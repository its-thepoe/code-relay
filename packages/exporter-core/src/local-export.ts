import { copy, mkdirp } from "fs-extra";
import { spawn } from "node:child_process";
import fs, { writeFile } from "node:fs/promises";
import { createServer } from "node:http";
import path from "node:path";
import { chromium } from "playwright";
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
  PluginCanvasCapture,
  PreviewValidationResult,
  RuntimeCapture,
  RuntimeNode,
} from "../../shared/src/types.js";
import { captureRuntime, createSimulatedPluginCapture } from "./capture.js";
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
};

type LocalExportResult = {
  exportDir: string;
  zipPath: string;
  reportPath: string;
  previewPath: string;
  bestAttempt: ExportAttemptResult;
  validation: GeneratedProjectValidation;
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
  console.log(
    "[coderelay:core:input]",
    JSON.stringify({
      url: input.url,
      selector: input.selector,
      exportMode: input.exportMode,
      maxAttempts: input.maxAttempts,
      targetFidelity: input.targetFidelity,
      pluginNodeCount: input.pluginCapture?.selectedNodes.length ?? 0,
    }),
  );

  const timestamp = new Date().toISOString().replaceAll(/[:.]/g, "-");
  const runDir = path.resolve(input.outDir, timestamp);
  const workDir = path.join(runDir, "work");
  const attemptsDir = path.join(runDir, "attempts");
  const exportDir = path.join(runDir, "export");

  await mkdirp(workDir);
  await mkdirp(attemptsDir);
  await mkdirp(exportDir);

  const canCaptureFromUrl =
    typeof input.url === "string" &&
    /^https?:\/\//.test(input.url) &&
    input.url.length > 0;
  const runtimeCapture = canCaptureFromUrl
    ? await captureRuntime({
        url: input.url!,
        workDir,
        selector: input.selector,
      })
    : createRuntimeCaptureFromPluginContext(input.pluginCapture);
  console.log(
    "[coderelay:core:capture]",
    JSON.stringify({
      captureMode: canCaptureFromUrl ? "runtime-first" : "plugin-only",
      runtimeNodeCount: runtimeCapture.nodes.length,
      viewportNodeCounts: runtimeCapture.captureDiagnostics?.nodeCount,
      framerStyleCssBytes: Buffer.byteLength(
        runtimeCapture.framerStyleCss ?? "",
      ),
    }),
  );
  const pluginCapture =
    input.pluginCapture ?? createSimulatedPluginCapture(runtimeCapture.nodes);
  const sourceUrl = input.url ?? runtimeCapture.url;
  const nodeMatches = matchPluginNodesToDom(
    pluginCapture,
    runtimeCapture.nodes,
  );
  const ir = buildIntermediateRepresentation({
    url: sourceUrl,
    name: input.name,
    exportMode: input.exportMode,
    captureMode: canCaptureFromUrl ? "runtime-first" : "plugin-only",
    runtimeCapture,
    pluginCapture,
    nodeMatches,
  });
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
  const validation = await validateGeneratedProject(bestAttempt.projectDir);

  await copy(bestAttempt.projectDir, exportDir);
  const debugArtifacts = await bundleDebugArtifacts({
    workDir,
    attemptsDir,
    exportDir,
    attempts,
    bestAttempt,
  });
  const report = createReport(
    ir,
    attempts,
    bestAttempt,
    debugArtifacts,
    validation,
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
    `${JSON.stringify(ir, null, 2)}\n`,
  );
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

  const zipPath = path.join(runDir, `${ir.componentName}.zip`);
  await zipDirectory(exportDir, zipPath);

  return {
    exportDir,
    zipPath,
    reportPath,
    previewPath,
    bestAttempt,
    validation,
  };
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
    const install = await runCommand(
      "npm",
      ["install", "--ignore-scripts", "--no-audit", "--no-fund"],
      projectDir,
      180_000,
    );
    console.log(
      "[coderelay:core:install]",
      JSON.stringify({
        exitCode: install.exitCode,
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
      "npm",
      ["run", "build"],
      projectDir,
      180_000,
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

    const runtime = await inspectBuiltProject(path.join(projectDir, "dist"));
    console.log(
      "[coderelay:core:runtime]",
      JSON.stringify(runtime),
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

    return {
      status: "passed",
      ...generated,
      buildDurationMs: Date.now() - startedAt,
      renderedElementCount: runtime.renderedElementCount,
      renderedTextLength: runtime.renderedTextLength,
      consoleErrors: runtime.consoleErrors,
      pageErrors: runtime.pageErrors,
    };
  } finally {
    // Keep package-lock.json and dist, but never ship installed dependencies.
    await fs.rm(path.join(projectDir, "node_modules"), {
      recursive: true,
      force: true,
    });
  }
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

async function inspectBuiltProject(distDir: string) {
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
    await page.goto(`http://127.0.0.1:${address.port}/`, {
      waitUntil: "networkidle",
      timeout: 30_000,
    });
    await page.waitForTimeout(500);
    return await page.evaluate(
      ({ consoleErrors, pageErrors }) => {
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
          consoleErrors,
          pageErrors,
        };
      },
      { consoleErrors, pageErrors },
    );
  } finally {
    await browser.close();
    await new Promise<void>((resolve) => server.close(() => resolve()));
  }
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
    path.join(input.workDir, "original"),
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
    if (entry.isDirectory()) continue;
    const source = path.join(sourceDir, entry.name);
    const target = path.join(targetDir, entry.name);
    await fs.copyFile(source, target);
    copied.push(target);
  }
  return copied;
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
) {
  const styleStats = summarizeStyleExtraction(ir);
  return {
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
    codeFiles: (ir.codeFiles ?? []).map((file) => ({
      id: file.id,
      name: file.name,
      path: file.path,
      exports: file.exports,
      insertURL: file.insertURL,
      source: file.source,
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
    runtimeCapture: {
      breakpointsCaptured:
        ir.runtimeCapture.captureDiagnostics?.breakpointsCaptured ?? [],
      stylesheetCount: ir.runtimeCapture.captureDiagnostics?.stylesheetCount,
      nodeCount: ir.runtimeCapture.captureDiagnostics?.nodeCount,
      fontsReady: ir.runtimeCapture.captureDiagnostics?.fontReadiness,
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
