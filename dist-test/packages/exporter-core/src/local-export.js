import { spawn } from "node:child_process";
import crypto from "node:crypto";
import fs, { writeFile } from "node:fs/promises";
import { createServer } from "node:http";
import os from "node:os";
import path from "node:path";
import { delimiter as pathDelimiter } from "node:path";
import { chromium, } from "playwright";
import { PNG } from "pngjs";
import { generateNextProject } from "../../codegen/src/next-project.js";
import { compareGeneratedPreview } from "../../fidelity/src/compare.js";
import { matchPluginNodesToDom } from "../../matcher/src/match.js";
import { canonicalEditAreas, createCanonicalContentBundle, migrateV1ContentContractToV2, writeCanonicalSiteBundle, } from "../../content-contract/src/index.js";
import { resolveExportRouteMetadata } from "../../shared/src/route-contract.js";
import { captureRuntime, captureRuntimeRoutes, createSimulatedPluginCapture, validateFullSiteCapture, } from "./capture.js";
import { buildIntermediateRepresentation, buildPluginSourceSnapshot, } from "./ir.js";
import { normalizePluginExportRoutes, } from "./export-routes.js";
import { zipDirectory } from "./package.js";
import { applyAttemptPlan, baselineStrategy, buildAttemptPlan, detectAttemptPlateau, } from "./attempt-planner.js";
import { analyzeCodeFilesCompatibility } from "./code-compatibility.js";
let zipVerificationTestMode = "normal";
let generationFailureTestMode = "normal";
export function __setZipVerificationTestMode(mode) {
    zipVerificationTestMode = mode;
}
export function __setGenerationFailureTestMode(mode) {
    generationFailureTestMode = mode;
}
function resolveValidationTimeoutMs(envName, fallbackMs) {
    const rawValue = process.env[envName];
    if (!rawValue)
        return fallbackMs;
    const parsed = Number(rawValue);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : fallbackMs;
}
export function assertPluginCaptureIntegrity(input) {
    const diagnostics = input.pluginCapture.context?.captureDiagnostics;
    if (!diagnostics?.truncated)
        return;
    const summariesById = new Map(diagnostics.rootSummaries.map((summary) => [summary.rootId, summary]));
    const truncatedPageRootIds = diagnostics.truncatedRootIds.filter((rootId) => summariesById.get(rootId)?.rootKind === "page");
    const cannotProvePageCompleteness = input.exportMode === "full-site" &&
        diagnostics.captureSource === "full-site" &&
        diagnostics.rootSummaries.length === 0;
    if (input.exportMode === "full-site" &&
        (truncatedPageRootIds.length > 0 || cannotProvePageCompleteness)) {
        const affectedRoots = truncatedPageRootIds.join(", ") ||
            diagnostics.truncatedRootIds.join(", ") ||
            "unknown";
        throw new Error(`Full-site export blocked: plugin capture was truncated for page roots (${affectedRoots}) after ${diagnostics.capturedNodeCount} nodes.`);
    }
}
const ARTIFACT_INDEX_SCHEMA_VERSION = 2;
const REVISION_MANIFEST_SCHEMA_VERSION = 2;
export async function runLocalExport(input) {
    if (!input.exportMode) {
        throw new Error("Missing exportMode: CLI/plugin did not pass exportMode into runLocalExport.");
    }
    if (!input.url && !input.pluginCapture) {
        throw new Error("Missing URL and plugin capture: export cannot determine a source.");
    }
    if (input.exportMode === "full-site" &&
        (!input.url || !/^https?:\/\//.test(input.url))) {
        throw new Error("Missing published URL: full-site export requires an http(s) Framer site.");
    }
    const capturedPluginPayload = input.pluginCapture ??
        {
            mode: "simulated",
            selectedNodes: [],
            capturedAt: new Date().toISOString(),
        };
    const pluginCapture = input.exportMode === "full-site"
        ? { ...capturedPluginPayload, selectedNodes: [] }
        : capturedPluginPayload;
    assertPluginCaptureIntegrity({
        exportMode: input.exportMode,
        pluginCapture,
    });
    console.log("[coderelay:core:input]", JSON.stringify({
        url: input.url,
        selector: input.selector,
        exportMode: input.exportMode,
        maxAttempts: input.maxAttempts,
        targetFidelity: input.targetFidelity,
        pluginNodeCount: pluginCapture.selectedNodes.length,
    }));
    const timestamp = new Date().toISOString().replaceAll(/[:.]/g, "-");
    const runDir = path.resolve(input.outDir, timestamp);
    const workDir = path.join(runDir, "work");
    const attemptsDir = path.join(runDir, "attempts");
    const exportDir = path.join(runDir, "export");
    const sharedRevisionCacheRoot = resolveSharedRevisionCacheRoot(input.outDir);
    let resolvedRevisionId;
    await fs.mkdir(workDir, { recursive: true });
    await fs.mkdir(attemptsDir, { recursive: true });
    await fs.mkdir(exportDir, { recursive: true });
    await updateRevisionStatusFile({
        exportDir,
        stage: "planning",
        detail: "Preparing revision workspace and request context.",
    });
    try {
        const revalidateOnlyRevision = await tryReuseParentRevisionForValidation({
            exportDir,
            runDir,
            sharedRevisionCacheRoot,
            localExportInput: input,
            revisionRequest: input.revisionRequest,
            targetFidelity: input.targetFidelity,
            maxAttempts: input.maxAttempts,
        });
        if (revalidateOnlyRevision) {
            return revalidateOnlyRevision;
        }
        const sourceSnapshot = buildPluginSourceSnapshot(pluginCapture);
        const initialSourceArtifacts = await writeSourceArtifacts(exportDir, sourceSnapshot);
        const canCaptureFromUrl = typeof input.url === "string" &&
            /^https?:\/\//.test(input.url) &&
            input.url.length > 0;
        const responsiveSelectiveReuse = canCaptureFromUrl
            ? await readResponsiveSelectiveReuseContext({
                sharedRevisionCacheRoot,
                pluginCapture,
                exportMode: input.exportMode,
                revisionRequest: input.revisionRequest,
            })
            : null;
        await updateRevisionStatusFile({
            exportDir,
            stage: "capturing",
            detail: canCaptureFromUrl
                ? "Capturing runtime and plugin evidence."
                : "Building plugin-only runtime approximation.",
        });
        const requestedFullSiteRoutes = input.exportMode === "full-site"
            ? readFullSiteRouteManifest(pluginCapture)
            : [];
        const runtimeCapture = canCaptureFromUrl
            ? input.exportMode === "full-site"
                ? mergeRuntimeCaptures(responsiveSelectiveReuse?.parentRuntimeCapture, await captureRuntimeRoutes({
                    originUrl: input.url,
                    routes: responsiveSelectiveReuse?.routesToCapture ??
                        readFullSiteRouteManifest(pluginCapture),
                    workDir,
                    cacheDir: path.join(input.outDir, ".capture-cache"),
                    viewportNames: responsiveSelectiveReuse?.viewportNames,
                    baseCapturesByRoute: responsiveSelectiveReuse?.baseCapturesByRoute,
                    freshRoutePaths: responsiveSelectiveReuse?.freshRoutePaths,
                    onProgress: async (progress) => {
                        await updateRevisionStatusFile({
                            exportDir,
                            stage: "capturing",
                            detail: `Captured route ${progress.routePath} (${progress.completed}/${progress.total}).`,
                            progress: {
                                completed: progress.completed,
                                total: progress.total,
                                routePath: progress.routePath,
                                failed: progress.failed,
                            },
                        });
                        await input.onProgress?.({ stage: "Capturing routes", ...progress });
                    },
                }))
                : await captureRuntime({
                    url: input.url,
                    workDir,
                    selector: input.selector,
                })
            : createRuntimeCaptureFromPluginContext(pluginCapture);
        if (input.exportMode === "full-site" && canCaptureFromUrl) {
            await validateFullSiteCapture({
                routes: requestedFullSiteRoutes,
                capture: runtimeCapture,
            });
        }
        console.log("[coderelay:core:capture]", JSON.stringify({
            captureMode: canCaptureFromUrl ? "runtime-first" : "plugin-only",
            runtimeNodeCount: runtimeCapture.nodes.length,
            viewportNodeCounts: runtimeCapture.captureDiagnostics?.nodeCount,
            viewportValidation: runtimeCapture.captureDiagnostics?.viewportValidation,
            routeCount: runtimeCapture.routeCaptures?.length ?? 1,
            framerStyleCssBytes: Buffer.byteLength(runtimeCapture.framerStyleCss ?? ""),
        }));
        if (!input.pluginCapture && input.exportMode !== "full-site") {
            pluginCapture.selectedNodes =
                createSimulatedPluginCapture(runtimeCapture.nodes).selectedNodes;
        }
        const sourceUrl = input.url ?? runtimeCapture.url;
        const sourceFingerprint = createSourceFingerprint({
            url: sourceUrl,
            exportMode: input.exportMode,
            selector: input.selector,
            pluginCapture,
        });
        const nodeMatches = input.exportMode === "full-site"
            ? []
            : matchPluginNodesToDom(pluginCapture, runtimeCapture.nodes);
        const ir = buildIntermediateRepresentation({
            url: sourceUrl,
            name: input.name,
            exportMode: input.exportMode,
            captureMode: canCaptureFromUrl ? "runtime-first" : "plugin-only",
            runtimeCapture,
            pluginCapture,
            nodeMatches,
        });
        if (input.exportMode === "full-site") {
            compactMaterializedRouteCaptures(runtimeCapture);
        }
        const normalizedIr = createNormalizedIrArtifact(ir);
        const currentSourceArtifactsPreview = createSourceArtifactsPreview(sourceSnapshot);
        const parentSourceArtifacts = await readParentSourceArtifacts(sharedRevisionCacheRoot, input.revisionRequest?.parentRevisionId);
        const currentSourceDiff = createSourceArtifactDiff(currentSourceArtifactsPreview, parentSourceArtifacts);
        const stableRevisionSummary = createStableRevisionSummary(ir);
        const pluginFingerprint = createPluginFingerprint(pluginCapture, ir);
        const revisionId = createRevisionId({
            sourceFingerprint,
            pluginFingerprint,
            stableRevisionSummary,
            revisionRequest: input.revisionRequest ?? null,
        });
        resolvedRevisionId = revisionId;
        await updateRevisionStatusFile({
            exportDir,
            revisionId,
            stage: "generating",
            detail: "Generating export attempts and source artifacts.",
        });
        const revisionCacheDir = path.join(sharedRevisionCacheRoot, revisionId);
        const cachedRevision = await readCachedRevision(revisionCacheDir);
        if (cachedRevision) {
            await fs.cp(cachedRevision.exportDir, exportDir, { recursive: true });
            return finalizeCachedRevisionResult({
                exportDir,
                runDir,
                cachedRevision,
                revisionCacheHit: true,
            });
        }
        const noopComponentRevision = await tryReuseParentRevisionForUnchangedComponentSource({
            exportDir,
            runDir,
            sharedRevisionCacheRoot,
            revisionId,
            localExportInput: input,
            revisionRequest: input.revisionRequest,
            sourceArtifacts: currentSourceArtifactsPreview,
            parentSourceArtifacts,
            sourceDiff: currentSourceDiff,
            targetFidelity: input.targetFidelity,
            maxAttempts: input.maxAttempts,
        });
        if (noopComponentRevision) {
            return noopComponentRevision;
        }
        console.log("[coderelay:core:strategy]", JSON.stringify({
            exportMode: ir.exportMode,
            exportEngine: ir.exportEngine,
            componentName: ir.componentName,
            sitePageCount: ir.sitePages?.length ?? 0,
            componentModuleCount: ir.componentModules?.length ?? 0,
            codeFileCount: ir.codeFiles?.length ?? 0,
            cmsCollectionCount: ir.cmsCollections?.length ?? 0,
            exportTreeRootCount: ir.exportTree?.length ?? 0,
        }));
        const codeCompatibilityReport = analyzeCodeFilesCompatibility(ir.codeFiles ?? []);
        const unadaptedCodeFiles = createUnadaptedCodeFileArtifacts(ir, codeCompatibilityReport);
        const attempts = await runAttempts({
            ir,
            attemptsDir,
            maxAttempts: input.maxAttempts,
            targetFidelity: input.targetFidelity,
            codeCompatibilityReport,
            unadaptedCodeFiles,
        });
        if (generationFailureTestMode === "fail-before-validation") {
            throw new Error("Generated export forced to fail during generation before validation for testing.");
        }
        const bestAttempt = selectBestAttempt(attempts);
        const runtimeLocalization = input.exportMode === "full-site"
            ? await localizeRuntimeKeptProjectAssets(bestAttempt.projectDir)
            : undefined;
        if (input.exportMode === "full-site" &&
            (bestAttempt.previewValidation?.summary.inspectedNodes ?? 0) > 0 &&
            (bestAttempt.previewValidation?.summary.foundNodes ?? 0) === 0) {
            throw new Error("Generated export failed validation: none of the runtime-derived nodes were found in the generated preview.");
        }
        await updateRevisionStatusFile({
            exportDir,
            revisionId,
            stage: "validating",
            detail: "Validating generated project output.",
        });
        const validation = await validateGeneratedProject(bestAttempt.projectDir, {
            exportMode: input.exportMode,
            runtimeLocalization,
            onProgress: async (progress) => {
                await updateRevisionStatusFile({
                    exportDir,
                    revisionId,
                    stage: "validating",
                    detail: progress.detail,
                    progress: {
                        completed: progress.completed,
                        total: progress.total,
                        routePath: progress.routePath,
                        failed: progress.failed,
                    },
                });
            },
        });
        await fs.cp(bestAttempt.projectDir, exportDir, { recursive: true });
        const debugArtifacts = await bundleDebugArtifacts({
            workDir,
            attemptsDir,
            exportDir,
            attempts,
            bestAttempt,
        });
        const sourceArtifacts = initialSourceArtifacts;
        const responsiveRecapturePlan = createResponsiveRecapturePlan(ir, input.revisionRequest);
        const captureProgress = await readJsonFile(path.join(workDir, "capture-progress.json"));
        const report = createReport(ir, attempts, bestAttempt, debugArtifacts, validation, revisionId, false, input.revisionRequest, sourceArtifacts, responsiveRecapturePlan, captureProgress, codeCompatibilityReport, unadaptedCodeFiles);
        await fs.mkdir(revisionCacheDir, { recursive: true });
        await writeFile(path.join(exportDir, "best-attempt.json"), `${JSON.stringify(bestAttempt, null, 2)}\n`);
        await writeFile(path.join(exportDir, "generated-validation.json"), `${JSON.stringify(validation, null, 2)}\n`);
        await writeFile(path.join(exportDir, "raw-plugin-payload.json"), `${JSON.stringify(pluginCapture, null, 2)}\n`);
        await writeFile(path.join(exportDir, "raw-runtime-capture.json"), `${JSON.stringify(runtimeCapture, null, 2)}\n`);
        await fs.cp(path.join(workDir, "capture-progress.json"), path.join(exportDir, "capture-progress.json"), { recursive: false }).catch(() => undefined);
        await writeFile(path.join(exportDir, "normalized-ir.json"), `${JSON.stringify(createNormalizedIrArtifact(ir), null, 2)}\n`);
        await writeFile(path.join(exportDir, "fidelity-replay-ir.json"), `${JSON.stringify(ir, null, 2)}\n`);
        if (codeCompatibilityReport.fileCount > 0) {
            await writeJsonFile(path.join(exportDir, "code-compatibility-report.json"), codeCompatibilityReport);
        }
        await writeUnadaptedCodeFileArtifacts(exportDir, ir, unadaptedCodeFiles);
        if (responsiveRecapturePlan) {
            await writeJsonFile(path.join(exportDir, "responsive-recapture-plan.json"), responsiveRecapturePlan);
        }
        const reportPath = path.join(exportDir, "export-report.json");
        await writeFile(reportPath, `${JSON.stringify(report, null, 2)}\n`);
        const contentContract = createCanonicalExportContentContract(ir, sourceArtifacts);
        await writeJsonFile(path.join(exportDir, "content-contract.json"), contentContract);
        await writeCanonicalBundleFromContentContract(exportDir, contentContract);
        const parentReport = await readParentRevisionReport(sharedRevisionCacheRoot, input.revisionRequest?.parentRevisionId);
        const beforeAfterReport = parentReport && input.revisionRequest?.kind === "improvement"
            ? createBeforeAfterReport(report, parentReport, {
                revisionId,
                parentRevisionId: input.revisionRequest.parentRevisionId ?? null,
            })
            : null;
        if (beforeAfterReport) {
            await writeJsonFile(path.join(exportDir, "before-after-report.json"), beforeAfterReport);
        }
        await writeFile(path.join(exportDir, "patch-history.json"), `${JSON.stringify(createPatchHistory(attempts), null, 2)}\n`);
        await writeFile(path.join(exportDir, "README.md"), createReadme(ir, bestAttempt));
        await writeFile(path.join(exportDir, "AGENT_BRIEF.md"), createAgentBrief(ir, bestAttempt));
        const previewPath = path.join(exportDir, "preview.html");
        const attemptPreviewPath = path.join(bestAttempt.projectDir, "preview.html");
        try {
            await fs.copyFile(attemptPreviewPath, previewPath);
        }
        catch {
            await writeFile(previewPath, `<!doctype html><html><body><pre>preview.html was not generated for this attempt.</pre></body></html>\n`);
        }
        const invalidationPlan = createInvalidationPlan({
            revisionRequest: input.revisionRequest,
            sourceArtifacts,
            parentSourceArtifacts,
            codeFileCount: ir.codeFiles?.length ?? 0,
            routeTemplateCount: ir.routeTemplates?.length ?? 0,
            componentFamilyCount: ir.componentFamilies?.length ?? 0,
        });
        await writeJsonFile(path.join(exportDir, "invalidation-plan.json"), invalidationPlan);
        const parentInfo = createParentInfo(input.revisionRequest);
        if (parentInfo) {
            await writeJsonFile(path.join(exportDir, "parent.json"), parentInfo);
        }
        await writeJsonFile(path.join(exportDir, "resolved-request.json"), createResolvedRequestArtifact({
            localExportInput: input,
            pluginCapture,
            revisionId,
        }));
        const revisionManifest = createRevisionManifest(ir, attempts, bestAttempt, revisionId, {
            status: "validating",
            sourceFingerprint,
            pluginFingerprint,
            revisionRequest: input.revisionRequest,
            sourceEvidence: createSourceEvidenceSummary(ir, sourceArtifacts),
            sourceArtifacts,
            responsiveRecapturePlan,
            validation,
            reusedArtifactIds: invalidationPlan.reused,
            invalidatedArtifacts: invalidationPlan.invalidated,
            parentInfoPath: parentInfo ? "parent.json" : null,
        });
        await writeJsonFile(path.join(exportDir, "revision-manifest.json"), {
            ...revisionManifest,
            normalizedIr,
        });
        const preliminaryArtifactIndex = await createArtifactIndex(exportDir, sourceArtifacts, {
            sourceFingerprint,
            revisionId,
        });
        const artifactGraphHash = hashValue(preliminaryArtifactIndex.entries
            .filter((entry) => entry.id !== "manifest/revision")
            .map((entry) => ({
            id: entry.id,
            hash: entry.hash,
            dependencyHashes: entry.dependencyHashes,
        })));
        await writeJsonFile(path.join(exportDir, "revision-manifest.json"), {
            ...revisionManifest,
            artifactGraphHash,
            normalizedIr,
        });
        const artifactIndex = await createArtifactIndex(exportDir, sourceArtifacts, {
            sourceFingerprint,
            revisionId,
        });
        await writeJsonFile(path.join(exportDir, "artifact-index.json"), artifactIndex);
        const zipPath = path.join(runDir, `${ir.componentName}.zip`);
        await updateRevisionStatusFile({
            exportDir,
            revisionId,
            stage: "validating",
            detail: "Packaging generated export into a ZIP archive.",
        });
        await zipDirectory(exportDir, zipPath);
        const packagedArchive = await verifyPackagedExportArchive(zipPath, {
            exportMode: input.exportMode,
            onProgress: async (progress) => {
                await updateRevisionStatusFile({
                    exportDir,
                    revisionId,
                    stage: "validating",
                    detail: progress.detail,
                    progress: {
                        completed: progress.completed,
                        total: progress.total,
                        routePath: progress.routePath,
                        failed: progress.failed,
                    },
                });
            },
        });
        await persistPackagedArchiveVerification({
            exportDir,
            packagedArchive,
        });
        await fs.mkdir(revisionCacheDir, { recursive: true });
        const completedRevisionManifest = {
            ...revisionManifest,
            status: "completed",
            updatedAt: new Date().toISOString(),
        };
        await writeJsonFile(path.join(exportDir, "revision-manifest.json"), {
            ...completedRevisionManifest,
            artifactGraphHash,
            normalizedIr,
        });
        const completedArtifactIndex = await createArtifactIndex(exportDir, sourceArtifacts, {
            sourceFingerprint,
            revisionId,
        });
        await writeJsonFile(path.join(exportDir, "artifact-index.json"), completedArtifactIndex);
        await fs.cp(exportDir, path.join(revisionCacheDir, "export"), {
            recursive: true,
        });
        await updateRevisionStatusFile({
            exportDir,
            revisionId,
            stage: "completed",
            detail: "Revision completed successfully.",
        });
        return {
            exportDir,
            zipPath,
            reportPath,
            previewPath,
            resolvedRequestPath: path.join(exportDir, "resolved-request.json"),
            statusPath: path.join(exportDir, "status.json"),
            captureProgressPath: (await fileExists(path.join(exportDir, "capture-progress.json")))
                ? path.join(exportDir, "capture-progress.json")
                : undefined,
            capabilityReportPath: readCapabilityReport(pluginCapture)
                ? path.join(exportDir, "capability-report.json")
                : undefined,
            codeCompatibilityReportPath: codeCompatibilityReport.fileCount > 0
                ? path.join(exportDir, "code-compatibility-report.json")
                : undefined,
            beforeAfterReportPath: beforeAfterReport
                ? path.join(exportDir, "before-after-report.json")
                : undefined,
            parentInfoPath: parentInfo ? path.join(exportDir, "parent.json") : undefined,
            bestAttempt,
            validation: {
                ...validation,
                packagedArchive,
            },
            revisionManifestPath: path.join(exportDir, "revision-manifest.json"),
            invalidationPlanPath: path.join(exportDir, "invalidation-plan.json"),
            artifactIndexPath: path.join(exportDir, "artifact-index.json"),
            responsiveRecapturePlanPath: responsiveRecapturePlan
                ? path.join(exportDir, "responsive-recapture-plan.json")
                : undefined,
            revisionCacheHit: false,
        };
    }
    catch (error) {
        const manifestPath = path.join(exportDir, "revision-manifest.json");
        const persistedManifest = (await readJsonFile(manifestPath)) ?? null;
        if (persistedManifest) {
            await writeJsonFile(manifestPath, {
                ...persistedManifest,
                status: "failed",
                updatedAt: new Date().toISOString(),
            });
        }
        await updateRevisionStatusFile({
            exportDir,
            revisionId: resolvedRevisionId,
            stage: "failed",
            detail: error instanceof Error ? error.message : String(error),
        });
        throw error;
    }
}
export async function migrateLegacyExportToRevision(input) {
    const exportDir = path.resolve(input.exportDir);
    const outDir = path.dirname(path.dirname(exportDir));
    const sharedRevisionCacheRoot = resolveSharedRevisionCacheRoot(outDir);
    const report = (await readJsonFile(path.join(exportDir, "export-report.json"))) ?? null;
    const normalizedIr = (await readJsonFile(path.join(exportDir, "normalized-ir.json"))) ?? null;
    const runtimeCapture = (await readJsonFile(path.join(exportDir, "raw-runtime-capture.json"))) ?? null;
    const pluginCapture = input.pluginCapture ??
        (await readJsonFile(path.join(exportDir, "raw-plugin-payload.json"))) ??
        {
            mode: "simulated",
            selectedNodes: [],
            capturedAt: new Date().toISOString(),
        };
    if (!report) {
        throw new Error("Legacy export migration failed: export-report.json is missing.");
    }
    if (!normalizedIr) {
        throw new Error("Legacy export migration failed: normalized-ir.json is missing.");
    }
    const routeTemplates = deriveLegacyRouteTemplates(normalizedIr, report);
    const responsiveRecapturePlan = createLegacyResponsiveRecapturePlan({
        runtimeCapture,
        routeTemplates,
    });
    const sourceArtifacts = await writeLegacySourceArtifacts({
        exportDir,
        normalizedIr,
        pluginCapture,
    });
    const sourceFingerprint = createSourceFingerprint({
        url: input.sourceUrl ??
            (typeof report.sourceUrl === "string" ? report.sourceUrl : undefined),
        exportMode: input.exportMode ??
            (typeof normalizedIr.exportMode === "string"
                ? normalizedIr.exportMode
                : undefined),
        selector: input.selector,
        pluginCapture,
    });
    const pluginFingerprint = createLegacyPluginFingerprint({
        pluginCapture,
        normalizedIr,
        sourceArtifacts,
    });
    const stableRevisionSummary = createLegacyStableRevisionSummary({
        jobId: input.jobId,
        sourceUrl: input.sourceUrl ??
            (typeof report.sourceUrl === "string" ? report.sourceUrl : ""),
        exportMode: input.exportMode ??
            (typeof normalizedIr.exportMode === "string"
                ? normalizedIr.exportMode
                : "selection"),
        report,
        normalizedIr,
        routeTemplates,
    });
    const revisionId = createRevisionId({
        sourceFingerprint,
        pluginFingerprint,
        stableRevisionSummary,
        revisionRequest: null,
        legacyMigration: true,
    });
    await updateRevisionStatusFile({
        exportDir,
        revisionId,
        stage: "planning",
        detail: "Registering legacy export as a revisioned artifact.",
    });
    const validation = (await readJsonFile(path.join(exportDir, "generated-validation.json"))) ??
        (report.generatedValidation ??
            null);
    if (!validation) {
        throw new Error("Legacy export migration failed: generated validation is missing.");
    }
    const bestAttempt = (await readJsonFile(path.join(exportDir, "best-attempt.json"))) ??
        createLegacyBestAttempt(report);
    await writeJsonFile(path.join(exportDir, "best-attempt.json"), bestAttempt);
    await writeJsonFile(path.join(exportDir, "generated-validation.json"), validation);
    if (responsiveRecapturePlan) {
        await writeJsonFile(path.join(exportDir, "responsive-recapture-plan.json"), responsiveRecapturePlan);
    }
    const invalidationPlan = createInvalidationPlan({
        sourceArtifacts,
        codeFileCount: Array.isArray(normalizedIr.codeFiles)
            ? normalizedIr.codeFiles.length
            : undefined,
        routeTemplateCount: routeTemplates.length,
        componentFamilyCount: Array.isArray(normalizedIr.componentFamilies)
            ? normalizedIr.componentFamilies.length
            : undefined,
    });
    const revisionManifest = {
        revisionId,
        schemaVersion: REVISION_MANIFEST_SCHEMA_VERSION,
        sourceFingerprint,
        pluginFingerprint,
        status: "completed",
        parentRevisionId: null,
        revisionRequest: null,
        summary: stableRevisionSummary,
        sourceArtifacts: sourceArtifacts,
        responsiveRecapturePlan: responsiveRecapturePlan ?? null,
        generatedValidation: validation,
        reusedArtifactIds: [],
        invalidatedArtifacts: invalidationPlan.invalidated,
        parentInfoPath: null,
        createdAt: typeof report.createdAt === "string"
            ? report.createdAt
            : new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };
    const nextReport = {
        ...report,
        revisionId,
        revisionCacheHit: false,
        revisionRequest: null,
        sourceArtifacts,
        routeTemplateCount: routeTemplates.length,
        routeTemplates,
        componentFamilyCount: Array.isArray(normalizedIr.componentFamilies)
            ? normalizedIr.componentFamilies.length
            : 0,
        responsiveRecapturePlan: responsiveRecapturePlan ?? null,
        generatedValidation: validation,
        migrationNotes: {
            legacyResponsiveViewportInvalid: responsiveRecapturePlan?.migration?.legacyResponsiveViewportInvalid ??
                false,
            legacyObservedViewportWidths: responsiveRecapturePlan?.migration?.observedViewportWidths ?? [],
        },
    };
    await writeJsonFile(path.join(exportDir, "export-report.json"), nextReport);
    const contentContract = createCanonicalExportContentContract({
        jobId: input.jobId,
        sourceUrl: input.sourceUrl,
        componentName: typeof normalizedIr.componentName === "string"
            ? normalizedIr.componentName
            : input.jobId,
        exportMode: typeof normalizedIr.exportMode === "string"
            ? normalizedIr.exportMode
            : undefined,
        exportEngine: typeof normalizedIr.exportEngine === "string"
            ? normalizedIr.exportEngine
            : undefined,
        runtimeCapture: runtimeCapture ?? {},
        pluginCapture,
        nodeMatches: [],
        component: {
            semanticType: "unknown",
            nodes: [],
            sections: [],
        },
        assets: [],
        componentModules: Array.isArray(normalizedIr.componentModules)
            ? normalizedIr.componentModules
            : [],
        componentFamilies: Array.isArray(normalizedIr.componentFamilies)
            ? normalizedIr.componentFamilies
            : [],
        overrideAssignments: Array.isArray(normalizedIr.overrideAssignments)
            ? normalizedIr.overrideAssignments
            : [],
        codeFiles: Array.isArray(normalizedIr.codeFiles)
            ? normalizedIr.codeFiles
            : [],
        fonts: Array.isArray(normalizedIr.fonts)
            ? normalizedIr.fonts
            : [],
        cmsCollections: Array.isArray(normalizedIr.cmsCollections)
            ? normalizedIr.cmsCollections
            : [],
        libraryComponents: [],
        sitePages: Array.isArray(normalizedIr.sitePages)
            ? normalizedIr.sitePages
            : [],
        routeTemplates: Array.isArray(normalizedIr.routeTemplates)
            ? normalizedIr.routeTemplates
            : [],
        warnings: [],
    }, sourceArtifacts);
    await writeJsonFile(path.join(exportDir, "content-contract.json"), contentContract);
    await writeCanonicalBundleFromContentContract(exportDir, contentContract);
    await writeJsonFile(path.join(exportDir, "invalidation-plan.json"), invalidationPlan);
    await writeJsonFile(path.join(exportDir, "revision-manifest.json"), {
        ...revisionManifest,
        normalizedIr: normalizedIr,
    });
    const artifactIndex = await createArtifactIndex(exportDir, sourceArtifacts, {
        sourceFingerprint,
        revisionId,
    });
    const artifactGraphHash = hashValue(artifactIndex.entries.map((entry) => ({
        id: entry.id,
        hash: entry.hash,
        dependencyHashes: entry.dependencyHashes,
    })));
    await writeJsonFile(path.join(exportDir, "revision-manifest.json"), {
        ...revisionManifest,
        artifactGraphHash,
        normalizedIr,
    });
    await writeJsonFile(path.join(exportDir, "artifact-index.json"), artifactIndex);
    const revisionCacheDir = path.join(sharedRevisionCacheRoot, revisionId);
    await fs.mkdir(revisionCacheDir, { recursive: true });
    await fs.cp(exportDir, path.join(revisionCacheDir, "export"), {
        recursive: true,
    });
    await updateRevisionStatusFile({
        exportDir,
        revisionId,
        stage: "completed",
        detail: "Legacy export registered successfully.",
    });
    return {
        revisionId,
        sharedRevisionCacheRoot,
        revisionCacheDir,
        statusPath: path.join(exportDir, "status.json"),
        revisionManifestPath: path.join(exportDir, "revision-manifest.json"),
        invalidationPlanPath: path.join(exportDir, "invalidation-plan.json"),
        artifactIndexPath: path.join(exportDir, "artifact-index.json"),
        responsiveRecapturePlanPath: responsiveRecapturePlan
            ? path.join(exportDir, "responsive-recapture-plan.json")
            : undefined,
        capabilityReportPath: sourceArtifacts.capabilityReportPath
            ? path.join(exportDir, sourceArtifacts.capabilityReportPath)
            : undefined,
        sourceArtifactsPath: path.join(exportDir, "source-artifacts", "manifest.json"),
    };
}
function compactMaterializedRouteCaptures(runtimeCapture) {
    for (const capture of runtimeCapture.routeCaptures ?? []) {
        capture.nodes = [];
        capture.nodesByViewport = undefined;
        capture.framerStyleCss = undefined;
    }
}
export function createNormalizedIrArtifact(ir) {
    return {
        ...ir,
        artifactFormat: "summary",
        artifactNote: "Materialized node trees are stored in export-tree.json and generated page files.",
        pluginCapture: {
            mode: ir.pluginCapture.mode,
            capturedAt: ir.pluginCapture.capturedAt,
            project: ir.pluginCapture.context?.project,
            selectedNodeCount: ir.pluginCapture.selectedNodes.length,
        },
        runtimeCapture: {
            url: ir.runtimeCapture.url,
            title: ir.runtimeCapture.title,
            mode: ir.runtimeCapture.mode,
            captureDiagnostics: ir.runtimeCapture.captureDiagnostics,
            stylesheetUrls: ir.runtimeCapture.stylesheetUrls,
            routeCaptures: (ir.runtimeCapture.routeCaptures ?? []).map((capture) => ({
                routePath: capture.routePath,
                url: capture.url,
                title: capture.title,
                captureDiagnostics: capture.captureDiagnostics,
            })),
        },
        component: {
            semanticType: ir.component.semanticType,
            nodeCount: ir.component.nodes.length,
            sections: ir.component.sections.map((section) => ({
                index: section.index,
                name: section.name,
                kind: section.kind,
                confidence: section.confidence,
                nodeCount: section.nodes.length,
            })),
        },
        routeTemplates: (ir.routeTemplates ?? []).map((template) => ({
            templateId: template.templateId,
            templatePath: template.templatePath,
            templateKind: template.templateKind,
            representativeRoutePath: template.representativeRoutePath,
            routeCount: template.routeCount,
            nodeCount: template.nodeCount,
            sourceTextLength: template.sourceTextLength,
        })),
        exportTree: undefined,
        sitePages: (ir.sitePages ?? []).map((page) => ({
            componentName: page.componentName,
            routePath: page.routePath,
            title: page.title,
            sourceTextLength: page.sourceTextLength,
            nodeCount: page.nodes.length,
            exportTreeNodeCount: countExportTreeNodes(page.exportTree ?? []),
            templateId: page.templateId,
            templatePath: page.templatePath,
            routeKind: page.routeKind,
            template: page.template,
            templateKind: page.templateKind,
            destination: page.destination ?? page.redirectTo,
            destinationKind: page.destinationKind,
        })),
    };
}
function createResolvedRequestArtifact(input) {
    return {
        schemaVersion: 1,
        generatedAt: new Date().toISOString(),
        url: input.localExportInput.url ?? null,
        exportMode: input.localExportInput.exportMode ?? "selection",
        selector: input.localExportInput.selector ?? null,
        name: input.localExportInput.name ?? null,
        maxAttempts: input.localExportInput.maxAttempts,
        targetFidelity: input.localExportInput.targetFidelity,
        revisionRequest: input.localExportInput.revisionRequest ?? null,
        pluginCapture: {
            mode: input.pluginCapture.mode,
            capturedAt: input.pluginCapture.capturedAt,
            selectedNodeCount: input.pluginCapture.selectedNodes.length,
            hasContext: Boolean(input.pluginCapture.context),
            codeFileCount: Array.isArray(input.pluginCapture.context?.codeFiles)
                ? input.pluginCapture.context.codeFiles.length
                : 0,
        },
        revisionId: input.revisionId,
    };
}
function deriveLegacyRouteTemplates(normalizedIr, report) {
    if (Array.isArray(report.routeTemplates) && report.routeTemplates.length > 0) {
        return report.routeTemplates
            .map((entry) => {
            const record = entry && typeof entry === "object"
                ? entry
                : {};
            const templateKind = record.templateKind === "cms" ||
                record.templateKind === "component" ||
                record.templateKind === "static" ||
                record.templateKind === "redirect" ||
                record.templateKind === "utility"
                ? record.templateKind
                : "static";
            return {
                templateId: String(record.templateId ?? record.representativeRoutePath ?? "template"),
                templatePath: String(record.templatePath ??
                    record.representativeRoutePath ??
                    record.templateId ??
                    "/"),
                templateKind,
                representativeRoutePath: String(record.representativeRoutePath ??
                    record.templatePath ??
                    record.templateId ??
                    "/"),
                routePaths: Array.isArray(record.routePaths)
                    ? record.routePaths.filter((value) => typeof value === "string")
                    : [String(record.representativeRoutePath ?? "/")],
                routeCount: typeof record.routeCount === "number" ? record.routeCount : 1,
                sourceTextLength: typeof record.sourceTextLength === "number"
                    ? record.sourceTextLength
                    : 0,
                nodeCount: typeof record.nodeCount === "number" ? record.nodeCount : 0,
            };
        })
            .filter((entry) => entry.representativeRoutePath);
    }
    const sitePages = Array.isArray(normalizedIr.sitePages)
        ? normalizedIr.sitePages
        : [];
    const grouped = new Map();
    for (const page of sitePages) {
        const routePath = typeof page.routePath === "string" && page.routePath.length > 0
            ? page.routePath
            : "/";
        const templateId = typeof page.templateId === "string" && page.templateId.length > 0
            ? page.templateId
            : routePath;
        const templatePath = typeof page.templatePath === "string" && page.templatePath.length > 0
            ? page.templatePath
            : routePath;
        const templateKind = page.templateKind === "cms" ||
            page.templateKind === "component" ||
            page.templateKind === "static" ||
            page.templateKind === "redirect" ||
            page.templateKind === "utility"
            ? page.templateKind
            : "static";
        const key = `${templateKind}:${templateId}:${templatePath}`;
        const existing = grouped.get(key);
        if (existing) {
            existing.routePaths.push(routePath);
            existing.routeCount += 1;
            continue;
        }
        grouped.set(key, {
            templateId,
            templatePath,
            templateKind,
            representativeRoutePath: routePath,
            routePaths: [routePath],
            routeCount: 1,
            sourceTextLength: typeof page.sourceTextLength === "number" ? page.sourceTextLength : 0,
            nodeCount: typeof page.nodeCount === "number" ? page.nodeCount : 0,
        });
    }
    return Array.from(grouped.values()).sort((left, right) => left.representativeRoutePath.localeCompare(right.representativeRoutePath));
}
function createLegacyResponsiveRecapturePlan(input) {
    if (input.routeTemplates.length === 0)
        return null;
    const breakpointsCaptured = unique(input.runtimeCapture?.captureDiagnostics?.breakpointsCaptured?.length
        ? input.runtimeCapture.captureDiagnostics.breakpointsCaptured
        : Object.keys(input.runtimeCapture?.viewports ?? {}));
    const observedViewportWidths = breakpointsCaptured
        .map((viewport) => {
        const view = input.runtimeCapture?.viewports?.[viewport];
        return view?.observed?.innerWidth ?? view?.requested?.width ?? view?.width;
    })
        .filter((value) => typeof value === "number" && value > 0);
    const uniqueObservedWidths = new Set(observedViewportWidths);
    const legacyResponsiveViewportInvalid = observedViewportWidths.length === 0 ||
        uniqueObservedWidths.size < Math.min(2, breakpointsCaptured.length);
    const targetViewports = legacyResponsiveViewportInvalid
        ? ["laptop", "tablet", "mobile"]
        : breakpointsCaptured.filter((viewport) => viewport !== "desktop");
    return {
        schemaVersion: 1,
        captureSchemaVersion: "runtime-capture-v2",
        generatedAt: new Date().toISOString(),
        kind: "initial",
        requestedFocus: null,
        parentRevisionId: null,
        breakpointsCaptured: breakpointsCaptured.length > 0
            ? breakpointsCaptured
            : ["desktop", "laptop", "tablet", "mobile"],
        targetViewports: targetViewports.length > 0
            ? targetViewports
            : ["laptop", "tablet", "mobile"],
        reuseDesktopCapture: !legacyResponsiveViewportInvalid,
        templateCount: input.routeTemplates.length,
        routeCount: input.routeTemplates.reduce((total, template) => total + template.routeCount, 0),
        templates: input.routeTemplates.map((template) => ({
            templateId: template.templateId,
            templatePath: template.templatePath,
            templateKind: template.templateKind,
            routeCount: template.routeCount,
            representativeRoutePaths: template.templateKind === "cms"
                ? [template.representativeRoutePath]
                : template.routePaths,
            memberRoutePaths: template.routePaths,
            responsiveCapturePolicy: template.templateKind === "cms"
                ? "representative-viewports"
                : "all-viewports",
            routesToCapture: legacyResponsiveViewportInvalid
                ? template.templateKind === "cms"
                    ? [template.representativeRoutePath]
                    : template.routePaths
                : [],
            viewports: targetViewports.length > 0
                ? targetViewports
                : ["laptop", "tablet", "mobile"],
            reasons: legacyResponsiveViewportInvalid
                ? [
                    "legacy-invalid-responsive-capture",
                    "observed-widths-missing-or-duplicated",
                ]
                : ["legacy-responsive-capture-valid"],
        })),
        migration: {
            legacyResponsiveViewportInvalid,
            observedViewportWidths,
        },
    };
}
function createResponsiveRecapturePlan(ir, revisionRequest) {
    if (ir.exportMode !== "full-site" &&
        (ir.routeTemplates?.length ?? 0) === 0 &&
        (ir.sitePages?.length ?? 0) <= 1) {
        return null;
    }
    const breakpointsCaptured = unique(ir.runtimeCapture.captureDiagnostics?.breakpointsCaptured?.length
        ? ir.runtimeCapture.captureDiagnostics.breakpointsCaptured
        : ["desktop", "laptop", "tablet", "mobile"]);
    const targetViewports = breakpointsCaptured.filter((viewport) => viewport !== "desktop");
    const routeTemplates = (ir.routeTemplates?.length ?? 0) > 0
        ? ir.routeTemplates
        : (ir.sitePages ?? []).map((page) => ({
            templateId: page.templateId ?? page.routePath,
            templatePath: page.templatePath ?? page.routePath,
            templateKind: page.templateKind ?? "static",
            representativeRoutePath: page.routePath,
            routePaths: [page.routePath],
            routeCount: 1,
            sourceTextLength: page.sourceTextLength ?? 0,
            nodeCount: page.nodes.length,
        }));
    return {
        schemaVersion: 1,
        captureSchemaVersion: "runtime-capture-v2",
        generatedAt: new Date().toISOString(),
        kind: revisionRequest?.kind === "improvement" ? "improvement" : "initial",
        requestedFocus: revisionRequest?.requestedFocus ?? null,
        parentRevisionId: revisionRequest?.parentRevisionId ?? null,
        breakpointsCaptured,
        targetViewports: targetViewports.length > 0
            ? targetViewports
            : ["laptop", "tablet", "mobile"],
        reuseDesktopCapture: breakpointsCaptured.includes("desktop"),
        templateCount: routeTemplates.length,
        routeCount: routeTemplates.reduce((total, template) => total + template.routeCount, 0),
        templates: routeTemplates.map((template) => {
            const memberRoutePaths = unique(template.routePaths?.length
                ? template.routePaths
                : [template.representativeRoutePath]);
            const responsiveCapturePolicy = template.templateKind === "cms"
                ? "representative-viewports"
                : "all-viewports";
            const representativeRoutePaths = template.templateKind === "cms"
                ? [template.representativeRoutePath]
                : memberRoutePaths;
            return {
                templateId: template.templateId,
                templatePath: template.templatePath,
                templateKind: template.templateKind,
                routeCount: template.routeCount,
                representativeRoutePaths,
                memberRoutePaths,
                responsiveCapturePolicy,
                routesToCapture: responsiveCapturePolicy === "representative-viewports"
                    ? [template.representativeRoutePath]
                    : memberRoutePaths,
                viewports: targetViewports.length > 0
                    ? targetViewports
                    : ["laptop", "tablet", "mobile"],
                reasons: responsiveCapturePolicy === "representative-viewports"
                    ? [
                        "cms-template-shared-layout",
                        "reuse-member-route-data",
                        "capture-representative-breakpoints",
                    ]
                    : [
                        "static-or-component-layout",
                        "capture-all-template-routes",
                    ],
            };
        }),
    };
}
function countExportTreeNodes(nodes) {
    return nodes.reduce((total, node) => total + 1 + countExportTreeNodes(node.children ?? []), 0);
}
export function readFullSiteRouteManifest(pluginCapture) {
    const routes = normalizePluginExportRoutes(pluginCapture);
    return routes.length > 0
        ? routes
        : [
            {
                schemaVersion: 1,
                path: "/",
                title: "Home",
                templateId: "/",
                templatePath: "/",
                kind: "page",
                template: "static",
                templateKind: "static",
            },
        ];
}
async function readResponsiveSelectiveReuseContext(input) {
    if (input.exportMode !== "full-site" ||
        input.revisionRequest?.kind !== "improvement" ||
        (input.revisionRequest.requestedFocus !== "responsiveness" &&
            input.revisionRequest.requestedFocus !== "both") ||
        !input.revisionRequest.parentRevisionId) {
        return null;
    }
    const parentRuntimeCapture = await readParentRuntimeCapture(input.sharedRevisionCacheRoot, input.revisionRequest.parentRevisionId);
    if (!parentRuntimeCapture?.routeCaptures?.length) {
        return null;
    }
    const routes = readFullSiteRouteManifest(input.pluginCapture);
    const groups = new Map();
    for (const route of routes) {
        const key = route.templateId ?? route.templatePath ?? route.path;
        groups.set(key, [...(groups.get(key) ?? []), route]);
    }
    const routesToCapture = Array.from(groups.values()).flatMap((group) => {
        const templateKind = group[0]?.templateKind ?? "static";
        return templateKind === "cms" ? group.slice(0, 1) : group;
    });
    const freshRoutePaths = routesToCapture.map((route) => route.path);
    const baseCapturesByRoute = Object.fromEntries((parentRuntimeCapture.routeCaptures ?? [])
        .filter((capture) => freshRoutePaths.includes(capture.routePath))
        .map((capture) => [
        capture.routePath,
        createResponsiveFreshBaseCapture(capture, ["desktop"]),
    ]));
    return {
        parentRuntimeCapture,
        routesToCapture,
        freshRoutePaths,
        viewportNames: ["laptop", "tablet", "mobile"],
        baseCapturesByRoute,
    };
}
function createResponsiveFreshBaseCapture(capture, preserveViewports = ["desktop"]) {
    const preserved = new Set(preserveViewports);
    const preservedViewports = Object.fromEntries(Object.entries(capture.viewports).filter(([viewportName]) => preserved.has(viewportName)));
    const preservedNodesByViewport = capture.nodesByViewport
        ? Object.fromEntries(Object.entries(capture.nodesByViewport).filter(([viewportName]) => preserved.has(viewportName)))
        : undefined;
    const preservedRootStylesByViewport = capture.rootStylesByViewport
        ? Object.fromEntries(Object.entries(capture.rootStylesByViewport).filter(([viewportName]) => preserved.has(viewportName)))
        : undefined;
    const preservedBreakpointNames = (capture.captureDiagnostics?.breakpointsCaptured ?? []).filter((viewportName) => preserved.has(viewportName));
    const filterRecords = (records) => records
        ? Object.fromEntries(Object.entries(records).filter(([viewportName]) => preserved.has(viewportName)))
        : records;
    return {
        ...capture,
        viewports: preservedViewports,
        nodesByViewport: preservedNodesByViewport,
        rootStylesByViewport: preservedRootStylesByViewport,
        captureDiagnostics: {
            ...(capture.captureDiagnostics ?? {
                breakpointsCaptured: preserveViewports,
            }),
            breakpointsCaptured: preservedBreakpointNames.length > 0
                ? preservedBreakpointNames
                : preserveViewports,
            viewportValidation: filterRecords(capture.captureDiagnostics?.viewportValidation),
            fontReadiness: filterRecords(capture.captureDiagnostics?.fontReadiness),
            stylesheetCount: filterRecords(capture.captureDiagnostics?.stylesheetCount),
            nodeCount: filterRecords(capture.captureDiagnostics?.nodeCount),
            phaseHistory: capture.captureDiagnostics?.phaseHistory ?? [],
            routeProgress: capture.captureDiagnostics?.routeProgress ?? [],
        },
    };
}
async function readParentRuntimeCapture(sharedRevisionCacheRoot, parentRevisionId) {
    return readJsonFile(path.join(sharedRevisionCacheRoot, parentRevisionId, "export", "raw-runtime-capture.json"));
}
async function localizeRuntimeKeptProjectAssets(projectDir) {
    const files = await listFiles(projectDir);
    const candidateFiles = files.filter((filePath) => {
        if (filePath.includes(`${path.sep}node_modules${path.sep}`))
            return false;
        if (filePath.includes(`${path.sep}dist${path.sep}`))
            return false;
        if (filePath.includes(`${path.sep}public${path.sep}runtime-assets${path.sep}`)) {
            return false;
        }
        const extension = path.extname(filePath).toLowerCase();
        return [".tsx", ".ts", ".css", ".html", ".json", ".md"].includes(extension);
    });
    const rawMatchesByNormalizedUrl = new Map();
    for (const filePath of candidateFiles) {
        const content = await fs.readFile(filePath, "utf8");
        for (const match of content.matchAll(/https?:\/\/[^\s"'`()<>]+/g)) {
            const raw = match[0]?.trim();
            if (!raw)
                continue;
            const normalized = normalizeLocalizableRuntimeUrl(raw);
            if (!normalized || !isLocalizableRuntimeUrl(normalized))
                continue;
            const variants = rawMatchesByNormalizedUrl.get(normalized) ?? new Set();
            variants.add(raw);
            rawMatchesByNormalizedUrl.set(normalized, variants);
        }
    }
    const runtimeAssetsDir = path.join(projectDir, "public", "runtime-assets");
    await fs.mkdir(runtimeAssetsDir, { recursive: true });
    const replacements = new Map();
    const manifestEntries = [];
    const localizationResults = await mapWithConcurrency(Array.from(rawMatchesByNormalizedUrl.entries()), 8, async ([normalizedUrl, rawMatches]) => {
        try {
            const localized = await downloadLocalizedRuntimeAsset(normalizedUrl, runtimeAssetsDir);
            return {
                sourceUrl: normalizedUrl,
                rawMatches,
                entry: {
                    sourceUrl: normalizedUrl,
                    localPath: localized.publicPath,
                    status: "localized",
                    contentType: localized.contentType,
                    byteLength: localized.byteLength,
                },
            };
        }
        catch (error) {
            return {
                sourceUrl: normalizedUrl,
                rawMatches,
                entry: {
                    sourceUrl: normalizedUrl,
                    status: "failed",
                    error: error instanceof Error ? error.message : String(error),
                },
            };
        }
    });
    for (const result of localizationResults) {
        manifestEntries.push(result.entry);
        if (result.entry.status !== "localized" || !result.entry.localPath)
            continue;
        for (const rawMatch of result.rawMatches) {
            replacements.set(rawMatch, `${result.entry.localPath}${extractLocalizedRuntimeUrlSuffix(rawMatch)}`);
        }
    }
    let replaced = 0;
    const orderedReplacements = Array.from(replacements.entries()).sort(([left], [right]) => right.length - left.length);
    for (const filePath of candidateFiles) {
        const original = await fs.readFile(filePath, "utf8");
        let next = original;
        for (const [rawMatch, publicPath] of orderedReplacements) {
            if (!next.includes(rawMatch))
                continue;
            next = next.split(rawMatch).join(publicPath);
            replaced += 1;
        }
        if (next !== original) {
            await fs.writeFile(filePath, next);
        }
    }
    const manifestPath = path.join(projectDir, "runtime-localization-report.json");
    await writeJsonFile(manifestPath, {
        generatedAt: new Date().toISOString(),
        downloaded: manifestEntries.filter((entry) => entry.status === "localized").length,
        replaced,
        failed: manifestEntries.filter((entry) => entry.status === "failed").length,
        assets: manifestEntries,
    });
    return {
        downloaded: manifestEntries.filter((entry) => entry.status === "localized").length,
        replaced,
        failed: manifestEntries.filter((entry) => entry.status === "failed").length,
        manifestPath: "runtime-localization-report.json",
    };
}
async function downloadLocalizedRuntimeAsset(sourceUrl, outputDir) {
    const normalizedSourceUrl = normalizeLocalizableRuntimeUrl(sourceUrl);
    const cached = await readCachedLocalizedRuntimeAsset(normalizedSourceUrl);
    if (cached) {
        return await materializeLocalizedRuntimeAsset({
            outputDir,
            buffer: cached.buffer,
            contentType: cached.contentType,
            sourceUrl: normalizedSourceUrl,
        });
    }
    const timeoutMs = resolveRuntimeLocalizationDownloadTimeoutMs();
    let lastError = null;
    for (let attempt = 1; attempt <= 3; attempt += 1) {
        try {
            const response = await fetch(normalizedSourceUrl, {
                headers: {
                    connection: "close",
                },
                redirect: "follow",
                signal: AbortSignal.timeout(timeoutMs),
            });
            if (!response.ok) {
                throw new Error(`Download failed with ${response.status} ${response.statusText}`);
            }
            const contentType = response.headers.get("content-type") ?? undefined;
            const normalizedContentType = normalizeRuntimeAssetContentType(contentType);
            if (normalizedContentType &&
                !isSupportedLocalizedRuntimeContentType(normalizedContentType)) {
                throw new Error(`Unsupported localized asset content type: ${normalizedContentType}`);
            }
            const extension = inferAssetExtension(normalizedSourceUrl, contentType) ?? ".bin";
            const arrayBuffer = await response.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);
            if (buffer.byteLength === 0) {
                throw new Error("Downloaded asset is empty.");
            }
            await writeCachedLocalizedRuntimeAsset({
                sourceUrl: normalizedSourceUrl,
                extension,
                contentType,
                buffer,
            });
            return await materializeLocalizedRuntimeAsset({
                outputDir,
                buffer,
                contentType,
                sourceUrl: normalizedSourceUrl,
            });
        }
        catch (error) {
            lastError = error;
            if (attempt >= 3 || !isRetryableRuntimeLocalizationError(error)) {
                break;
            }
            await new Promise((resolve) => setTimeout(resolve, attempt * 250));
        }
    }
    throw lastError instanceof Error ? lastError : new Error(String(lastError));
}
async function readLocalizedRuntimeAssetHash(targetPath) {
    try {
        const buffer = await fs.readFile(targetPath);
        if (buffer.byteLength === 0)
            return null;
        return crypto
            .createHash("sha256")
            .update(buffer)
            .digest("hex")
            .slice(0, 24);
    }
    catch {
        return null;
    }
}
function localizedRuntimeAssetCacheRoot() {
    return path.join(os.tmpdir(), "coderelay-runtime-asset-cache");
}
async function readCachedLocalizedRuntimeAsset(sourceUrl) {
    const cacheKey = createLocalizedRuntimeAssetCacheKey(sourceUrl);
    const metadataPath = path.join(localizedRuntimeAssetCacheRoot(), `${cacheKey}.json`);
    try {
        const metadata = JSON.parse(await fs.readFile(metadataPath, "utf8"));
        if (!metadata.assetPath)
            return null;
        const buffer = await fs.readFile(metadata.assetPath);
        if (buffer.byteLength === 0)
            return null;
        return {
            buffer,
            contentType: metadata.contentType,
        };
    }
    catch {
        return null;
    }
}
async function writeCachedLocalizedRuntimeAsset(input) {
    const cacheRoot = localizedRuntimeAssetCacheRoot();
    await fs.mkdir(cacheRoot, { recursive: true });
    const cacheKey = createLocalizedRuntimeAssetCacheKey(input.sourceUrl);
    const assetPath = path.join(cacheRoot, `${cacheKey}${input.extension}`);
    await fs.writeFile(assetPath, input.buffer);
    await writeJsonFile(path.join(cacheRoot, `${cacheKey}.json`), {
        sourceUrl: input.sourceUrl,
        contentType: input.contentType,
        assetPath,
        byteLength: input.buffer.byteLength,
        updatedAt: new Date().toISOString(),
    });
}
function createLocalizedRuntimeAssetCacheKey(sourceUrl) {
    return crypto
        .createHash("sha256")
        .update(sourceUrl)
        .digest("hex")
        .slice(0, 24);
}
async function materializeLocalizedRuntimeAsset(input) {
    const extension = inferAssetExtension(input.sourceUrl, input.contentType) ?? ".bin";
    const contentHash = crypto
        .createHash("sha256")
        .update(input.buffer)
        .digest("hex")
        .slice(0, 24);
    const fileName = `${contentHash}${extension}`;
    const targetPath = path.join(input.outputDir, fileName);
    const existingAssetMatches = (await readLocalizedRuntimeAssetHash(targetPath)) === contentHash;
    if (!existingAssetMatches) {
        const tempPath = path.join(input.outputDir, `${fileName}.tmp-${crypto.randomUUID()}`);
        await fs.writeFile(tempPath, input.buffer);
        try {
            await fs.rename(tempPath, targetPath);
        }
        catch (error) {
            const renamedAssetMatches = (await readLocalizedRuntimeAssetHash(targetPath)) === contentHash;
            if (!renamedAssetMatches) {
                throw error;
            }
            await fs.rm(tempPath, { force: true }).catch(() => undefined);
        }
    }
    return {
        publicPath: `/runtime-assets/${fileName}`,
        contentType: input.contentType,
        byteLength: input.buffer.byteLength,
    };
}
async function mapWithConcurrency(items, concurrency, mapper) {
    if (items.length === 0)
        return [];
    const results = new Array(items.length);
    const limit = Math.max(1, Math.min(concurrency, items.length));
    let nextIndex = 0;
    await Promise.all(Array.from({ length: limit }, async () => {
        while (true) {
            const currentIndex = nextIndex;
            nextIndex += 1;
            if (currentIndex >= items.length)
                return;
            results[currentIndex] = await mapper(items[currentIndex], currentIndex);
        }
    }));
    return results;
}
function resolveRuntimeLocalizationDownloadTimeoutMs() {
    return resolveValidationTimeoutMs("CODERELAY_RUNTIME_LOCALIZATION_DOWNLOAD_TIMEOUT_MS", 90_000);
}
function decodeHtmlEntities(value) {
    return value.replace(/&amp;/g, "&");
}
export function normalizeLocalizableRuntimeUrl(value) {
    return decodeHtmlEntities(value).trim().replace(/\\+$/u, "");
}
function extractLocalizedRuntimeUrlSuffix(value) {
    return value.match(/\\+$/u)?.[0] ?? "";
}
function isLocalizableRuntimeUrl(value) {
    try {
        const parsed = new URL(normalizeLocalizableRuntimeUrl(value));
        if (!/^https?:$/.test(parsed.protocol))
            return false;
        const hostname = parsed.hostname.toLowerCase();
        if (hostname.endsWith("framerusercontent.com") ||
            hostname.endsWith("framerstatic.com") ||
            hostname === "fonts.googleapis.com" ||
            hostname === "fonts.gstatic.com") {
            return true;
        }
        const extension = path.extname(parsed.pathname).toLowerCase();
        return [
            ".png",
            ".jpg",
            ".jpeg",
            ".gif",
            ".webp",
            ".svg",
            ".ico",
            ".avif",
            ".mp4",
            ".webm",
            ".mov",
            ".m4v",
            ".mp3",
            ".wav",
            ".ogg",
            ".aac",
            ".woff",
            ".woff2",
            ".ttf",
            ".otf",
            ".eot",
            ".riv",
            ".css",
            ".js",
            ".mjs",
            ".json",
        ].includes(extension);
    }
    catch {
        return false;
    }
}
function inferAssetExtension(sourceUrl, contentType) {
    try {
        const parsed = new URL(sourceUrl);
        const pathnameExt = path.extname(parsed.pathname).toLowerCase();
        if (pathnameExt)
            return pathnameExt;
    }
    catch {
        // Fall through to content-type based inference.
    }
    const normalized = contentType?.split(";")[0].trim().toLowerCase();
    const byType = {
        "image/png": ".png",
        "image/jpeg": ".jpg",
        "image/webp": ".webp",
        "image/gif": ".gif",
        "image/svg+xml": ".svg",
        "image/avif": ".avif",
        "video/mp4": ".mp4",
        "video/webm": ".webm",
        "audio/mpeg": ".mp3",
        "audio/ogg": ".ogg",
        "font/woff": ".woff",
        "font/woff2": ".woff2",
        "font/ttf": ".ttf",
        "font/otf": ".otf",
        "text/css": ".css",
        "text/javascript": ".js",
        "application/javascript": ".js",
        "application/json": ".json",
    };
    return normalized ? byType[normalized] : undefined;
}
function normalizeRuntimeAssetContentType(contentType) {
    return contentType?.split(";")[0].trim().toLowerCase() || undefined;
}
function isSupportedLocalizedRuntimeContentType(contentType) {
    return Boolean(inferAssetExtension("https://example.com/asset", contentType) ||
        contentType.startsWith("image/") ||
        contentType.startsWith("video/") ||
        contentType.startsWith("audio/") ||
        contentType.startsWith("font/"));
}
function isRetryableRuntimeLocalizationError(error) {
    if (!(error instanceof Error))
        return false;
    return (error.name === "AbortError" ||
        /timed out|timeout|network|fetch failed|socket/i.test(error.message));
}
function mergeRuntimeCaptures(parentRuntimeCapture, freshRuntimeCapture) {
    if (!parentRuntimeCapture?.routeCaptures?.length) {
        return freshRuntimeCapture;
    }
    const freshByRoute = new Map((freshRuntimeCapture.routeCaptures ?? []).map((capture) => [
        capture.routePath,
        capture,
    ]));
    const mergedRouteCaptures = (parentRuntimeCapture.routeCaptures ?? []).map((capture) => freshByRoute.get(capture.routePath) ?? capture);
    for (const capture of freshRuntimeCapture.routeCaptures ?? []) {
        if (!mergedRouteCaptures.some((entry) => entry.routePath === capture.routePath)) {
            mergedRouteCaptures.push(capture);
        }
    }
    const primary = mergedRouteCaptures.find((capture) => capture.routePath === "/") ??
        mergedRouteCaptures[0] ??
        freshRuntimeCapture;
    return {
        ...freshRuntimeCapture,
        ...primary,
        routeCaptures: mergedRouteCaptures,
        stylesheetUrls: unique([
            ...(parentRuntimeCapture.stylesheetUrls ?? []),
            ...(freshRuntimeCapture.stylesheetUrls ?? []),
        ]),
        framerStyleCss: freshRuntimeCapture.framerStyleCss || parentRuntimeCapture.framerStyleCss,
    };
}
export async function validateGeneratedProject(projectDir, input = {}) {
    const generated = await summarizeGeneratedProject(projectDir);
    console.log("[coderelay:core:generated-files]", JSON.stringify(generated));
    if (generated.generatedFileCount === 0) {
        throw new Error("Generated export is empty: no files were written.");
    }
    if (generated.tsxBytes === 0) {
        throw new Error("Generated export is invalid: TSX output is empty.");
    }
    if (generated.cssBytes === 0) {
        throw new Error("Generated export is invalid: CSS output is empty.");
    }
    if (generated.previewHtmlBytes === 0) {
        throw new Error("Generated export is invalid: preview.html is empty.");
    }
    const startedAt = Date.now();
    try {
        const packageManager = await resolvePackageManager(projectDir);
        const hasPackageLock = await fileExists(path.join(projectDir, "package-lock.json"));
        const installArgs = packageManager === "pnpm"
            ? ["install", "--config.dangerouslyAllowAllBuilds=true"]
            : hasPackageLock
                ? ["ci", "--ignore-scripts", "--no-audit", "--no-fund"]
                : ["install", "--ignore-scripts", "--no-audit", "--no-fund"];
        const expectedLockfilePath = packageManager === "pnpm"
            ? path.join(projectDir, "pnpm-lock.yaml")
            : path.join(projectDir, "package-lock.json");
        await input.onProgress?.({
            detail: `Installing generated project dependencies with ${packageManager}.`,
        });
        const install = await runCommand(packageManager, installArgs, projectDir, resolveValidationTimeoutMs("CODERELAY_INSTALL_TIMEOUT_MS", 180_000));
        console.log("[coderelay:core:install]", JSON.stringify({
            exitCode: install.exitCode,
            packageManager,
            command: installArgs.join(" "),
            durationMs: install.durationMs,
            stdout: tail(install.stdout, 2_000),
            stderr: tail(install.stderr, 2_000),
        }));
        if (install.exitCode !== 0) {
            throw new Error(`Generated export dependency install failed.\n${tail(install.stderr || install.stdout, 4_000)}`);
        }
        if (!(await fileExists(expectedLockfilePath))) {
            throw new Error(`Generated export install did not produce the expected lockfile: ${path.basename(expectedLockfilePath)}.`);
        }
        await input.onProgress?.({
            detail: `Building generated project with ${packageManager} run build.`,
        });
        const buildTimeoutMs = resolveGeneratedProjectBuildTimeoutMs(generated.generatedFileCount);
        const build = await runCommand(packageManager, ["run", "build"], projectDir, buildTimeoutMs);
        console.log("[coderelay:core:build]", JSON.stringify({
            exitCode: build.exitCode,
            timeoutMs: buildTimeoutMs,
            durationMs: build.durationMs,
            stdout: tail(build.stdout, 4_000),
            stderr: tail(build.stderr, 4_000),
        }));
        if (build.exitCode !== 0) {
            throw new Error(`Generated export build failed.\n${tail(build.stderr || build.stdout, 8_000)}`);
        }
        const routeManifest = await readGeneratedRouteManifest(projectDir);
        await input.onProgress?.({
            detail: `Running generated runtime validation across ${routeManifest.length} routes.`,
            completed: 0,
            total: routeManifest.length,
        });
        const runtime = await inspectBuiltProject(path.join(projectDir, "dist"), routeManifest, {
            onProgress: input.onProgress,
        });
        console.log("[coderelay:core:runtime]", JSON.stringify({
            rootChildCount: runtime.rootChildCount,
            renderedElementCount: runtime.renderedElementCount,
            renderedTextLength: runtime.renderedTextLength,
            consoleErrorCount: runtime.consoleErrors.length,
            pageErrorCount: runtime.pageErrors.length,
            routeCount: runtime.routes.length,
            externalRequestCount: runtime.externalRequests.length,
            failedRequestCount: runtime.failedRequests.length,
            codeFileExecutionCount: runtime.codeFileExecutions.length,
            failedCodeFileExecutionCount: runtime.codeFileExecutions.filter((execution) => execution.status === "failed").length,
            interactionContractCount: runtime.interactionContracts.length,
            failedInteractionContractCount: runtime.interactionContracts.filter((contract) => contract.status === "failed").length,
            responsiveViewportCheckCount: runtime.routes.reduce((total, route) => total + route.viewportChecks.length, 0),
            responsiveViewportFailureCount: runtime.routes.reduce((total, route) => total +
                route.viewportChecks.filter((check) => check.horizontalOverflow || !check.fullWidthRoot).length, 0),
            failedRouteCount: runtime.routes.filter((route) => route.routeKind !== "redirect" &&
                (route.rootChildCount === 0 || route.renderedElementCount === 0)).length,
        }));
        const hasRenderedPageRoute = runtime.routes.some((route) => route.routeKind !== "redirect");
        if (hasRenderedPageRoute &&
            (runtime.rootChildCount === 0 || runtime.renderedElementCount === 0)) {
            throw new Error(`Generated export rendered a blank root (children=${runtime.rootChildCount}, visibleElements=${runtime.renderedElementCount}).`);
        }
        if (runtime.pageErrors.length > 0) {
            throw new Error(`Generated export crashed at runtime.\n${runtime.pageErrors.join("\n")}`);
        }
        if (input.exportMode === "full-site" && runtime.externalRequests.length > 0) {
            throw new Error(`Generated export still depends on external runtime assets.\n${runtime.externalRequests.join("\n")}`);
        }
        if (input.exportMode === "full-site" && runtime.failedRequests.length > 0) {
            throw new Error(`Generated export requested missing assets or routes.\n${runtime.failedRequests
                .map((entry) => `${entry.status} ${entry.url}`)
                .join("\n")}`);
        }
        const failedCodeFileExecution = runtime.codeFileExecutions.find((execution) => execution.status === "failed");
        if (failedCodeFileExecution) {
            throw new Error(`Generated export executable code-file contract failed for ${failedCodeFileExecution.fileName} on route ${failedCodeFileExecution.routePath}. ` +
                `${failedCodeFileExecution.detail ?? "Executable preview did not mount as expected."}`);
        }
        const failedInteractionContract = runtime.interactionContracts.find((contract) => contract.status === "failed");
        if (failedInteractionContract) {
            throw new Error(`Generated export interaction contract failed for family ${failedInteractionContract.familyId} on route ${failedInteractionContract.routePath}. ` +
                `${failedInteractionContract.detail ?? "Interaction state did not update as expected."}`);
        }
        const emptyRoute = runtime.routes.find((route) => route.routeKind !== "redirect" &&
            ((route.sourceTextLength > 0 && route.renderedTextLength === 0) ||
                (route.sourceTextLength >= 200 &&
                    route.renderedTextLength / route.sourceTextLength < 0.5) ||
                (route.sourceTextLength > 0 &&
                    route.sourceNodeCount >= 5 &&
                    route.renderedElementCount < 3) ||
                (route.sourceTextLength > 0 &&
                    route.sourceNodeCount >= 5 &&
                    route.screenshotColorCount < 3)));
        if (emptyRoute) {
            throw new Error(`Generated export route ${emptyRoute.path} is near-empty ` +
                `(sourceText=${emptyRoute.sourceTextLength}, renderedText=${emptyRoute.renderedTextLength}, ` +
                `sourceNodes=${emptyRoute.sourceNodeCount}, visibleElements=${emptyRoute.renderedElementCount}, ` +
                `screenshotColors=${emptyRoute.screenshotColorCount}).`);
        }
        const failedResponsiveCheck = runtime.routes
            .flatMap((route) => route.viewportChecks.map((check) => ({ routePath: route.path, check })))
            .find(({ check }) => check.horizontalOverflow || !check.fullWidthRoot);
        if (failedResponsiveCheck) {
            throw new Error(`Generated export responsive validation failed for route ${failedResponsiveCheck.routePath} at ${failedResponsiveCheck.check.viewport}. ` +
                `horizontalOverflow=${failedResponsiveCheck.check.horizontalOverflow}, ` +
                `fullWidthRoot=${failedResponsiveCheck.check.fullWidthRoot}, ` +
                `innerWidth=${failedResponsiveCheck.check.innerWidth}, ` +
                `rootWidth=${failedResponsiveCheck.check.rootWidth}, ` +
                `scrollWidth=${failedResponsiveCheck.check.scrollWidth}.`);
        }
        return {
            status: "passed",
            ...generated,
            buildDurationMs: Date.now() - startedAt,
            renderedElementCount: runtime.renderedElementCount,
            renderedTextLength: runtime.renderedTextLength,
            consoleErrors: runtime.consoleErrors,
            pageErrors: runtime.pageErrors,
            externalRequests: runtime.externalRequests,
            failedRequests: runtime.failedRequests,
            runtimeLocalization: input.runtimeLocalization,
            codeFileExecutions: runtime.codeFileExecutions,
            interactionContracts: runtime.interactionContracts,
            routes: runtime.routes,
        };
    }
    finally {
        // Keep the generated lockfile and dist, but never ship installed dependencies.
        await fs.rm(path.join(projectDir, "node_modules"), {
            recursive: true,
            force: true,
        });
    }
}
function resolveGeneratedProjectBuildTimeoutMs(generatedFileCount) {
    const configuredTimeoutMs = resolveValidationTimeoutMs("CODERELAY_BUILD_TIMEOUT_MS", 300_000);
    if (generatedFileCount < 500)
        return configuredTimeoutMs;
    return Math.max(configuredTimeoutMs, generatedFileCount * 750);
}
async function resolvePackageManager(projectDir) {
    const requested = process.env.CODERELAY_PACKAGE_MANAGER;
    const candidates = requested === "npm" || requested === "pnpm"
        ? [requested]
        : ["npm", "pnpm"];
    for (const candidate of candidates) {
        try {
            const result = await runCommand(candidate, ["--version"], projectDir, 10_000);
            if (result.exitCode === 0)
                return candidate;
        }
        catch (error) {
            if (error.code !== "ENOENT")
                throw error;
        }
    }
    throw new Error("Generated export validation requires npm or pnpm, but neither command is available.");
}
async function verifyPackagedExportArchive(zipPath, input = {}) {
    if (zipVerificationTestMode === "force-failure") {
        throw new Error("Generated export ZIP verification forced to fail for testing.");
    }
    const zipStat = await fs.stat(zipPath).catch(() => null);
    if (!zipStat?.isFile() || zipStat.size <= 0) {
        throw new Error(`Packaged export ZIP is missing or empty: ${zipPath}`);
    }
    const verificationRoot = await fs.mkdtemp(path.join(os.tmpdir(), "coderelay-zip-verify-"));
    const extractedProjectDir = path.join(verificationRoot, "export");
    await fs.mkdir(extractedProjectDir, { recursive: true });
    try {
        await input.onProgress?.({
            detail: "Extracting generated ZIP into a clean verification directory.",
        });
        const extraction = await extractZipArchive(zipPath, extractedProjectDir);
        console.log("[coderelay:core:zip-verify:extract]", JSON.stringify({
            command: `${extraction.command} ${extraction.args.join(" ")}`,
            exitCode: extraction.result.exitCode,
            durationMs: extraction.result.durationMs,
            stdout: tail(extraction.result.stdout, 2_000),
            stderr: tail(extraction.result.stderr, 2_000),
        }));
        if (extraction.result.exitCode !== 0) {
            throw new Error(`Generated export ZIP could not be extracted.\n${tail(extraction.result.stderr || extraction.result.stdout, 4_000)}`);
        }
        const extractedFiles = await listFiles(extractedProjectDir);
        if (extractedFiles.length === 0) {
            throw new Error("Generated export ZIP unpacked to an empty directory.");
        }
        await input.onProgress?.({
            detail: "Revalidating extracted ZIP contents from a clean directory.",
        });
        const packagedValidation = await validateGeneratedProject(extractedProjectDir, {
            exportMode: input.exportMode,
            onProgress: input.onProgress,
        });
        return {
            verified: true,
            zipByteSize: zipStat.size,
            extractedFileCount: extractedFiles.length,
            verificationDurationMs: extraction.result.durationMs + packagedValidation.buildDurationMs,
            routeCount: packagedValidation.routes.length,
            renderedElementCount: packagedValidation.renderedElementCount,
            renderedTextLength: packagedValidation.renderedTextLength,
            externalRequestCount: packagedValidation.externalRequests.length,
            failedRequestCount: packagedValidation.failedRequests.length,
        };
    }
    finally {
        await fs.rm(verificationRoot, {
            recursive: true,
            force: true,
        });
    }
}
async function extractZipArchive(zipPath, outputDir) {
    const requestedCommands = process.env.CODERELAY_ZIP_EXTRACT_COMMANDS
        ?.split(",")
        .map((value) => value.trim())
        .filter(Boolean);
    const attempts = (requestedCommands && requestedCommands.length > 0
        ? requestedCommands
        : ["unzip", "tar"]).map((command) => ({
        command,
        args: command === "unzip"
            ? ["-qq", path.resolve(zipPath), "-d", path.resolve(outputDir)]
            : command === "tar"
                ? ["-xf", path.resolve(zipPath), "-C", path.resolve(outputDir)]
                : [path.resolve(zipPath), path.resolve(outputDir)],
    }));
    const failures = [];
    for (const attempt of attempts) {
        try {
            const result = await runCommand(attempt.command, [...attempt.args], outputDir, 120_000);
            if (result.exitCode === 0) {
                return { ...attempt, result };
            }
            failures.push(`${attempt.command}: ${tail(result.stderr || result.stdout, 2_000)}`);
        }
        catch (error) {
            if (error.code === "ENOENT") {
                failures.push(`${attempt.command}: command not available`);
                continue;
            }
            throw error;
        }
    }
    throw new Error(`Generated export ZIP verification requires unzip or tar.\n${failures.join("\n")}`);
}
async function readGeneratedRouteManifest(projectDir) {
    const manifestPath = path.join(projectDir, "route-manifest.json");
    const parsed = await fs
        .readFile(manifestPath, "utf8")
        .then((content) => JSON.parse(content))
        .catch(() => []);
    if (!Array.isArray(parsed) || parsed.length === 0) {
        return [{ path: "/", routeKind: "page", sourceTextLength: 0, sourceNodeCount: 0 }];
    }
    return parsed.map((entry) => {
        const record = entry && typeof entry === "object"
            ? entry
            : {};
        const routeMetadata = resolveExportRouteMetadata({
            routeKind: record.routeKind === "redirect" || record.routeKind === "page"
                ? record.routeKind
                : undefined,
            destination: typeof record.destination === "string" && record.destination.length > 0
                ? record.destination
                : undefined,
            destinationKind: record.destinationKind === "internal" || record.destinationKind === "external"
                ? record.destinationKind
                : undefined,
            redirectTo: typeof record.redirectTo === "string" && record.redirectTo.length > 0
                ? record.redirectTo
                : undefined,
        });
        return {
            path: typeof record.path === "string" && record.path.startsWith("/")
                ? record.path
                : "/",
            routeKind: routeMetadata.routeKind,
            sourceTextLength: typeof record.sourceTextLength === "number"
                ? record.sourceTextLength
                : 0,
            sourceNodeCount: typeof record.sourceNodeCount === "number"
                ? record.sourceNodeCount
                : 0,
            destination: routeMetadata.destination,
            destinationKind: routeMetadata.destinationKind,
            redirectTo: routeMetadata.redirectTo,
        };
    });
}
async function summarizeGeneratedProject(projectDir) {
    const files = await listFiles(projectDir);
    let tsxBytes = 0;
    let cssBytes = 0;
    let previewHtmlBytes = 0;
    for (const file of files) {
        const size = (await fs.stat(file)).size;
        if (file.endsWith(".tsx"))
            tsxBytes += size;
        if (file.endsWith(".css"))
            cssBytes += size;
        if (path.basename(file) === "preview.html")
            previewHtmlBytes += size;
    }
    return {
        generatedFileCount: files.length,
        tsxBytes,
        cssBytes,
        previewHtmlBytes,
    };
}
async function listFiles(dir) {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    const nested = await Promise.all(entries.map(async (entry) => {
        const fullPath = path.join(dir, entry.name);
        return entry.isDirectory() ? listFiles(fullPath) : [fullPath];
    }));
    return nested.flat();
}
async function runCommand(command, args, cwd, timeoutMs) {
    const startedAt = Date.now();
    const nodeBinDir = path.dirname(process.execPath);
    const inheritedPath = process.env.PATH ?? "";
    const envPathEntries = inheritedPath
        .split(pathDelimiter)
        .filter(Boolean);
    if (!envPathEntries.includes(nodeBinDir)) {
        envPathEntries.unshift(nodeBinDir);
    }
    const childEnv = {
        ...process.env,
        PATH: envPathEntries.join(pathDelimiter),
        NODE: process.execPath,
        npm_node_execpath: process.execPath,
        npm_execpath: process.env.npm_execpath ?? process.execPath,
    };
    return await new Promise((resolve, reject) => {
        const child = spawn(command, args, {
            cwd,
            env: childEnv,
            stdio: ["ignore", "pipe", "pipe"],
        });
        let stdout = "";
        let stderr = "";
        const timer = setTimeout(() => {
            child.kill("SIGKILL");
            const durationMs = Date.now() - startedAt;
            reject(new Error(`${command} ${args.join(" ")} timed out after ${timeoutMs}ms.\n` +
                `cwd=${cwd}\n` +
                `pid=${child.pid ?? "unknown"}\n` +
                `elapsedMs=${durationMs}\n` +
                `stdout:\n${tail(stdout, 4_000) || "(empty)"}\n` +
                `stderr:\n${tail(stderr, 4_000) || "(empty)"}`));
        }, timeoutMs);
        child.stdout.on("data", (chunk) => {
            stdout = tail(stdout + String(chunk), 20_000);
        });
        child.stderr.on("data", (chunk) => {
            stderr = tail(stderr + String(chunk), 20_000);
        });
        child.on("error", (error) => {
            clearTimeout(timer);
            reject(error);
        });
        child.on("close", (code) => {
            clearTimeout(timer);
            resolve({
                exitCode: code ?? -1,
                stdout,
                stderr,
                durationMs: Date.now() - startedAt,
            });
        });
    });
}
async function inspectBuiltProject(distDir, routeManifest, input = {}) {
    const normalizeRoutePath = (value) => {
        if (!value)
            return "/";
        if (value === "/")
            return "/";
        return value.endsWith("/") ? value.slice(0, -1) : value;
    };
    const server = createServer(async (request, response) => {
        try {
            const requestUrl = new URL(request.url ?? "/", "http://127.0.0.1");
            const requested = requestUrl.pathname === "/" ? "/index.html" : requestUrl.pathname;
            const normalized = path.normalize(requested).replace(/^(\.\.(\/|\\|$))+/, "");
            let filePath = path.join(distDir, normalized);
            const stat = await fs.stat(filePath).catch(() => null);
            if (!stat?.isFile()) {
                if (path.extname(normalized)) {
                    response.statusCode = 404;
                    response.end("Not found");
                    return;
                }
                filePath = path.join(distDir, "index.html");
            }
            const content = await fs.readFile(filePath);
            response.statusCode = 200;
            response.setHeader("content-type", contentType(filePath));
            response.end(content);
        }
        catch (error) {
            response.statusCode = 500;
            response.end(error instanceof Error ? error.message : String(error));
        }
    });
    await new Promise((resolve, reject) => {
        server.once("error", reject);
        server.listen(0, "127.0.0.1", () => resolve());
    });
    const address = server.address();
    if (!address || typeof address === "string") {
        server.close();
        throw new Error("Generated export validation server did not start.");
    }
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
    const consoleErrors = [];
    const pageErrors = [];
    const externalRequests = new Set();
    const failedRequests = [];
    page.on("console", (message) => {
        if (message.type() === "error")
            consoleErrors.push(message.text());
    });
    page.on("pageerror", (error) => {
        pageErrors.push(error.message);
    });
    page.on("request", (request) => {
        try {
            const url = new URL(request.url());
            if (!/^https?:$/.test(url.protocol))
                return;
            if (url.hostname === "127.0.0.1" && url.port === String(address.port))
                return;
            if (!shouldTrackExternalRuntimeRequest(request))
                return;
            externalRequests.add(request.url());
        }
        catch {
            // Ignore nonstandard URLs.
        }
    });
    page.on("response", (response) => {
        if (response.status() < 400)
            return;
        failedRequests.push({ url: response.url(), status: response.status() });
    });
    try {
        const routes = [];
        let rootChildCount = 0;
        const codeFileExecutions = [];
        const interactionContracts = [];
        const responsiveValidationViewports = {
            desktop: { width: 1440, height: 900 },
            laptop: { width: 1280, height: 900 },
            tablet: { width: 768, height: 1024 },
            mobile: { width: 390, height: 844 },
        };
        const routeReadyTimeoutMs = resolveValidationTimeoutMs("CODERELAY_ROUTE_READY_TIMEOUT_MS", 10_000);
        const knownRoutePaths = new Set(routeManifest.map((route) => route.path));
        for (const [routeIndex, route] of routeManifest.entries()) {
            const routeMetadata = resolveExportRouteMetadata({
                routeKind: route.routeKind,
                destination: route.destination,
                destinationKind: route.destinationKind,
                redirectTo: route.redirectTo,
            });
            await input.onProgress?.({
                detail: routeMetadata.routeKind === "redirect"
                    ? `Validating redirect contract for ${route.path}.`
                    : `Validating rendered route ${route.path}.`,
                routePath: route.path,
                completed: routeIndex,
                total: routeManifest.length,
            });
            if (routeMetadata.routeKind === "redirect") {
                const destination = routeMetadata.destination;
                const destinationKind = routeMetadata.destinationKind;
                let validRedirect = false;
                if (destination) {
                    if (destination.startsWith("/")) {
                        validRedirect = true;
                    }
                    else {
                        try {
                            validRedirect = ["http:", "https:"].includes(new URL(destination).protocol);
                        }
                        catch {
                            validRedirect = false;
                        }
                    }
                }
                if (!destination || !validRedirect || !destinationKind) {
                    throw new Error(`Generated export route ${route.path} has an invalid redirect target: ${destination ?? "missing"}`);
                }
                if (destinationKind === "internal" &&
                    !knownRoutePaths.has(destination)) {
                    throw new Error(`Generated export route ${route.path} has an invalid internal redirect target: ${destination}`);
                }
                await page.goto(`http://127.0.0.1:${address.port}${route.path}`, {
                    waitUntil: "domcontentloaded",
                    timeout: 30_000,
                });
                await page.waitForTimeout(250);
                const runtimeUrl = page.url();
                let runtimeLocation;
                try {
                    runtimeLocation = new URL(runtimeUrl);
                }
                catch {
                    throw new Error(`Generated export redirect route ${route.path} resolved to an unreadable runtime URL: ${runtimeUrl}`);
                }
                if (runtimeLocation.hostname !== "127.0.0.1" ||
                    runtimeLocation.port !== String(address.port)) {
                    throw new Error(`Generated export redirect route ${route.path} navigated away during local validation: ${runtimeUrl}`);
                }
                const observedPath = normalizeRoutePath(runtimeLocation.pathname);
                const expectedPaths = destinationKind === "internal"
                    ? new Set([
                        normalizeRoutePath(route.path),
                        normalizeRoutePath(destination),
                    ])
                    : new Set([normalizeRoutePath(route.path)]);
                if (!expectedPaths.has(observedPath)) {
                    throw new Error(`Generated export redirect route ${route.path} resolved to unexpected local path during validation: ${observedPath}`);
                }
                routes.push({
                    ...route,
                    routeKind: "redirect",
                    status: "passed",
                    destination,
                    destinationKind,
                    redirectTo: routeMetadata.redirectTo,
                    rootChildCount: 0,
                    renderedElementCount: 0,
                    renderedTextLength: 0,
                    screenshotColorCount: 0,
                    viewportChecks: [],
                });
                await input.onProgress?.({
                    detail: `Validated redirect contract for ${route.path}.`,
                    routePath: route.path,
                    completed: routeIndex + 1,
                    total: routeManifest.length,
                });
                continue;
            }
            await page.goto(`http://127.0.0.1:${address.port}${route.path}`, {
                waitUntil: "domcontentloaded",
                timeout: 30_000,
            });
            await waitForRenderedRouteReady({
                page,
                routePath: route.path,
                timeoutMs: routeReadyTimeoutMs,
            });
            await page.waitForTimeout(100);
            const inspected = await page.evaluate(() => {
                const root = document.getElementById("root");
                const renderedElements = root
                    ? Array.from(root.querySelectorAll("*")).filter((element) => {
                        const style = getComputedStyle(element);
                        const rect = element.getBoundingClientRect();
                        return (style.display !== "none" &&
                            style.visibility !== "hidden" &&
                            Number(style.opacity) > 0 &&
                            rect.width > 0 &&
                            rect.height > 0);
                    })
                    : [];
                const rootWidth = root?.getBoundingClientRect().width ?? 0;
                const innerWidth = window.innerWidth;
                const scrollWidth = document.documentElement.scrollWidth;
                const bodyScrollWidth = document.body?.scrollWidth ?? 0;
                const horizontalOverflow = scrollWidth > innerWidth + 1 || bodyScrollWidth > innerWidth + 1;
                return {
                    rootChildCount: root?.children.length ?? 0,
                    renderedElementCount: renderedElements.length,
                    renderedTextLength: root?.textContent?.trim().length ?? 0,
                    rootWidth,
                    innerWidth,
                    scrollWidth,
                    bodyScrollWidth,
                    horizontalOverflow,
                    fullWidthRoot: rootWidth >= innerWidth - 4,
                };
            });
            const screenshotColorCount = countSampledScreenshotColors(await page.screenshot({ animations: "disabled" }));
            const viewportChecks = [];
            for (const [viewportName, viewport] of Object.entries(responsiveValidationViewports)) {
                await page.setViewportSize(viewport);
                await page.waitForTimeout(100);
                const viewportState = await page.evaluate(() => {
                    const root = document.getElementById("root");
                    const renderedElements = root
                        ? Array.from(root.querySelectorAll("*")).filter((element) => {
                            const style = getComputedStyle(element);
                            const rect = element.getBoundingClientRect();
                            return (style.display !== "none" &&
                                style.visibility !== "hidden" &&
                                Number(style.opacity) > 0 &&
                                rect.width > 0 &&
                                rect.height > 0);
                        })
                        : [];
                    const rootWidth = root?.getBoundingClientRect().width ?? 0;
                    const innerWidth = window.innerWidth;
                    const scrollWidth = document.documentElement.scrollWidth;
                    const bodyScrollWidth = document.body?.scrollWidth ?? 0;
                    const horizontalOverflow = scrollWidth > innerWidth + 1 || bodyScrollWidth > innerWidth + 1;
                    return {
                        rootChildCount: root?.children.length ?? 0,
                        renderedElementCount: renderedElements.length,
                        renderedTextLength: root?.textContent?.trim().length ?? 0,
                        rootWidth,
                        innerWidth,
                        scrollWidth,
                        bodyScrollWidth,
                        horizontalOverflow,
                        fullWidthRoot: rootWidth >= innerWidth - 4,
                    };
                });
                viewportChecks.push({
                    viewport: viewportName,
                    innerWidth: viewportState.innerWidth,
                    rootWidth: viewportState.rootWidth,
                    scrollWidth: viewportState.scrollWidth,
                    bodyScrollWidth: viewportState.bodyScrollWidth,
                    renderedElementCount: viewportState.renderedElementCount,
                    renderedTextLength: viewportState.renderedTextLength,
                    horizontalOverflow: viewportState.horizontalOverflow,
                    fullWidthRoot: viewportState.fullWidthRoot,
                });
            }
            codeFileExecutions.push(...(await inspectExecutableCodeFilePreviews(page, route.path)));
            interactionContracts.push(...(await inspectComponentFamilyInteractions(page, route.path)));
            rootChildCount = Math.max(rootChildCount, inspected.rootChildCount);
            routes.push({ ...route, ...inspected, screenshotColorCount, viewportChecks });
            await input.onProgress?.({
                detail: `Validated rendered route ${route.path}.`,
                routePath: route.path,
                completed: routeIndex + 1,
                total: routeManifest.length,
            });
        }
        return {
            rootChildCount,
            renderedElementCount: routes.reduce((total, route) => total + route.renderedElementCount, 0),
            renderedTextLength: routes.reduce((total, route) => total + route.renderedTextLength, 0),
            consoleErrors,
            pageErrors,
            externalRequests: [...externalRequests],
            failedRequests,
            codeFileExecutions,
            interactionContracts,
            routes,
        };
    }
    finally {
        await browser.close();
        await new Promise((resolve) => server.close(() => resolve()));
    }
}
function shouldTrackExternalRuntimeRequest(request) {
    const resourceType = request.resourceType();
    if (resourceType === "document")
        return false;
    if (request.isNavigationRequest())
        return false;
    return true;
}
async function inspectComponentFamilyInteractions(page, routePath) {
    const routeMountedFamilies = await page
        .locator('[data-framer-component-family-placement="route"]')
        .all();
    const families = routeMountedFamilies.length > 0
        ? routeMountedFamilies
        : await page.locator("[data-framer-component-family]").all();
    const results = [];
    for (const family of families) {
        const familyId = (await family.getAttribute("data-framer-component-family")) ?? "";
        const familyName = (await family.getAttribute("data-framer-component-family-name")) ?? undefined;
        const currentVariant = family.locator("[data-framer-current-variant]").first();
        const initialVariantId = (await currentVariant.getAttribute("data-framer-current-variant")) ?? undefined;
        const variantButtons = family.locator("[data-framer-variant-button]");
        const buttonCount = await variantButtons.count();
        if (!initialVariantId || buttonCount === 0) {
            results.push({
                routePath,
                familyId,
                familyName,
                status: "failed",
                initialVariantId,
                detail: "Missing initial variant marker or variant buttons.",
            });
            continue;
        }
        const targetButtonIndex = await findAlternateVariantButtonIndex(variantButtons, initialVariantId);
        const transitionButtons = family.locator("[data-framer-transition-trigger]");
        const transitionButtonCount = await transitionButtons.count();
        const hasAlternateTransition = await hasAlternateTransitionTarget(transitionButtons, initialVariantId);
        if (targetButtonIndex < 0) {
            if (buttonCount <= 1 && (!transitionButtonCount || !hasAlternateTransition)) {
                continue;
            }
            results.push({
                routePath,
                familyId,
                familyName,
                status: "failed",
                initialVariantId,
                detail: "No alternate variant button was available.",
            });
            continue;
        }
        const clickButton = variantButtons.nth(targetButtonIndex);
        const clickVariantId = (await clickButton.getAttribute("data-framer-variant-button")) ?? undefined;
        await clickButton.click();
        await page.waitForTimeout(50);
        const variantAfterClick = (await currentVariant.getAttribute("data-framer-current-variant")) ?? undefined;
        if (!clickVariantId || variantAfterClick !== clickVariantId) {
            results.push({
                routePath,
                familyId,
                familyName,
                status: "failed",
                initialVariantId,
                clickVariantId,
                detail: "Pointer activation did not move the family into the selected variant state.",
            });
            continue;
        }
        await variantButtons.nth(0).focus();
        const keyboardTargetIndex = await findAlternateVariantButtonIndex(variantButtons, variantAfterClick);
        if (keyboardTargetIndex < 0) {
            results.push({
                routePath,
                familyId,
                familyName,
                status: "failed",
                initialVariantId,
                clickVariantId,
                detail: "No alternate keyboard target variant was available after click validation.",
            });
            continue;
        }
        const keyboardButton = variantButtons.nth(keyboardTargetIndex);
        const keyboardVariantId = (await keyboardButton.getAttribute("data-framer-variant-button")) ?? undefined;
        await keyboardButton.focus();
        await page.keyboard.press("Enter");
        await page.waitForTimeout(50);
        const variantAfterKeyboard = (await currentVariant.getAttribute("data-framer-current-variant")) ?? undefined;
        if (!keyboardVariantId || variantAfterKeyboard !== keyboardVariantId) {
            results.push({
                routePath,
                familyId,
                familyName,
                status: "failed",
                initialVariantId,
                clickVariantId,
                keyboardVariantId,
                detail: "Keyboard activation did not move the family into the focused variant state.",
            });
            continue;
        }
        let transitionTargetId;
        if ((await transitionButtons.count()) > 0) {
            const transitionButton = transitionButtons.first();
            transitionTargetId =
                (await transitionButton.getAttribute("data-framer-transition-target")) ??
                    undefined;
            await transitionButton.click();
            await page.waitForTimeout(50);
            const variantAfterTransition = (await currentVariant.getAttribute("data-framer-current-variant")) ??
                undefined;
            if (transitionTargetId &&
                variantAfterTransition !== transitionTargetId) {
                results.push({
                    routePath,
                    familyId,
                    familyName,
                    status: "failed",
                    initialVariantId,
                    clickVariantId,
                    keyboardVariantId,
                    transitionTargetId,
                    detail: "Transition trigger did not advance the component family to the declared target state.",
                });
                continue;
            }
        }
        results.push({
            routePath,
            familyId,
            familyName,
            status: "passed",
            initialVariantId,
            clickVariantId,
            keyboardVariantId,
            transitionTargetId,
        });
    }
    return results;
}
async function waitForRenderedRouteReady(input) {
    const maxAttempts = 2;
    for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
        try {
            await input.page.waitForFunction(() => {
                const root = document.getElementById("root");
                return ((root?.childElementCount ?? 0) > 0 &&
                    !root?.querySelector('[aria-live="polite"]'));
            }, undefined, { timeout: input.timeoutMs });
            return;
        }
        catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            if (!/Timeout \d+ms exceeded/i.test(message))
                throw error;
            if (attempt < maxAttempts) {
                await input.page.reload({
                    waitUntil: "domcontentloaded",
                    timeout: 30_000,
                });
                continue;
            }
            let diagnostics;
            try {
                diagnostics = await input.page.evaluate(() => {
                    const root = document.getElementById("root");
                    const ariaLive = root?.querySelector('[aria-live="polite"]');
                    return {
                        readyState: document.readyState,
                        rootChildCount: root?.childElementCount ?? 0,
                        ariaLivePresent: Boolean(ariaLive),
                        ariaLiveTextLength: ariaLive?.textContent?.trim().length ?? 0,
                        renderedTextLength: root?.textContent?.trim().length ?? 0,
                    };
                });
            }
            catch {
                diagnostics = undefined;
            }
            throw new Error(`Generated runtime validation timed out waiting for route ${input.routePath} to render after ${input.timeoutMs}ms. ` +
                `attempt=${attempt}/${maxAttempts} url=${input.page.url()} ` +
                `readyState=${diagnostics?.readyState ?? "unknown"} ` +
                `rootChildCount=${diagnostics?.rootChildCount ?? "unknown"} ` +
                `ariaLivePresent=${diagnostics?.ariaLivePresent ?? "unknown"} ` +
                `ariaLiveTextLength=${diagnostics?.ariaLiveTextLength ?? "unknown"} ` +
                `renderedTextLength=${diagnostics?.renderedTextLength ?? "unknown"}`);
        }
    }
}
async function inspectExecutableCodeFilePreviews(page, routePath) {
    return await page.evaluate((currentRoutePath) => {
        const previews = Array.from(document.querySelectorAll("[data-framer-code-file-executable-preview]"));
        return previews.map((preview) => {
            const fileName = preview.getAttribute("data-framer-code-file-executable-preview") ?? "";
            const executable = preview.querySelector("[data-framer-code-file-executable]");
            const fallback = preview.querySelector("[data-framer-code-file-executable-fallback]");
            const renderTargetMarker = executable?.querySelector("[data-render-target]");
            const renderTargetValue = renderTargetMarker?.getAttribute("data-render-target") ?? undefined;
            const exportName = executable?.getAttribute("data-framer-code-file-export") ?? undefined;
            if (fallback) {
                return {
                    routePath: currentRoutePath,
                    fileName,
                    exportName,
                    status: "failed",
                    renderTargetValue,
                    detail: "Executable preview fell back instead of mounting the adapted component.",
                };
            }
            if (!executable) {
                return {
                    routePath: currentRoutePath,
                    fileName,
                    exportName,
                    status: "failed",
                    renderTargetValue,
                    detail: "Executable preview wrapper rendered, but no executable component mount marker was found.",
                };
            }
            if (renderTargetValue && renderTargetValue !== "preview") {
                return {
                    routePath: currentRoutePath,
                    fileName,
                    exportName,
                    status: "failed",
                    renderTargetValue,
                    detail: `Executable preview mounted with an unexpected Framer adapter target (${renderTargetValue}).`,
                };
            }
            return {
                routePath: currentRoutePath,
                fileName,
                exportName,
                status: "passed",
                renderTargetValue,
                detail: renderTargetValue
                    ? "Executable preview mounted with the preview adapter target."
                    : "Executable preview mounted without exposing an explicit render target marker.",
            };
        });
    }, routePath);
}
async function findAlternateVariantButtonIndex(buttons, currentVariantId) {
    const buttonCount = await buttons.count();
    for (let index = 0; index < buttonCount; index += 1) {
        const candidateId = (await buttons.nth(index).getAttribute("data-framer-variant-button")) ?? "";
        if (candidateId && candidateId !== currentVariantId) {
            return index;
        }
    }
    return -1;
}
async function hasAlternateTransitionTarget(buttons, currentVariantId) {
    const buttonCount = await buttons.count();
    for (let index = 0; index < buttonCount; index += 1) {
        const targetId = (await buttons.nth(index).getAttribute("data-framer-transition-target")) ?? "";
        if (targetId && targetId !== currentVariantId) {
            return true;
        }
    }
    return false;
}
function countSampledScreenshotColors(buffer) {
    const image = PNG.sync.read(buffer);
    const colors = new Set();
    const pixelCount = image.width * image.height;
    const step = Math.max(1, Math.floor(pixelCount / 20_000));
    for (let pixel = 0; pixel < pixelCount; pixel += step) {
        const offset = pixel * 4;
        const alpha = image.data[offset + 3] ?? 0;
        if (alpha === 0)
            continue;
        const red = Math.round((image.data[offset] ?? 0) / 16);
        const green = Math.round((image.data[offset + 1] ?? 0) / 16);
        const blue = Math.round((image.data[offset + 2] ?? 0) / 16);
        colors.add(`${red}:${green}:${blue}`);
        if (colors.size >= 256)
            break;
    }
    return colors.size;
}
function contentType(filePath) {
    if (filePath.endsWith(".html"))
        return "text/html; charset=utf-8";
    if (filePath.endsWith(".js"))
        return "text/javascript; charset=utf-8";
    if (filePath.endsWith(".css"))
        return "text/css; charset=utf-8";
    if (filePath.endsWith(".svg"))
        return "image/svg+xml";
    if (filePath.endsWith(".png"))
        return "image/png";
    if (filePath.endsWith(".jpg") || filePath.endsWith(".jpeg")) {
        return "image/jpeg";
    }
    return "application/octet-stream";
}
function tail(value, maxLength) {
    return value.length <= maxLength ? value : value.slice(-maxLength);
}
async function bundleDebugArtifacts(input) {
    const debugDir = path.join(input.exportDir, "debug");
    const sourceDir = path.join(debugDir, "source");
    const attemptsDir = path.join(debugDir, "attempts");
    await fs.mkdir(debugDir, { recursive: true });
    await fs.mkdir(sourceDir, { recursive: true });
    await fs.mkdir(attemptsDir, { recursive: true });
    const sourceScreenshotPaths = await copyDirectoryIfExists((await pathExists(path.join(input.workDir, "routes")))
        ? path.join(input.workDir, "routes")
        : path.join(input.workDir, "original"), sourceDir);
    const attemptArtifacts = await Promise.all(input.attempts.map(async (attempt) => {
        const sourceAttemptDir = path.join(input.attemptsDir, `attempt-${attempt.attemptNumber}`);
        const targetAttemptDir = path.join(attemptsDir, `attempt-${attempt.attemptNumber}`);
        await fs.mkdir(targetAttemptDir, { recursive: true });
        const compareDiagnostics = await copyFileIfExists(path.join(sourceAttemptDir, "compare-diagnostics.json"), path.join(targetAttemptDir, "compare-diagnostics.json"));
        const previewCaptureError = await copyFileIfExists(path.join(sourceAttemptDir, "generated-preview-capture-error.json"), path.join(targetAttemptDir, "generated-preview-capture-error.json"));
        const generatedScreenshots = (await Promise.all(["desktop", "laptop", "tablet", "mobile"].map((viewport) => copyFileIfExists(path.join(sourceAttemptDir, `generated-${viewport}.png`), path.join(targetAttemptDir, `generated-${viewport}.png`))))).filter(Boolean);
        const summary = {
            attempt: attempt.attemptNumber,
            strategy: attempt.strategy,
            overall: attempt.fidelity.overall,
            fidelity: attempt.fidelity,
            warningCount: attempt.warnings.length,
            previewValidation: attempt.previewValidation,
            diagnosis: attempt.diagnosis,
            diagnosisDetails: attempt.diagnosisDetails,
            patchOperations: attempt.patchOperations,
            patchTargets: attempt.patchTargets,
            patchPropertyHints: attempt.patchPropertyHints,
            stopReason: attempt.stopReason,
            resetToBestStateForNextAttempt: attempt.resetToBestStateForNextAttempt,
            selectedAsBest: attempt.id === input.bestAttempt.id,
        };
        await writeFile(path.join(targetAttemptDir, "summary.json"), `${JSON.stringify(summary, null, 2)}\n`);
        return {
            attempt: attempt.attemptNumber,
            dir: relativeToExport(input.exportDir, targetAttemptDir),
            compareDiagnostics: compareDiagnostics
                ? relativeToExport(input.exportDir, compareDiagnostics)
                : undefined,
            previewCaptureError: previewCaptureError
                ? relativeToExport(input.exportDir, previewCaptureError)
                : undefined,
            generatedScreenshots: generatedScreenshots.map((filePath) => relativeToExport(input.exportDir, filePath)),
            summary: relativeToExport(input.exportDir, path.join(targetAttemptDir, "summary.json")),
        };
    }));
    const manifest = {
        bestAttempt: input.bestAttempt.attemptNumber,
        sourceScreenshots: sourceScreenshotPaths.map((filePath) => relativeToExport(input.exportDir, filePath)),
        attempts: attemptArtifacts,
    };
    const manifestPath = path.join(debugDir, "manifest.json");
    await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
    return {
        manifestPath: relativeToExport(input.exportDir, manifestPath),
        ...manifest,
    };
}
async function copyDirectoryIfExists(sourceDir, targetDir) {
    const entries = await readDirSafe(sourceDir);
    const copied = [];
    for (const entry of entries) {
        const source = path.join(sourceDir, entry.name);
        const target = path.join(targetDir, entry.name);
        if (entry.isDirectory()) {
            await fs.mkdir(target, { recursive: true });
            copied.push(...(await copyDirectoryIfExists(source, target)));
            continue;
        }
        await fs.copyFile(source, target);
        copied.push(target);
    }
    return copied;
}
async function pathExists(targetPath) {
    return Boolean(await fs.stat(targetPath).catch(() => null));
}
async function copyFileIfExists(source, target) {
    try {
        await fs.copyFile(source, target);
        return target;
    }
    catch {
        return undefined;
    }
}
async function readDirSafe(targetPath) {
    try {
        return await fs.readdir(targetPath, { withFileTypes: true });
    }
    catch {
        return [];
    }
}
function relativeToExport(exportDir, targetPath) {
    return path.relative(exportDir, targetPath) || ".";
}
function createRuntimeCaptureFromPluginContext(pluginCapture) {
    const context = pluginCapture?.context;
    const capturedNodes = Array.isArray(pluginCapture?.selectedNodes)
        ? pluginCapture.selectedNodes
        : [];
    const framerTree = Array.isArray(context?.framerTree) ? context.framerTree : [];
    const snapshot = Array.isArray(context?.selectionSnapshot)
        ? context.selectionSnapshot
        : [];
    const selectedComponents = Array.isArray(context?.selectedComponents)
        ? context.selectedComponents
        : [];
    const rawNodes = framerTree.length > 0
        ? createFallbackNodesFromFramerTree(framerTree, capturedNodes)
        : capturedNodes.length > 0
            ? capturedNodes
            : snapshot.length > 0
                ? snapshot
                : selectedComponents.length > 0
                    ? selectedComponents
                    : [];
    const nodes = rawNodes
        .map((entry, index) => toRuntimeNode(entry, index))
        .filter(Boolean);
    const projectName = typeof context?.project?.name === "string"
        ? context.project.name
        : "Framer Project";
    const projectId = typeof context?.project?.id === "string" ? context.project.id : "unknown";
    return {
        url: `framer://project/${projectId}`,
        title: projectName,
        mode: "section",
        viewports: {
            desktop: {
                screenshotPath: "",
                width: 1440,
                height: 900,
            },
            laptop: {
                screenshotPath: "",
                width: 1280,
                height: 900,
            },
            tablet: {
                screenshotPath: "",
                width: 768,
                height: 1024,
            },
            mobile: {
                screenshotPath: "",
                width: 390,
                height: 844,
            },
        },
        nodes,
        nodesByViewport: {
            desktop: nodes,
            laptop: nodes,
            tablet: nodes,
            mobile: nodes,
        },
        captureDiagnostics: {
            breakpointsCaptured: ["desktop", "laptop", "tablet", "mobile"],
            fontReadiness: {
                desktop: false,
                laptop: false,
                tablet: false,
                mobile: false,
            },
            stylesheetCount: {
                desktop: 0,
                laptop: 0,
                tablet: 0,
                mobile: 0,
            },
            nodeCount: {
                desktop: nodes.length,
                laptop: nodes.length,
                tablet: nodes.length,
                mobile: nodes.length,
            },
        },
    };
}
function createFallbackNodesFromFramerTree(tree, selectedNodes) {
    const selectedById = new Map(selectedNodes
        .filter((node) => typeof node.id === "string")
        .map((node) => [node.id, node]));
    const childIdsByParent = new Map();
    const treeById = new Map(tree.map((node) => [node.id, node]));
    for (const node of tree) {
        if (!node.parentId)
            continue;
        childIdsByParent.set(node.parentId, [
            ...(childIdsByParent.get(node.parentId) ?? []),
            node.id,
        ]);
    }
    const ordered = [...tree].sort((first, second) => compareTreePath(first.path, second.path));
    return ordered.map((treeNode) => {
        const selected = selectedById.get(treeNode.id);
        const selectedMeta = selected?.metadata && typeof selected.metadata === "object"
            ? selected.metadata
            : {};
        return {
            id: treeNode.id,
            name: selected?.name ?? treeNode.name,
            type: selected?.type ?? treeNode.type,
            text: selected?.text ?? treeNode.text,
            bounds: selected?.bounds ?? treeNode.rect,
            metadata: {
                ...selectedMeta,
                rootId: selectedMeta.rootId ?? treeNode.rootId,
                rootName: selectedMeta.rootName ?? treeNode.rootName,
                rootKind: selectedMeta.rootKind ?? treeNode.rootKind,
                parentId: selectedMeta.parentId ?? treeNode.parentId,
                childIds: Array.isArray(selectedMeta.childIds) && selectedMeta.childIds.length > 0
                    ? selectedMeta.childIds
                    : childIdsByParent.get(treeNode.id) ?? treeNode.childIds,
                depth: selectedMeta.depth ?? treeNode.depth,
                path: selectedMeta.path ?? treeNode.path,
                styles: {
                    ...treeNode.styles,
                    ...asStyleRecord(selectedMeta.styles),
                },
                traits: {
                    ...treeNode.traits,
                    ...asRecord(selectedMeta.traits),
                },
                component: selectedMeta.component ?? treeNode.component,
                src: selectedMeta.src ?? treeNode.asset?.src,
                alt: selectedMeta.alt ?? treeNode.asset?.alt,
            },
        };
    });
}
function compareTreePath(first, second) {
    const tokenize = (value) => value
        .split(/[^0-9]+/)
        .filter(Boolean)
        .map((part) => Number(part));
    const firstParts = tokenize(first);
    const secondParts = tokenize(second);
    const max = Math.max(firstParts.length, secondParts.length);
    for (let index = 0; index < max; index += 1) {
        const a = firstParts[index] ?? -1;
        const b = secondParts[index] ?? -1;
        if (a !== b)
            return a - b;
    }
    return first.localeCompare(second);
}
function toRuntimeNode(entry, index) {
    const id = typeof entry.id === "string" ? entry.id : `plugin-node-${index + 1}`;
    const text = typeof entry.text === "string" && entry.text.trim().length > 0
        ? entry.text.trim().slice(0, 500)
        : undefined;
    const metadata = entry.metadata && typeof entry.metadata === "object"
        ? entry.metadata
        : {};
    const capturedStyles = asStyleRecord(metadata.styles);
    const capturedMotion = asMotionRecord(metadata.motion);
    const imageSrc = typeof metadata.src === "string" && metadata.src.length > 0
        ? metadata.src
        : undefined;
    const imageAlt = typeof metadata.alt === "string" && metadata.alt.length > 0
        ? metadata.alt
        : undefined;
    const href = typeof metadata.link === "string" && metadata.link.length > 0
        ? metadata.link
        : undefined;
    const position = asPoint(entry.position);
    const size = asSize(entry.size);
    const bounds = asRect(entry.bounds);
    const sourceIndex = typeof metadata.sourceIndex === "number" ? metadata.sourceIndex : index;
    const rootName = typeof metadata.rootName === "string" && metadata.rootName.trim().length > 0
        ? metadata.rootName.trim()
        : undefined;
    const sectionName = rootName ??
        (typeof entry.name === "string" && entry.name.trim().length > 0
            ? entry.name.trim()
            : "Selection");
    const explicitTag = typeof metadata.tag === "string" && metadata.tag.trim().length > 0
        ? metadata.tag.trim().toLowerCase()
        : undefined;
    const path = typeof metadata.path === "string" ? metadata.path : undefined;
    const runtimeTag = imageSrc
        ? "img"
        : explicitTag ?? normalizeTag(typeof entry.type === "string" ? entry.type : "div");
    return {
        id,
        tag: runtimeTag,
        domPath: typeof metadata.domPath === "string" && metadata.domPath.trim().length > 0
            ? metadata.domPath
            : path
                ? buildPluginDomPath(runtimeTag, path)
                : `plugin > ${runtimeTag}:nth-child(${index + 1})`,
        text: imageSrc ? undefined : text,
        sectionIndex: sourceIndex,
        sectionName,
        rect: {
            x: bounds?.x ?? position?.x ?? 0,
            y: bounds?.y ?? position?.y ?? index * 40,
            width: bounds?.width ?? size?.width ?? 320,
            height: bounds?.height ?? size?.height ?? 48,
        },
        attributes: {
            src: imageSrc,
            alt: imageAlt,
            href,
            className: typeof metadata.className === "string" && metadata.className.length > 0
                ? metadata.className
                : undefined,
            dataFramerName: typeof metadata.dataFramerName === "string" &&
                metadata.dataFramerName.length > 0
                ? metadata.dataFramerName
                : undefined,
        },
        styles: {
            ...capturedStyles,
            backgroundColor: capturedStyles.backgroundColor ??
                (typeof metadata.backgroundColor === "string"
                    ? metadata.backgroundColor
                    : undefined),
            opacity: capturedStyles.opacity ??
                (typeof metadata.opacity === "number"
                    ? String(metadata.opacity)
                    : undefined),
            __coderelaySourceIndex: String(index),
            __coderelayRootId: typeof metadata.rootId === "string" ? metadata.rootId : "",
            __coderelayRootKind: typeof metadata.rootKind === "string" ? metadata.rootKind : "",
            __coderelayDepth: typeof metadata.depth === "number" ? String(metadata.depth) : "",
            __coderelayParentId: typeof metadata.parentId === "string" ? metadata.parentId : "",
            __coderelayPath: typeof metadata.path === "string" ? metadata.path : "",
        },
        motion: capturedMotion,
    };
}
function buildPluginDomPath(tag, path) {
    const tokens = path
        .split(".")
        .map((part) => {
        const match = part.match(/(\d+)$/);
        return match ? Number(match[1]) : null;
    })
        .filter((value) => value != null);
    if (tokens.length === 0)
        return `plugin > ${tag}`;
    return `plugin > ${tokens
        .map((token, index) => `${index === tokens.length - 1 ? tag : "div"}:nth-child(${token})`)
        .join(" > ")}`;
}
function asStyleRecord(value) {
    if (!value || typeof value !== "object")
        return {};
    const output = {};
    for (const [key, entry] of Object.entries(value)) {
        if (typeof entry === "string" && entry.trim()) {
            output[key] = entry.trim();
        }
    }
    return output;
}
function asRecord(value) {
    if (!value || typeof value !== "object" || Array.isArray(value)) {
        return undefined;
    }
    return value;
}
function asMotionRecord(value) {
    if (!value || typeof value !== "object")
        return undefined;
    const output = {};
    for (const [key, entry] of Object.entries(value)) {
        if (typeof entry !== "string" || !entry.trim())
            continue;
        switch (key) {
            case "transitionProperty":
            case "transitionDuration":
            case "transitionTimingFunction":
            case "transitionDelay":
            case "animationName":
            case "animationDuration":
            case "animationTimingFunction":
            case "animationDelay":
            case "animationIterationCount":
            case "animationDirection":
            case "animationFillMode":
            case "transformOrigin":
                output[key] = entry.trim();
                break;
            default:
                break;
        }
    }
    return Object.keys(output).length > 0 ? output : undefined;
}
function normalizeTag(type) {
    const lower = type.toLowerCase();
    if (lower.includes("text"))
        return "p";
    if (lower.includes("image"))
        return "img";
    if (lower.includes("button"))
        return "button";
    if (lower.includes("heading"))
        return "h2";
    if (lower.includes("component"))
        return "section";
    return "div";
}
function asPoint(value) {
    if (!value || typeof value !== "object")
        return null;
    const input = value;
    if (typeof input.x !== "number" || typeof input.y !== "number")
        return null;
    return { x: input.x, y: input.y };
}
function asSize(value) {
    if (!value || typeof value !== "object")
        return null;
    const input = value;
    if (typeof input.width !== "number" || typeof input.height !== "number")
        return null;
    return { width: input.width, height: input.height };
}
function asRect(value) {
    if (!value || typeof value !== "object")
        return null;
    const input = value;
    if (typeof input.x !== "number" ||
        typeof input.y !== "number" ||
        typeof input.width !== "number" ||
        typeof input.height !== "number") {
        return null;
    }
    return {
        x: input.x,
        y: input.y,
        width: input.width,
        height: input.height,
    };
}
async function runAttempts(input) {
    const attempts = [];
    const maxAttempts = Math.max(1, input.maxAttempts);
    let workingState = {
        ir: input.ir,
        strategy: baselineStrategy,
    };
    let bestWorkingState = cloneWorkingAttemptState(workingState);
    let bestFidelity;
    for (let index = 0; index < maxAttempts; index += 1) {
        const attemptNumber = index + 1;
        const previousAttempt = attempts.at(-1);
        const plan = buildAttemptPlan({
            previousAttempt: previousAttempt
                ? {
                    strategy: {
                        id: previousAttempt.strategy,
                        structuredLayout: previousAttempt.strategy.includes("structured"),
                        compactSpacing: previousAttempt.strategy.includes("compact") ||
                            previousAttempt.strategy.includes("spacing-typography-correction"),
                        aggressiveMobileStacking: previousAttempt.strategy.includes("mobile-repair"),
                        preserveImageAspectRatio: !previousAttempt.strategy.includes("fluid-images"),
                    },
                    fidelity: previousAttempt.fidelity,
                    warnings: previousAttempt.warnings,
                    comparisonDiagnostics: previousAttempt.comparisonDiagnostics,
                    previewValidation: previousAttempt.previewValidation,
                }
                : undefined,
            attemptNumber,
        });
        workingState = applyAttemptPlan(workingState, plan);
        const attemptDir = path.join(input.attemptsDir, `attempt-${attemptNumber}`);
        const projectDir = path.join(attemptDir, "project");
        await fs.mkdir(projectDir, { recursive: true });
        const generated = await generateNextProject({
            ir: workingState.ir,
            projectDir,
            strategy: workingState.strategy,
            codeCompatibilityReport: input.codeCompatibilityReport,
            unadaptedCodeFiles: input.unadaptedCodeFiles,
        });
        const comparison = await compareGeneratedPreview({
            ir: workingState.ir,
            previewHtmlPath: generated.previewHtmlPath,
            attemptDir,
        });
        const fidelity = comparison.fidelity;
        const warnings = warningsForAttempt(workingState.ir, fidelity, comparison.diagnostics, comparison.previewValidation, comparison.evidence);
        const rerunReason = getRerunReason(fidelity, input.targetFidelity, warnings);
        const plateau = detectAttemptPlateau([...attempts.map((attempt) => attempt.fidelity.overall), fidelity.overall]);
        const stopReason = plateau
            ? "Fidelity improvements plateaued across the last three attempts."
            : !rerunReason
                ? "Target fidelity reached or no rerun required."
                : undefined;
        const improvedBest = !bestFidelity || fidelity.overall >= bestFidelity.overall;
        if (improvedBest) {
            bestFidelity = fidelity;
            bestWorkingState = cloneWorkingAttemptState(workingState);
        }
        const resetToBestStateForNextAttempt = !improvedBest &&
            shouldResetToBestAttempt({
                current: fidelity,
                best: bestFidelity,
                targetFidelity: input.targetFidelity,
            });
        attempts.push({
            id: `attempt-${attemptNumber}`,
            attemptNumber,
            strategy: workingState.strategy.id,
            projectDir,
            fidelity,
            warnings,
            rerunReason: plateau ? undefined : rerunReason,
            diagnosis: plan.diagnosis,
            patchesApplied: plan.patchesApplied,
            diagnosisDetails: plan.diagnosisDetails,
            patchOperations: plan.patchOperations,
            patchTargets: plan.patchTargets,
            patchPropertyHints: plan.patchPropertyHints,
            comparisonDiagnostics: comparison.diagnostics,
            previewValidation: comparison.previewValidation,
            fidelityEvidence: comparison.evidence,
            stopReason,
            resetToBestStateForNextAttempt,
        });
        if (!rerunReason || plateau) {
            break;
        }
        if (resetToBestStateForNextAttempt) {
            workingState = cloneWorkingAttemptState(bestWorkingState);
        }
    }
    return attempts;
}
function selectBestAttempt(attempts) {
    const best = [...attempts].sort((first, second) => second.fidelity.overall - first.fidelity.overall)[0];
    if (!best) {
        throw new Error("No export attempts were generated.");
    }
    return best;
}
export function shouldResetToBestAttempt(input) {
    const target = input.targetFidelity <= 1 ? input.targetFidelity * 100 : input.targetFidelity;
    const current = input.current;
    const best = input.best;
    if (current.overall >= best.overall)
        return false;
    const overallDrop = best.overall - current.overall;
    if (overallDrop >= 1) {
        return true;
    }
    const weakCategoryRegression = collectComparableFidelityMetrics(best)
        .filter((entry) => entry.best < target)
        .some((entry) => {
        const currentValue = readComparableFidelityMetric(current, entry.key);
        return typeof currentValue === "number" && entry.best - currentValue >= 2;
    });
    return weakCategoryRegression;
}
function warningsForAttempt(ir, fidelity, comparisonDiagnostics, previewValidation, fidelityEvidence) {
    const warnings = [...ir.warnings];
    if (fidelity.overall < 90) {
        warnings.push({
            type: "low_fidelity_score",
            severity: "warning",
            message: `Overall fidelity is ${fidelity.overall}%, below the 90% alpha target.`,
        });
    }
    const tabletLag = typeof fidelity.tablet === "number" ? fidelity.tablet < fidelity.desktop - 6 : false;
    if (fidelity.mobile < fidelity.desktop - 8 || tabletLag) {
        warnings.push({
            type: "responsive_mismatch",
            severity: "warning",
            message: "Responsive fidelity is meaningfully lower than desktop fidelity on one or more smaller breakpoints.",
        });
    }
    if (fidelity.motion < 60) {
        warnings.push({
            type: "unsupported_animation",
            severity: "info",
            message: "Motion fidelity is limited for this export. Review Framer animations manually.",
        });
    }
    if ((comparisonDiagnostics?.summary.missingNodes ?? 0) > 0) {
        warnings.push({
            type: "generated_node_missing",
            severity: "warning",
            message: `${comparisonDiagnostics.summary.missingNodes} generated nodes could not be found during computed-style comparison.`,
        });
    }
    if (comparisonDiagnostics && (comparisonDiagnostics.summary.nodesCompared ?? 0) > 0) {
        const previewMissingAllNodes = comparisonDiagnostics.summary.missingNodes >=
            comparisonDiagnostics.summary.nodesCompared;
        if (previewMissingAllNodes) {
            warnings.push({
                type: "generated_node_missing",
                severity: "warning",
                message: "Generated preview validation could not find any exported nodes during computed-style inspection.",
            });
        }
    }
    if (fidelityEvidence?.mode === "heuristic") {
        warnings.push({
            type: "heuristic_fidelity",
            severity: "info",
            message: `Fidelity is heuristic-only: ${fidelityEvidence.reason}`,
        });
    }
    if (previewValidation?.status === "blocked") {
        warnings.push({
            type: "preview_validation_blocked",
            severity: "info",
            message: "Rendered preview validation could not run in this environment. Review preview validation evidence manually.",
        });
    }
    if (previewValidation?.status === "validated" &&
        previewValidation.summary.inspectedNodes > 0) {
        if (previewValidation.summary.foundNodes === 0) {
            warnings.push({
                type: "preview_validation_missing_nodes",
                severity: "warning",
                message: "Rendered preview validation did not find any exported nodes in the generated preview DOM.",
            });
        }
        if (previewValidation.summary.nodesWithNonDefaultStyles === 0) {
            warnings.push({
                type: "preview_validation_unstyled",
                severity: "warning",
                message: "Rendered preview validation found exported nodes, but none resolved to non-default visual styles.",
            });
        }
    }
    const weakSections = ir.component.sections.filter((section) => (section.confidence ?? 0) < 0.5);
    if (weakSections.length > 0) {
        warnings.push({
            type: "section_extraction_low_confidence",
            severity: "warning",
            message: `${weakSections.length} sections were extracted with low confidence and may be visually inaccurate.`,
        });
    }
    return warnings;
}
function getRerunReason(fidelity, targetFidelity, warnings) {
    const target = targetFidelity <= 1 ? targetFidelity * 100 : targetFidelity;
    if (fidelity.overall >= target &&
        !warnings.some((warning) => warning.type === "responsive_mismatch")) {
        return undefined;
    }
    const categories = [
        fidelity.typography < target ? "typography" : undefined,
        fidelity.layout < target ? "layout" : undefined,
        fidelity.mobile < target ? "mobile spacing" : undefined,
        typeof fidelity.tablet === "number" && fidelity.tablet < target
            ? "tablet layout"
            : undefined,
        fidelity.assets < target ? "assets" : undefined,
        fidelity.nodeMatch < 70 ? "section mapping" : undefined,
    ].filter(Boolean);
    return `${categories.join(", ") || "visual"} mismatches were above threshold.`;
}
function createReport(ir, attempts, bestAttempt, debugArtifacts, validation, revisionId, revisionCacheHit, revisionRequest, sourceArtifacts, responsiveRecapturePlan, captureProgress, codeCompatibilityReport = analyzeCodeFilesCompatibility(ir.codeFiles ?? []), unadaptedCodeFiles = createUnadaptedCodeFileArtifacts(ir, codeCompatibilityReport)) {
    const styleStats = summarizeStyleExtraction(ir);
    const sourceEvidence = createSourceEvidenceSummary(ir, sourceArtifacts);
    const runtimeInteractionReplay = summarizeRuntimeInteractionReplay(ir.runtimeCapture);
    const unsupportedBehavior = collectUnsupportedBehavior({
        codeCompatibilityReport,
        warnings: bestAttempt.warnings,
    });
    return {
        revisionId,
        revisionCacheHit,
        revisionRequest: revisionRequest ?? null,
        sourceEvidence,
        captureDiagnostics: ir.pluginCapture.context?.captureDiagnostics ?? null,
        fidelityEvidence: bestAttempt.fidelityEvidence ?? null,
        runtimeInteractionReplay,
        unsupportedBehavior,
        sourceArtifacts: sourceArtifacts ?? null,
        responsiveRecapturePlan: responsiveRecapturePlan ?? null,
        captureProgress: captureProgress ?? null,
        jobId: ir.jobId,
        exportType: ir.exportMode === "full-site"
            ? "full-site"
            : ir.libraryComponents
                ? "component-library"
                : "component",
        exportStrategy: ir.exportMode === "full-site"
            ? "runtime-kept-full-site"
            : "reconstructed-react",
        runtimeKept: ir.exportMode === "full-site",
        intendedEditor: ir.exportMode === "full-site" ? "agent-first" : "human-or-agent",
        handoffArtifacts: {
            readme: "README.md",
            agentBrief: "AGENT_BRIEF.md",
            routeManifest: "route-manifest.json",
            routeTemplateManifest: "route-template-manifest.json",
            assetManifest: "asset-manifest.json",
            runtimeLocalizationReport: "runtime-localization-report.json",
            runtimeStrategyManifest: "runtime-strategy-manifest.json",
            agentHandoffManifest: "agent-handoff-manifest.json",
            cmsManifest: "framer-cms-collections.json",
            codeFilesManifest: "framer-code-files.json",
            fontsManifest: "framer-fonts.json",
            rawRuntimeCapture: "raw-runtime-capture.json",
        },
        sourceUrl: ir.sourceUrl,
        captureMode: ir.captureMode ?? "plugin-only",
        exportEngine: ir.exportEngine ?? "plugin-approximation",
        componentName: ir.componentName,
        componentFileCount: ir.libraryComponents?.length ?? 1,
        pageFileCount: ir.sitePages?.length ?? 0,
        componentModuleCount: ir.componentModules?.length ?? 0,
        codeFileCount: ir.codeFiles?.length ?? 0,
        codeCompatibility: codeCompatibilityReport,
        componentFamilyCount: ir.componentFamilies?.length ?? 0,
        routeTemplateCount: ir.routeTemplates?.length ?? 0,
        fontCount: ir.fonts?.length ?? 0,
        cmsCollectionCount: ir.cmsCollections?.length ?? 0,
        framerTreeNodeCount: ir.framerTree?.length ?? 0,
        exportTreeNodeCount: ir.exportTreeDiagnostics?.totalNodes ?? 0,
        componentModules: (ir.componentModules ?? []).map((module) => ({
            name: module.name,
            source: module.source,
            insertURL: module.insertURL,
            componentIdentifier: module.componentIdentifier,
            codeFileName: module.codeFileName,
        })),
        componentFamilies: (ir.componentFamilies ?? []).map((family) => ({
            id: family.id,
            name: family.name,
            primaryVariantId: family.primaryVariantId,
            variantCount: family.variants.length,
            instanceCount: family.instances.length,
            transitionCount: family.transitions.length,
            provenance: family.provenance,
        })),
        overrideAssignments: (ir.overrideAssignments ?? []).map((assignment) => ({
            id: assignment.id,
            exportName: assignment.exportName,
            codeFileId: assignment.codeFileId,
            codeFileName: assignment.codeFileName,
            targetNodeId: assignment.targetNodeId ?? null,
            targetComponentId: assignment.targetComponentId ?? null,
            assignmentStatus: assignment.assignmentStatus,
            assignmentConfidence: assignment.assignmentConfidence,
            unresolvedReason: assignment.unresolvedReason ?? null,
        })),
        codeFiles: (ir.codeFiles ?? []).map((file) => ({
            id: file.id,
            name: file.name,
            path: file.path,
            exports: file.exports,
            exportDetails: file.exportDetails,
            insertURL: file.insertURL,
            source: file.source,
            hasContent: file.hasContent,
            contentHash: file.contentHash,
            contentByteLength: file.contentByteLength,
            compatibility: codeCompatibilityReport.files.find((entry) => entry.codeFileId === file.id ||
                entry.path === file.path ||
                entry.name === file.name)?.compatibility ?? null,
            compatibilityReasons: codeCompatibilityReport.files.find((entry) => entry.codeFileId === file.id ||
                entry.path === file.path ||
                entry.name === file.name)?.reasons ?? [],
            unadaptedComponentPath: unadaptedCodeFiles.find((entry) => entry.codeFileId === file.id ||
                entry.name === file.name)?.sourcePath ?? null,
            unadaptedMetadataPath: unadaptedCodeFiles.find((entry) => entry.codeFileId === file.id ||
                entry.name === file.name)?.metadataPath ?? null,
            artifact: sourceArtifacts?.codeFiles.find((entry) => entry.contentHash && file.contentHash
                ? entry.contentHash === file.contentHash
                : entry.name === file.name && entry.path === file.path) ?? null,
        })),
        fonts: (ir.fonts ?? []).map((font) => ({
            id: font.id,
            name: font.name,
            family: font.family,
            source: font.source,
            weight: font.weight,
            style: font.style,
        })),
        cmsCollections: (ir.cmsCollections ?? []).map((collection) => ({
            id: collection.id,
            name: collection.name,
            managed: collection.managed ?? false,
            fieldCount: collection.fields.length,
            itemCount: collection.items?.length ?? 0,
            itemIds: collection.itemIds ?? [],
            pluginData: collection.pluginData ?? {},
            pluginDataKeys: collection.pluginDataKeys ?? [],
            fields: collection.fields.map((field) => ({
                id: field.id,
                name: field.name,
                type: field.type,
                userEditable: field.userEditable ?? false,
                collectionId: field.collectionId,
            })),
        })),
        createdAt: new Date().toISOString(),
        generatedValidation: validation,
        bestAttempt: bestAttempt.attemptNumber,
        visualFidelity: bestAttempt.fidelity,
        attempts: attempts.map((attempt) => ({
            attempt: attempt.attemptNumber,
            strategy: attempt.strategy,
            overall: attempt.fidelity.overall,
            desktop: attempt.fidelity.desktop,
            laptop: attempt.fidelity.laptop,
            tablet: attempt.fidelity.tablet,
            mobile: attempt.fidelity.mobile,
            rerunReason: attempt.rerunReason,
            selectedAsBest: attempt.id === bestAttempt.id,
            warningCount: attempt.warnings.length,
            fidelityEvidence: attempt.fidelityEvidence ?? null,
            previewValidation: attempt.previewValidation,
            diagnosis: attempt.diagnosis,
            diagnosisDetails: attempt.diagnosisDetails,
            patchesApplied: attempt.patchesApplied,
            patchOperations: attempt.patchOperations,
            patchTargets: attempt.patchTargets,
            patchPropertyHints: attempt.patchPropertyHints,
            comparisonDiagnostics: attempt.comparisonDiagnostics,
            stopReason: attempt.stopReason,
            resetToBestStateForNextAttempt: attempt.resetToBestStateForNextAttempt,
        })),
        nodeMatching: {
            matched: ir.nodeMatches.filter((match) => match.confidence >= 0.45)
                .length,
            unmatched: ir.nodeMatches.filter((match) => match.confidence < 0.45)
                .length,
            averageConfidence: average(ir.nodeMatches.map((match) => match.confidence)),
        },
        styleExtraction: styleStats,
        motionExtraction: summarizeMotionExtraction(ir),
        exportTree: ir.exportTreeDiagnostics,
        routeTemplates: ir.routeTemplates ?? [],
        runtimeCapture: {
            breakpointsCaptured: ir.runtimeCapture.captureDiagnostics?.breakpointsCaptured ?? [],
            viewportValidation: ir.runtimeCapture.captureDiagnostics?.viewportValidation,
            captureProvenance: revisionRequest?.kind === "improvement" ? "mixed" : "fresh",
            stylesheetCount: ir.runtimeCapture.captureDiagnostics?.stylesheetCount,
            nodeCount: ir.runtimeCapture.captureDiagnostics?.nodeCount,
            fontsReady: ir.runtimeCapture.captureDiagnostics?.fontReadiness,
            routeProgress: ir.runtimeCapture.captureDiagnostics?.routeProgress ?? [],
            routes: (ir.runtimeCapture.routeCaptures ?? []).map((capture) => ({
                path: capture.routePath,
                url: capture.url,
                title: capture.title,
                nodeCount: capture.captureDiagnostics?.nodeCount,
                stylesheetCount: capture.captureDiagnostics?.stylesheetCount,
                fontsReady: capture.captureDiagnostics?.fontReadiness,
                viewportValidation: capture.captureDiagnostics?.viewportValidation,
                captureProvenance: revisionRequest?.kind === "improvement" ? "mixed" : "fresh",
                phaseHistory: capture.captureDiagnostics?.phaseHistory ?? [],
                routeProgress: capture.captureDiagnostics?.routeProgress?.[0] ?? null,
                evidenceClasses: capture.captureDiagnostics?.routeProgress?.[0]?.evidenceClasses ?? [],
                warningCount: capture.captureDiagnostics?.routeProgress?.[0]?.warningCount ?? 0,
            })),
        },
        previewValidation: bestAttempt.previewValidation,
        debugArtifacts,
        sections: ir.component.sections.map((section) => ({
            index: section.index,
            name: section.name,
            kind: section.kind ?? "content",
            nodeCount: section.nodes.length,
            confidence: section.confidence ?? 0,
            flaggedLowConfidence: (section.confidence ?? 0) < 0.5,
        })),
        assets: {
            downloaded: validation.runtimeLocalization?.downloaded ?? 0,
            linked: ir.assets.length,
            failed: validation.runtimeLocalization?.failed ?? 0,
        },
        patchHistoryPath: "patch-history.json",
        warnings: bestAttempt.warnings,
    };
}
function createCanonicalExportContentContract(ir, sourceArtifacts) {
    return createCanonicalContentBundle({
        sourceUrl: ir.sourceUrl,
        routePath: ir.sitePages?.[0]?.routePath,
        title: ir.componentName,
        description: ir.exportMode === "full-site"
            ? `Canonical content contract for a full-site export with ${ir.sitePages?.length ?? 0} routes.`
            : `Canonical content contract for a component export with ${ir.componentModules?.length ?? 0} generated component modules.`,
        content: {
            sourceUrl: ir.sourceUrl,
            exportMode: ir.exportMode ?? null,
            exportEngine: ir.exportEngine ?? null,
            componentName: ir.componentName,
            routeCount: ir.sitePages?.length ?? 0,
            componentModuleCount: ir.componentModules?.length ?? 0,
            codeFileCount: ir.codeFiles?.length ?? 0,
            cmsCollectionCount: ir.cmsCollections?.length ?? 0,
            routePaths: (ir.sitePages ?? []).map((page) => page.routePath),
            templateKinds: [
                ...new Set((ir.sitePages ?? []).map((page) => page.templateKind ?? "static")),
            ],
            sourceFileCount: sourceArtifacts?.codeFiles.length ?? 0,
        },
        routes: (ir.sitePages ?? []).map((page) => ({
            routePath: page.routePath,
            title: page.title,
            templateKind: page.templateKind ?? "static",
            templateId: page.templateId,
            templatePath: page.templatePath,
            routeKind: page.routeKind,
            destination: page.destination ?? null,
            destinationKind: page.destinationKind ?? null,
            redirectTo: page.redirectTo ?? null,
            redirectStatus: page.redirectStatus ?? null,
            sourceTextLength: page.sourceTextLength ?? 0,
        })),
        componentModules: ir.componentModules ?? [],
        safeEditAreas: canonicalEditAreas({
            hasContentModule: (ir.sitePages?.length ?? 0) > 0 || (ir.cmsCollections?.length ?? 0) > 0,
            hasSections: (ir.sitePages?.length ?? 0) > 1,
            hasComponents: (ir.componentModules?.length ?? 0) > 0,
            hasDocs: true,
            hasStyles: true,
        }),
        generatedFiles: [
            "content-contract.json",
            "revision-manifest.json",
            "export-report.json",
            "source-artifacts/manifest.json",
            "invalidation-plan.json",
            "artifact-index.json",
        ],
        runtimeUtilities: [],
    });
}
async function writeCanonicalBundleFromContentContract(exportDir, contentContract) {
    await writeCanonicalSiteBundle(migrateV1ContentContractToV2(contentContract), path.join(exportDir, ".coderelay"));
}
function summarizeRuntimeInteractionReplay(runtimeCapture) {
    const records = [
        ...(runtimeCapture.interactionReplay ?? []),
        ...((runtimeCapture.routeCaptures ?? []).flatMap((capture) => capture.interactionReplay ?? []) ?? []),
    ];
    const stateChanges = records.filter((record) => record.stateChanged).length;
    const blocked = records.filter((record) => !record.allowed).length;
    return {
        recordCount: records.length,
        stateChangeCount: stateChanges,
        blockedCount: blocked,
        routesCovered: Array.from(new Set(records
            .map((record) => record.routePath)
            .filter((routePath) => Boolean(routePath)))),
        actionCounts: records.reduce((accumulator, record) => {
            accumulator[record.action] = (accumulator[record.action] ?? 0) + 1;
            return accumulator;
        }, {}),
    };
}
function createPatchHistory(attempts) {
    return attempts.map((attempt) => ({
        attempt: attempt.attemptNumber,
        strategy: attempt.strategy,
        patchesApplied: attempt.patchesApplied ?? [],
        patchOperations: attempt.patchOperations ?? [],
        patchTargets: attempt.patchTargets,
        patchPropertyHints: attempt.patchPropertyHints,
        diagnosis: attempt.diagnosis ?? [],
        diagnosisDetails: attempt.diagnosisDetails ?? [],
        stopReason: attempt.stopReason,
        rerunReason: attempt.rerunReason,
        resetToBestStateForNextAttempt: attempt.resetToBestStateForNextAttempt ?? false,
    }));
}
function createBeforeAfterReport(currentReport, parentReport, input) {
    return {
        schemaVersion: 1,
        generatedAt: new Date().toISOString(),
        revisionId: input.revisionId,
        parentRevisionId: input.parentRevisionId ?? null,
        metrics: [
            createBeforeAfterMetric("Overall fidelity", readMetricNumber(currentReport.visualFidelity, "overall"), readMetricNumber(parentReport.visualFidelity, "overall")),
            createBeforeAfterMetric("Rendered routes", readMetricNumber(currentReport.generatedValidation, "routes.length"), readMetricNumber(parentReport.generatedValidation, "routes.length"), true),
            createBeforeAfterMetric("Rendered elements", readMetricNumber(currentReport.generatedValidation, "renderedElementCount"), readMetricNumber(parentReport.generatedValidation, "renderedElementCount"), true),
            createBeforeAfterMetric("Route templates", readMetricNumber(currentReport, "routeTemplateCount"), readMetricNumber(parentReport, "routeTemplateCount"), true),
            createBeforeAfterMetric("Component families", readMetricNumber(currentReport, "componentFamilyCount"), readMetricNumber(parentReport, "componentFamilyCount"), true),
        ].filter((entry) => entry !== null),
    };
}
function createBeforeAfterMetric(label, currentValue, parentValue, integer = false) {
    if (currentValue === undefined && parentValue === undefined) {
        return null;
    }
    const current = currentValue ?? 0;
    const parent = parentValue ?? 0;
    const deltaValue = current - parent;
    const formatter = integer ? formatWholeMetric : formatRoundedMetric;
    return {
        label,
        current: formatter(current),
        parent: formatter(parent),
        delta: deltaValue === 0
            ? "0"
            : `${deltaValue > 0 ? "+" : ""}${formatter(deltaValue)}`,
    };
}
function readMetricNumber(value, metricPath) {
    const parts = metricPath.split(".");
    let current = value;
    for (const part of parts) {
        if (part === "length") {
            if (Array.isArray(current)) {
                current = current.length;
                continue;
            }
            return undefined;
        }
        if (!current || typeof current !== "object") {
            return undefined;
        }
        current = current[part];
    }
    return typeof current === "number" && Number.isFinite(current)
        ? current
        : undefined;
}
function formatWholeMetric(value) {
    return `${Math.round(value)}`;
}
function formatRoundedMetric(value) {
    return `${Math.round(value)}`;
}
function createParentInfo(revisionRequest) {
    if (revisionRequest?.kind !== "improvement")
        return null;
    return {
        kind: revisionRequest.kind,
        parentJobId: revisionRequest.parentJobId ?? null,
        parentRevisionId: revisionRequest.parentRevisionId ?? null,
        requestedFocus: revisionRequest.requestedFocus ?? null,
        createdAt: new Date().toISOString(),
    };
}
async function updateRevisionStatusFile(input) {
    const statusPath = path.join(input.exportDir, "status.json");
    const now = new Date().toISOString();
    const existing = (await readJsonFile(statusPath)) ?? null;
    const createdAt = existing?.createdAt ?? now;
    const history = Array.isArray(existing?.history) ? existing.history : [];
    history.push({
        stage: input.stage,
        at: now,
        progress: input.progress,
        detail: input.detail,
    });
    const nextStatus = {
        schemaVersion: 1,
        revisionId: input.revisionId ?? existing?.revisionId,
        stage: input.stage,
        updatedAt: now,
        createdAt,
        progress: input.progress,
        history,
    };
    await writeJsonFile(statusPath, nextStatus);
}
function createRevisionManifest(ir, attempts, bestAttempt, revisionId, input) {
    const summary = {
        sourceUrl: ir.sourceUrl,
        exportMode: ir.exportMode,
        captureMode: ir.captureMode,
        exportEngine: ir.exportEngine,
        componentName: ir.componentName,
        routeTemplates: (ir.routeTemplates ?? []).map((template) => ({
            templateId: template.templateId,
            templatePath: template.templatePath,
            templateKind: template.templateKind,
            representativeRoutePath: template.representativeRoutePath,
            routeCount: template.routeCount,
            nodeCount: template.nodeCount,
        })),
        sitePages: (ir.sitePages ?? []).map((page) => ({
            routePath: page.routePath,
            templateId: page.templateId,
            templatePath: page.templatePath,
            routeKind: page.routeKind,
            template: page.template,
            templateKind: page.templateKind,
            destination: page.destination ?? page.redirectTo,
            destinationKind: page.destinationKind,
            sourceTextLength: page.sourceTextLength ?? 0,
        })),
        componentModuleCount: ir.componentModules?.length ?? 0,
        codeFileCount: ir.codeFiles?.length ?? 0,
        cmsCollectionCount: ir.cmsCollections?.length ?? 0,
        fontCount: ir.fonts?.length ?? 0,
        bestAttempt: {
            attempt: bestAttempt.attemptNumber,
            strategy: bestAttempt.strategy,
            overall: bestAttempt.fidelity.overall,
            layout: bestAttempt.fidelity.layout,
            typography: bestAttempt.fidelity.typography,
            color: bestAttempt.fidelity.color,
            assets: bestAttempt.fidelity.assets,
            motion: bestAttempt.fidelity.motion,
            nodeMatch: bestAttempt.fidelity.nodeMatch,
            desktop: bestAttempt.fidelity.desktop,
            laptop: bestAttempt.fidelity.laptop,
            tablet: bestAttempt.fidelity.tablet,
            mobile: bestAttempt.fidelity.mobile,
            fidelityEvidence: bestAttempt.fidelityEvidence ?? null,
        },
        attempts: attempts.map((attempt) => ({
            attempt: attempt.attemptNumber,
            strategy: attempt.strategy,
            overall: attempt.fidelity.overall,
            fidelityEvidence: attempt.fidelityEvidence ?? null,
            warningCount: attempt.warnings.length,
            stopReason: attempt.stopReason,
        })),
    };
    return {
        revisionId,
        schemaVersion: REVISION_MANIFEST_SCHEMA_VERSION,
        sourceFingerprint: input.sourceFingerprint,
        pluginFingerprint: input.pluginFingerprint,
        status: input.status ?? "completed",
        parentRevisionId: input.revisionRequest?.parentRevisionId ?? null,
        revisionRequest: input.revisionRequest ?? null,
        summary,
        sourceEvidence: input.sourceEvidence ?? null,
        sourceArtifacts: input.sourceArtifacts ?? null,
        responsiveRecapturePlan: input.responsiveRecapturePlan ?? null,
        generatedValidation: input.validation ?? null,
        reusedArtifactIds: input.reusedArtifactIds,
        invalidatedArtifacts: input.invalidatedArtifacts,
        parentInfoPath: input.parentInfoPath ?? null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };
}
function createInvalidationPlan(input) {
    const revisionRequest = input.revisionRequest;
    const sourceArtifacts = input.sourceArtifacts ?? null;
    const parentSourceArtifacts = input.parentSourceArtifacts ?? null;
    const sourceDiff = createSourceArtifactDiff(sourceArtifacts, parentSourceArtifacts);
    const codeFileArtifactIds = unique((sourceArtifacts?.codeFiles ?? []).flatMap((entry) => allCodeFileArtifactIds(entry)));
    const readableCodeFileArtifactIds = (sourceArtifacts?.codeFiles ?? [])
        .filter((entry) => entry.hasContent)
        .map((entry) => primaryCodeFileArtifactId(entry));
    const missingCodeFileArtifactIds = (sourceArtifacts?.codeFiles ?? [])
        .filter((entry) => !entry.hasContent)
        .map((entry) => primaryCodeFileArtifactId(entry));
    const componentFamiliesArtifactId = sourceArtifacts?.componentFamiliesArtifactId ?? "source/component-families";
    const overrideAssignmentsArtifactId = sourceArtifacts?.overrideAssignmentsArtifactId ??
        "source/override-assignments";
    if (!revisionRequest || revisionRequest.kind !== "improvement") {
        return {
            kind: "initial",
            requestedFocus: null,
            parentRevisionId: null,
            sourceDiff,
            reused: [],
            invalidated: [
                {
                    artifact: "generated/project",
                    reason: "initial-export",
                    dependsOn: [
                        "plugin/raw-payload",
                        "runtime/raw-capture",
                        "ir/normalized",
                    ],
                },
            ],
        };
    }
    if (revisionRequest.requestedFocus === "revalidate") {
        return {
            kind: "improvement",
            requestedFocus: "revalidate",
            parentRevisionId: revisionRequest.parentRevisionId ?? null,
            sourceDiff,
            reused: [
                "generated/project",
                "debug/*",
                "manifest/revision",
                "manifest/source-artifacts",
            ],
            invalidated: [
                {
                    artifact: "validation/generated",
                    reason: "revalidate-only",
                    dependsOn: ["generated/project"],
                },
                {
                    artifact: "report/export",
                    reason: "validation-refreshed",
                    dependsOn: ["validation/generated", "manifest/revision"],
                },
            ],
        };
    }
    if (revisionRequest.requestedFocus === "components") {
        return {
            kind: "improvement",
            requestedFocus: "components",
            parentRevisionId: revisionRequest.parentRevisionId ?? null,
            sourceDiff,
            reused: [
                "runtime/raw-capture",
                "cms/*",
                "assets/*",
                ...(input.routeTemplateCount ? ["routes/templates"] : []),
                ...sourceDiff.unchangedCodeFileArtifactIds,
                ...(sourceArtifacts?.overrideAssignmentsArtifactId
                    ? [overrideAssignmentsArtifactId]
                    : []),
            ],
            invalidated: [
                ...(input.codeFileCount && missingCodeFileArtifactIds.length > 0
                    ? [
                        {
                            artifact: "source/code-files",
                            reason: "code-file-content-not-captured",
                            dependsOn: missingCodeFileArtifactIds,
                        },
                    ]
                    : []),
                {
                    artifact: componentFamiliesArtifactId,
                    reason: "component-source-refresh",
                    dependsOn: sourceDiff.changedCodeFileArtifactIds.length > 0
                        ? sourceDiff.changedCodeFileArtifactIds
                        : readableCodeFileArtifactIds.length > 0
                            ? readableCodeFileArtifactIds
                            : ["plugin/raw-payload"],
                },
                ...(sourceArtifacts?.overrideAssignmentsArtifactId &&
                    sourceDiff.overrideAssignmentsChanged
                    ? [
                        {
                            artifact: overrideAssignmentsArtifactId,
                            reason: "override-assignment-refresh",
                            dependsOn: ["plugin/raw-payload"],
                        },
                    ]
                    : []),
                {
                    artifact: "ir/normalized",
                    reason: "depends-on-component-model",
                    dependsOn: [
                        componentFamiliesArtifactId,
                        ...(sourceArtifacts?.overrideAssignmentsArtifactId
                            ? [overrideAssignmentsArtifactId]
                            : []),
                        ...codeFileArtifactIds,
                    ],
                },
                {
                    artifact: "generated/project",
                    reason: "depends-on-component-model",
                    dependsOn: ["ir/normalized"],
                },
                {
                    artifact: "report/export",
                    reason: "depends-on-generated-project",
                    dependsOn: ["generated/project", "validation/generated"],
                },
            ],
        };
    }
    if (revisionRequest.requestedFocus === "responsiveness") {
        return {
            kind: "improvement",
            requestedFocus: "responsiveness",
            parentRevisionId: revisionRequest.parentRevisionId ?? null,
            sourceDiff,
            reused: [
                "plugin/raw-payload",
                "source/code-files",
                componentFamiliesArtifactId,
                ...(sourceArtifacts?.overrideAssignmentsArtifactId
                    ? [overrideAssignmentsArtifactId]
                    : []),
                "cms/*",
                "assets/*",
            ],
            invalidated: [
                {
                    artifact: "runtime/responsive",
                    reason: "responsive-improvement",
                    dependsOn: ["runtime/raw-capture"],
                },
                {
                    artifact: "generated/project",
                    reason: "depends-on-responsive-model",
                    dependsOn: ["runtime/responsive", "ir/normalized"],
                },
                {
                    artifact: "report/export",
                    reason: "depends-on-generated-project",
                    dependsOn: ["generated/project", "validation/generated"],
                },
            ],
        };
    }
    return {
        kind: "improvement",
        requestedFocus: revisionRequest.requestedFocus ?? "both",
        parentRevisionId: revisionRequest.parentRevisionId ?? null,
        sourceDiff,
        reused: [
            "cms/*",
            "assets/*",
            ...sourceDiff.unchangedCodeFileArtifactIds,
            ...(sourceArtifacts?.overrideAssignmentsArtifactId
                ? [overrideAssignmentsArtifactId]
                : []),
        ],
        invalidated: [
            {
                artifact: "runtime/responsive",
                reason: "responsive-improvement",
                dependsOn: ["runtime/raw-capture"],
            },
            {
                artifact: componentFamiliesArtifactId,
                reason: "component-source-refresh",
                dependsOn: sourceDiff.changedCodeFileArtifactIds.length > 0
                    ? sourceDiff.changedCodeFileArtifactIds
                    : readableCodeFileArtifactIds.length > 0
                        ? readableCodeFileArtifactIds
                        : ["plugin/raw-payload"],
            },
            ...(sourceArtifacts?.overrideAssignmentsArtifactId &&
                sourceDiff.overrideAssignmentsChanged
                ? [
                    {
                        artifact: overrideAssignmentsArtifactId,
                        reason: "override-assignment-refresh",
                        dependsOn: ["plugin/raw-payload"],
                    },
                ]
                : []),
            {
                artifact: "ir/normalized",
                reason: "depends-on-updated-models",
                dependsOn: [
                    "runtime/responsive",
                    componentFamiliesArtifactId,
                    ...(sourceArtifacts?.overrideAssignmentsArtifactId
                        ? [overrideAssignmentsArtifactId]
                        : []),
                    ...codeFileArtifactIds,
                ],
            },
            {
                artifact: "generated/project",
                reason: "depends-on-updated-models",
                dependsOn: ["ir/normalized"],
            },
            {
                artifact: "report/export",
                reason: "depends-on-generated-project",
                dependsOn: ["generated/project", "validation/generated"],
            },
        ],
    };
}
export function buildImprovementInvalidationPreview(input) {
    return createInvalidationPlan({
        revisionRequest: {
            kind: "improvement",
            requestedFocus: input.requestedFocus,
            parentRevisionId: input.parentRevisionId ?? undefined,
        },
        sourceArtifacts: input.sourceArtifacts ?? null,
        parentSourceArtifacts: input.parentSourceArtifacts ??
            null,
        codeFileCount: input.codeFileCount,
        routeTemplateCount: input.routeTemplateCount,
        componentFamilyCount: input.componentFamilyCount,
    });
}
function resolveSharedRevisionCacheRoot(outDir) {
    const normalizedOutDir = path.resolve(outDir);
    const parentDir = path.dirname(normalizedOutDir);
    if (path.basename(parentDir) === "artifacts") {
        return path.join(path.dirname(parentDir), "revision-cache");
    }
    return path.join(normalizedOutDir, ".revision-cache");
}
function createRevisionId(value) {
    return `revision_${crypto
        .createHash("sha256")
        .update(JSON.stringify(value))
        .digest("hex")
        .slice(0, 16)}`;
}
function createStableRevisionSummary(ir) {
    return {
        sourceUrl: ir.sourceUrl,
        exportMode: ir.exportMode,
        captureMode: ir.captureMode,
        exportEngine: ir.exportEngine,
        componentName: ir.componentName,
        routeTemplates: (ir.routeTemplates ?? []).map((template) => ({
            templateId: template.templateId,
            templatePath: template.templatePath,
            templateKind: template.templateKind,
            representativeRoutePath: template.representativeRoutePath,
            routeCount: template.routeCount,
            nodeCount: template.nodeCount,
        })),
        sitePages: (ir.sitePages ?? []).map((page) => ({
            routePath: page.routePath,
            templateId: page.templateId,
            templatePath: page.templatePath,
            routeKind: page.routeKind,
            template: page.template,
            templateKind: page.templateKind,
            destination: page.destination ?? page.redirectTo,
            destinationKind: page.destinationKind,
            sourceTextLength: page.sourceTextLength ?? 0,
        })),
        componentModuleCount: ir.componentModules?.length ?? 0,
        codeFileCount: ir.codeFiles?.length ?? 0,
        cmsCollectionCount: ir.cmsCollections?.length ?? 0,
        fontCount: ir.fonts?.length ?? 0,
    };
}
function createSourceFingerprint(input) {
    const publishedUrl = input.pluginCapture?.context?.publishedUrl ??
        input.pluginCapture?.context?.publishInfo?.production?.url ??
        input.pluginCapture?.context?.publishInfo?.staging?.url;
    return crypto
        .createHash("sha256")
        .update(JSON.stringify({
        url: input.url ?? null,
        exportMode: input.exportMode ?? null,
        selector: input.selector ?? null,
        projectId: input.pluginCapture?.context?.project?.id ?? null,
        publishedUrl: publishedUrl ?? null,
    }))
        .digest("hex");
}
function createLegacyPluginFingerprint(input) {
    const componentModules = Array.isArray(input.normalizedIr.componentModules)
        ? input.normalizedIr.componentModules
        : [];
    const componentFamilies = Array.isArray(input.normalizedIr.componentFamilies)
        ? input.normalizedIr.componentFamilies
        : [];
    return crypto
        .createHash("sha256")
        .update(JSON.stringify({
        selectedNodeCount: input.pluginCapture.selectedNodes.length,
        projectId: input.pluginCapture.context?.project?.id ?? null,
        componentIds: componentModules.map((component) => (typeof component.id === "string" && component.id) ||
            (typeof component.insertURL === "string" && component.insertURL) ||
            (typeof component.name === "string" && component.name) ||
            null),
        componentFamilyIds: componentFamilies
            .map((family) => (typeof family.id === "string" ? family.id : null))
            .filter(Boolean),
        codeFiles: input.sourceArtifacts.codeFiles.map((file) => ({
            id: file.id ?? null,
            versionId: file.versionId ?? null,
            contentHash: file.contentHash ?? null,
            hasContent: file.hasContent,
        })),
        capabilityReport: readCapabilityReport(input.pluginCapture),
    }))
        .digest("hex");
}
function createPluginFingerprint(pluginCapture, ir) {
    return crypto
        .createHash("sha256")
        .update(JSON.stringify({
        selectedNodeCount: pluginCapture.selectedNodes.length,
        projectId: pluginCapture.context?.project?.id ?? null,
        componentIds: (ir.componentModules ?? []).map((component) => component.id ?? component.insertURL ?? component.name),
        componentFamilyIds: (ir.componentFamilies ?? []).map((family) => family.id),
        codeFiles: (ir.codeFiles ?? []).map((file) => ({
            id: file.id ?? null,
            versionId: file.versionId ?? null,
            contentHash: file.contentHash ?? null,
            hasContent: file.hasContent ?? Boolean(file.content),
        })),
        capabilityReport: readCapabilityReport(pluginCapture),
    }))
        .digest("hex");
}
function hashValue(value) {
    return crypto
        .createHash("sha256")
        .update(JSON.stringify(value))
        .digest("hex");
}
function createLegacyStableRevisionSummary(input) {
    const sitePages = Array.isArray(input.normalizedIr.sitePages)
        ? input.normalizedIr.sitePages
        : [];
    return {
        sourceUrl: input.sourceUrl,
        exportMode: input.exportMode,
        captureMode: typeof input.normalizedIr.captureMode === "string"
            ? input.normalizedIr.captureMode
            : "runtime-first",
        exportEngine: typeof input.normalizedIr.exportEngine === "string"
            ? input.normalizedIr.exportEngine
            : "published-runtime",
        componentName: typeof input.normalizedIr.componentName === "string"
            ? input.normalizedIr.componentName
            : typeof input.report.componentName === "string"
                ? input.report.componentName
                : input.jobId,
        routeTemplates: input.routeTemplates.map((template) => ({
            templateId: template.templateId,
            templatePath: template.templatePath,
            templateKind: template.templateKind,
            representativeRoutePath: template.representativeRoutePath,
            routeCount: template.routeCount,
            nodeCount: template.nodeCount ?? 0,
            sourceTextLength: template.sourceTextLength ?? 0,
        })),
        sitePages: sitePages.map((page) => ({
            routePath: page.routePath,
            templateId: page.templateId,
            templatePath: page.templatePath,
            routeKind: page.routeKind,
            template: page.template,
            templateKind: page.templateKind,
            destination: page.destination ?? page.redirectTo,
            destinationKind: page.destinationKind,
            sourceTextLength: typeof page.sourceTextLength === "number" ? page.sourceTextLength : 0,
        })),
        componentModuleCount: Array.isArray(input.normalizedIr.componentModules)
            ? input.normalizedIr.componentModules.length
            : 0,
        codeFileCount: Array.isArray(input.normalizedIr.codeFiles)
            ? input.normalizedIr.codeFiles.length
            : 0,
        cmsCollectionCount: Array.isArray(input.normalizedIr.cmsCollections)
            ? input.normalizedIr.cmsCollections.length
            : 0,
        fontCount: Array.isArray(input.normalizedIr.fonts)
            ? input.normalizedIr.fonts.length
            : 0,
    };
}
function createLegacyBestAttempt(report) {
    const fidelity = report.visualFidelity &&
        typeof report.visualFidelity === "object"
        ? report.visualFidelity
        : {};
    return {
        id: "legacy-attempt-1",
        attemptNumber: report.bestAttempt &&
            typeof report.bestAttempt === "object" &&
            typeof report.bestAttempt.attempt ===
                "number"
            ? Number(report.bestAttempt.attempt)
            : 1,
        strategy: "legacy-migrated",
        projectDir: ".",
        fidelity: {
            overall: typeof fidelity.overall === "number" ? Number(fidelity.overall) : 0,
            layout: typeof fidelity.layout === "number" ? Number(fidelity.layout) : 0,
            typography: typeof fidelity.typography === "number" ? Number(fidelity.typography) : 0,
            color: typeof fidelity.color === "number" ? Number(fidelity.color) : 0,
            assets: typeof fidelity.assets === "number" ? Number(fidelity.assets) : 0,
            motion: typeof fidelity.motion === "number" ? Number(fidelity.motion) : 0,
            nodeMatch: typeof fidelity.nodeMatch === "number" ? Number(fidelity.nodeMatch) : 0,
            desktop: typeof fidelity.desktop === "number" ? Number(fidelity.desktop) : 0,
            laptop: typeof fidelity.laptop === "number" ? Number(fidelity.laptop) : 0,
            tablet: typeof fidelity.tablet === "number" ? Number(fidelity.tablet) : 0,
            mobile: typeof fidelity.mobile === "number" ? Number(fidelity.mobile) : 0,
            breakpointScores: fidelity.breakpointScores &&
                typeof fidelity.breakpointScores === "object"
                ? fidelity.breakpointScores
                : undefined,
        },
        warnings: [],
        stopReason: "legacy-migrated",
    };
}
async function tryReuseParentRevisionForValidation(input) {
    const revisionRequest = input.revisionRequest;
    if (revisionRequest?.kind !== "improvement" ||
        revisionRequest.requestedFocus !== "revalidate") {
        return null;
    }
    if (!revisionRequest.parentRevisionId) {
        throw new Error("Missing parentRevisionId: revalidate revision requires a parent revision.");
    }
    const parentRevisionCacheDir = path.join(input.sharedRevisionCacheRoot, revisionRequest.parentRevisionId);
    const parentRevision = await readCachedRevision(parentRevisionCacheDir);
    if (!parentRevision) {
        throw new Error(`Parent revision cache not found: ${revisionRequest.parentRevisionId}`);
    }
    const parentManifestPath = path.join(parentRevision.exportDir, "revision-manifest.json");
    const parentManifest = await readJsonFile(parentManifestPath);
    const revisionId = createRevisionId({
        mode: "revalidate-only",
        parentRevisionId: revisionRequest.parentRevisionId,
        requestedFocus: revisionRequest.requestedFocus,
        targetFidelity: input.targetFidelity,
        maxAttempts: input.maxAttempts,
        parentSummary: parentManifest && typeof parentManifest.summary === "object"
            ? parentManifest.summary
            : null,
    });
    const revisionCacheDir = path.join(input.sharedRevisionCacheRoot, revisionId);
    const cachedRevision = await readCachedRevision(revisionCacheDir);
    if (cachedRevision) {
        await fs.cp(cachedRevision.exportDir, input.exportDir, { recursive: true });
        await writeJsonFile(path.join(input.exportDir, "resolved-request.json"), createResolvedRequestArtifact({
            localExportInput: input.localExportInput,
            pluginCapture: {
                mode: "simulated",
                selectedNodes: [],
                capturedAt: new Date().toISOString(),
            },
            revisionId,
        }));
        return finalizeCachedRevisionResult({
            exportDir: input.exportDir,
            runDir: input.runDir,
            cachedRevision,
            revisionCacheHit: true,
        });
    }
    await fs.cp(parentRevision.exportDir, input.exportDir, { recursive: true });
    await updateRevisionStatusFile({
        exportDir: input.exportDir,
        revisionId,
        stage: "validating",
        detail: "Revalidating copied parent revision output.",
    });
    const runtimeLocalization = input.localExportInput.exportMode === "full-site"
        ? await localizeRuntimeKeptProjectAssets(input.exportDir)
        : undefined;
    const validation = await validateGeneratedProject(input.exportDir, {
        exportMode: input.localExportInput.exportMode,
        runtimeLocalization,
        onProgress: async (progress) => {
            await updateRevisionStatusFile({
                exportDir: input.exportDir,
                revisionId,
                stage: "validating",
                detail: progress.detail,
                progress: {
                    completed: progress.completed,
                    total: progress.total,
                    routePath: progress.routePath,
                    failed: progress.failed,
                },
            });
        },
    });
    const parentReportPath = path.join(parentRevision.exportDir, "export-report.json");
    const parentReport = await readJsonFile(parentReportPath);
    const now = new Date().toISOString();
    await patchRevalidatedRevisionArtifacts({
        exportDir: input.exportDir,
        revisionId,
        parentRevisionId: revisionRequest.parentRevisionId,
        revisionRequest,
        validation,
        parentManifest,
        parentReport,
        createdAt: now,
    });
    if (parentReport) {
        await writeJsonFile(path.join(input.exportDir, "before-after-report.json"), createBeforeAfterReport((await readJsonFile(path.join(input.exportDir, "export-report.json"))) ?? {}, parentReport, {
            revisionId,
            parentRevisionId: revisionRequest.parentRevisionId ?? null,
        }));
    }
    await writeJsonFile(path.join(input.exportDir, "resolved-request.json"), createResolvedRequestArtifact({
        localExportInput: input.localExportInput,
        pluginCapture: {
            mode: "simulated",
            selectedNodes: [],
            capturedAt: new Date().toISOString(),
        },
        revisionId,
    }));
    const result = await finalizeCachedRevisionResult({
        exportDir: input.exportDir,
        runDir: input.runDir,
        cachedRevision: {
            exportDir: input.exportDir,
            bestAttempt: parentRevision.bestAttempt,
            validation,
        },
        revisionCacheHit: false,
    });
    await fs.mkdir(revisionCacheDir, { recursive: true });
    await fs.cp(input.exportDir, path.join(revisionCacheDir, "export"), {
        recursive: true,
    });
    await updateRevisionStatusFile({
        exportDir: input.exportDir,
        revisionId,
        stage: "completed",
        detail: "Revalidate-only revision completed successfully.",
    });
    return result;
}
async function tryReuseParentRevisionForUnchangedComponentSource(input) {
    const revisionRequest = input.revisionRequest;
    if (revisionRequest?.kind !== "improvement" ||
        revisionRequest.requestedFocus !== "components" ||
        !revisionRequest.parentRevisionId) {
        return null;
    }
    if (input.sourceDiff.changedCodeFileArtifactIds.length > 0 ||
        input.sourceDiff.addedCodeFileArtifactIds.length > 0 ||
        input.sourceDiff.removedCodeFileArtifactIds.length > 0 ||
        input.sourceDiff.componentFamiliesChanged ||
        input.sourceDiff.overrideAssignmentsChanged ||
        input.sourceArtifacts.codeFiles.some((entry) => !entry.hasContent)) {
        return null;
    }
    const parentRevisionCacheDir = path.join(input.sharedRevisionCacheRoot, revisionRequest.parentRevisionId);
    const parentRevision = await readCachedRevision(parentRevisionCacheDir);
    if (!parentRevision) {
        return null;
    }
    await fs.cp(parentRevision.exportDir, input.exportDir, { recursive: true });
    await updateRevisionStatusFile({
        exportDir: input.exportDir,
        revisionId: input.revisionId,
        stage: "validating",
        detail: "Validating reused parent export for unchanged component source.",
    });
    const runtimeLocalization = input.localExportInput.exportMode === "full-site"
        ? await localizeRuntimeKeptProjectAssets(input.exportDir)
        : undefined;
    const validation = await validateGeneratedProject(input.exportDir, {
        exportMode: input.localExportInput.exportMode,
        runtimeLocalization,
        onProgress: async (progress) => {
            await updateRevisionStatusFile({
                exportDir: input.exportDir,
                revisionId: input.revisionId,
                stage: "validating",
                detail: progress.detail,
                progress: {
                    completed: progress.completed,
                    total: progress.total,
                    routePath: progress.routePath,
                    failed: progress.failed,
                },
            });
        },
    });
    const parentManifest = await readJsonFile(path.join(parentRevision.exportDir, "revision-manifest.json"));
    const parentReport = await readJsonFile(path.join(parentRevision.exportDir, "export-report.json"));
    const createdAt = new Date().toISOString();
    const invalidationPlan = createInvalidationPlan({
        revisionRequest,
        sourceArtifacts: input.sourceArtifacts,
        parentSourceArtifacts: input.parentSourceArtifacts,
        codeFileCount: input.sourceArtifacts.codeFiles.length,
        componentFamilyCount: input.sourceArtifacts.componentFamiliesArtifactId
            ? 1
            : 0,
    });
    const parentInfo = createParentInfo(revisionRequest);
    const manifest = {
        ...(parentManifest ?? {}),
        revisionId: input.revisionId,
        parentRevisionId: revisionRequest.parentRevisionId,
        reusedFromRevisionId: revisionRequest.parentRevisionId,
        reusedBecause: "component-source-unchanged",
        revisionRequest,
        generatedValidation: validation,
        sourceArtifacts: input.sourceArtifacts,
        revalidatedAt: createdAt,
        reusedArtifactIds: invalidationPlan.reused,
        invalidatedArtifacts: invalidationPlan.invalidated,
        parentInfoPath: parentInfo ? "parent.json" : null,
    };
    const report = {
        ...(parentReport ?? {}),
        revisionId: input.revisionId,
        parentRevisionId: revisionRequest.parentRevisionId,
        revisionCacheHit: false,
        revisionRequest,
        generatedValidation: validation,
        sourceArtifacts: input.sourceArtifacts,
        reusedFromRevisionId: revisionRequest.parentRevisionId,
        reusedBecause: "component-source-unchanged",
        createdAt,
    };
    await writeJsonFile(path.join(input.exportDir, "generated-validation.json"), validation);
    await writeJsonFile(path.join(input.exportDir, "revision-manifest.json"), manifest);
    if (parentInfo) {
        await writeJsonFile(path.join(input.exportDir, "parent.json"), parentInfo);
    }
    await writeJsonFile(path.join(input.exportDir, "export-report.json"), report);
    if (parentReport) {
        await writeJsonFile(path.join(input.exportDir, "before-after-report.json"), createBeforeAfterReport(report, parentReport, {
            revisionId: input.revisionId,
            parentRevisionId: revisionRequest.parentRevisionId ?? null,
        }));
    }
    await writeJsonFile(path.join(input.exportDir, "source-artifacts", "manifest.json"), input.sourceArtifacts);
    await writeJsonFile(path.join(input.exportDir, "invalidation-plan.json"), invalidationPlan);
    await writeJsonFile(path.join(input.exportDir, "artifact-index.json"), await createArtifactIndex(input.exportDir, input.sourceArtifacts, {
        sourceFingerprint: typeof manifest.sourceFingerprint === "string"
            ? manifest.sourceFingerprint
            : hashValue(manifest.summary ?? null),
        revisionId: input.revisionId,
    }));
    await writeJsonFile(path.join(input.exportDir, "resolved-request.json"), createResolvedRequestArtifact({
        localExportInput: input.localExportInput,
        pluginCapture: {
            mode: "simulated",
            selectedNodes: [],
            capturedAt: new Date().toISOString(),
        },
        revisionId: input.revisionId,
    }));
    const revisionCacheDir = path.join(input.sharedRevisionCacheRoot, input.revisionId);
    const result = await finalizeCachedRevisionResult({
        exportDir: input.exportDir,
        runDir: input.runDir,
        cachedRevision: {
            exportDir: input.exportDir,
            bestAttempt: parentRevision.bestAttempt,
            validation,
        },
        revisionCacheHit: false,
    });
    await fs.mkdir(revisionCacheDir, { recursive: true });
    await fs.cp(input.exportDir, path.join(revisionCacheDir, "export"), {
        recursive: true,
    });
    await updateRevisionStatusFile({
        exportDir: input.exportDir,
        revisionId: input.revisionId,
        stage: "completed",
        detail: "Unchanged component-source revision completed successfully.",
    });
    return result;
}
async function readCachedRevision(revisionCacheDir) {
    try {
        const exportDir = path.join(revisionCacheDir, "export");
        const artifactIndexPath = path.join(exportDir, "artifact-index.json");
        await fs.access(path.join(exportDir, "revision-manifest.json"));
        await fs.access(artifactIndexPath);
        const artifactIndex = JSON.parse(await fs.readFile(artifactIndexPath, "utf8"));
        const artifactIntegrity = await validateCachedArtifactIndex(exportDir, artifactIndex);
        if (!artifactIntegrity.valid) {
            return null;
        }
        const bestAttempt = JSON.parse(await fs.readFile(path.join(exportDir, "best-attempt.json"), "utf8"));
        const validation = JSON.parse(await fs.readFile(path.join(exportDir, "generated-validation.json"), "utf8"));
        return { exportDir, bestAttempt, validation };
    }
    catch {
        return null;
    }
}
async function validateCachedArtifactIndex(exportDir, artifactIndex) {
    if (artifactIndex.schemaVersion !== ARTIFACT_INDEX_SCHEMA_VERSION ||
        !Array.isArray(artifactIndex.entries)) {
        return { valid: false, reason: "artifact-index-schema-mismatch" };
    }
    if (artifactIndex.entries.length !== artifactIndex.fileCount) {
        return { valid: false, reason: "artifact-index-count-mismatch" };
    }
    for (const entry of artifactIndex.entries) {
        const targetPath = path.join(exportDir, entry.path);
        let stat;
        try {
            stat = await fs.stat(targetPath);
        }
        catch {
            return {
                valid: false,
                reason: "artifact-missing",
                artifactId: entry.id,
                path: entry.path,
            };
        }
        if (stat.size !== entry.byteSize) {
            return {
                valid: false,
                reason: "artifact-byte-size-mismatch",
                artifactId: entry.id,
                path: entry.path,
            };
        }
        const actualHash = await hashFile(targetPath);
        if (actualHash !== entry.hash) {
            return {
                valid: false,
                reason: "artifact-hash-mismatch",
                artifactId: entry.id,
                path: entry.path,
            };
        }
    }
    return { valid: true };
}
async function patchRevalidatedRevisionArtifacts(input) {
    const invalidationPlan = createInvalidationPlan({
        revisionRequest: input.revisionRequest,
        sourceArtifacts: input.parentManifest?.sourceArtifacts ?? null,
        codeFileCount: typeof input.parentManifest?.summary?.codeFileCount ===
            "number"
            ? (input.parentManifest?.summary).codeFileCount
            : undefined,
        routeTemplateCount: Array.isArray(input.parentManifest?.summary?.routeTemplates)
            ? (input.parentManifest?.summary).routeTemplates.length
            : undefined,
    });
    const parentInfo = createParentInfo(input.revisionRequest);
    const manifest = {
        ...(input.parentManifest ?? {}),
        revisionId: input.revisionId,
        parentRevisionId: input.parentRevisionId,
        revalidatedFromRevisionId: input.parentRevisionId,
        revalidatedAt: input.createdAt,
        revisionRequest: input.revisionRequest,
        generatedValidation: input.validation,
        reusedArtifactIds: invalidationPlan.reused,
        invalidatedArtifacts: invalidationPlan.invalidated,
        parentInfoPath: parentInfo ? "parent.json" : null,
    };
    const report = {
        ...(input.parentReport ?? {}),
        revisionId: input.revisionId,
        parentRevisionId: input.parentRevisionId,
        revisionCacheHit: false,
        revisionRequest: input.revisionRequest,
        generatedValidation: input.validation,
        createdAt: input.createdAt,
    };
    await writeJsonFile(path.join(input.exportDir, "generated-validation.json"), input.validation);
    await writeJsonFile(path.join(input.exportDir, "revision-manifest.json"), manifest);
    if (parentInfo) {
        await writeJsonFile(path.join(input.exportDir, "parent.json"), parentInfo);
    }
    await writeJsonFile(path.join(input.exportDir, "export-report.json"), report);
    if (input.parentReport) {
        await writeJsonFile(path.join(input.exportDir, "before-after-report.json"), createBeforeAfterReport(report, input.parentReport, {
            revisionId: input.revisionId,
            parentRevisionId: input.parentRevisionId,
        }));
    }
    await writeJsonFile(path.join(input.exportDir, "invalidation-plan.json"), invalidationPlan);
    await writeJsonFile(path.join(input.exportDir, "artifact-index.json"), await createArtifactIndex(input.exportDir, manifest.sourceArtifacts ?? null, {
        sourceFingerprint: typeof manifest.sourceFingerprint === "string"
            ? manifest.sourceFingerprint
            : hashValue(manifest.summary ?? null),
        revisionId: input.revisionId,
    }));
}
async function readJsonFile(filePath) {
    try {
        return JSON.parse(await fs.readFile(filePath, "utf8"));
    }
    catch {
        return null;
    }
}
async function readParentSourceArtifacts(sharedRevisionCacheRoot, parentRevisionId) {
    if (!parentRevisionId)
        return null;
    const manifestPath = path.join(sharedRevisionCacheRoot, parentRevisionId, "export", "revision-manifest.json");
    const manifest = await readJsonFile(manifestPath);
    if (!manifest || typeof manifest !== "object")
        return null;
    const sourceArtifacts = manifest.sourceArtifacts;
    return sourceArtifacts && typeof sourceArtifacts === "object"
        ? sourceArtifacts
        : null;
}
async function readParentRevisionReport(sharedRevisionCacheRoot, parentRevisionId) {
    if (!parentRevisionId)
        return null;
    return readJsonFile(path.join(sharedRevisionCacheRoot, parentRevisionId, "export", "export-report.json"));
}
async function writeJsonFile(filePath, value) {
    await writeFile(filePath, `${JSON.stringify(value, null, 2)}\n`);
}
async function persistPackagedArchiveVerification(input) {
    const generatedValidationPath = path.join(input.exportDir, "generated-validation.json");
    const generatedValidation = await readJsonFile(generatedValidationPath);
    if (generatedValidation) {
        await writeJsonFile(generatedValidationPath, {
            ...generatedValidation,
            packagedArchive: input.packagedArchive,
        });
    }
    const exportReportPath = path.join(input.exportDir, "export-report.json");
    const exportReport = await readJsonFile(exportReportPath);
    if (exportReport) {
        const generatedValidationRecord = exportReport.generatedValidation &&
            typeof exportReport.generatedValidation === "object"
            ? exportReport.generatedValidation
            : null;
        await writeJsonFile(exportReportPath, {
            ...exportReport,
            generatedValidation: generatedValidationRecord
                ? {
                    ...generatedValidationRecord,
                    packagedArchive: input.packagedArchive,
                }
                : exportReport.generatedValidation,
        });
    }
    const revisionManifestPath = path.join(input.exportDir, "revision-manifest.json");
    const revisionManifest = await readJsonFile(revisionManifestPath);
    if (revisionManifest) {
        const generatedValidationRecord = revisionManifest.generatedValidation &&
            typeof revisionManifest.generatedValidation === "object"
            ? revisionManifest.generatedValidation
            : null;
        await writeJsonFile(revisionManifestPath, {
            ...revisionManifest,
            generatedValidation: generatedValidationRecord
                ? {
                    ...generatedValidationRecord,
                    packagedArchive: input.packagedArchive,
                }
                : revisionManifest.generatedValidation,
        });
    }
}
async function finalizeCachedRevisionResult(input) {
    if (input.revisionCacheHit) {
        const cachedReportPath = path.join(input.exportDir, "export-report.json");
        try {
            const cachedReport = JSON.parse(await fs.readFile(cachedReportPath, "utf8"));
            cachedReport.revisionCacheHit = true;
            await writeJsonFile(cachedReportPath, cachedReport);
        }
        catch {
            // Keep the cached export usable even if the report cannot be patched.
        }
    }
    const manifest = (await readJsonFile(path.join(input.exportDir, "revision-manifest.json"))) ?? {};
    const componentName = typeof manifest.summary === "object" &&
        manifest.summary &&
        typeof manifest.summary.componentName === "string"
        ? manifest.summary.componentName
        : "CodeRelayExport";
    const revisionId = typeof manifest.revisionId === "string" ? manifest.revisionId : undefined;
    const zipPath = path.join(input.runDir, `${componentName}.zip`);
    let packagedArchive;
    try {
        if (revisionId) {
            await updateRevisionStatusFile({
                exportDir: input.exportDir,
                revisionId,
                stage: "validating",
                detail: "Packaging cached revision export into a ZIP archive.",
            });
        }
        await zipDirectory(input.exportDir, zipPath);
        packagedArchive = await verifyPackagedExportArchive(zipPath, {
            exportMode: typeof manifest.summary === "object" &&
                manifest.summary &&
                typeof manifest.summary.exportMode === "string"
                ? manifest.summary.exportMode
                : undefined,
            onProgress: revisionId
                ? async (progress) => {
                    await updateRevisionStatusFile({
                        exportDir: input.exportDir,
                        revisionId,
                        stage: "validating",
                        detail: progress.detail,
                        progress: {
                            completed: progress.completed,
                            total: progress.total,
                            routePath: progress.routePath,
                            failed: progress.failed,
                        },
                    });
                }
                : undefined,
        });
    }
    catch (error) {
        if (revisionId) {
            await updateRevisionStatusFile({
                exportDir: input.exportDir,
                revisionId,
                stage: "failed",
                detail: error instanceof Error ? error.message : String(error),
            });
        }
        throw error;
    }
    await persistPackagedArchiveVerification({
        exportDir: input.exportDir,
        packagedArchive,
    });
    const responsivePlanPath = path.join(input.exportDir, "responsive-recapture-plan.json");
    return {
        exportDir: input.exportDir,
        zipPath,
        reportPath: path.join(input.exportDir, "export-report.json"),
        previewPath: path.join(input.exportDir, "preview.html"),
        resolvedRequestPath: (await fileExists(path.join(input.exportDir, "resolved-request.json")))
            ? path.join(input.exportDir, "resolved-request.json")
            : undefined,
        statusPath: (await fileExists(path.join(input.exportDir, "status.json")))
            ? path.join(input.exportDir, "status.json")
            : undefined,
        captureProgressPath: (await fileExists(path.join(input.exportDir, "capture-progress.json")))
            ? path.join(input.exportDir, "capture-progress.json")
            : undefined,
        capabilityReportPath: (await fileExists(path.join(input.exportDir, "capability-report.json")))
            ? path.join(input.exportDir, "capability-report.json")
            : undefined,
        codeCompatibilityReportPath: (await fileExists(path.join(input.exportDir, "code-compatibility-report.json")))
            ? path.join(input.exportDir, "code-compatibility-report.json")
            : undefined,
        beforeAfterReportPath: (await fileExists(path.join(input.exportDir, "before-after-report.json")))
            ? path.join(input.exportDir, "before-after-report.json")
            : undefined,
        parentInfoPath: (await fileExists(path.join(input.exportDir, "parent.json")))
            ? path.join(input.exportDir, "parent.json")
            : undefined,
        bestAttempt: input.cachedRevision.bestAttempt,
        validation: {
            ...input.cachedRevision.validation,
            packagedArchive,
        },
        revisionManifestPath: path.join(input.exportDir, "revision-manifest.json"),
        invalidationPlanPath: path.join(input.exportDir, "invalidation-plan.json"),
        artifactIndexPath: path.join(input.exportDir, "artifact-index.json"),
        responsiveRecapturePlanPath: (await fileExists(responsivePlanPath))
            ? responsivePlanPath
            : undefined,
        revisionCacheHit: input.revisionCacheHit,
    };
}
async function createArtifactIndex(exportDir, sourceArtifacts, input) {
    const files = (await listFiles(exportDir)).filter((filePath) => {
        const relativePath = relativeToExport(exportDir, filePath);
        return (relativePath !== "status.json" &&
            relativePath !== "artifact-index.json");
    });
    const draftEntries = await Promise.all(files.map(async (filePath) => {
        const relativePath = relativeToExport(exportDir, filePath);
        const artifactId = inferArtifactId(relativePath, sourceArtifacts);
        const dependencyArtifactIds = inferArtifactDependencies(artifactId, sourceArtifacts);
        const artifactMetadata = inferArtifactMetadata(relativePath, sourceArtifacts);
        return {
            id: artifactId,
            path: relativePath,
            byteSize: (await fs.stat(filePath)).size,
            hash: await hashFile(filePath),
            artifactType: inferArtifactType(filePath),
            schemaVersion: ARTIFACT_INDEX_SCHEMA_VERSION,
            sourceFingerprint: input?.sourceFingerprint ?? "unknown",
            dependencyArtifactIds,
            dependencyHashes: [],
            dependsOn: dependencyArtifactIds,
            status: "complete",
            createdAt: new Date().toISOString(),
            ...artifactMetadata,
        };
    }));
    const entriesById = new Map();
    for (const entry of draftEntries) {
        if (entriesById.has(entry.id)) {
            throw new Error(`Duplicate artifact id detected in artifact index: ${entry.id}`);
        }
        entriesById.set(entry.id, entry);
    }
    for (const entry of draftEntries) {
        for (const dependencyArtifactId of entry.dependencyArtifactIds) {
            if (!entriesById.has(dependencyArtifactId)) {
                throw new Error(`Artifact dependency is missing from artifact index: ${entry.id} -> ${dependencyArtifactId}`);
            }
        }
    }
    const entries = draftEntries.map((entry) => ({
        ...entry,
        dependencyHashes: entry.dependencyArtifactIds.map((dependencyArtifactId) => {
            const dependency = entriesById.get(dependencyArtifactId);
            if (!dependency) {
                throw new Error(`Artifact dependency hash resolution failed: ${entry.id} -> ${dependencyArtifactId}`);
            }
            return dependency.hash;
        }),
    }));
    return {
        schemaVersion: ARTIFACT_INDEX_SCHEMA_VERSION,
        generatedAt: new Date().toISOString(),
        revisionId: input?.revisionId,
        sourceFingerprint: input?.sourceFingerprint ?? "unknown",
        fileCount: entries.length,
        entries: entries.sort((left, right) => left.path.localeCompare(right.path)),
    };
}
function inferArtifactMetadata(relativePath, sourceArtifacts) {
    const sourceArtifactEntry = (sourceArtifacts?.codeFiles ?? []).find((entry) => entry.metadataPath === relativePath || entry.sourcePath === relativePath);
    if (sourceArtifactEntry) {
        return {
            codeFileId: sourceArtifactEntry.id ?? sourceArtifactEntry.path ?? sourceArtifactEntry.name,
        };
    }
    return {};
}
function inferArtifactType(filePath) {
    const relativePath = filePath.replace(/\\/g, "/");
    if (relativePath.endsWith("revision-manifest.json"))
        return "revision-manifest";
    if (relativePath.endsWith("status.json"))
        return "revision-status";
    if (relativePath.endsWith("capture-progress.json"))
        return "capture-progress";
    if (relativePath.endsWith("resolved-request.json"))
        return "resolved-request";
    if (relativePath.endsWith("parent.json"))
        return "parent-link";
    if (relativePath.endsWith("invalidation-plan.json"))
        return "invalidation-plan";
    if (relativePath.endsWith("artifact-index.json"))
        return "artifact-index";
    if (relativePath.endsWith("capability-report.json"))
        return "capability-report";
    if (relativePath.endsWith("code-compatibility-report.json"))
        return "code-compatibility-report";
    if (relativePath.endsWith("responsive-recapture-plan.json"))
        return "responsive-recapture-plan";
    if (relativePath.endsWith("generated-validation.json"))
        return "validation";
    if (relativePath.endsWith("export-report.json"))
        return "report";
    if (relativePath.endsWith("best-attempt.json"))
        return "best-attempt";
    if (relativePath.endsWith("raw-plugin-payload.json"))
        return "plugin-payload";
    if (relativePath.endsWith("raw-runtime-capture.json"))
        return "runtime-capture";
    if (relativePath.endsWith("normalized-ir.json"))
        return "normalized-ir";
    if (relativePath.endsWith("source-artifacts/manifest.json"))
        return "source-artifact-manifest";
    if (relativePath.endsWith("source-artifacts/component-families.json"))
        return "component-families";
    if (relativePath.endsWith("source-artifacts/override-assignments.json"))
        return "override-assignments";
    if (relativePath.includes("/source-artifacts/code-files/")) {
        return relativePath.endsWith(".json") ? "code-file-metadata" : "code-file-source";
    }
    if (relativePath.endsWith("patch-history.json"))
        return "patch-history";
    if (relativePath.endsWith("preview.html"))
        return "preview";
    if (relativePath.includes("/debug/"))
        return "debug";
    if (relativePath.endsWith(".tsx"))
        return "source-tsx";
    if (relativePath.endsWith(".css"))
        return "source-css";
    if (relativePath.endsWith(".json"))
        return "json";
    return "file";
}
function inferArtifactId(relativePath, sourceArtifacts) {
    if (relativePath === "raw-plugin-payload.json")
        return "plugin/raw-payload";
    if (relativePath === "raw-runtime-capture.json")
        return "runtime/raw-capture";
    if (relativePath === "normalized-ir.json")
        return "ir/normalized";
    if (relativePath === "generated-validation.json")
        return "validation/generated";
    if (relativePath === "export-report.json")
        return "report/export";
    if (relativePath === "revision-manifest.json")
        return "manifest/revision";
    if (relativePath === "status.json")
        return "manifest/status";
    if (relativePath === "capture-progress.json")
        return "manifest/capture-progress";
    if (relativePath === "resolved-request.json")
        return "request/resolved";
    if (relativePath === "parent.json")
        return "manifest/parent";
    if (relativePath === "invalidation-plan.json")
        return "manifest/invalidation";
    if (relativePath === "artifact-index.json")
        return "manifest/artifact-index";
    if (relativePath === "capability-report.json")
        return (sourceArtifacts?.capabilityReportArtifactId ?? "plugin/capability-report");
    if (relativePath === "code-compatibility-report.json")
        return "source/code-compatibility";
    if (relativePath === "responsive-recapture-plan.json")
        return "manifest/responsive-recapture";
    if (relativePath === "best-attempt.json")
        return "attempt/best";
    if (relativePath === "patch-history.json")
        return "attempt/patch-history";
    if (relativePath === "source-artifacts/manifest.json")
        return "manifest/source-artifacts";
    if (relativePath === "source-artifacts/component-families.json") {
        return sourceArtifacts?.componentFamiliesArtifactId ?? "source/component-families";
    }
    if (relativePath === "source-artifacts/override-assignments.json") {
        return (sourceArtifacts?.overrideAssignmentsArtifactId ??
            "source/override-assignments");
    }
    if (relativePath.startsWith("source-artifacts/code-files/")) {
        const sourceMatch = (sourceArtifacts?.codeFiles ?? []).find((entry) => entry.metadataPath === relativePath || entry.sourcePath === relativePath);
        if (sourceMatch) {
            if (sourceMatch.metadataPath === relativePath) {
                return sourceMatch.metadataArtifactId ?? `${sourceMatch.artifactId}/metadata`;
            }
            if (sourceMatch.sourcePath === relativePath) {
                return sourceMatch.sourceArtifactId ?? `${sourceMatch.artifactId}/source`;
            }
            return sourceMatch.artifactId;
        }
        return relativePath.endsWith(".json")
            ? `source/code-file/${slugSegment(relativePath)}/metadata`
            : `source/code-file/${slugSegment(relativePath)}/source`;
    }
    if (relativePath === "preview.html")
        return "generated/project";
    if (relativePath.startsWith("debug/")) {
        return `debug/${slugSegment(relativePath)}`;
    }
    return `artifact/${slugSegment(relativePath)}`;
}
function inferArtifactDependencies(artifactId, sourceArtifacts) {
    if (artifactId === "plugin/raw-payload")
        return [];
    if (artifactId === "runtime/raw-capture")
        return [];
    if (artifactId === "plugin/capability-report")
        return ["plugin/raw-payload"];
    if (artifactId.endsWith("/metadata") && artifactId.startsWith("source/code-file/")) {
        return ["plugin/raw-payload"];
    }
    if (artifactId.endsWith("/source") && artifactId.startsWith("source/code-file/")) {
        const metadataArtifactId = artifactId.replace(/\/source$/, "/metadata");
        return [metadataArtifactId];
    }
    if (artifactId === "source/code-compatibility") {
        return [
            "plugin/raw-payload",
            ...(sourceArtifacts?.codeFiles ?? []).flatMap((entry) => allCodeFileArtifactIds(entry)),
        ];
    }
    if (artifactId === "source/override-assignments") {
        const codeFileDependencies = unique((sourceArtifacts?.codeFiles ?? []).flatMap((entry) => allCodeFileArtifactIds(entry)));
        return codeFileDependencies.length > 0
            ? ["plugin/raw-payload", ...codeFileDependencies]
            : ["plugin/raw-payload"];
    }
    if (artifactId === "source/component-families") {
        const codeFileDependencies = unique((sourceArtifacts?.codeFiles ?? []).flatMap((entry) => allCodeFileArtifactIds(entry)));
        return codeFileDependencies.length > 0
            ? ["plugin/raw-payload", ...codeFileDependencies]
            : ["plugin/raw-payload"];
    }
    if (artifactId === "manifest/source-artifacts") {
        return [
            ...(sourceArtifacts?.componentFamiliesArtifactId
                ? [sourceArtifacts.componentFamiliesArtifactId]
                : []),
            ...(sourceArtifacts?.overrideAssignmentsArtifactId
                ? [sourceArtifacts.overrideAssignmentsArtifactId]
                : []),
            ...(sourceArtifacts?.capabilityReportArtifactId
                ? [sourceArtifacts.capabilityReportArtifactId]
                : []),
            ...(sourceArtifacts?.codeFiles ?? []).flatMap((entry) => allCodeFileArtifactIds(entry)),
        ];
    }
    if (artifactId === "ir/normalized") {
        return [
            "plugin/raw-payload",
            ...(sourceArtifacts?.capabilityReportArtifactId
                ? [sourceArtifacts.capabilityReportArtifactId]
                : []),
            ...(sourceArtifacts?.overrideAssignmentsArtifactId
                ? [sourceArtifacts.overrideAssignmentsArtifactId]
                : []),
            "runtime/raw-capture",
            ...(sourceArtifacts?.componentFamiliesArtifactId
                ? [sourceArtifacts.componentFamiliesArtifactId]
                : []),
            ...(sourceArtifacts?.codeFiles ?? []).flatMap((entry) => allCodeFileArtifactIds(entry)),
        ];
    }
    if (artifactId === "generated/project")
        return ["ir/normalized"];
    if (artifactId === "validation/generated")
        return ["generated/project"];
    if (artifactId === "report/export") {
        return ["generated/project", "validation/generated", "ir/normalized"];
    }
    if (artifactId === "manifest/revision") {
        return ["ir/normalized", "validation/generated", "manifest/source-artifacts"];
    }
    if (artifactId === "manifest/status")
        return [];
    if (artifactId === "manifest/capture-progress")
        return ["runtime/raw-capture"];
    if (artifactId === "request/resolved")
        return ["plugin/raw-payload"];
    if (artifactId === "manifest/parent")
        return ["manifest/revision"];
    if (artifactId === "manifest/invalidation")
        return ["manifest/revision"];
    if (artifactId === "manifest/artifact-index")
        return ["manifest/revision"];
    if (artifactId === "manifest/responsive-recapture") {
        return ["runtime/raw-capture", "manifest/revision"];
    }
    if (artifactId === "attempt/best" || artifactId === "attempt/patch-history") {
        return ["ir/normalized"];
    }
    if (artifactId.startsWith("debug/"))
        return ["generated/project"];
    return [];
}
async function hashFile(filePath) {
    const content = await fs.readFile(filePath);
    return crypto.createHash("sha256").update(content).digest("hex");
}
function createArtifactContentHash(value) {
    return crypto
        .createHash("sha256")
        .update(JSON.stringify(value))
        .digest("hex");
}
async function fileExists(filePath) {
    try {
        await fs.access(filePath);
        return true;
    }
    catch {
        return false;
    }
}
function createSourceArtifactsPreview(input) {
    return {
        generatedAt: new Date().toISOString(),
        componentFamiliesArtifactId: (input.componentFamilies?.length ?? 0) > 0
            ? "source/component-families"
            : undefined,
        overrideAssignmentsPath: (input.overrideAssignments?.length ?? 0) > 0
            ? "source-artifacts/override-assignments.json"
            : undefined,
        overrideAssignmentsArtifactId: (input.overrideAssignments?.length ?? 0) > 0
            ? "source/override-assignments"
            : undefined,
        capabilityReportPath: readCapabilityReport(input.pluginCapture)
            ? "capability-report.json"
            : undefined,
        capabilityReportArtifactId: readCapabilityReport(input.pluginCapture)
            ? "plugin/capability-report"
            : undefined,
        codeFiles: (input.codeFiles ?? []).map((file, index) => {
            const artifactRoot = createCodeFileArtifactRoot(file, index);
            const hasContent = file.hasContent ?? Boolean(file.content);
            const baseName = createCodeFileArtifactBaseName(file, index);
            const extension = inferCodeFileExtension(file);
            return {
                id: file.id,
                name: file.name,
                path: file.path,
                versionId: file.versionId,
                hasContent,
                contentHash: file.contentHash,
                contentByteLength: file.contentByteLength,
                artifactId: artifactRoot,
                metadataArtifactId: `${artifactRoot}/metadata`,
                sourceArtifactId: hasContent ? `${artifactRoot}/source` : undefined,
                metadataPath: `source-artifacts/code-files/${baseName}.json`,
                sourcePath: hasContent
                    ? `source-artifacts/code-files/${baseName}${extension}`
                    : undefined,
            };
        }),
    };
}
function createSourceArtifactDiff(current, parent) {
    const currentEntries = current?.codeFiles ?? [];
    const parentEntries = parent?.codeFiles ?? [];
    const currentByIdentity = new Map(currentEntries.map((entry) => [sourceArtifactIdentity(entry), entry]));
    const parentByIdentity = new Map(parentEntries.map((entry) => [sourceArtifactIdentity(entry), entry]));
    const changedCodeFileArtifactIds = [];
    const unchangedCodeFileArtifactIds = [];
    const addedCodeFileArtifactIds = [];
    const removedCodeFileArtifactIds = [];
    for (const [identity, currentEntry] of currentByIdentity) {
        const parentEntry = parentByIdentity.get(identity);
        if (!parentEntry) {
            addedCodeFileArtifactIds.push(primaryCodeFileArtifactId(currentEntry));
            continue;
        }
        if (currentEntry.contentHash &&
            parentEntry.contentHash &&
            currentEntry.contentHash === parentEntry.contentHash) {
            unchangedCodeFileArtifactIds.push(primaryCodeFileArtifactId(currentEntry));
        }
        else if (currentEntry.contentHash &&
            parentEntry.contentHash &&
            currentEntry.contentHash !== parentEntry.contentHash) {
            changedCodeFileArtifactIds.push(primaryCodeFileArtifactId(currentEntry));
        }
        else if (currentEntry.hasContent === parentEntry.hasContent &&
            currentEntry.contentByteLength === parentEntry.contentByteLength &&
            currentEntry.name === parentEntry.name &&
            currentEntry.path === parentEntry.path) {
            unchangedCodeFileArtifactIds.push(primaryCodeFileArtifactId(currentEntry));
        }
        else {
            changedCodeFileArtifactIds.push(primaryCodeFileArtifactId(currentEntry));
        }
    }
    for (const [identity, parentEntry] of parentByIdentity) {
        if (!currentByIdentity.has(identity)) {
            removedCodeFileArtifactIds.push(primaryCodeFileArtifactId(parentEntry));
        }
    }
    const currentFamiliesArtifactId = current?.componentFamiliesArtifactId;
    const parentFamiliesArtifactId = parent?.componentFamiliesArtifactId;
    const currentFamiliesHash = current?.componentFamiliesHash;
    const parentFamiliesHash = parent?.componentFamiliesHash;
    const currentOverrideAssignmentsArtifactId = current?.overrideAssignmentsArtifactId;
    const parentOverrideAssignmentsArtifactId = parent?.overrideAssignmentsArtifactId;
    const currentOverrideAssignmentsHash = current?.overrideAssignmentsHash;
    const parentOverrideAssignmentsHash = parent?.overrideAssignmentsHash;
    const componentFamiliesChanged = changedCodeFileArtifactIds.length > 0 ||
        addedCodeFileArtifactIds.length > 0 ||
        removedCodeFileArtifactIds.length > 0 ||
        currentFamiliesArtifactId !== parentFamiliesArtifactId ||
        currentFamiliesHash !== parentFamiliesHash;
    const overrideAssignmentsChanged = currentOverrideAssignmentsArtifactId !== parentOverrideAssignmentsArtifactId ||
        currentOverrideAssignmentsHash !== parentOverrideAssignmentsHash;
    const capabilityReportChanged = current?.capabilityReportArtifactId !== parent?.capabilityReportArtifactId ||
        current?.capabilityReportHash !== parent?.capabilityReportHash;
    return {
        changedCodeFileArtifactIds,
        unchangedCodeFileArtifactIds,
        addedCodeFileArtifactIds,
        removedCodeFileArtifactIds,
        parentComponentFamiliesArtifactId: parentFamiliesArtifactId,
        currentComponentFamiliesArtifactId: currentFamiliesArtifactId,
        componentFamiliesChanged,
        parentOverrideAssignmentsArtifactId,
        currentOverrideAssignmentsArtifactId,
        overrideAssignmentsChanged,
        capabilityReportChanged,
    };
}
function sourceArtifactIdentity(entry) {
    return entry.id ?? entry.path ?? `${entry.name}:${entry.versionId ?? ""}`;
}
function primaryCodeFileArtifactId(entry) {
    return entry.sourceArtifactId ?? entry.metadataArtifactId ?? entry.artifactId;
}
function allCodeFileArtifactIds(entry) {
    return unique([
        entry.metadataArtifactId,
        entry.sourceArtifactId,
    ].filter((value) => typeof value === "string" && value.length > 0));
}
async function writeSourceArtifacts(exportDir, input) {
    const rootDir = path.join(exportDir, "source-artifacts");
    const codeFilesDir = path.join(rootDir, "code-files");
    await fs.mkdir(codeFilesDir, { recursive: true });
    let componentFamiliesPath;
    let componentFamiliesArtifactId;
    let componentFamiliesHash;
    let overrideAssignmentsPath;
    let overrideAssignmentsArtifactId;
    let overrideAssignmentsHash;
    let capabilityReportPath;
    let capabilityReportArtifactId;
    let capabilityReportHash;
    if ((input.componentFamilies?.length ?? 0) > 0) {
        const serializedFamilies = input.componentFamilies ?? [];
        const target = path.join(rootDir, "component-families.json");
        await writeJsonFile(target, serializedFamilies);
        componentFamiliesPath = relativeToExport(exportDir, target);
        componentFamiliesArtifactId = "source/component-families";
        componentFamiliesHash = createArtifactContentHash(serializedFamilies);
    }
    if ((input.overrideAssignments?.length ?? 0) > 0) {
        const serializedAssignments = input.overrideAssignments ?? [];
        const target = path.join(rootDir, "override-assignments.json");
        await writeJsonFile(target, serializedAssignments);
        overrideAssignmentsPath = relativeToExport(exportDir, target);
        overrideAssignmentsArtifactId = "source/override-assignments";
        overrideAssignmentsHash = createArtifactContentHash(serializedAssignments);
    }
    const capabilityReport = readCapabilityReport(input.pluginCapture);
    if (capabilityReport) {
        const target = path.join(exportDir, "capability-report.json");
        await writeJsonFile(target, capabilityReport);
        capabilityReportPath = relativeToExport(exportDir, target);
        capabilityReportArtifactId = "plugin/capability-report";
        capabilityReportHash = createArtifactContentHash(capabilityReport);
    }
    const codeFiles = await Promise.all((input.codeFiles ?? []).map(async (file, index) => {
        const baseName = createCodeFileArtifactBaseName(file, index);
        const metadataPath = path.join(codeFilesDir, `${baseName}.json`);
        const artifactId = createCodeFileArtifactRoot(file, index);
        const metadataArtifactId = `${artifactId}/metadata`;
        const metadata = {
            id: file.id,
            name: file.name,
            path: file.path,
            versionId: file.versionId,
            exports: file.exports,
            exportDetails: file.exportDetails,
            isDefaultExport: file.isDefaultExport,
            insertURL: file.insertURL,
            source: file.source,
            hasContent: file.hasContent ?? false,
            contentHash: file.contentHash,
            contentByteLength: file.contentByteLength,
        };
        await writeJsonFile(metadataPath, metadata);
        let sourcePath;
        let sourceArtifactId;
        if (typeof file.content === "string" && file.content.length > 0) {
            const extension = inferCodeFileExtension(file);
            const target = path.join(codeFilesDir, `${baseName}${extension}`);
            await writeFile(target, file.content);
            sourcePath = relativeToExport(exportDir, target);
            sourceArtifactId = `${artifactId}/source`;
        }
        return {
            id: file.id,
            name: file.name,
            path: file.path,
            versionId: file.versionId,
            hasContent: file.hasContent ?? Boolean(file.content),
            contentHash: file.contentHash,
            contentByteLength: file.contentByteLength,
            artifactId,
            metadataArtifactId,
            sourceArtifactId,
            metadataPath: relativeToExport(exportDir, metadataPath),
            sourcePath,
        };
    }));
    const manifest = {
        generatedAt: new Date().toISOString(),
        componentFamiliesPath,
        componentFamiliesArtifactId,
        componentFamiliesHash,
        overrideAssignmentsPath,
        overrideAssignmentsArtifactId,
        overrideAssignmentsHash,
        capabilityReportPath,
        capabilityReportArtifactId,
        capabilityReportHash,
        codeFiles,
    };
    await writeJsonFile(path.join(rootDir, "manifest.json"), manifest);
    return manifest;
}
async function writeLegacySourceArtifacts(input) {
    const rootDir = path.join(input.exportDir, "source-artifacts");
    const codeFilesDir = path.join(rootDir, "code-files");
    await fs.mkdir(codeFilesDir, { recursive: true });
    const normalizedCodeFiles = Array.isArray(input.normalizedIr.codeFiles)
        ? input.normalizedIr.codeFiles
        : [];
    const normalizedComponentFamilies = Array.isArray(input.normalizedIr.componentFamilies)
        ? input.normalizedIr.componentFamilies
        : [];
    const normalizedOverrideAssignments = Array.isArray(input.normalizedIr.overrideAssignments)
        ? input.normalizedIr.overrideAssignments
        : [];
    let componentFamiliesPath;
    let componentFamiliesArtifactId;
    let componentFamiliesHash;
    let overrideAssignmentsPath;
    let overrideAssignmentsArtifactId;
    let overrideAssignmentsHash;
    let capabilityReportPath;
    let capabilityReportArtifactId;
    let capabilityReportHash;
    if (normalizedComponentFamilies.length > 0) {
        const target = path.join(rootDir, "component-families.json");
        await writeJsonFile(target, normalizedComponentFamilies);
        componentFamiliesPath = relativeToExport(input.exportDir, target);
        componentFamiliesArtifactId = "source/component-families";
        componentFamiliesHash = createArtifactContentHash(normalizedComponentFamilies);
    }
    if (normalizedOverrideAssignments.length > 0) {
        const target = path.join(rootDir, "override-assignments.json");
        await writeJsonFile(target, normalizedOverrideAssignments);
        overrideAssignmentsPath = relativeToExport(input.exportDir, target);
        overrideAssignmentsArtifactId = "source/override-assignments";
        overrideAssignmentsHash = createArtifactContentHash(normalizedOverrideAssignments);
    }
    const capabilityReport = readCapabilityReport(input.pluginCapture);
    if (capabilityReport) {
        const target = path.join(input.exportDir, "capability-report.json");
        await writeJsonFile(target, capabilityReport);
        capabilityReportPath = relativeToExport(input.exportDir, target);
        capabilityReportArtifactId = "plugin/capability-report";
        capabilityReportHash = createArtifactContentHash(capabilityReport);
    }
    const codeFiles = await Promise.all(normalizedCodeFiles.map(async (file, index) => {
        const normalizedFile = {
            id: typeof file.id === "string" ? file.id : undefined,
            name: typeof file.name === "string" && file.name.length > 0
                ? file.name
                : `CodeFile${index + 1}.tsx`,
            path: typeof file.path === "string" ? file.path : undefined,
            versionId: typeof file.versionId === "string" ? file.versionId : undefined,
            exports: Array.isArray(file.exports)
                ? file.exports.filter((value) => typeof value === "string")
                : undefined,
            exportDetails: Array.isArray(file.exportDetails)
                ? file.exportDetails
                : undefined,
            isDefaultExport: typeof file.isDefaultExport === "boolean"
                ? file.isDefaultExport
                : undefined,
            insertURL: typeof file.insertURL === "string" ? file.insertURL : undefined,
            source: typeof file.source === "string" ? file.source : undefined,
            content: typeof file.content === "string" ? file.content : undefined,
            contentHash: typeof file.contentHash === "string" ? file.contentHash : undefined,
            contentByteLength: typeof file.contentByteLength === "number"
                ? file.contentByteLength
                : undefined,
            hasContent: typeof file.hasContent === "boolean"
                ? file.hasContent
                : typeof file.content === "string" && file.content.length > 0,
        };
        const baseName = createCodeFileArtifactBaseName(normalizedFile, index);
        const metadataPath = path.join(codeFilesDir, `${baseName}.json`);
        const artifactId = createCodeFileArtifactRoot(normalizedFile, index);
        const metadataArtifactId = `${artifactId}/metadata`;
        await writeJsonFile(metadataPath, {
            id: normalizedFile.id,
            name: normalizedFile.name,
            path: normalizedFile.path,
            versionId: normalizedFile.versionId,
            exports: normalizedFile.exports,
            exportDetails: normalizedFile.exportDetails,
            isDefaultExport: normalizedFile.isDefaultExport,
            insertURL: normalizedFile.insertURL,
            source: normalizedFile.source,
            hasContent: normalizedFile.hasContent,
            contentHash: normalizedFile.contentHash,
            contentByteLength: normalizedFile.contentByteLength,
        });
        let sourcePath;
        let sourceArtifactId;
        if (typeof normalizedFile.content === "string" && normalizedFile.content.length > 0) {
            const extension = inferCodeFileExtension(normalizedFile);
            const target = path.join(codeFilesDir, `${baseName}${extension}`);
            await writeFile(target, normalizedFile.content);
            sourcePath = relativeToExport(input.exportDir, target);
            sourceArtifactId = `${artifactId}/source`;
        }
        return {
            id: normalizedFile.id,
            name: normalizedFile.name,
            path: normalizedFile.path,
            versionId: normalizedFile.versionId,
            hasContent: normalizedFile.hasContent,
            contentHash: normalizedFile.contentHash,
            contentByteLength: normalizedFile.contentByteLength,
            artifactId,
            metadataArtifactId,
            sourceArtifactId,
            metadataPath: relativeToExport(input.exportDir, metadataPath),
            sourcePath,
        };
    }));
    const manifest = {
        generatedAt: new Date().toISOString(),
        componentFamiliesPath,
        componentFamiliesArtifactId,
        componentFamiliesHash,
        overrideAssignmentsPath,
        overrideAssignmentsArtifactId,
        overrideAssignmentsHash,
        capabilityReportPath,
        capabilityReportArtifactId,
        capabilityReportHash,
        codeFiles,
    };
    await writeJsonFile(path.join(rootDir, "manifest.json"), manifest);
    return manifest;
}
function readCapabilityReport(pluginCapture) {
    const report = pluginCapture.context?.capabilities?.capabilityReport;
    return report && typeof report === "object"
        ? report
        : null;
}
function createSourceEvidenceSummary(ir, sourceArtifacts) {
    const capabilityReport = readCapabilityReport(ir.pluginCapture);
    const capabilityCodeFiles = capabilityReport?.codeFiles && typeof capabilityReport.codeFiles === "object"
        ? capabilityReport.codeFiles
        : null;
    const codeFileEntries = sourceArtifacts?.codeFiles ?? [];
    const codeFileCount = Math.max(ir.codeFiles?.length ?? 0, codeFileEntries.length);
    const readableCodeFileCount = codeFileEntries.filter((entry) => entry.hasContent).length;
    const unreadableCodeFileCount = Math.max(0, codeFileCount - readableCodeFileCount);
    const overrideAssignmentCount = ir.overrideAssignments?.length ?? 0;
    const unresolvedOverrideCount = (ir.overrideAssignments ?? []).filter((assignment) => assignment.assignmentStatus !== "resolved").length;
    const codeFileApiReadable = typeof capabilityCodeFiles?.readable === "boolean"
        ? capabilityCodeFiles.readable
        : null;
    const reportedCodeFileCount = typeof capabilityCodeFiles?.count === "number" ? capabilityCodeFiles.count : codeFileCount;
    const reportedReadableCodeFileCount = typeof capabilityCodeFiles?.contentReadableCount === "number"
        ? capabilityCodeFiles.contentReadableCount
        : readableCodeFileCount;
    const reasons = [];
    const warnings = [];
    if (reportedCodeFileCount > 0 && codeFileApiReadable === false) {
        reasons.push("code-file-api-unavailable");
    }
    if (reportedCodeFileCount > 0 &&
        reportedReadableCodeFileCount < reportedCodeFileCount) {
        reasons.push("code-file-source-unreadable");
    }
    if (unreadableCodeFileCount > 0 && !reasons.includes("code-file-source-unreadable")) {
        reasons.push("code-file-source-unreadable");
    }
    if (overrideAssignmentCount > 0 && unresolvedOverrideCount > 0) {
        warnings.push("override-assignment-unresolved");
    }
    return {
        status: reasons.length > 0 ? "partial" : "complete",
        reasons,
        warnings,
        codeFileCount: reportedCodeFileCount,
        readableCodeFileCount: reportedReadableCodeFileCount,
        unreadableCodeFileCount: Math.max(unreadableCodeFileCount, reportedCodeFileCount - reportedReadableCodeFileCount),
        overrideAssignmentCount,
        unresolvedOverrideCount,
        capabilityReportPresent: capabilityReport !== null,
        codeFileApiReadable,
    };
}
function collectUnsupportedBehavior(input) {
    const issues = [];
    for (const file of input.codeCompatibilityReport.files) {
        if (file.compatibility === "runtime-fallback-required" ||
            file.compatibility === "unsupported") {
            issues.push({
                kind: file.compatibility,
                scope: "code-file",
                name: file.name,
                reasons: file.reasons,
            });
        }
    }
    for (const warning of input.warnings) {
        if (warning.type === "unsupported_animation") {
            issues.push({
                kind: "unsupported-animation",
                scope: "runtime",
                name: "Motion fidelity",
                reasons: [warning.message],
            });
        }
    }
    return issues;
}
function createUnadaptedCodeFileArtifacts(ir, codeCompatibilityReport) {
    return codeCompatibilityReport.files.flatMap((entry) => {
        if (entry.compatibility !== "runtime-fallback-required" &&
            entry.compatibility !== "unsupported") {
            return [];
        }
        const file = (ir.codeFiles ?? []).find((candidate) => candidate.id === entry.codeFileId ||
            candidate.path === entry.path ||
            candidate.name === entry.name) ?? null;
        const index = file ? (ir.codeFiles ?? []).indexOf(file) : -1;
        const baseName = createCodeFileArtifactBaseName(file ?? { name: entry.name }, index >= 0 ? index : 0);
        const sourcePath = file && (file.hasContent ?? Boolean(file.content))
            ? `unadapted-components/${baseName}${inferCodeFileExtension(file)}`
            : undefined;
        return [
            {
                codeFileId: file?.id ?? entry.codeFileId,
                name: file?.name ?? entry.name,
                compatibility: entry.compatibility,
                reasons: entry.reasons,
                sourcePath,
                metadataPath: `unadapted-components/${baseName}.json`,
            },
        ];
    });
}
async function writeUnadaptedCodeFileArtifacts(exportDir, ir, artifacts) {
    if (artifacts.length === 0)
        return;
    const dir = path.join(exportDir, "unadapted-components");
    await fs.mkdir(dir, { recursive: true });
    for (const artifact of artifacts) {
        const file = (ir.codeFiles ?? []).find((entry) => entry.id === artifact.codeFileId || entry.name === artifact.name) ?? null;
        const metadataTarget = path.join(exportDir, artifact.metadataPath);
        await writeJsonFile(metadataTarget, {
            codeFileId: artifact.codeFileId ?? file?.id ?? null,
            name: artifact.name,
            path: file?.path ?? null,
            compatibility: artifact.compatibility,
            reasons: artifact.reasons,
            exports: file?.exports ?? [],
            exportDetails: file?.exportDetails ?? [],
            sourcePath: artifact.sourcePath ?? null,
            hasContent: file?.hasContent ?? Boolean(file?.content),
            contentHash: file?.contentHash ?? null,
            contentByteLength: file?.contentByteLength ?? null,
        });
        if (!artifact.sourcePath || !file?.content)
            continue;
        const sourceTarget = path.join(exportDir, artifact.sourcePath);
        await fs.mkdir(path.dirname(sourceTarget), { recursive: true });
        await writeFile(sourceTarget, file.content.endsWith("\n") ? file.content : `${file.content}\n`);
    }
}
function createCodeFileArtifactBaseName(file, index) {
    const seed = file.contentHash ??
        file.id ??
        file.path ??
        `${file.name || "code-file"}-${index}`;
    return slugSegment(seed);
}
function createCodeFileArtifactRoot(file, index) {
    return `source/code-file/${createCodeFileArtifactBaseName(file, index)}`;
}
function inferCodeFileExtension(file) {
    const explicit = file.path ? path.extname(file.path).trim() : "";
    if (explicit)
        return explicit.startsWith(".") ? explicit : `.${explicit}`;
    const names = new Set((file.exportDetails ?? [])
        .map((entry) => entry?.type)
        .filter((value) => typeof value === "string"));
    if (names.has("override") || names.has("component"))
        return ".tsx";
    return ".ts";
}
function slugSegment(value) {
    const trimmed = value.trim().toLowerCase();
    const normalized = trimmed.replace(/[^a-z0-9._-]+/g, "-").replace(/^-+|-+$/g, "");
    return normalized || "artifact";
}
function unique(values) {
    return Array.from(new Set(values));
}
function summarizeStyleExtraction(ir) {
    const runtimeNodes = ir.runtimeCapture.nodes;
    const componentNodes = ir.component.nodes;
    const nonMetaEntries = (styles) => Object.keys(styles).filter((key) => !key.startsWith("__coderelay"));
    const styledRuntimeNodes = runtimeNodes.filter((node) => nonMetaEntries(node.styles).length > 0);
    const styledComponentNodes = componentNodes.filter((node) => nonMetaEntries(node.styles).length > 0);
    const surfaceNodes = componentNodes.filter((node) => isVisualSurfaceNode(node));
    return {
        runtimeNodeCount: runtimeNodes.length,
        componentNodeCount: componentNodes.length,
        runtimeNodesWithStyles: styledRuntimeNodes.length,
        componentNodesWithStyles: styledComponentNodes.length,
        visualSurfaceNodeCount: surfaceNodes.length,
        topStyledNodes: styledComponentNodes.slice(0, 12).map((node) => ({
            id: node.id,
            tag: node.tag,
            text: node.text?.slice(0, 80),
            styleKeys: nonMetaEntries(node.styles),
        })),
    };
}
function summarizeMotionExtraction(ir) {
    const runtimeNodesWithMotion = ir.runtimeCapture.nodes.filter((node) => hasMotionStyles(node.motion) || hasInteractionStateStyles(node.interactionStyles));
    const exportNodesWithMotion = flattenExportTree(ir.exportTree ?? []).filter((node) => hasMotionStyles(node.motion) || hasInteractionStateStyles(node.interactionStyles));
    return {
        runtimeNodesWithMotion: runtimeNodesWithMotion.length,
        exportNodesWithMotion: exportNodesWithMotion.length,
        topMotionNodes: runtimeNodesWithMotion.slice(0, 12).map((node) => ({
            id: node.id,
            tag: node.tag,
            text: node.text?.slice(0, 80),
            motion: node.motion,
            interactionStyles: node.interactionStyles,
        })),
    };
}
function hasMotionStyles(motion) {
    if (!motion)
        return false;
    return Object.values(motion).some((value) => typeof value === "string" &&
        value.trim().length > 0 &&
        value !== "all 0s ease 0s" &&
        value !== "0s" &&
        value !== "none" &&
        value !== "normal" &&
        value !== "1" &&
        value !== "running");
}
function hasInteractionStateStyles(interactionStyles) {
    if (!interactionStyles)
        return false;
    return ["hover", "focus"].some((state) => {
        const styles = interactionStyles[state];
        return Boolean(styles && Object.values(styles).some((value) => Boolean(value)));
    });
}
function flattenExportTree(nodes) {
    return nodes.flatMap((node) => [node, ...flattenExportTree(node.children)]);
}
function isVisualSurfaceNode(node) {
    if (node.text?.trim())
        return false;
    if (node.tag === "img" || node.tag === "a" || node.tag === "button") {
        return false;
    }
    return Boolean(node.styles.backgroundColor ||
        node.styles.backgroundImage ||
        node.styles.border ||
        node.styles.borderRadius ||
        node.styles.boxShadow);
}
function cloneWorkingAttemptState(state) {
    return {
        ir: structuredClone(state.ir),
        strategy: { ...state.strategy },
    };
}
function collectComparableFidelityMetrics(fidelity) {
    const metrics = [
        { key: "layout", best: fidelity.layout },
        { key: "typography", best: fidelity.typography },
        { key: "color", best: fidelity.color },
        { key: "assets", best: fidelity.assets },
        { key: "motion", best: fidelity.motion },
        { key: "nodeMatch", best: fidelity.nodeMatch },
        { key: "desktop", best: fidelity.desktop },
        { key: "laptop", best: fidelity.laptop },
        { key: "tablet", best: fidelity.tablet },
        { key: "mobile", best: fidelity.mobile },
    ];
    return metrics.filter((entry) => typeof entry.best === "number");
}
function readComparableFidelityMetric(fidelity, key) {
    const value = fidelity[key];
    return typeof value === "number" ? value : undefined;
}
function createReadme(ir, bestAttempt) {
    const isRuntimeKeptFullSite = ir.exportMode === "full-site";
    return `# ${ir.componentName}

Generated by Coderelay from:

${ir.sourceUrl}

## Run locally

\`\`\`bash
npm ci
npm run dev
\`\`\`

This export is a Vite + React + TypeScript project using CSS Modules and Framer Motion.

${isRuntimeKeptFullSite
        ? "For full-site exports, Coderelay now treats the generated project as a runtime-kept, agent-first handoff. Preserve fidelity first; simplify only when validation still passes."
        : "This export favors reconstructed React that a human or agent can refine."}

## Important files

- \`src/App.tsx\`
- \`src/main.tsx\`
- \`src/styles.css\`
- \`pages/\`
- \`components/\`
- \`framer-modules/\`
- \`framer-component-modules.json\`
- \`framer-code-files.json\`
- \`framer-fonts.json\`
- \`framer-cms-collections.json\`
- \`raw-runtime-capture.json\`
- \`framer-tree.json\`
- \`export-tree.json\`
- \`asset-manifest.json\`
- \`runtime-localization-report.json\`
- \`runtime-strategy-manifest.json\`
- \`agent-handoff-manifest.json\`
- \`patch-history.json\`
- \`export-report.json\`
- \`debug/manifest.json\`
- \`AGENT_BRIEF.md\`

## Fidelity

- Best attempt: ${bestAttempt.attemptNumber} (${bestAttempt.strategy})
- Overall: ${bestAttempt.fidelity.overall}%
- Desktop: ${bestAttempt.fidelity.desktop}%
- Mobile: ${bestAttempt.fidelity.mobile}%
- Capture mode: ${ir.captureMode ?? "plugin-only"}
- Export engine: ${ir.exportEngine ?? "plugin-approximation"}
- Framer component modules: ${ir.componentModules?.length ?? 0}
- Framer code files: ${ir.codeFiles?.length ?? 0}
- Framer fonts: ${ir.fonts?.length ?? 0}
- Framer CMS collections: ${ir.cmsCollections?.length ?? 0}
- Runtime breakpoints captured: ${ir.runtimeCapture.captureDiagnostics?.breakpointsCaptured?.join(", ") || "none"}
- Framer tree nodes: ${ir.framerTree?.length ?? 0}
- Export tree nodes: ${ir.exportTreeDiagnostics?.totalNodes ?? 0}

Review \`export-report.json\` before editing. For full-site exports, also read \`runtime-strategy-manifest.json\`, \`agent-handoff-manifest.json\`, and \`runtime-localization-report.json\`.
`;
}
function createAgentBrief(ir, bestAttempt) {
    const isRuntimeKeptFullSite = ir.exportMode === "full-site";
    return `# Agent Brief

This code was exported from a Framer design. Preserve visual fidelity unless instructed otherwise.

## Main files

- Preview app: \`src/App.tsx\`
- Pages: \`pages/\`
- Components: \`components/\`
- Framer remote module wrappers: \`framer-modules/\`
- Framer component manifest: \`framer-component-modules.json\`
- Framer code file manifest: \`framer-code-files.json\`
- Framer font manifest: \`framer-fonts.json\`
- Framer CMS manifest: \`framer-cms-collections.json\`
- Raw runtime capture: \`raw-runtime-capture.json\`
- Framer tree manifest: \`framer-tree.json\`
- Merged export tree manifest: \`export-tree.json\`
- Asset manifest: \`asset-manifest.json\`
- Runtime localization report: \`runtime-localization-report.json\`
- Runtime strategy manifest: \`runtime-strategy-manifest.json\`
- Agent handoff manifest: \`agent-handoff-manifest.json\`
- Patch history: \`patch-history.json\`
- Debug artifact manifest: \`debug/manifest.json\`
- Shared preview styles: \`src/styles.css\`
- Report: \`export-report.json\`

## Guidance

- Start by reading \`export-report.json\`.
- Keep spacing, typography, and responsive behavior close to the original.
- Reconnect forms, analytics, custom embeds, and advanced motion manually if needed.
- ${isRuntimeKeptFullSite
        ? "This full-site export is runtime-kept and optimized for agent follow-on work. Treat route completeness and behavior parity as the top constraints."
        : "This reconstructed export is intended to be refined as regular React code."}
- Capture mode: \`${ir.captureMode ?? "plugin-only"}\`.
- Export engine: \`${ir.exportEngine ?? "plugin-approximation"}\`.
- Component modules detected: ${ir.componentModules?.length ?? 0}.
- Code files detected: ${ir.codeFiles?.length ?? 0}.
- Fonts detected: ${ir.fonts?.length ?? 0}.
- CMS collections detected: ${ir.cmsCollections?.length ?? 0}.
- Tree nodes preserved: ${ir.framerTree?.length ?? 0}.
- Merged export tree nodes: ${ir.exportTreeDiagnostics?.totalNodes ?? 0}.
- Best attempt was ${bestAttempt.attemptNumber} using \`${bestAttempt.strategy}\`.
- Intended editor: \`${isRuntimeKeptFullSite ? "agent-first" : "human-or-agent"}\`.
`;
}
function average(values) {
    if (values.length === 0) {
        return 0;
    }
    return Number((values.reduce((sum, value) => sum + value, 0) / values.length).toFixed(3));
}
