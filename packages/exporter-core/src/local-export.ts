import { copy, mkdirp } from "fs-extra";
import { spawn } from "node:child_process";
import crypto from "node:crypto";
import fs, { writeFile } from "node:fs/promises";
import { createServer } from "node:http";
import path from "node:path";
import { chromium } from "playwright";
import { PNG } from "pngjs";
import { generateNextProject } from "../../codegen/src/next-project.js";
import { compareGeneratedPreview } from "../../fidelity/src/compare.js";
import { matchPluginNodesToDom } from "../../matcher/src/match.js";
import type {
  ComparisonDiagnostics,
  ExportAttemptResult,
  ExportIR,
  ExportMode,
  ExportTreeNode,
  FramerTreeNode,
  MotionStyles,
  ExportWarning,
  FidelityScores,
  FramerCodeFile,
  PluginCanvasCapture,
  PreviewValidationResult,
  RuntimeCapture,
  RuntimeNode,
} from "../../shared/src/types.js";
import {
  captureRuntime,
  captureRuntimeRoutes,
  createSimulatedPluginCapture,
} from "./capture.js";
import { buildIntermediateRepresentation } from "./ir.js";
import { zipDirectory } from "./package.js";
import {
  applyAttemptPlan,
  baselineStrategy,
  buildAttemptPlan,
  detectAttemptPlateau,
} from "./attempt-planner.js";
type LocalExportInput = {
  url?: string;
  pluginCapture?: PluginCanvasCapture;
  outDir: string;
  name?: string;
  selector?: string;
  exportMode?: ExportMode;
  maxAttempts: number;
  targetFidelity: number;
  revisionRequest?: {
    kind?: "initial" | "improvement";
    requestedFocus?: "responsiveness" | "components" | "both" | "revalidate";
    parentJobId?: string;
    parentRevisionId?: string;
  };
  onProgress?: (progress: {
    stage: string;
    completed?: number;
    total?: number;
    routePath?: string;
    failed?: number;
  }) => void | Promise<void>;
};

type LocalExportResult = {
  exportDir: string;
  zipPath: string;
  reportPath: string;
  previewPath: string;
  bestAttempt: ExportAttemptResult;
  validation: GeneratedProjectValidation;
  revisionManifestPath?: string;
  invalidationPlanPath?: string;
  artifactIndexPath?: string;
  responsiveRecapturePlanPath?: string;
  revisionCacheHit?: boolean;
};

export type GeneratedProjectValidation = {
  status: "passed";
  generatedFileCount: number;
  tsxBytes: number;
  cssBytes: number;
  previewHtmlBytes: number;
  buildDurationMs: number;
  renderedElementCount: number;
  renderedTextLength: number;
  consoleErrors: string[];
  pageErrors: string[];
  routes: Array<{
    path: string;
    sourceTextLength: number;
    sourceNodeCount: number;
    renderedElementCount: number;
    renderedTextLength: number;
    screenshotColorCount: number;
  }>;
};

type DebugArtifactsManifest = {
  manifestPath: string;
  bestAttempt: number;
  sourceScreenshots: string[];
  attempts: Array<{
    attempt: number;
    dir: string;
    compareDiagnostics?: string;
    generatedScreenshots: string[];
    summary: string;
  }>;
};

type SourceArtifactsManifest = {
  generatedAt: string;
  componentFamiliesPath?: string;
  componentFamiliesArtifactId?: string;
  codeFiles: Array<{
    id?: string;
    name: string;
    path?: string;
    versionId?: string;
    hasContent: boolean;
    contentHash?: string;
    contentByteLength?: number;
    artifactId: string;
    metadataPath: string;
    sourcePath?: string;
  }>;
};

type SourceArtifactDiff = {
  changedCodeFileArtifactIds: string[];
  unchangedCodeFileArtifactIds: string[];
  addedCodeFileArtifactIds: string[];
  removedCodeFileArtifactIds: string[];
  parentComponentFamiliesArtifactId?: string;
  currentComponentFamiliesArtifactId?: string;
  componentFamiliesChanged: boolean;
};

type ResponsiveRecapturePlan = {
  schemaVersion: 1;
  captureSchemaVersion: "runtime-capture-v2";
  generatedAt: string;
  kind: "initial" | "improvement";
  requestedFocus:
    | "responsiveness"
    | "components"
    | "both"
    | "revalidate"
    | null;
  parentRevisionId: string | null;
  breakpointsCaptured: ViewportName[];
  targetViewports: ViewportName[];
  reuseDesktopCapture: boolean;
  templateCount: number;
  routeCount: number;
  templates: Array<{
    templateId: string;
    templatePath: string;
    templateKind: "static" | "cms" | "component";
    routeCount: number;
    representativeRoutePaths: string[];
    memberRoutePaths: string[];
    responsiveCapturePolicy: "all-viewports" | "representative-viewports";
    routesToCapture: string[];
    viewports: ViewportName[];
    reasons: string[];
  }>;
};

type BestAttemptResetInput = {
  current: FidelityScores;
  best: FidelityScores;
  targetFidelity: number;
};

type ComparableFidelityKey =
  | "layout"
  | "typography"
  | "color"
  | "assets"
  | "motion"
  | "nodeMatch"
  | "desktop"
  | "laptop"
  | "tablet"
  | "mobile";

export async function runLocalExport(
  input: LocalExportInput,
): Promise<LocalExportResult> {
  if (!input.exportMode) {
    throw new Error(
      "Missing exportMode: CLI/plugin did not pass exportMode into runLocalExport.",
    );
  }
  if (!input.url && !input.pluginCapture) {
    throw new Error(
      "Missing URL and plugin capture: export cannot determine a source.",
    );
  }
  if (
    input.exportMode === "full-site" &&
    (!input.url || !/^https?:\/\//.test(input.url))
  ) {
    throw new Error(
      "Missing published URL: full-site export requires an http(s) Framer site.",
    );
  }
  const capturedPluginPayload =
    input.pluginCapture ??
    ({
      mode: "simulated",
      selectedNodes: [],
      capturedAt: new Date().toISOString(),
    } satisfies PluginCanvasCapture);
  const pluginCapture =
    input.exportMode === "full-site"
      ? { ...capturedPluginPayload, selectedNodes: [] }
      : capturedPluginPayload;
  console.log(
    "[coderelay:core:input]",
    JSON.stringify({
      url: input.url,
      selector: input.selector,
      exportMode: input.exportMode,
      maxAttempts: input.maxAttempts,
      targetFidelity: input.targetFidelity,
      pluginNodeCount: pluginCapture.selectedNodes.length,
    }),
  );

  const timestamp = new Date().toISOString().replaceAll(/[:.]/g, "-");
  const runDir = path.resolve(input.outDir, timestamp);
  const workDir = path.join(runDir, "work");
  const attemptsDir = path.join(runDir, "attempts");
  const exportDir = path.join(runDir, "export");
  const sharedRevisionCacheRoot = resolveSharedRevisionCacheRoot(input.outDir);

  await mkdirp(workDir);
  await mkdirp(attemptsDir);
  await mkdirp(exportDir);

  const revalidateOnlyRevision = await tryReuseParentRevisionForValidation({
    exportDir,
    runDir,
    sharedRevisionCacheRoot,
    revisionRequest: input.revisionRequest,
    targetFidelity: input.targetFidelity,
    maxAttempts: input.maxAttempts,
  });
  if (revalidateOnlyRevision) {
    return revalidateOnlyRevision;
  }

  const canCaptureFromUrl =
    typeof input.url === "string" &&
    /^https?:\/\//.test(input.url) &&
    input.url.length > 0;
  const runtimeCapture = canCaptureFromUrl
    ? input.exportMode === "full-site"
      ? await captureRuntimeRoutes({
          originUrl: input.url!,
          routes: readFullSiteRouteManifest(pluginCapture),
          workDir,
          cacheDir: path.join(input.outDir, ".capture-cache"),
          onProgress: (progress) =>
            input.onProgress?.({ stage: "Capturing routes", ...progress }),
        })
      : await captureRuntime({
          url: input.url!,
          workDir,
          selector: input.selector,
        })
    : createRuntimeCaptureFromPluginContext(pluginCapture);
  console.log(
    "[coderelay:core:capture]",
    JSON.stringify({
      captureMode: canCaptureFromUrl ? "runtime-first" : "plugin-only",
      runtimeNodeCount: runtimeCapture.nodes.length,
      viewportNodeCounts: runtimeCapture.captureDiagnostics?.nodeCount,
      routeCount: runtimeCapture.routeCaptures?.length ?? 1,
      framerStyleCssBytes: Buffer.byteLength(
        runtimeCapture.framerStyleCss ?? "",
      ),
    }),
  );
  if (!input.pluginCapture && input.exportMode !== "full-site") {
    pluginCapture.selectedNodes =
      createSimulatedPluginCapture(runtimeCapture.nodes).selectedNodes;
  }
  const sourceUrl = input.url ?? runtimeCapture.url;
  const nodeMatches =
    input.exportMode === "full-site"
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
  const currentSourceArtifactsPreview = createSourceArtifactsPreview(ir);
  const parentSourceArtifacts = await readParentSourceArtifacts(
    sharedRevisionCacheRoot,
    input.revisionRequest?.parentRevisionId,
  );
  const currentSourceDiff = createSourceArtifactDiff(
    currentSourceArtifactsPreview,
    parentSourceArtifacts,
  );
  const stableRevisionSummary = createStableRevisionSummary(ir);
  const revisionId = createRevisionId({
    stableRevisionSummary,
    exportMode: ir.exportMode,
    name: input.name ?? null,
    selector: input.selector ?? null,
    maxAttempts: input.maxAttempts,
    targetFidelity: input.targetFidelity,
    revisionRequest: input.revisionRequest ?? null,
  });
  const revisionCacheDir = path.join(
    sharedRevisionCacheRoot,
    revisionId,
  );
  const cachedRevision = await readCachedRevision(revisionCacheDir);
  if (cachedRevision) {
    await copy(cachedRevision.exportDir, exportDir);
    const cachedReportPath = path.join(exportDir, "export-report.json");
    try {
      const cachedReport = JSON.parse(
        await fs.readFile(cachedReportPath, "utf8"),
      ) as Record<string, unknown>;
      cachedReport.revisionCacheHit = true;
      await writeFile(cachedReportPath, `${JSON.stringify(cachedReport, null, 2)}\n`);
    } catch {
      // Keep the cached export usable even if the report cannot be patched.
    }
    const zipPath = path.join(runDir, `${ir.componentName}.zip`);
    await zipDirectory(exportDir, zipPath);
    return {
      exportDir,
      zipPath,
      reportPath: path.join(exportDir, "export-report.json"),
      previewPath: path.join(exportDir, "preview.html"),
      bestAttempt: cachedRevision.bestAttempt,
      validation: cachedRevision.validation,
      revisionManifestPath: path.join(exportDir, "revision-manifest.json"),
      invalidationPlanPath: path.join(exportDir, "invalidation-plan.json"),
      artifactIndexPath: path.join(exportDir, "artifact-index.json"),
      revisionCacheHit: true,
    };
  }
  const noopComponentRevision =
    await tryReuseParentRevisionForUnchangedComponentSource({
      exportDir,
      runDir,
      sharedRevisionCacheRoot,
      revisionId,
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
  console.log(
    "[coderelay:core:strategy]",
    JSON.stringify({
      exportMode: ir.exportMode,
      exportEngine: ir.exportEngine,
      componentName: ir.componentName,
      sitePageCount: ir.sitePages?.length ?? 0,
      componentModuleCount: ir.componentModules?.length ?? 0,
      codeFileCount: ir.codeFiles?.length ?? 0,
      cmsCollectionCount: ir.cmsCollections?.length ?? 0,
      exportTreeRootCount: ir.exportTree?.length ?? 0,
    }),
  );
  const attempts = await runAttempts({
    ir,
    attemptsDir,
    maxAttempts: input.maxAttempts,
    targetFidelity: input.targetFidelity,
  });
  const bestAttempt = selectBestAttempt(attempts);
  if (
    input.exportMode === "full-site" &&
    (bestAttempt.previewValidation?.summary.inspectedNodes ?? 0) > 0 &&
    (bestAttempt.previewValidation?.summary.foundNodes ?? 0) === 0
  ) {
    throw new Error(
      "Generated export failed validation: none of the runtime-derived nodes were found in the generated preview.",
    );
  }
  const validation = await validateGeneratedProject(bestAttempt.projectDir);

  await copy(bestAttempt.projectDir, exportDir);
  const debugArtifacts = await bundleDebugArtifacts({
    workDir,
    attemptsDir,
    exportDir,
    attempts,
    bestAttempt,
  });
  const sourceArtifacts = await writeSourceArtifacts(exportDir, ir);
  const responsiveRecapturePlan = createResponsiveRecapturePlan(
    ir,
    input.revisionRequest,
  );
  const report = createReport(
    ir,
    attempts,
    bestAttempt,
    debugArtifacts,
    validation,
    revisionId,
    false,
    input.revisionRequest,
    sourceArtifacts,
    responsiveRecapturePlan,
  );
  await mkdirp(revisionCacheDir);
  await writeFile(
    path.join(exportDir, "best-attempt.json"),
    `${JSON.stringify(bestAttempt, null, 2)}\n`,
  );
  await writeFile(
    path.join(exportDir, "generated-validation.json"),
    `${JSON.stringify(validation, null, 2)}\n`,
  );
  await writeFile(
    path.join(exportDir, "raw-plugin-payload.json"),
    `${JSON.stringify(pluginCapture, null, 2)}\n`,
  );
  await writeFile(
    path.join(exportDir, "raw-runtime-capture.json"),
    `${JSON.stringify(runtimeCapture, null, 2)}\n`,
  );
  await writeFile(
    path.join(exportDir, "normalized-ir.json"),
    `${JSON.stringify(createNormalizedIrArtifact(ir), null, 2)}\n`,
  );
  if (responsiveRecapturePlan) {
    await writeJsonFile(
      path.join(exportDir, "responsive-recapture-plan.json"),
      responsiveRecapturePlan,
    );
  }
  const reportPath = path.join(exportDir, "export-report.json");
  await writeFile(reportPath, `${JSON.stringify(report, null, 2)}\n`);
  await writeFile(
    path.join(exportDir, "patch-history.json"),
    `${JSON.stringify(createPatchHistory(attempts), null, 2)}\n`,
  );
  await writeFile(
    path.join(exportDir, "README.md"),
    createReadme(ir, bestAttempt),
  );
  await writeFile(
    path.join(exportDir, "AGENT_BRIEF.md"),
    createAgentBrief(ir, bestAttempt),
  );

  const previewPath = path.join(exportDir, "preview.html");
  const attemptPreviewPath = path.join(bestAttempt.projectDir, "preview.html");
  try {
    await fs.copyFile(attemptPreviewPath, previewPath);
  } catch {
    await writeFile(
      previewPath,
      `<!doctype html><html><body><pre>preview.html was not generated for this attempt.</pre></body></html>\n`,
    );
  }

  await writeFile(
    path.join(exportDir, "revision-manifest.json"),
    `${JSON.stringify(
      {
        ...createRevisionManifest(ir, attempts, bestAttempt, revisionId),
        revisionRequest: input.revisionRequest ?? null,
        normalizedIr,
        sourceArtifacts,
        responsiveRecapturePlan,
      },
      null,
      2,
    )}\n`,
  );
  const invalidationPlan = createInvalidationPlan({
    revisionRequest: input.revisionRequest,
    sourceArtifacts,
    parentSourceArtifacts,
    codeFileCount: ir.codeFiles?.length ?? 0,
    routeTemplateCount: ir.routeTemplates?.length ?? 0,
    componentFamilyCount: ir.componentFamilies?.length ?? 0,
  });
  await writeJsonFile(
    path.join(exportDir, "invalidation-plan.json"),
    invalidationPlan,
  );
  await writeJsonFile(
    path.join(exportDir, "artifact-index.json"),
    await createArtifactIndex(exportDir, sourceArtifacts),
  );
  await copy(exportDir, path.join(revisionCacheDir, "export"));

  const zipPath = path.join(runDir, `${ir.componentName}.zip`);
  await zipDirectory(exportDir, zipPath);

  return {
    exportDir,
    zipPath,
    reportPath,
    previewPath,
    bestAttempt,
    validation,
    revisionManifestPath: path.join(exportDir, "revision-manifest.json"),
    invalidationPlanPath: path.join(exportDir, "invalidation-plan.json"),
    artifactIndexPath: path.join(exportDir, "artifact-index.json"),
    responsiveRecapturePlanPath: responsiveRecapturePlan
      ? path.join(exportDir, "responsive-recapture-plan.json")
      : undefined,
    revisionCacheHit: false,
  };
}

function compactMaterializedRouteCaptures(runtimeCapture: RuntimeCapture) {
  for (const capture of runtimeCapture.routeCaptures ?? []) {
    capture.nodes = [];
    capture.nodesByViewport = undefined;
    capture.framerStyleCss = undefined;
  }
}

export function createNormalizedIrArtifact(ir: ExportIR) {
  return {
    ...ir,
    artifactFormat: "summary",
    artifactNote:
      "Materialized node trees are stored in export-tree.json and generated page files.",
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
      templateKind: page.templateKind,
    })),
  };
}

function countExportTreeNodes(nodes: ExportTreeNode[]): number {
  return nodes.reduce(
    (total, node) => total + 1 + countExportTreeNodes(node.children ?? []),
    0,
  );
}

export function readFullSiteRouteManifest(pluginCapture?: PluginCanvasCapture) {
  type RouteManifestEntry = {
    path: string;
    title?: string;
    collectionId?: string;
    templateId?: string;
    templatePath?: string;
    templateKind?: "static" | "cms" | "component";
  };
  const pages = Array.isArray(pluginCapture?.context?.sitePages)
    ? pluginCapture.context.sitePages
    : [];
  const collections = Array.isArray(pluginCapture?.context?.cmsCollections)
    ? pluginCapture.context.cmsCollections
    : [];
  const routes: RouteManifestEntry[] = pages
    .map((page) => {
      const record =
        page && typeof page === "object"
          ? (page as Record<string, unknown>)
          : {};
      const metadata =
        record.metadata && typeof record.metadata === "object"
          ? (record.metadata as Record<string, unknown>)
          : {};
      const pathValue = [
        record.routePath,
        record.path,
        record.pathname,
        record.pagePath,
        record.route,
        record.slug,
        record.url,
        metadata.routePath,
        metadata.path,
        metadata.pathname,
        metadata.pagePath,
      ].find((value) => typeof value === "string" && value.trim());
      const titleValue = [
        record.name,
        record.title,
        record.pageTitle,
        record.displayName,
        metadata.name,
        metadata.title,
      ].find((value) => typeof value === "string" && value.trim());
      return {
        path: typeof pathValue === "string" ? pathValue : "",
        title: typeof titleValue === "string" ? titleValue : undefined,
        collectionId:
          typeof record.collectionId === "string"
            ? record.collectionId
            : typeof metadata.collectionId === "string"
              ? metadata.collectionId
              : undefined,
        templatePath:
          typeof record.path === "string" && record.path.trim()
            ? record.path.trim()
            : typeof metadata.path === "string" && metadata.path.trim()
              ? metadata.path.trim()
              : undefined,
      };
    })
    .filter(
      (route) =>
        route.path &&
        !/^\/?drafts(?:\/|$)/i.test(route.path) &&
        !/^\/?404\/?$/i.test(route.path),
    )
    .flatMap((route): RouteManifestEntry[] => {
      if (!route.path.includes(":slug")) {
        return [
          {
            ...route,
            templateId: route.templatePath ?? route.path,
            templateKind: "static",
            templatePath: route.templatePath ?? route.path,
          },
        ];
      }
      if (!route.collectionId) {
        return [
          {
            ...route,
            templateId: route.templatePath ?? route.path,
            templateKind: "cms",
            templatePath: route.templatePath ?? route.path,
          },
        ];
      }
      const collection = collections.find((entry) => {
        const record =
          entry && typeof entry === "object"
            ? (entry as Record<string, unknown>)
            : {};
        return record.id === route.collectionId;
      });
      const collectionRecord =
        collection && typeof collection === "object"
          ? (collection as Record<string, unknown>)
          : {};
      const items = Array.isArray(collectionRecord.items)
        ? collectionRecord.items
        : [];
      const expanded = items
        .map<RouteManifestEntry | null>((item) => {
          const record =
            item && typeof item === "object"
              ? (item as Record<string, unknown>)
              : {};
          const slug = typeof record.slug === "string" ? record.slug.trim() : "";
          if (!slug) return null;
          return {
            path: route.path.replace(":slug", encodeURIComponent(slug)),
            title: route.title ? `${route.title} - ${slug}` : slug,
            collectionId: route.collectionId,
            templateId: route.templatePath ?? route.path,
            templatePath: route.templatePath ?? route.path,
            templateKind: "cms",
          };
        })
        .filter((entry): entry is RouteManifestEntry => entry !== null);
      return expanded.length > 0
        ? expanded
        : [
            {
              ...route,
              templateId: route.templatePath ?? route.path,
              templateKind: "cms",
              templatePath: route.templatePath ?? route.path,
            },
          ];
    });
  return routes.length > 0 ? routes : [{ path: "/", title: "Home" }];
}

export async function validateGeneratedProject(
  projectDir: string,
): Promise<GeneratedProjectValidation> {
  const generated = await summarizeGeneratedProject(projectDir);
  console.log(
    "[coderelay:core:generated-files]",
    JSON.stringify(generated),
  );

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
    const installArgs =
      packageManager === "pnpm"
        ? ["install", "--config.dangerouslyAllowAllBuilds=true"]
        : ["install", "--ignore-scripts", "--no-audit", "--no-fund"];
    const install = await runCommand(
      packageManager,
      installArgs,
      projectDir,
      180_000,
    );
    console.log(
      "[coderelay:core:install]",
      JSON.stringify({
        exitCode: install.exitCode,
        packageManager,
        durationMs: install.durationMs,
        stdout: tail(install.stdout, 2_000),
        stderr: tail(install.stderr, 2_000),
      }),
    );
    if (install.exitCode !== 0) {
      throw new Error(
        `Generated export dependency install failed.\n${tail(
          install.stderr || install.stdout,
          4_000,
        )}`,
      );
    }

    const build = await runCommand(
      packageManager,
      ["run", "build"],
      projectDir,
      300_000,
    );
    console.log(
      "[coderelay:core:build]",
      JSON.stringify({
        exitCode: build.exitCode,
        durationMs: build.durationMs,
        stdout: tail(build.stdout, 4_000),
        stderr: tail(build.stderr, 4_000),
      }),
    );
    if (build.exitCode !== 0) {
      throw new Error(
        `Generated export build failed.\n${tail(
          build.stderr || build.stdout,
          8_000,
        )}`,
      );
    }

    const routeManifest = await readGeneratedRouteManifest(projectDir);
    const runtime = await inspectBuiltProject(
      path.join(projectDir, "dist"),
      routeManifest,
    );
    console.log(
      "[coderelay:core:runtime]",
      JSON.stringify({
        rootChildCount: runtime.rootChildCount,
        renderedElementCount: runtime.renderedElementCount,
        renderedTextLength: runtime.renderedTextLength,
        consoleErrorCount: runtime.consoleErrors.length,
        pageErrorCount: runtime.pageErrors.length,
        routeCount: runtime.routes.length,
        failedRouteCount: runtime.routes.filter(
          (route) =>
            route.rootChildCount === 0 || route.renderedElementCount === 0,
        ).length,
      }),
    );
    if (runtime.rootChildCount === 0 || runtime.renderedElementCount === 0) {
      throw new Error(
        `Generated export rendered a blank root (children=${runtime.rootChildCount}, visibleElements=${runtime.renderedElementCount}).`,
      );
    }
    if (runtime.pageErrors.length > 0) {
      throw new Error(
        `Generated export crashed at runtime.\n${runtime.pageErrors.join("\n")}`,
      );
    }
    const emptyRoute = runtime.routes.find(
      (route) =>
        (route.sourceTextLength > 0 && route.renderedTextLength === 0) ||
        (route.sourceTextLength >= 200 &&
          route.renderedTextLength / route.sourceTextLength < 0.5) ||
        (route.sourceTextLength > 0 &&
          route.sourceNodeCount >= 5 &&
          route.renderedElementCount < 3) ||
        (route.sourceTextLength > 0 &&
          route.sourceNodeCount >= 5 &&
          route.screenshotColorCount < 3),
    );
    if (emptyRoute) {
      throw new Error(
        `Generated export route ${emptyRoute.path} is near-empty ` +
          `(sourceText=${emptyRoute.sourceTextLength}, renderedText=${emptyRoute.renderedTextLength}, ` +
          `sourceNodes=${emptyRoute.sourceNodeCount}, visibleElements=${emptyRoute.renderedElementCount}, ` +
          `screenshotColors=${emptyRoute.screenshotColorCount}).`,
      );
    }

    return {
      status: "passed",
      ...generated,
      buildDurationMs: Date.now() - startedAt,
      renderedElementCount: runtime.renderedElementCount,
      renderedTextLength: runtime.renderedTextLength,
      consoleErrors: runtime.consoleErrors,
      pageErrors: runtime.pageErrors,
      routes: runtime.routes,
    };
  } finally {
    // Keep package-lock.json and dist, but never ship installed dependencies.
    await fs.rm(path.join(projectDir, "node_modules"), {
      recursive: true,
      force: true,
    });
  }
}

async function resolvePackageManager(projectDir: string): Promise<"npm" | "pnpm"> {
  const requested = process.env.CODERELAY_PACKAGE_MANAGER;
  const candidates =
    requested === "npm" || requested === "pnpm"
      ? ([requested] as const)
      : (["npm", "pnpm"] as const);

  for (const candidate of candidates) {
    try {
      const result = await runCommand(candidate, ["--version"], projectDir, 10_000);
      if (result.exitCode === 0) return candidate;
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
    }
  }

  throw new Error(
    "Generated export validation requires npm or pnpm, but neither command is available.",
  );
}

async function readGeneratedRouteManifest(projectDir: string) {
  const manifestPath = path.join(projectDir, "route-manifest.json");
  const parsed = await fs
    .readFile(manifestPath, "utf8")
    .then((content) => JSON.parse(content) as unknown)
    .catch(() => []);
  if (!Array.isArray(parsed) || parsed.length === 0) {
    return [{ path: "/", sourceTextLength: 0, sourceNodeCount: 0 }];
  }
  return parsed.map((entry) => {
    const record =
      entry && typeof entry === "object"
        ? (entry as Record<string, unknown>)
        : {};
    return {
      path:
        typeof record.path === "string" && record.path.startsWith("/")
          ? record.path
          : "/",
      sourceTextLength:
        typeof record.sourceTextLength === "number"
          ? record.sourceTextLength
          : 0,
      sourceNodeCount:
        typeof record.sourceNodeCount === "number"
          ? record.sourceNodeCount
          : 0,
    };
  });
}

async function summarizeGeneratedProject(projectDir: string) {
  const files = await listFiles(projectDir);
  let tsxBytes = 0;
  let cssBytes = 0;
  let previewHtmlBytes = 0;

  for (const file of files) {
    const size = (await fs.stat(file)).size;
    if (file.endsWith(".tsx")) tsxBytes += size;
    if (file.endsWith(".css")) cssBytes += size;
    if (path.basename(file) === "preview.html") previewHtmlBytes += size;
  }

  return {
    generatedFileCount: files.length,
    tsxBytes,
    cssBytes,
    previewHtmlBytes,
  };
}

async function listFiles(dir: string): Promise<string[]> {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const nested = await Promise.all(
    entries.map(async (entry) => {
      const fullPath = path.join(dir, entry.name);
      return entry.isDirectory() ? listFiles(fullPath) : [fullPath];
    }),
  );
  return nested.flat();
}

async function runCommand(
  command: string,
  args: string[],
  cwd: string,
  timeoutMs: number,
) {
  const startedAt = Date.now();
  return await new Promise<{
    exitCode: number;
    stdout: string;
    stderr: string;
    durationMs: number;
  }>((resolve, reject) => {
    const child = spawn(command, args, {
      cwd,
      env: process.env,
      stdio: ["ignore", "pipe", "pipe"],
    });
    let stdout = "";
    let stderr = "";
    const timer = setTimeout(() => {
      child.kill("SIGKILL");
      reject(
        new Error(
          `${command} ${args.join(" ")} timed out after ${timeoutMs}ms.`,
        ),
      );
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

async function inspectBuiltProject(
  distDir: string,
  routeManifest: Array<{
    path: string;
    sourceTextLength: number;
    sourceNodeCount: number;
  }>,
) {
  const server = createServer(async (request, response) => {
    try {
      const requestUrl = new URL(request.url ?? "/", "http://127.0.0.1");
      const requested = requestUrl.pathname === "/" ? "/index.html" : requestUrl.pathname;
      const normalized = path.normalize(requested).replace(/^(\.\.(\/|\\|$))+/, "");
      let filePath = path.join(distDir, normalized);
      const stat = await fs.stat(filePath).catch(() => null);
      if (!stat?.isFile()) filePath = path.join(distDir, "index.html");
      const content = await fs.readFile(filePath);
      response.statusCode = 200;
      response.setHeader("content-type", contentType(filePath));
      response.end(content);
    } catch (error) {
      response.statusCode = 500;
      response.end(error instanceof Error ? error.message : String(error));
    }
  });

  await new Promise<void>((resolve, reject) => {
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
  const consoleErrors: string[] = [];
  const pageErrors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") consoleErrors.push(message.text());
  });
  page.on("pageerror", (error) => {
    pageErrors.push(error.message);
  });

  try {
    const routes = [];
    let rootChildCount = 0;
    for (const route of routeManifest) {
      await page.goto(`http://127.0.0.1:${address.port}${route.path}`, {
        waitUntil: "domcontentloaded",
        timeout: 30_000,
      });
      await page.waitForFunction(
        () => {
          const root = document.getElementById("root");
          return (
            (root?.childElementCount ?? 0) > 0 &&
            !root?.querySelector('[aria-live="polite"]')
          );
        },
        undefined,
        { timeout: 10_000 },
      );
      await page.waitForTimeout(100);
      const inspected = await page.evaluate(() => {
        const root = document.getElementById("root");
        const renderedElements = root
          ? Array.from(root.querySelectorAll("*")).filter((element) => {
              const style = getComputedStyle(element);
              const rect = element.getBoundingClientRect();
              return (
                style.display !== "none" &&
                style.visibility !== "hidden" &&
                Number(style.opacity) > 0 &&
                rect.width > 0 &&
                rect.height > 0
              );
            })
          : [];
        return {
          rootChildCount: root?.children.length ?? 0,
          renderedElementCount: renderedElements.length,
          renderedTextLength: root?.textContent?.trim().length ?? 0,
        };
      });
      const screenshotColorCount = countSampledScreenshotColors(
        await page.screenshot({ animations: "disabled" }),
      );
      rootChildCount = Math.max(rootChildCount, inspected.rootChildCount);
      routes.push({ ...route, ...inspected, screenshotColorCount });
    }
    return {
      rootChildCount,
      renderedElementCount: routes.reduce(
        (total, route) => total + route.renderedElementCount,
        0,
      ),
      renderedTextLength: routes.reduce(
        (total, route) => total + route.renderedTextLength,
        0,
      ),
      consoleErrors,
      pageErrors,
      routes,
    };
  } finally {
    await browser.close();
    await new Promise<void>((resolve) => server.close(() => resolve()));
  }
}

function countSampledScreenshotColors(buffer: Buffer) {
  const image = PNG.sync.read(buffer);
  const colors = new Set<string>();
  const pixelCount = image.width * image.height;
  const step = Math.max(1, Math.floor(pixelCount / 20_000));
  for (let pixel = 0; pixel < pixelCount; pixel += step) {
    const offset = pixel * 4;
    const alpha = image.data[offset + 3] ?? 0;
    if (alpha === 0) continue;
    const red = Math.round((image.data[offset] ?? 0) / 16);
    const green = Math.round((image.data[offset + 1] ?? 0) / 16);
    const blue = Math.round((image.data[offset + 2] ?? 0) / 16);
    colors.add(`${red}:${green}:${blue}`);
    if (colors.size >= 256) break;
  }
  return colors.size;
}

function contentType(filePath: string) {
  if (filePath.endsWith(".html")) return "text/html; charset=utf-8";
  if (filePath.endsWith(".js")) return "text/javascript; charset=utf-8";
  if (filePath.endsWith(".css")) return "text/css; charset=utf-8";
  if (filePath.endsWith(".svg")) return "image/svg+xml";
  if (filePath.endsWith(".png")) return "image/png";
  if (filePath.endsWith(".jpg") || filePath.endsWith(".jpeg")) {
    return "image/jpeg";
  }
  return "application/octet-stream";
}

function tail(value: string, maxLength: number) {
  return value.length <= maxLength ? value : value.slice(-maxLength);
}

async function bundleDebugArtifacts(input: {
  workDir: string;
  attemptsDir: string;
  exportDir: string;
  attempts: ExportAttemptResult[];
  bestAttempt: ExportAttemptResult;
}): Promise<DebugArtifactsManifest> {
  const debugDir = path.join(input.exportDir, "debug");
  const sourceDir = path.join(debugDir, "source");
  const attemptsDir = path.join(debugDir, "attempts");

  await mkdirp(debugDir);
  await mkdirp(sourceDir);
  await mkdirp(attemptsDir);

  const sourceScreenshotPaths = await copyDirectoryIfExists(
    (await pathExists(path.join(input.workDir, "routes")))
      ? path.join(input.workDir, "routes")
      : path.join(input.workDir, "original"),
    sourceDir,
  );

  const attemptArtifacts = await Promise.all(
    input.attempts.map(async (attempt) => {
      const sourceAttemptDir = path.join(
        input.attemptsDir,
        `attempt-${attempt.attemptNumber}`,
      );
      const targetAttemptDir = path.join(
        attemptsDir,
        `attempt-${attempt.attemptNumber}`,
      );
      await mkdirp(targetAttemptDir);

      const compareDiagnostics = await copyFileIfExists(
        path.join(sourceAttemptDir, "compare-diagnostics.json"),
        path.join(targetAttemptDir, "compare-diagnostics.json"),
      );

      const generatedScreenshots = (
        await Promise.all(
          ["desktop", "laptop", "tablet", "mobile"].map((viewport) =>
            copyFileIfExists(
              path.join(sourceAttemptDir, `generated-${viewport}.png`),
              path.join(targetAttemptDir, `generated-${viewport}.png`),
            ),
          ),
        )
      ).filter(Boolean) as string[];

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

      await writeFile(
        path.join(targetAttemptDir, "summary.json"),
        `${JSON.stringify(summary, null, 2)}\n`,
      );

      return {
        attempt: attempt.attemptNumber,
        dir: relativeToExport(input.exportDir, targetAttemptDir),
        compareDiagnostics: compareDiagnostics
          ? relativeToExport(input.exportDir, compareDiagnostics)
          : undefined,
        generatedScreenshots: generatedScreenshots.map((filePath) =>
          relativeToExport(input.exportDir, filePath),
        ),
        summary: relativeToExport(
          input.exportDir,
          path.join(targetAttemptDir, "summary.json"),
        ),
      };
    }),
  );

  const manifest = {
    bestAttempt: input.bestAttempt.attemptNumber,
    sourceScreenshots: sourceScreenshotPaths.map((filePath) =>
      relativeToExport(input.exportDir, filePath),
    ),
    attempts: attemptArtifacts,
  };

  const manifestPath = path.join(debugDir, "manifest.json");
  await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
  return {
    manifestPath: relativeToExport(input.exportDir, manifestPath),
    ...manifest,
  };
}

async function copyDirectoryIfExists(sourceDir: string, targetDir: string) {
  const entries = await readDirSafe(sourceDir);
  const copied: string[] = [];
  for (const entry of entries) {
    const source = path.join(sourceDir, entry.name);
    const target = path.join(targetDir, entry.name);
    if (entry.isDirectory()) {
      await mkdirp(target);
      copied.push(...(await copyDirectoryIfExists(source, target)));
      continue;
    }
    await fs.copyFile(source, target);
    copied.push(target);
  }
  return copied;
}

async function pathExists(targetPath: string) {
  return Boolean(await fs.stat(targetPath).catch(() => null));
}

async function copyFileIfExists(source: string, target: string) {
  try {
    await fs.copyFile(source, target);
    return target;
  } catch {
    return undefined;
  }
}

async function readDirSafe(targetPath: string) {
  try {
    return await fs.readdir(targetPath, { withFileTypes: true });
  } catch {
    return [];
  }
}

function relativeToExport(exportDir: string, targetPath: string) {
  return path.relative(exportDir, targetPath) || ".";
}

function createRuntimeCaptureFromPluginContext(
  pluginCapture?: PluginCanvasCapture,
): RuntimeCapture {
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
  const rawNodes =
    framerTree.length > 0
      ? createFallbackNodesFromFramerTree(framerTree, capturedNodes)
      : capturedNodes.length > 0
      ? capturedNodes
      : snapshot.length > 0
        ? snapshot
        : selectedComponents.length > 0
          ? selectedComponents
          : [];
  const nodes: RuntimeNode[] = rawNodes
    .map((entry, index) => toRuntimeNode(entry, index))
    .filter(Boolean) as RuntimeNode[];

  const projectName =
    typeof context?.project?.name === "string"
      ? context.project.name
      : "Framer Project";
  const projectId =
    typeof context?.project?.id === "string" ? context.project.id : "unknown";

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

function createFallbackNodesFromFramerTree(
  tree: FramerTreeNode[],
  selectedNodes: Array<PluginCanvasCapture["selectedNodes"][number]>,
) {
  const selectedById = new Map(
    selectedNodes
      .filter((node): node is typeof node & { id: string } => typeof node.id === "string")
      .map((node) => [node.id, node] as const),
  );
  const childIdsByParent = new Map<string, string[]>();
  const treeById = new Map(tree.map((node) => [node.id, node] as const));

  for (const node of tree) {
    if (!node.parentId) continue;
    childIdsByParent.set(node.parentId, [
      ...(childIdsByParent.get(node.parentId) ?? []),
      node.id,
    ]);
  }

  const ordered = [...tree].sort((first, second) => compareTreePath(first.path, second.path));

  return ordered.map((treeNode) => {
    const selected = selectedById.get(treeNode.id);
    const selectedMeta =
      selected?.metadata && typeof selected.metadata === "object"
        ? (selected.metadata as Record<string, unknown>)
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
        childIds:
          Array.isArray(selectedMeta.childIds) && selectedMeta.childIds.length > 0
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

function compareTreePath(first: string, second: string) {
  const tokenize = (value: string) =>
    value
      .split(/[^0-9]+/)
      .filter(Boolean)
      .map((part) => Number(part));
  const firstParts = tokenize(first);
  const secondParts = tokenize(second);
  const max = Math.max(firstParts.length, secondParts.length);
  for (let index = 0; index < max; index += 1) {
    const a = firstParts[index] ?? -1;
    const b = secondParts[index] ?? -1;
    if (a !== b) return a - b;
  }
  return first.localeCompare(second);
}

function toRuntimeNode(
  entry: Record<string, unknown>,
  index: number,
): RuntimeNode | null {
  const id =
    typeof entry.id === "string" ? entry.id : `plugin-node-${index + 1}`;
  const text =
    typeof entry.text === "string" && entry.text.trim().length > 0
      ? entry.text.trim().slice(0, 500)
      : undefined;
  const metadata =
    entry.metadata && typeof entry.metadata === "object"
      ? (entry.metadata as Record<string, unknown>)
      : {};
  const capturedStyles = asStyleRecord(metadata.styles);
  const capturedMotion = asMotionRecord(metadata.motion);
  const imageSrc =
    typeof metadata.src === "string" && metadata.src.length > 0
      ? metadata.src
      : undefined;
  const imageAlt =
    typeof metadata.alt === "string" && metadata.alt.length > 0
      ? metadata.alt
      : undefined;
  const href =
    typeof metadata.link === "string" && metadata.link.length > 0
      ? metadata.link
      : undefined;
  const position = asPoint(entry.position);
  const size = asSize(entry.size);
  const bounds = asRect(entry.bounds);
  const sourceIndex =
    typeof metadata.sourceIndex === "number" ? metadata.sourceIndex : index;
  const rootName =
    typeof metadata.rootName === "string" && metadata.rootName.trim().length > 0
      ? metadata.rootName.trim()
      : undefined;
  const sectionName =
    rootName ??
    (typeof entry.name === "string" && entry.name.trim().length > 0
      ? entry.name.trim()
      : "Selection");

  const explicitTag =
    typeof metadata.tag === "string" && metadata.tag.trim().length > 0
      ? metadata.tag.trim().toLowerCase()
      : undefined;
  const path = typeof metadata.path === "string" ? metadata.path : undefined;
  const runtimeTag = imageSrc
    ? "img"
    : explicitTag ?? normalizeTag(typeof entry.type === "string" ? entry.type : "div");

  return {
    id,
    tag: runtimeTag,
    domPath:
      typeof metadata.domPath === "string" && metadata.domPath.trim().length > 0
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
      className:
        typeof metadata.className === "string" && metadata.className.length > 0
          ? metadata.className
          : undefined,
      dataFramerName:
        typeof metadata.dataFramerName === "string" &&
        metadata.dataFramerName.length > 0
          ? metadata.dataFramerName
          : undefined,
    },
    styles: {
      ...capturedStyles,
      backgroundColor:
        capturedStyles.backgroundColor ??
        (typeof metadata.backgroundColor === "string"
          ? metadata.backgroundColor
          : undefined),
      opacity:
        capturedStyles.opacity ??
        (typeof metadata.opacity === "number"
          ? String(metadata.opacity)
          : undefined),
      __coderelaySourceIndex: String(index),
      __coderelayRootId:
        typeof metadata.rootId === "string" ? metadata.rootId : "",
      __coderelayRootKind:
        typeof metadata.rootKind === "string" ? metadata.rootKind : "",
      __coderelayDepth:
        typeof metadata.depth === "number" ? String(metadata.depth) : "",
      __coderelayParentId:
        typeof metadata.parentId === "string" ? metadata.parentId : "",
      __coderelayPath: typeof metadata.path === "string" ? metadata.path : "",
    },
    motion: capturedMotion,
  };
}

function buildPluginDomPath(tag: string, path: string) {
  const tokens = path
    .split(".")
    .map((part) => {
      const match = part.match(/(\d+)$/);
      return match ? Number(match[1]) : null;
    })
    .filter((value): value is number => value != null);
  if (tokens.length === 0) return `plugin > ${tag}`;
  return `plugin > ${tokens
    .map((token, index) =>
      `${index === tokens.length - 1 ? tag : "div"}:nth-child(${token})`,
    )
    .join(" > ")}`;
}

function asStyleRecord(value: unknown) {
  if (!value || typeof value !== "object") return {};
  const output: Record<string, string> = {};
  for (const [key, entry] of Object.entries(value)) {
    if (typeof entry === "string" && entry.trim()) {
      output[key] = entry.trim();
    }
  }
  return output;
}

function asRecord(value: unknown): Record<string, unknown> | undefined {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return undefined;
  }
  return value as Record<string, unknown>;
}

function asMotionRecord(value: unknown): MotionStyles | undefined {
  if (!value || typeof value !== "object") return undefined;
  const output: MotionStyles = {};
  for (const [key, entry] of Object.entries(value as Record<string, unknown>)) {
    if (typeof entry !== "string" || !entry.trim()) continue;
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

function normalizeTag(type: string) {
  const lower = type.toLowerCase();
  if (lower.includes("text")) return "p";
  if (lower.includes("image")) return "img";
  if (lower.includes("button")) return "button";
  if (lower.includes("heading")) return "h2";
  if (lower.includes("component")) return "section";
  return "div";
}

function asPoint(value: unknown): { x: number; y: number } | null {
  if (!value || typeof value !== "object") return null;
  const input = value as Record<string, unknown>;
  if (typeof input.x !== "number" || typeof input.y !== "number") return null;
  return { x: input.x, y: input.y };
}

function asSize(value: unknown): { width: number; height: number } | null {
  if (!value || typeof value !== "object") return null;
  const input = value as Record<string, unknown>;
  if (typeof input.width !== "number" || typeof input.height !== "number")
    return null;
  return { width: input.width, height: input.height };
}

function asRect(value: unknown): RuntimeNode["rect"] | null {
  if (!value || typeof value !== "object") return null;
  const input = value as Record<string, unknown>;
  if (
    typeof input.x !== "number" ||
    typeof input.y !== "number" ||
    typeof input.width !== "number" ||
    typeof input.height !== "number"
  ) {
    return null;
  }
  return {
    x: input.x,
    y: input.y,
    width: input.width,
    height: input.height,
  };
}

async function runAttempts(input: {
  ir: ExportIR;
  attemptsDir: string;
  maxAttempts: number;
  targetFidelity: number;
}) {
  const attempts: ExportAttemptResult[] = [];
  const maxAttempts = Math.max(1, input.maxAttempts);
  let workingState = {
    ir: input.ir,
    strategy: baselineStrategy,
  };
  let bestWorkingState = cloneWorkingAttemptState(workingState);
  let bestFidelity: FidelityScores | undefined;

  for (let index = 0; index < maxAttempts; index += 1) {
    const attemptNumber = index + 1;
    const previousAttempt = attempts.at(-1);
    const plan = buildAttemptPlan({
      previousAttempt: previousAttempt
        ? {
            strategy: {
              id: previousAttempt.strategy,
              structuredLayout: previousAttempt.strategy.includes("structured"),
              compactSpacing:
                previousAttempt.strategy.includes("compact") ||
                previousAttempt.strategy.includes("spacing-typography-correction"),
              aggressiveMobileStacking:
                previousAttempt.strategy.includes("mobile-repair"),
              preserveImageAspectRatio:
                !previousAttempt.strategy.includes("fluid-images"),
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

    await mkdirp(projectDir);

    const generated = await generateNextProject({
      ir: workingState.ir,
      projectDir,
      strategy: workingState.strategy,
    });
    const comparison = await compareGeneratedPreview({
      ir: workingState.ir,
      previewHtmlPath: generated.previewHtmlPath,
      attemptDir,
    });
    const fidelity = comparison.fidelity;
    const warnings = warningsForAttempt(
      workingState.ir,
      fidelity,
      comparison.diagnostics,
      comparison.previewValidation,
    );
    const rerunReason = getRerunReason(
      fidelity,
      input.targetFidelity,
      warnings,
    );
    const plateau = detectAttemptPlateau(
      [...attempts.map((attempt) => attempt.fidelity.overall), fidelity.overall],
    );
    const stopReason = plateau
      ? "Fidelity improvements plateaued across the last three attempts."
      : !rerunReason
        ? "Target fidelity reached or no rerun required."
        : undefined;
    const improvedBest =
      !bestFidelity || fidelity.overall >= bestFidelity.overall;
    if (improvedBest) {
      bestFidelity = fidelity;
      bestWorkingState = cloneWorkingAttemptState(workingState);
    }
    const resetToBestStateForNextAttempt =
      !improvedBest &&
      shouldResetToBestAttempt({
        current: fidelity,
        best: bestFidelity!,
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

function selectBestAttempt(attempts: ExportAttemptResult[]) {
  const best = [...attempts].sort(
    (first, second) => second.fidelity.overall - first.fidelity.overall,
  )[0];

  if (!best) {
    throw new Error("No export attempts were generated.");
  }

  return best;
}

export function shouldResetToBestAttempt(input: BestAttemptResetInput) {
  const target =
    input.targetFidelity <= 1 ? input.targetFidelity * 100 : input.targetFidelity;
  const current = input.current;
  const best = input.best;

  if (current.overall >= best.overall) return false;

  const overallDrop = best.overall - current.overall;
  if (overallDrop >= 1) {
    return true;
  }

  const weakCategoryRegression =
    collectComparableFidelityMetrics(best)
      .filter((entry) => entry.best < target)
      .some((entry) => {
        const currentValue = readComparableFidelityMetric(current, entry.key);
        return typeof currentValue === "number" && entry.best - currentValue >= 2;
      });

  return weakCategoryRegression;
}

function warningsForAttempt(
  ir: ExportIR,
  fidelity: FidelityScores,
  comparisonDiagnostics?: ComparisonDiagnostics,
  previewValidation?: PreviewValidationResult,
): ExportWarning[] {
  const warnings = [...ir.warnings];

  if (fidelity.overall < 90) {
    warnings.push({
      type: "low_fidelity_score",
      severity: "warning",
      message: `Overall fidelity is ${fidelity.overall}%, below the 90% alpha target.`,
    });
  }

  const tabletLag =
    typeof fidelity.tablet === "number" ? fidelity.tablet < fidelity.desktop - 6 : false;
  if (fidelity.mobile < fidelity.desktop - 8 || tabletLag) {
    warnings.push({
      type: "responsive_mismatch",
      severity: "warning",
      message:
        "Responsive fidelity is meaningfully lower than desktop fidelity on one or more smaller breakpoints.",
    });
  }

  if (fidelity.motion < 60) {
    warnings.push({
      type: "unsupported_animation",
      severity: "info",
      message:
        "Motion fidelity is limited for this export. Review Framer animations manually.",
    });
  }

  if ((comparisonDiagnostics?.summary.missingNodes ?? 0) > 0) {
    warnings.push({
      type: "generated_node_missing",
      severity: "warning",
      message: `${comparisonDiagnostics!.summary.missingNodes} generated nodes could not be found during computed-style comparison.`,
    });
  }

  if (comparisonDiagnostics && (comparisonDiagnostics.summary.nodesCompared ?? 0) > 0) {
    const previewMissingAllNodes = comparisonDiagnostics.summary.missingNodes >=
      comparisonDiagnostics.summary.nodesCompared;
    if (previewMissingAllNodes) {
      warnings.push({
        type: "generated_node_missing",
        severity: "warning",
        message:
          "Generated preview validation could not find any exported nodes during computed-style inspection.",
      });
    }
  }

  if (previewValidation?.status === "blocked") {
    warnings.push({
      type: "preview_validation_blocked",
      severity: "info",
      message:
        "Rendered preview validation could not run in this environment. Review preview validation evidence manually.",
    });
  }

  if (
    previewValidation?.status === "validated" &&
    previewValidation.summary.inspectedNodes > 0
  ) {
    if (previewValidation.summary.foundNodes === 0) {
      warnings.push({
        type: "preview_validation_missing_nodes",
        severity: "warning",
        message:
          "Rendered preview validation did not find any exported nodes in the generated preview DOM.",
      });
    }

    if (previewValidation.summary.nodesWithNonDefaultStyles === 0) {
      warnings.push({
        type: "preview_validation_unstyled",
        severity: "warning",
        message:
          "Rendered preview validation found exported nodes, but none resolved to non-default visual styles.",
      });
    }
  }

  const weakSections = ir.component.sections.filter(
    (section) => (section.confidence ?? 0) < 0.5,
  );

  if (weakSections.length > 0) {
    warnings.push({
      type: "section_extraction_low_confidence",
      severity: "warning",
      message: `${weakSections.length} sections were extracted with low confidence and may be visually inaccurate.`,
    });
  }

  return warnings;
}

function getRerunReason(
  fidelity: FidelityScores,
  targetFidelity: number,
  warnings: ExportWarning[],
) {
  const target = targetFidelity <= 1 ? targetFidelity * 100 : targetFidelity;

  if (
    fidelity.overall >= target &&
    !warnings.some((warning) => warning.type === "responsive_mismatch")
  ) {
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

function createReport(
  ir: ExportIR,
  attempts: ExportAttemptResult[],
  bestAttempt: ExportAttemptResult,
  debugArtifacts: DebugArtifactsManifest,
  validation: GeneratedProjectValidation,
  revisionId: string,
  revisionCacheHit: boolean,
  revisionRequest?: LocalExportInput["revisionRequest"],
  sourceArtifacts?: SourceArtifactsManifest,
) {
  const styleStats = summarizeStyleExtraction(ir);
  return {
    revisionId,
    revisionCacheHit,
    revisionRequest: revisionRequest ?? null,
    sourceArtifacts: sourceArtifacts ?? null,
    jobId: ir.jobId,
    exportType:
      ir.exportMode === "full-site"
        ? "full-site"
        : ir.libraryComponents
          ? "component-library"
          : "component",
    sourceUrl: ir.sourceUrl,
    captureMode: ir.captureMode ?? "plugin-only",
    exportEngine: ir.exportEngine ?? "plugin-approximation",
    componentName: ir.componentName,
    componentFileCount: ir.libraryComponents?.length ?? 1,
    pageFileCount: ir.sitePages?.length ?? 0,
    componentModuleCount: ir.componentModules?.length ?? 0,
    codeFileCount: ir.codeFiles?.length ?? 0,
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
      artifact:
        sourceArtifacts?.codeFiles.find((entry) =>
          entry.contentHash && file.contentHash
            ? entry.contentHash === file.contentHash
            : entry.name === file.name && entry.path === file.path,
        ) ?? null,
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
      averageConfidence: average(
        ir.nodeMatches.map((match) => match.confidence),
      ),
    },
    styleExtraction: styleStats,
    motionExtraction: summarizeMotionExtraction(ir),
    exportTree: ir.exportTreeDiagnostics,
    routeTemplates: ir.routeTemplates ?? [],
    runtimeCapture: {
      breakpointsCaptured:
        ir.runtimeCapture.captureDiagnostics?.breakpointsCaptured ?? [],
      stylesheetCount: ir.runtimeCapture.captureDiagnostics?.stylesheetCount,
      nodeCount: ir.runtimeCapture.captureDiagnostics?.nodeCount,
      fontsReady: ir.runtimeCapture.captureDiagnostics?.fontReadiness,
      routes: (ir.runtimeCapture.routeCaptures ?? []).map((capture) => ({
        path: capture.routePath,
        url: capture.url,
        title: capture.title,
        nodeCount: capture.captureDiagnostics?.nodeCount,
        stylesheetCount: capture.captureDiagnostics?.stylesheetCount,
        fontsReady: capture.captureDiagnostics?.fontReadiness,
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
      downloaded: 0,
      linked: ir.assets.length,
      failed: 0,
    },
    patchHistoryPath: "patch-history.json",
    warnings: bestAttempt.warnings,
  };
}

function createPatchHistory(attempts: ExportAttemptResult[]) {
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
    resetToBestStateForNextAttempt:
      attempt.resetToBestStateForNextAttempt ?? false,
  }));
}

function createRevisionManifest(
  ir: ExportIR,
  attempts: ExportAttemptResult[],
  bestAttempt: ExportAttemptResult,
  revisionId: string,
) {
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
      templateKind: page.templateKind,
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
    },
    attempts: attempts.map((attempt) => ({
      attempt: attempt.attemptNumber,
      strategy: attempt.strategy,
      overall: attempt.fidelity.overall,
      warningCount: attempt.warnings.length,
      stopReason: attempt.stopReason,
    })),
  };
  return {
    revisionId,
    schemaVersion: 1,
    summary,
  };
}

function createInvalidationPlan(input: {
  revisionRequest?: LocalExportInput["revisionRequest"];
  sourceArtifacts?: SourceArtifactsManifest | null;
  parentSourceArtifacts?: SourceArtifactsManifest | null;
  codeFileCount?: number;
  routeTemplateCount?: number;
  componentFamilyCount?: number;
}) {
  const revisionRequest = input.revisionRequest;
  const sourceArtifacts = input.sourceArtifacts ?? null;
  const parentSourceArtifacts = input.parentSourceArtifacts ?? null;
  const sourceDiff = createSourceArtifactDiff(sourceArtifacts, parentSourceArtifacts);
  const codeFileArtifactIds = (sourceArtifacts?.codeFiles ?? []).map(
    (entry) => entry.artifactId,
  );
  const readableCodeFileArtifactIds = (sourceArtifacts?.codeFiles ?? [])
    .filter((entry) => entry.hasContent)
    .map((entry) => entry.artifactId);
  const missingCodeFileArtifactIds = (sourceArtifacts?.codeFiles ?? [])
    .filter((entry) => !entry.hasContent)
    .map((entry) => entry.artifactId);
  const componentFamiliesArtifactId =
    sourceArtifacts?.componentFamiliesArtifactId ?? "source/component-families";

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
          dependsOn:
            sourceDiff.changedCodeFileArtifactIds.length > 0
              ? sourceDiff.changedCodeFileArtifactIds
              : readableCodeFileArtifactIds.length > 0
                ? readableCodeFileArtifactIds
              : ["plugin/raw-payload"],
        },
        {
          artifact: "ir/normalized",
          reason: "depends-on-component-model",
          dependsOn: [componentFamiliesArtifactId, ...codeFileArtifactIds],
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
    reused: ["cms/*", "assets/*", ...sourceDiff.unchangedCodeFileArtifactIds],
    invalidated: [
      {
        artifact: "runtime/responsive",
        reason: "responsive-improvement",
        dependsOn: ["runtime/raw-capture"],
      },
      {
        artifact: componentFamiliesArtifactId,
        reason: "component-source-refresh",
        dependsOn:
          sourceDiff.changedCodeFileArtifactIds.length > 0
            ? sourceDiff.changedCodeFileArtifactIds
            : readableCodeFileArtifactIds.length > 0
              ? readableCodeFileArtifactIds
            : ["plugin/raw-payload"],
      },
      {
        artifact: "ir/normalized",
        reason: "depends-on-updated-models",
        dependsOn: [
          "runtime/responsive",
          componentFamiliesArtifactId,
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

function resolveSharedRevisionCacheRoot(outDir: string) {
  const normalizedOutDir = path.resolve(outDir);
  const parentDir = path.dirname(normalizedOutDir);
  if (path.basename(parentDir) === "artifacts") {
    return path.join(path.dirname(parentDir), "revision-cache");
  }
  return path.join(normalizedOutDir, ".revision-cache");
}

function createRevisionId(value: unknown) {
  return `revision_${crypto
    .createHash("sha256")
    .update(JSON.stringify(value))
    .digest("hex")
    .slice(0, 16)}`;
}

function createStableRevisionSummary(ir: ExportIR) {
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
      templateKind: page.templateKind,
      sourceTextLength: page.sourceTextLength ?? 0,
    })),
    componentModuleCount: ir.componentModules?.length ?? 0,
    codeFileCount: ir.codeFiles?.length ?? 0,
    cmsCollectionCount: ir.cmsCollections?.length ?? 0,
    fontCount: ir.fonts?.length ?? 0,
  };
}

async function tryReuseParentRevisionForValidation(input: {
  exportDir: string;
  runDir: string;
  sharedRevisionCacheRoot: string;
  revisionRequest?: LocalExportInput["revisionRequest"];
  targetFidelity: number;
  maxAttempts: number;
}): Promise<LocalExportResult | null> {
  const revisionRequest = input.revisionRequest;
  if (
    revisionRequest?.kind !== "improvement" ||
    revisionRequest.requestedFocus !== "revalidate"
  ) {
    return null;
  }

  if (!revisionRequest.parentRevisionId) {
    throw new Error(
      "Missing parentRevisionId: revalidate revision requires a parent revision.",
    );
  }

  const parentRevisionCacheDir = path.join(
    input.sharedRevisionCacheRoot,
    revisionRequest.parentRevisionId,
  );
  const parentRevision = await readCachedRevision(parentRevisionCacheDir);
  if (!parentRevision) {
    throw new Error(
      `Parent revision cache not found: ${revisionRequest.parentRevisionId}`,
    );
  }

  const parentManifestPath = path.join(
    parentRevision.exportDir,
    "revision-manifest.json",
  );
  const parentManifest = await readJsonFile<Record<string, unknown>>(
    parentManifestPath,
  );
  const revisionId = createRevisionId({
    mode: "revalidate-only",
    parentRevisionId: revisionRequest.parentRevisionId,
    requestedFocus: revisionRequest.requestedFocus,
    targetFidelity: input.targetFidelity,
    maxAttempts: input.maxAttempts,
    parentSummary:
      parentManifest && typeof parentManifest.summary === "object"
        ? parentManifest.summary
        : null,
  });
  const revisionCacheDir = path.join(input.sharedRevisionCacheRoot, revisionId);
  const cachedRevision = await readCachedRevision(revisionCacheDir);
  if (cachedRevision) {
    await copy(cachedRevision.exportDir, input.exportDir);
    return finalizeCachedRevisionResult({
      exportDir: input.exportDir,
      runDir: input.runDir,
      cachedRevision,
      revisionCacheHit: true,
    });
  }

  await copy(parentRevision.exportDir, input.exportDir);
  const validation = await validateGeneratedProject(input.exportDir);
  const parentReportPath = path.join(parentRevision.exportDir, "export-report.json");
  const parentReport = await readJsonFile<Record<string, unknown>>(parentReportPath);
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

  await mkdirp(revisionCacheDir);
  await copy(input.exportDir, path.join(revisionCacheDir, "export"));

  return finalizeCachedRevisionResult({
    exportDir: input.exportDir,
    runDir: input.runDir,
    cachedRevision: {
      exportDir: input.exportDir,
      bestAttempt: parentRevision.bestAttempt,
      validation,
    },
    revisionCacheHit: false,
  });
}

async function tryReuseParentRevisionForUnchangedComponentSource(input: {
  exportDir: string;
  runDir: string;
  sharedRevisionCacheRoot: string;
  revisionId: string;
  revisionRequest?: LocalExportInput["revisionRequest"];
  sourceArtifacts: SourceArtifactsManifest;
  parentSourceArtifacts: SourceArtifactsManifest | null;
  sourceDiff: SourceArtifactDiff;
  targetFidelity: number;
  maxAttempts: number;
}): Promise<LocalExportResult | null> {
  const revisionRequest = input.revisionRequest;
  if (
    revisionRequest?.kind !== "improvement" ||
    revisionRequest.requestedFocus !== "components" ||
    !revisionRequest.parentRevisionId
  ) {
    return null;
  }

  if (
    input.sourceDiff.changedCodeFileArtifactIds.length > 0 ||
    input.sourceDiff.addedCodeFileArtifactIds.length > 0 ||
    input.sourceDiff.removedCodeFileArtifactIds.length > 0 ||
    input.sourceDiff.componentFamiliesChanged ||
    input.sourceArtifacts.codeFiles.some((entry) => !entry.hasContent)
  ) {
    return null;
  }

  const parentRevisionCacheDir = path.join(
    input.sharedRevisionCacheRoot,
    revisionRequest.parentRevisionId,
  );
  const parentRevision = await readCachedRevision(parentRevisionCacheDir);
  if (!parentRevision) {
    return null;
  }

  await copy(parentRevision.exportDir, input.exportDir);
  const validation = await validateGeneratedProject(input.exportDir);
  const parentManifest = await readJsonFile<Record<string, unknown>>(
    path.join(parentRevision.exportDir, "revision-manifest.json"),
  );
  const parentReport = await readJsonFile<Record<string, unknown>>(
    path.join(parentRevision.exportDir, "export-report.json"),
  );
  const createdAt = new Date().toISOString();
  const manifest: Record<string, unknown> = {
    ...(parentManifest ?? {}),
    revisionId: input.revisionId,
    parentRevisionId: revisionRequest.parentRevisionId,
    reusedFromRevisionId: revisionRequest.parentRevisionId,
    reusedBecause: "component-source-unchanged",
    revisionRequest,
    generatedValidation: validation,
    sourceArtifacts: input.sourceArtifacts,
    revalidatedAt: createdAt,
  };
  const report: Record<string, unknown> = {
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

  await writeJsonFile(
    path.join(input.exportDir, "generated-validation.json"),
    validation,
  );
  await writeJsonFile(
    path.join(input.exportDir, "revision-manifest.json"),
    manifest,
  );
  await writeJsonFile(path.join(input.exportDir, "export-report.json"), report);
  await writeJsonFile(
    path.join(input.exportDir, "invalidation-plan.json"),
    createInvalidationPlan({
      revisionRequest,
      sourceArtifacts: input.sourceArtifacts,
      parentSourceArtifacts: input.parentSourceArtifacts,
      codeFileCount: input.sourceArtifacts.codeFiles.length,
      componentFamilyCount: input.sourceArtifacts.componentFamiliesArtifactId
        ? 1
        : 0,
    }),
  );
  await writeJsonFile(
    path.join(input.exportDir, "artifact-index.json"),
    await createArtifactIndex(input.exportDir, input.sourceArtifacts),
  );

  const revisionCacheDir = path.join(
    input.sharedRevisionCacheRoot,
    input.revisionId,
  );
  await mkdirp(revisionCacheDir);
  await copy(input.exportDir, path.join(revisionCacheDir, "export"));

  return finalizeCachedRevisionResult({
    exportDir: input.exportDir,
    runDir: input.runDir,
    cachedRevision: {
      exportDir: input.exportDir,
      bestAttempt: parentRevision.bestAttempt,
      validation,
    },
    revisionCacheHit: false,
  });
}

async function readCachedRevision(revisionCacheDir: string): Promise<{
  exportDir: string;
  bestAttempt: ExportAttemptResult;
  validation: GeneratedProjectValidation;
} | null> {
  try {
    const exportDir = path.join(revisionCacheDir, "export");
    await fs.access(path.join(exportDir, "revision-manifest.json"));
    const bestAttempt = JSON.parse(
      await fs.readFile(path.join(exportDir, "best-attempt.json"), "utf8"),
    ) as ExportAttemptResult;
    const validation = JSON.parse(
      await fs.readFile(path.join(exportDir, "generated-validation.json"), "utf8"),
    ) as GeneratedProjectValidation;
    return { exportDir, bestAttempt, validation };
  } catch {
    return null;
  }
}

async function patchRevalidatedRevisionArtifacts(input: {
  exportDir: string;
  revisionId: string;
  parentRevisionId: string;
  revisionRequest: NonNullable<LocalExportInput["revisionRequest"]>;
  validation: GeneratedProjectValidation;
  parentManifest: Record<string, unknown> | null;
  parentReport: Record<string, unknown> | null;
  createdAt: string;
}) {
  const manifest: Record<string, unknown> = {
    ...(input.parentManifest ?? {}),
    revisionId: input.revisionId,
    parentRevisionId: input.parentRevisionId,
    revalidatedFromRevisionId: input.parentRevisionId,
    revalidatedAt: input.createdAt,
    revisionRequest: input.revisionRequest,
    generatedValidation: input.validation,
  };
  const report: Record<string, unknown> = {
    ...(input.parentReport ?? {}),
    revisionId: input.revisionId,
    parentRevisionId: input.parentRevisionId,
    revisionCacheHit: false,
    revisionRequest: input.revisionRequest,
    generatedValidation: input.validation,
    createdAt: input.createdAt,
  };

  await writeJsonFile(
    path.join(input.exportDir, "generated-validation.json"),
    input.validation,
  );
  await writeJsonFile(
    path.join(input.exportDir, "revision-manifest.json"),
    manifest,
  );
  await writeJsonFile(path.join(input.exportDir, "export-report.json"), report);
  await writeJsonFile(
    path.join(input.exportDir, "invalidation-plan.json"),
    createInvalidationPlan({
      revisionRequest: input.revisionRequest,
      sourceArtifacts: (manifest.sourceArtifacts as SourceArtifactsManifest | null) ?? null,
      codeFileCount:
        typeof (manifest.summary as Record<string, unknown> | undefined)?.codeFileCount ===
        "number"
          ? ((manifest.summary as Record<string, unknown>).codeFileCount as number)
          : undefined,
      routeTemplateCount:
        Array.isArray(
          (manifest.summary as Record<string, unknown> | undefined)?.routeTemplates,
        )
          ? (
              (manifest.summary as Record<string, unknown>).routeTemplates as Array<
                unknown
              >
            ).length
          : undefined,
      componentFamilyCount:
        typeof (input.parentReport?.componentFamilyCount as number | undefined) ===
        "number"
          ? (input.parentReport?.componentFamilyCount as number)
          : undefined,
    }),
  );
  await writeJsonFile(
    path.join(input.exportDir, "artifact-index.json"),
    await createArtifactIndex(
      input.exportDir,
      (manifest.sourceArtifacts as SourceArtifactsManifest | null) ?? null,
    ),
  );
}

async function readJsonFile<T>(filePath: string): Promise<T | null> {
  try {
    return JSON.parse(await fs.readFile(filePath, "utf8")) as T;
  } catch {
    return null;
  }
}

async function readParentSourceArtifacts(
  sharedRevisionCacheRoot: string,
  parentRevisionId?: string,
): Promise<SourceArtifactsManifest | null> {
  if (!parentRevisionId) return null;
  const manifestPath = path.join(
    sharedRevisionCacheRoot,
    parentRevisionId,
    "export",
    "revision-manifest.json",
  );
  const manifest = await readJsonFile<Record<string, unknown>>(manifestPath);
  if (!manifest || typeof manifest !== "object") return null;
  const sourceArtifacts = manifest.sourceArtifacts;
  return sourceArtifacts && typeof sourceArtifacts === "object"
    ? (sourceArtifacts as SourceArtifactsManifest)
    : null;
}

async function writeJsonFile(filePath: string, value: unknown) {
  await writeFile(filePath, `${JSON.stringify(value, null, 2)}\n`);
}

async function finalizeCachedRevisionResult(input: {
  exportDir: string;
  runDir: string;
  cachedRevision: {
    exportDir: string;
    bestAttempt: ExportAttemptResult;
    validation: GeneratedProjectValidation;
  };
  revisionCacheHit: boolean;
}): Promise<LocalExportResult> {
  if (input.revisionCacheHit) {
    const cachedReportPath = path.join(input.exportDir, "export-report.json");
    try {
      const cachedReport = JSON.parse(
        await fs.readFile(cachedReportPath, "utf8"),
      ) as Record<string, unknown>;
      cachedReport.revisionCacheHit = true;
      await writeJsonFile(cachedReportPath, cachedReport);
    } catch {
      // Keep the cached export usable even if the report cannot be patched.
    }
  }

  const manifest =
    (await readJsonFile<Record<string, unknown>>(
      path.join(input.exportDir, "revision-manifest.json"),
    )) ?? {};
  const componentName =
    typeof manifest.summary === "object" &&
    manifest.summary &&
    typeof (manifest.summary as Record<string, unknown>).componentName === "string"
      ? ((manifest.summary as Record<string, unknown>).componentName as string)
      : "CodeRelayExport";
  const zipPath = path.join(input.runDir, `${componentName}.zip`);
  await zipDirectory(input.exportDir, zipPath);
  return {
    exportDir: input.exportDir,
    zipPath,
    reportPath: path.join(input.exportDir, "export-report.json"),
    previewPath: path.join(input.exportDir, "preview.html"),
    bestAttempt: input.cachedRevision.bestAttempt,
    validation: input.cachedRevision.validation,
    revisionManifestPath: path.join(input.exportDir, "revision-manifest.json"),
    invalidationPlanPath: path.join(input.exportDir, "invalidation-plan.json"),
    artifactIndexPath: path.join(input.exportDir, "artifact-index.json"),
    revisionCacheHit: input.revisionCacheHit,
  };
}

async function createArtifactIndex(
  exportDir: string,
  sourceArtifacts?: SourceArtifactsManifest | null,
) {
  const files = await listFiles(exportDir);
  const entries = await Promise.all(
    files.map(async (filePath) => {
      const relativePath = relativeToExport(exportDir, filePath);
      const artifactId = inferArtifactId(relativePath, sourceArtifacts);
      return {
        id: artifactId,
        path: relativePath,
        bytes: (await fs.stat(filePath)).size,
        hash: await hashFile(filePath),
        artifactType: inferArtifactType(filePath),
        dependsOn: inferArtifactDependencies(artifactId, sourceArtifacts),
      };
    }),
  );
  return {
    generatedAt: new Date().toISOString(),
    fileCount: entries.length,
    entries: entries.sort((left, right) => left.path.localeCompare(right.path)),
  };
}

function inferArtifactType(filePath: string) {
  const relativePath = filePath.replace(/\\/g, "/");
  if (relativePath.endsWith("revision-manifest.json")) return "revision-manifest";
  if (relativePath.endsWith("invalidation-plan.json")) return "invalidation-plan";
  if (relativePath.endsWith("artifact-index.json")) return "artifact-index";
  if (relativePath.endsWith("generated-validation.json")) return "validation";
  if (relativePath.endsWith("export-report.json")) return "report";
  if (relativePath.endsWith("best-attempt.json")) return "best-attempt";
  if (relativePath.endsWith("raw-plugin-payload.json")) return "plugin-payload";
  if (relativePath.endsWith("raw-runtime-capture.json")) return "runtime-capture";
  if (relativePath.endsWith("normalized-ir.json")) return "normalized-ir";
  if (relativePath.endsWith("source-artifacts/manifest.json"))
    return "source-artifact-manifest";
  if (relativePath.endsWith("source-artifacts/component-families.json"))
    return "component-families";
  if (relativePath.includes("/source-artifacts/code-files/")) {
    return relativePath.endsWith(".json") ? "code-file-metadata" : "code-file-source";
  }
  if (relativePath.endsWith("patch-history.json")) return "patch-history";
  if (relativePath.endsWith("preview.html")) return "preview";
  if (relativePath.includes("/debug/")) return "debug";
  if (relativePath.endsWith(".tsx")) return "source-tsx";
  if (relativePath.endsWith(".css")) return "source-css";
  if (relativePath.endsWith(".json")) return "json";
  return "file";
}

function inferArtifactId(
  relativePath: string,
  sourceArtifacts?: SourceArtifactsManifest | null,
) {
  if (relativePath === "raw-plugin-payload.json") return "plugin/raw-payload";
  if (relativePath === "raw-runtime-capture.json") return "runtime/raw-capture";
  if (relativePath === "normalized-ir.json") return "ir/normalized";
  if (relativePath === "generated-validation.json") return "validation/generated";
  if (relativePath === "export-report.json") return "report/export";
  if (relativePath === "revision-manifest.json") return "manifest/revision";
  if (relativePath === "invalidation-plan.json") return "manifest/invalidation";
  if (relativePath === "artifact-index.json") return "manifest/artifact-index";
  if (relativePath === "best-attempt.json") return "attempt/best";
  if (relativePath === "patch-history.json") return "attempt/patch-history";
  if (relativePath === "source-artifacts/manifest.json")
    return "manifest/source-artifacts";
  if (relativePath === "source-artifacts/component-families.json") {
    return sourceArtifacts?.componentFamiliesArtifactId ?? "source/component-families";
  }
  if (relativePath.startsWith("source-artifacts/code-files/")) {
    const sourceMatch = (sourceArtifacts?.codeFiles ?? []).find(
      (entry) =>
        entry.metadataPath === relativePath || entry.sourcePath === relativePath,
    );
    if (sourceMatch) return sourceMatch.artifactId;
    return `source/code-file/${slugSegment(relativePath)}`;
  }
  if (relativePath === "preview.html") return "generated/project";
  if (relativePath.startsWith("debug/")) return "debug/artifacts";
  return `artifact/${slugSegment(relativePath)}`;
}

function inferArtifactDependencies(
  artifactId: string,
  sourceArtifacts?: SourceArtifactsManifest | null,
) {
  if (artifactId === "plugin/raw-payload") return [];
  if (artifactId === "runtime/raw-capture") return [];
  if (artifactId.startsWith("source/code-file/")) return ["plugin/raw-payload"];
  if (artifactId === "source/component-families") {
    const codeFileDependencies = (sourceArtifacts?.codeFiles ?? []).map(
      (entry) => entry.artifactId,
    );
    return codeFileDependencies.length > 0
      ? ["plugin/raw-payload", ...codeFileDependencies]
      : ["plugin/raw-payload"];
  }
  if (artifactId === "manifest/source-artifacts") {
    return [
      ...(sourceArtifacts?.componentFamiliesArtifactId
        ? [sourceArtifacts.componentFamiliesArtifactId]
        : []),
      ...(sourceArtifacts?.codeFiles ?? []).map((entry) => entry.artifactId),
    ];
  }
  if (artifactId === "ir/normalized") {
    return [
      "plugin/raw-payload",
      "runtime/raw-capture",
      ...(sourceArtifacts?.componentFamiliesArtifactId
        ? [sourceArtifacts.componentFamiliesArtifactId]
        : []),
      ...(sourceArtifacts?.codeFiles ?? []).map((entry) => entry.artifactId),
    ];
  }
  if (artifactId === "generated/project") return ["ir/normalized"];
  if (artifactId === "validation/generated") return ["generated/project"];
  if (artifactId === "report/export") {
    return ["generated/project", "validation/generated", "ir/normalized"];
  }
  if (artifactId === "manifest/revision") {
    return ["ir/normalized", "validation/generated", "manifest/source-artifacts"];
  }
  if (artifactId === "manifest/invalidation") return ["manifest/revision"];
  if (artifactId === "manifest/artifact-index") return ["manifest/revision"];
  if (artifactId === "attempt/best" || artifactId === "attempt/patch-history") {
    return ["ir/normalized"];
  }
  if (artifactId === "debug/artifacts") return ["generated/project"];
  return [];
}

async function hashFile(filePath: string) {
  const content = await fs.readFile(filePath);
  return crypto.createHash("sha256").update(content).digest("hex");
}

function createSourceArtifactsPreview(ir: ExportIR): SourceArtifactsManifest {
  return {
    generatedAt: new Date().toISOString(),
    componentFamiliesArtifactId:
      (ir.componentFamilies?.length ?? 0) > 0
        ? "source/component-families"
        : undefined,
    codeFiles: (ir.codeFiles ?? []).map((file, index) => ({
      id: file.id,
      name: file.name,
      path: file.path,
      versionId: file.versionId,
      hasContent: file.hasContent ?? Boolean(file.content),
      contentHash: file.contentHash,
      contentByteLength: file.contentByteLength,
      artifactId:
        file.contentHash || file.id || file.path
          ? `source/code-file/${slugSegment(
              file.contentHash ??
                file.id ??
                file.path ??
                `${file.name}-${index}`,
            )}`
          : `source/code-file/${slugSegment(`${file.name}-${index}`)}`,
      metadataPath: "",
      sourcePath: undefined,
    })),
  };
}

function createSourceArtifactDiff(
  current: SourceArtifactsManifest | null,
  parent: SourceArtifactsManifest | null,
): SourceArtifactDiff {
  const currentEntries = current?.codeFiles ?? [];
  const parentEntries = parent?.codeFiles ?? [];
  const currentByIdentity = new Map(
    currentEntries.map((entry) => [sourceArtifactIdentity(entry), entry] as const),
  );
  const parentByIdentity = new Map(
    parentEntries.map((entry) => [sourceArtifactIdentity(entry), entry] as const),
  );

  const changedCodeFileArtifactIds: string[] = [];
  const unchangedCodeFileArtifactIds: string[] = [];
  const addedCodeFileArtifactIds: string[] = [];
  const removedCodeFileArtifactIds: string[] = [];

  for (const [identity, currentEntry] of currentByIdentity) {
    const parentEntry = parentByIdentity.get(identity);
    if (!parentEntry) {
      addedCodeFileArtifactIds.push(currentEntry.artifactId);
      continue;
    }
    if (
      currentEntry.contentHash &&
      parentEntry.contentHash &&
      currentEntry.contentHash === parentEntry.contentHash
    ) {
      unchangedCodeFileArtifactIds.push(currentEntry.artifactId);
    } else if (
      currentEntry.contentHash &&
      parentEntry.contentHash &&
      currentEntry.contentHash !== parentEntry.contentHash
    ) {
      changedCodeFileArtifactIds.push(currentEntry.artifactId);
    } else if (
      currentEntry.hasContent === parentEntry.hasContent &&
      currentEntry.contentByteLength === parentEntry.contentByteLength &&
      currentEntry.name === parentEntry.name &&
      currentEntry.path === parentEntry.path
    ) {
      unchangedCodeFileArtifactIds.push(currentEntry.artifactId);
    } else {
      changedCodeFileArtifactIds.push(currentEntry.artifactId);
    }
  }

  for (const [identity, parentEntry] of parentByIdentity) {
    if (!currentByIdentity.has(identity)) {
      removedCodeFileArtifactIds.push(parentEntry.artifactId);
    }
  }

  const currentFamiliesArtifactId = current?.componentFamiliesArtifactId;
  const parentFamiliesArtifactId = parent?.componentFamiliesArtifactId;
  const componentFamiliesChanged =
    changedCodeFileArtifactIds.length > 0 ||
    addedCodeFileArtifactIds.length > 0 ||
    removedCodeFileArtifactIds.length > 0 ||
    currentFamiliesArtifactId !== parentFamiliesArtifactId;

  return {
    changedCodeFileArtifactIds,
    unchangedCodeFileArtifactIds,
    addedCodeFileArtifactIds,
    removedCodeFileArtifactIds,
    parentComponentFamiliesArtifactId: parentFamiliesArtifactId,
    currentComponentFamiliesArtifactId: currentFamiliesArtifactId,
    componentFamiliesChanged,
  };
}

function sourceArtifactIdentity(
  entry: Pick<
    SourceArtifactsManifest["codeFiles"][number],
    "id" | "path" | "name" | "versionId"
  >,
) {
  return entry.id ?? entry.path ?? `${entry.name}:${entry.versionId ?? ""}`;
}

async function writeSourceArtifacts(
  exportDir: string,
  ir: ExportIR,
): Promise<SourceArtifactsManifest> {
  const rootDir = path.join(exportDir, "source-artifacts");
  const codeFilesDir = path.join(rootDir, "code-files");
  await mkdirp(codeFilesDir);

  let componentFamiliesPath: string | undefined;
  let componentFamiliesArtifactId: string | undefined;
  if ((ir.componentFamilies?.length ?? 0) > 0) {
    const target = path.join(rootDir, "component-families.json");
    await writeJsonFile(target, ir.componentFamilies ?? []);
    componentFamiliesPath = relativeToExport(exportDir, target);
    componentFamiliesArtifactId = "source/component-families";
  }

  const codeFiles = await Promise.all(
    (ir.codeFiles ?? []).map(async (file, index) => {
      const baseName = createCodeFileArtifactBaseName(file, index);
      const metadataPath = path.join(codeFilesDir, `${baseName}.json`);
      const artifactId =
        file.contentHash || file.id || file.path
          ? `source/code-file/${slugSegment(
              file.contentHash ?? file.id ?? file.path ?? baseName,
            )}`
          : `source/code-file/${baseName}`;
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

      let sourcePath: string | undefined;
      if (typeof file.content === "string" && file.content.length > 0) {
        const extension = inferCodeFileExtension(file);
        const target = path.join(codeFilesDir, `${baseName}${extension}`);
        await writeFile(target, file.content);
        sourcePath = relativeToExport(exportDir, target);
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
        metadataPath: relativeToExport(exportDir, metadataPath),
        sourcePath,
      };
    }),
  );

  const manifest = {
    generatedAt: new Date().toISOString(),
    componentFamiliesPath,
    componentFamiliesArtifactId,
    codeFiles,
  } satisfies SourceArtifactsManifest;
  await writeJsonFile(path.join(rootDir, "manifest.json"), manifest);
  return manifest;
}

function createCodeFileArtifactBaseName(file: FramerCodeFile, index: number) {
  const seed =
    file.contentHash ??
    file.id ??
    file.path ??
    `${file.name || "code-file"}-${index}`;
  return slugSegment(seed);
}

function inferCodeFileExtension(file: FramerCodeFile) {
  const explicit = file.path ? path.extname(file.path).trim() : "";
  if (explicit) return explicit.startsWith(".") ? explicit : `.${explicit}`;
  const names = new Set(
    (file.exportDetails ?? [])
      .map((entry) => entry?.type)
      .filter((value): value is string => typeof value === "string"),
  );
  if (names.has("override") || names.has("component")) return ".tsx";
  return ".ts";
}

function slugSegment(value: string) {
  const trimmed = value.trim().toLowerCase();
  const normalized = trimmed.replace(/[^a-z0-9._-]+/g, "-").replace(/^-+|-+$/g, "");
  return normalized || "artifact";
}

function summarizeStyleExtraction(ir: ExportIR) {
  const runtimeNodes = ir.runtimeCapture.nodes;
  const componentNodes = ir.component.nodes;
  const nonMetaEntries = (styles: Record<string, string>) =>
    Object.keys(styles).filter((key) => !key.startsWith("__coderelay"));
  const styledRuntimeNodes = runtimeNodes.filter(
    (node) => nonMetaEntries(node.styles).length > 0,
  );
  const styledComponentNodes = componentNodes.filter(
    (node) => nonMetaEntries(node.styles).length > 0,
  );
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

function summarizeMotionExtraction(ir: ExportIR) {
  const runtimeNodesWithMotion = ir.runtimeCapture.nodes.filter((node) =>
    hasMotionStyles(node.motion) || hasInteractionStateStyles(node.interactionStyles),
  );
  const exportNodesWithMotion = flattenExportTree(ir.exportTree ?? []).filter(
    (node) => hasMotionStyles(node.motion) || hasInteractionStateStyles(node.interactionStyles),
  );

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

function hasMotionStyles(motion: RuntimeNode["motion"] | ExportTreeNode["motion"]) {
  if (!motion) return false;
  return Object.values(motion).some(
    (value) =>
      typeof value === "string" &&
      value.trim().length > 0 &&
      value !== "all 0s ease 0s" &&
      value !== "0s" &&
      value !== "none" &&
      value !== "normal" &&
      value !== "1" &&
      value !== "running",
  );
}

function hasInteractionStateStyles(
  interactionStyles: RuntimeNode["interactionStyles"] | ExportTreeNode["interactionStyles"],
) {
  if (!interactionStyles) return false;
  return ["hover", "focus"].some((state) => {
    const styles = interactionStyles[state as "hover" | "focus"];
    return Boolean(styles && Object.values(styles).some((value) => Boolean(value)));
  });
}

function flattenExportTree(nodes: ExportTreeNode[]): ExportTreeNode[] {
  return nodes.flatMap((node) => [node, ...flattenExportTree(node.children)]);
}

function isVisualSurfaceNode(node: RuntimeNode) {
  if (node.text?.trim()) return false;
  if (node.tag === "img" || node.tag === "a" || node.tag === "button") {
    return false;
  }
  return Boolean(
    node.styles.backgroundColor ||
      node.styles.backgroundImage ||
      node.styles.border ||
      node.styles.borderRadius ||
      node.styles.boxShadow,
  );
}

function cloneWorkingAttemptState(state: {
  ir: ExportIR;
  strategy: typeof baselineStrategy;
}) {
  return {
    ir: structuredClone(state.ir),
    strategy: { ...state.strategy },
  };
}

function collectComparableFidelityMetrics(fidelity: FidelityScores) {
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
  ] satisfies Array<{ key: ComparableFidelityKey; best: number | undefined }>;

  return metrics.filter(
    (entry): entry is { key: ComparableFidelityKey; best: number } =>
      typeof entry.best === "number",
  );
}

function readComparableFidelityMetric(
  fidelity: FidelityScores,
  key: ComparableFidelityKey,
) {
  const value = fidelity[key];
  return typeof value === "number" ? value : undefined;
}

function createReadme(ir: ExportIR, bestAttempt: ExportAttemptResult) {
  return `# ${ir.componentName}

Generated by Coderelay from:

${ir.sourceUrl}

## Run locally

\`\`\`bash
npm install
npm run dev
\`\`\`

This export is a Vite + React + TypeScript project using CSS Modules and Framer Motion.

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

Review \`export-report.json\` before editing.
`;
}

function createAgentBrief(ir: ExportIR, bestAttempt: ExportAttemptResult) {
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
- Patch history: \`patch-history.json\`
- Debug artifact manifest: \`debug/manifest.json\`
- Shared preview styles: \`src/styles.css\`
- Report: \`export-report.json\`

## Guidance

- Start by reading \`export-report.json\`.
- Keep spacing, typography, and responsive behavior close to the original.
- Reconnect forms, analytics, custom embeds, and advanced motion manually if needed.
- This MVP-A export links remote assets instead of bundling them.
- Capture mode: \`${ir.captureMode ?? "plugin-only"}\`.
- Export engine: \`${ir.exportEngine ?? "plugin-approximation"}\`.
- Component modules detected: ${ir.componentModules?.length ?? 0}.
- Code files detected: ${ir.codeFiles?.length ?? 0}.
- Fonts detected: ${ir.fonts?.length ?? 0}.
- CMS collections detected: ${ir.cmsCollections?.length ?? 0}.
- Tree nodes preserved: ${ir.framerTree?.length ?? 0}.
- Merged export tree nodes: ${ir.exportTreeDiagnostics?.totalNodes ?? 0}.
- Best attempt was ${bestAttempt.attemptNumber} using \`${bestAttempt.strategy}\`.
`;
}

function average(values: number[]) {
  if (values.length === 0) {
    return 0;
  }

  return Number(
    (values.reduce((sum, value) => sum + value, 0) / values.length).toFixed(3),
  );
}
