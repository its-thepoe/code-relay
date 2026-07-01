import test from "node:test";
import assert from "node:assert/strict";
import os from "node:os";
import path from "node:path";
import fs from "node:fs/promises";
import { createServer } from "node:http";
import {
  createNormalizedIrArtifact,
  runLocalExport,
  readFullSiteRouteManifest,
  validateGeneratedProject,
} from "./local-export.js";
import { CAPTURED_STYLE_PROPERTIES } from "./capture.js";
import type {
  ExportIR,
  PluginCanvasCapture,
} from "../../shared/src/types.js";

function createPluginCapture(): PluginCanvasCapture {
  return {
    mode: "framer-plugin",
    capturedAt: "2026-06-12T00:00:00.000Z",
    selectedNodes: [
      {
        id: "root",
        name: "Hero",
        type: "FrameNode",
        bounds: { x: 0, y: 0, width: 640, height: 320 },
        metadata: {
          rootId: "root",
          rootName: "Hero",
          rootKind: "component",
          sourceIndex: 0,
          depth: 0,
          path: "1",
          styles: {
            display: "flex",
            flexDirection: "column",
            gap: "24px",
            padding: "32px",
            backgroundColor: "#111827",
            backgroundImage: 'url("https://example.com/bg.png")',
            overflow: "hidden",
            aspectRatio: "16 / 9",
          },
        },
      },
      {
        id: "heading",
        name: "Heading",
        type: "TextNode",
        text: "Hello world",
        bounds: { x: 32, y: 32, width: 240, height: 48 },
        metadata: {
          rootId: "root",
          rootName: "Hero",
          rootKind: "component",
          sourceIndex: 0,
          depth: 1,
          parentId: "root",
          path: "1.1",
          tag: "h1",
          styles: {
            color: "#f9fafb",
            fontSize: "42px",
            lineHeight: "48px",
            fontWeight: "800",
          },
        },
      },
    ],
    context: {
      exportMode: "selection",
      captureMode: "plugin-only",
      project: {
        id: "integration-smoke",
        name: "Integration Smoke",
      },
    },
  };
}

test("runtime capture property allowlist includes fidelity-critical fields", () => {
  assert.equal(CAPTURED_STYLE_PROPERTIES.includes("background"), true);
  assert.equal(CAPTURED_STYLE_PROPERTIES.includes("paddingTop"), true);
  assert.equal(CAPTURED_STYLE_PROPERTIES.includes("overflow"), true);
  assert.equal(CAPTURED_STYLE_PROPERTIES.includes("aspectRatio"), true);
  assert.equal(CAPTURED_STYLE_PROPERTIES.includes("zIndex"), true);
  assert.equal(CAPTURED_STYLE_PROPERTIES.includes("placeItems"), true);
});

test("normalized IR artifact summarizes materialized full-site route trees", () => {
  const repeatedNodes = Array.from({ length: 10_000 }, (_, index) => ({
    id: `node-${index}`,
    children: [],
  }));
  const ir = {
    pluginCapture: {
      mode: "framer-plugin",
      capturedAt: "2026-07-01T00:00:00.000Z",
      selectedNodes: [],
    },
    runtimeCapture: {
      url: "https://example.com",
      title: "Large site",
      mode: "page",
      routeCaptures: [],
    },
    component: { semanticType: "page", nodes: [], sections: [] },
    sitePages: [
      {
        componentName: "Large",
        routePath: "/large",
        title: "Large",
        nodes: repeatedNodes,
        exportTree: repeatedNodes,
      },
    ],
  } as unknown as ExportIR;

  const artifact = createNormalizedIrArtifact(ir);
  const serialized = JSON.stringify(artifact);

  assert.equal(artifact.artifactFormat, "summary");
  assert.equal(artifact.sitePages[0]?.nodeCount, 10_000);
  assert.equal("nodes" in (artifact.sitePages[0] ?? {}), false);
  assert.ok(serialized.length < 10_000);
});

test("normalized IR artifact includes route template summaries", () => {
  const ir = {
    pluginCapture: {
      mode: "framer-plugin",
      capturedAt: "2026-07-01T00:00:00.000Z",
      selectedNodes: [],
    },
    runtimeCapture: {
      url: "https://example.com",
      title: "Template site",
      mode: "page",
      routeCaptures: [],
    },
    component: { semanticType: "page", nodes: [], sections: [] },
    routeTemplates: [
      {
        templateId: "/blog/:slug",
        templatePath: "/blog/:slug",
        templateKind: "cms",
        representativeRoutePath: "/blog/alpha",
        routePaths: ["/blog/alpha", "/blog/beta"],
        routeCount: 2,
        sourceTextLength: 240,
        nodeCount: 18,
      },
    ],
    sitePages: [
      {
        componentName: "Blog",
        routePath: "/blog/alpha",
        title: "Blog alpha",
        nodes: [],
        exportTree: [],
        templateId: "/blog/:slug",
        templatePath: "/blog/:slug",
        templateKind: "cms",
      },
    ],
  } as unknown as ExportIR;

  const artifact = createNormalizedIrArtifact(ir);

  assert.equal(artifact.routeTemplates?.[0]?.routeCount, 2);
  assert.equal(artifact.routeTemplates?.[0]?.templateKind, "cms");
  assert.equal(artifact.sitePages[0]?.templateId, "/blog/:slug");
});

test("runLocalExport rejects a missing exportMode before generating files", async () => {
  const outDir = await fs.mkdtemp(
    path.join(os.tmpdir(), "coderelay-missing-export-mode-"),
  );

  await assert.rejects(
    runLocalExport({
      outDir,
      pluginCapture: createPluginCapture(),
      maxAttempts: 1,
      targetFidelity: 0.92,
    }),
    /Missing exportMode/,
  );
  assert.deepEqual(await fs.readdir(outDir), []);
});

test("CMS route expansion requires an exact page collection id", () => {
  const base: PluginCanvasCapture = {
    mode: "framer-plugin",
    capturedAt: "2026-06-30T00:00:00.000Z",
    selectedNodes: [],
    context: {
      sitePages: [{ name: "Post", path: "/blog/:slug" }],
      cmsCollections: [
        {
          id: "posts",
          name: "Posts",
          fields: [],
          items: [{ id: "one", slug: "first-post", fieldKeys: [] }],
        },
      ],
    },
  };
  assert.deepEqual(readFullSiteRouteManifest(base), [
    {
      path: "/blog/:slug",
      title: "Post",
      collectionId: undefined,
      templateId: "/blog/:slug",
      templatePath: "/blog/:slug",
      templateKind: "cms",
    },
  ]);

  base.context!.sitePages = [
    {
      name: "Post",
      path: "/blog/:slug",
      collectionId: "posts",
    },
  ];
  assert.deepEqual(readFullSiteRouteManifest(base), [
    {
      path: "/blog/first-post",
      title: "Post - first-post",
      collectionId: "posts",
      templateId: "/blog/:slug",
      templatePath: "/blog/:slug",
      templateKind: "cms",
    },
  ]);
});

test("full-site route manifest excludes drafts and the explicit 404 page", () => {
  const capture = createPluginCapture();
  capture.context!.sitePages = [
    { name: "Home", path: "/" },
    { name: "Draft", path: "/drafts/landing" },
    { name: "Not found", path: "/404" },
    { name: "Public", path: "/about" },
  ];

  assert.deepEqual(readFullSiteRouteManifest(capture), [
    {
      path: "/",
      title: "Home",
      collectionId: undefined,
      templateId: "/",
      templatePath: "/",
      templateKind: "static",
    },
    {
      path: "/about",
      title: "Public",
      collectionId: undefined,
      templateId: "/about",
      templatePath: "/about",
      templateKind: "static",
    },
  ]);
});

test("generated validation rejects a mounted but visually empty route", async () => {
  const projectDir = await fs.mkdtemp(
    path.join(os.tmpdir(), "coderelay-empty-route-"),
  );
  await fs.mkdir(path.join(projectDir, "dist"), { recursive: true });
  await fs.writeFile(
    path.join(projectDir, "package.json"),
    JSON.stringify({
      name: "empty-route",
      private: true,
      scripts: { build: "node -e \"process.exit(0)\"" },
    }),
  );
  await fs.writeFile(
    path.join(projectDir, "route-manifest.json"),
    JSON.stringify([
      {
        path: "/",
        sourceTextLength: 120,
        sourceNodeCount: 12,
      },
    ]),
  );
  await fs.writeFile(
    path.join(projectDir, "placeholder.tsx"),
    "export const Placeholder = () => null\n",
  );
  await fs.writeFile(
    path.join(projectDir, "placeholder.css"),
    "body { background: #001a4c; }\n",
  );
  await fs.writeFile(
    path.join(projectDir, "preview.html"),
    "<!doctype html><html><body>preview</body></html>",
  );
  await fs.writeFile(
    path.join(projectDir, "dist", "index.html"),
    `<!doctype html><html><body style="margin:0;background:#001a4c">
      <div id="root"><main style="min-height:100vh">
        <div></div><div></div><div></div><div></div><div></div><div></div>
      </main></div>
    </body></html>`,
  );

  await assert.rejects(
    validateGeneratedProject(projectDir),
    /near-empty.*sourceText=120.*renderedText=0/s,
  );
});

test("runLocalExport writes raw runtime capture artifact for plugin-only exports", async () => {
  const outDir = await fs.mkdtemp(
    path.join(os.tmpdir(), "coderelay-local-export-"),
  );

  const result = await runLocalExport({
    outDir,
    pluginCapture: createPluginCapture(),
    name: "IntegrationSmoke",
    exportMode: "selection",
    maxAttempts: 1,
    targetFidelity: 0.92,
  });

  const runtimeCapturePath = path.join(result.exportDir, "raw-runtime-capture.json");
  const reportPath = path.join(result.exportDir, "export-report.json");
  const patchHistoryPath = path.join(result.exportDir, "patch-history.json");
  const debugManifestPath = path.join(result.exportDir, "debug", "manifest.json");
  const debugSummaryPath = path.join(
    result.exportDir,
    "debug",
    "attempts",
    "attempt-1",
    "summary.json",
  );
  const runtimeCapture = JSON.parse(await fs.readFile(runtimeCapturePath, "utf8"));
  const report = JSON.parse(await fs.readFile(reportPath, "utf8"));
  const patchHistory = JSON.parse(await fs.readFile(patchHistoryPath, "utf8"));
  const debugManifest = JSON.parse(await fs.readFile(debugManifestPath, "utf8"));
  const debugSummary = JSON.parse(await fs.readFile(debugSummaryPath, "utf8"));
  const invalidationPlan = JSON.parse(
    await fs.readFile(result.invalidationPlanPath!, "utf8"),
  );
  const artifactIndex = JSON.parse(
    await fs.readFile(result.artifactIndexPath!, "utf8"),
  );

  assert.equal(Array.isArray(runtimeCapture.nodes), true);
  assert.equal(runtimeCapture.nodes.length > 0, true);
  assert.equal(runtimeCapture.nodes[0]?.styles?.backgroundImage, 'url("https://example.com/bg.png")');
  assert.equal(runtimeCapture.nodes[0]?.styles?.overflow, "hidden");
  assert.equal(runtimeCapture.nodes[0]?.styles?.aspectRatio, "16 / 9");
  assert.equal(report.captureMode, "plugin-only");
  assert.equal(result.validation.status, "passed");
  assert.equal(result.validation.renderedElementCount > 0, true);
  assert.equal(report.generatedValidation?.status, "passed");
  assert.equal(
    ["validated", "blocked"].includes(report.previewValidation?.status ?? ""),
    true,
  );
  assert.equal(
    ["validated", "blocked"].includes(
      report.attempts?.[0]?.previewValidation?.status ?? "",
    ),
    true,
  );
  assert.equal(
    String(report.runtimeCapture?.breakpointsCaptured?.length ?? 0) !== "0",
    true,
  );
  assert.equal(debugManifest.bestAttempt, 1);
  assert.equal(Array.isArray(debugManifest.attempts), true);
  assert.equal(debugManifest.attempts[0]?.attempt, 1);
  assert.equal(typeof debugManifest.attempts[0]?.summary, "string");
  assert.equal(report.debugArtifacts?.manifestPath, "debug/manifest.json");
  assert.equal(report.debugArtifacts?.bestAttempt, 1);
  assert.equal(report.debugArtifacts?.attempts?.[0]?.attempt, 1);
  assert.equal(
    report.debugArtifacts?.attempts?.[0]?.summary,
    "debug/attempts/attempt-1/summary.json",
  );
  assert.equal(report.patchHistoryPath, "patch-history.json");
  assert.equal(Array.isArray(patchHistory), true);
  assert.equal(patchHistory[0]?.attempt, 1);
  assert.equal(
    typeof report.attempts?.[0]?.patchTargets === "object" ||
      typeof report.attempts?.[0]?.patchTargets === "undefined",
    true,
  );
  assert.equal(
    typeof debugSummary.patchTargets === "object" ||
      typeof debugSummary.patchTargets === "undefined",
    true,
  );
  assert.equal(debugSummary.attempt, 1);
  assert.equal(debugSummary.selectedAsBest, true);
  assert.equal(invalidationPlan.kind, "initial");
  assert.equal(Array.isArray(invalidationPlan.invalidated), true);
  assert.equal(typeof artifactIndex.fileCount, "number");
  assert.equal(
    Array.isArray(artifactIndex.entries) &&
      artifactIndex.entries.some(
        (entry: Record<string, unknown>) =>
          entry.path === "revision-manifest.json",
      ),
    true,
  );
  assert.equal(
    Array.isArray(artifactIndex.entries) &&
      artifactIndex.entries.some(
        (entry: Record<string, unknown>) =>
          entry.id === "generated/project" &&
          Array.isArray(entry.dependsOn) &&
          entry.dependsOn.includes("ir/normalized"),
      ),
    true,
  );
});

test("runLocalExport persists readable code files as source artifacts", async () => {
  const outDir = await fs.mkdtemp(
    path.join(os.tmpdir(), "coderelay-source-artifacts-"),
  );
  const pluginCapture = createPluginCapture();
  pluginCapture.context = {
    ...(pluginCapture.context ?? {}),
    codeFiles: [
      {
        id: "code-file-button",
        name: "Button.tsx",
        path: "code/Button.tsx",
        versionId: "v1",
        source: "framer",
        content:
          'export function Button(){ return <button type="button">Press</button> }',
        contentHash: "buttonhash",
        contentByteLength: 72,
        hasContent: true,
        exportDetails: [
          {
            name: "Button",
            type: "component",
            insertURL: "https://framer.com/m/Button.js",
            isDefaultExport: false,
            componentIdentifier: "Button",
            componentName: "Button",
            isPrimaryVariant: true,
          },
        ],
        exports: ["Button"],
      },
    ],
  };

  const result = await runLocalExport({
    outDir,
    pluginCapture,
    name: "IntegrationSmoke",
    exportMode: "selection",
    maxAttempts: 1,
    targetFidelity: 0.92,
  });

  const sourceManifest = JSON.parse(
    await fs.readFile(
      path.join(result.exportDir, "source-artifacts", "manifest.json"),
      "utf8",
    ),
  ) as Record<string, unknown>;
  const codeFileEntry = Array.isArray(sourceManifest.codeFiles)
    ? (sourceManifest.codeFiles[0] as Record<string, unknown>)
    : undefined;
  const metadata = JSON.parse(
    await fs.readFile(
      path.join(result.exportDir, String(codeFileEntry?.metadataPath ?? "")),
      "utf8",
    ),
  ) as Record<string, unknown>;
  const report = JSON.parse(await fs.readFile(result.reportPath, "utf8")) as Record<
    string,
    unknown
  >;
  const artifactIndex = JSON.parse(
    await fs.readFile(result.artifactIndexPath!, "utf8"),
  ) as Record<string, unknown>;

  assert.equal(Array.isArray(sourceManifest.codeFiles), true);
  assert.equal(codeFileEntry?.name, "Button.tsx");
  assert.equal(codeFileEntry?.hasContent, true);
  assert.equal(
    typeof codeFileEntry?.artifactId === "string" &&
      String(codeFileEntry.artifactId).startsWith("source/code-file/"),
    true,
  );
  assert.equal(typeof codeFileEntry?.sourcePath, "string");
  assert.equal(metadata.contentHash, "buttonhash");
  assert.equal(
    Array.isArray((report.sourceArtifacts as Record<string, unknown>)?.codeFiles),
    true,
  );
  assert.equal(
    Array.isArray(report.codeFiles) &&
      typeof (report.codeFiles[0] as Record<string, unknown>)?.artifact === "object",
    true,
  );
  assert.equal(
    Array.isArray(artifactIndex.entries) &&
      artifactIndex.entries.some(
        (entry: Record<string, unknown>) =>
          entry.id === codeFileEntry?.artifactId &&
          Array.isArray(entry.dependsOn) &&
          entry.dependsOn.includes("plugin/raw-payload"),
      ),
    true,
  );
});

test("component-focused improvement revisions write dependency-scoped invalidation entries", async () => {
  const outDir = await fs.mkdtemp(
    path.join(os.tmpdir(), "coderelay-component-invalidation-"),
  );
  const pluginCapture = createPluginCapture();
  pluginCapture.context = {
    ...(pluginCapture.context ?? {}),
    codeFiles: [
      {
        id: "code-file-tabs",
        name: "Tabs.tsx",
        path: "code/Tabs.tsx",
        versionId: "v1",
        source: "framer",
        content: 'export function Tabs(){ return <div>Tabs</div> }',
        contentHash: "tabshash",
        contentByteLength: 48,
        hasContent: true,
        exportDetails: [
          {
            name: "Tabs",
            type: "component",
            insertURL: "https://framer.com/m/Tabs.js",
            componentIdentifier: "Tabs",
            componentName: "Tabs",
            isPrimaryVariant: true,
          },
        ],
        exports: ["Tabs"],
      },
    ],
  };

  const result = await runLocalExport({
    outDir,
    pluginCapture,
    name: "IntegrationSmoke",
    exportMode: "selection",
    maxAttempts: 1,
    targetFidelity: 0.92,
    revisionRequest: {
      kind: "improvement",
      requestedFocus: "components",
      parentRevisionId: "revision_parent",
    },
  });

  const invalidationPlan = JSON.parse(
    await fs.readFile(result.invalidationPlanPath!, "utf8"),
  ) as Record<string, unknown>;
  const invalidated = Array.isArray(invalidationPlan.invalidated)
    ? (invalidationPlan.invalidated as Array<Record<string, unknown>>)
    : [];

  assert.equal(invalidationPlan.requestedFocus, "components");
  assert.equal(
    invalidated.some(
      (entry) =>
        entry.artifact === "source/component-families" &&
        entry.reason === "component-source-refresh" &&
        Array.isArray(entry.dependsOn) &&
        entry.dependsOn.some((value) => String(value).startsWith("source/code-file/")),
    ),
    true,
  );
  assert.equal(
    invalidated.some(
      (entry) =>
        entry.artifact === "generated/project" &&
        entry.reason === "depends-on-component-model" &&
        Array.isArray(entry.dependsOn) &&
        entry.dependsOn.includes("ir/normalized"),
    ),
    true,
  );
});

test("component-focused improvements record changed and unchanged source artifacts against the parent revision", async () => {
  const rootDir = await fs.mkdtemp(
    path.join(os.tmpdir(), "coderelay-source-diff-"),
  );
  const outDirA = path.join(rootDir, "artifacts", "job-a");
  const outDirB = path.join(rootDir, "artifacts", "job-b");
  await fs.mkdir(outDirA, { recursive: true });
  await fs.mkdir(outDirB, { recursive: true });

  const initialCapture = createPluginCapture();
  initialCapture.context = {
    ...(initialCapture.context ?? {}),
    codeFiles: [
      {
        id: "code-file-tabs",
        name: "Tabs.tsx",
        path: "code/Tabs.tsx",
        versionId: "v1",
        source: "framer",
        content: 'export function Tabs(){ return <div>v1</div> }',
        contentHash: "tabs-v1",
        contentByteLength: 46,
        hasContent: true,
        exportDetails: [{ name: "Tabs", type: "component" }],
        exports: ["Tabs"],
      },
      {
        id: "code-file-card",
        name: "Card.tsx",
        path: "code/Card.tsx",
        versionId: "v1",
        source: "framer",
        content: 'export function Card(){ return <div>same</div> }',
        contentHash: "card-same",
        contentByteLength: 49,
        hasContent: true,
        exportDetails: [{ name: "Card", type: "component" }],
        exports: ["Card"],
      },
    ],
  };

  const initial = await runLocalExport({
    outDir: outDirA,
    pluginCapture: initialCapture,
    name: "IntegrationSmoke",
    exportMode: "selection",
    maxAttempts: 1,
    targetFidelity: 0.92,
  });
  const initialManifest = JSON.parse(
    await fs.readFile(initial.revisionManifestPath!, "utf8"),
  ) as { revisionId: string };

  const nextCapture = createPluginCapture();
  nextCapture.context = {
    ...(nextCapture.context ?? {}),
    codeFiles: [
      {
        id: "code-file-tabs",
        name: "Tabs.tsx",
        path: "code/Tabs.tsx",
        versionId: "v2",
        source: "framer",
        content: 'export function Tabs(){ return <div>v2</div> }',
        contentHash: "tabs-v2",
        contentByteLength: 46,
        hasContent: true,
        exportDetails: [{ name: "Tabs", type: "component" }],
        exports: ["Tabs"],
      },
      {
        id: "code-file-card",
        name: "Card.tsx",
        path: "code/Card.tsx",
        versionId: "v1",
        source: "framer",
        content: 'export function Card(){ return <div>same</div> }',
        contentHash: "card-same",
        contentByteLength: 49,
        hasContent: true,
        exportDetails: [{ name: "Card", type: "component" }],
        exports: ["Card"],
      },
    ],
  };

  const next = await runLocalExport({
    outDir: outDirB,
    pluginCapture: nextCapture,
    name: "IntegrationSmoke",
    exportMode: "selection",
    maxAttempts: 1,
    targetFidelity: 0.92,
    revisionRequest: {
      kind: "improvement",
      requestedFocus: "components",
      parentRevisionId: initialManifest.revisionId,
    },
  });

  const invalidationPlan = JSON.parse(
    await fs.readFile(next.invalidationPlanPath!, "utf8"),
  ) as Record<string, unknown>;
  const sourceDiff = invalidationPlan.sourceDiff as Record<string, unknown>;

  assert.equal(Array.isArray(sourceDiff.changedCodeFileArtifactIds), true);
  assert.equal(
    (sourceDiff.changedCodeFileArtifactIds as Array<unknown>).length,
    1,
  );
  assert.equal(
    (sourceDiff.unchangedCodeFileArtifactIds as Array<unknown>).length,
    1,
  );
  assert.equal(
    Array.isArray(invalidationPlan.reused) &&
      (invalidationPlan.reused as Array<unknown>).some((entry) =>
        String(entry).startsWith("source/code-file/"),
      ),
    true,
  );
});

test("component-focused improvements reuse the parent export when source artifacts are unchanged", async () => {
  const rootDir = await fs.mkdtemp(
    path.join(os.tmpdir(), "coderelay-component-noop-"),
  );
  const outDirA = path.join(rootDir, "artifacts", "job-a");
  const outDirB = path.join(rootDir, "artifacts", "job-b");
  await fs.mkdir(outDirA, { recursive: true });
  await fs.mkdir(outDirB, { recursive: true });

  const capture = createPluginCapture();
  capture.context = {
    ...(capture.context ?? {}),
    codeFiles: [
      {
        id: "code-file-tabs",
        name: "Tabs.tsx",
        path: "code/Tabs.tsx",
        versionId: "v1",
        source: "framer",
        content: 'export function Tabs(){ return <div>same</div> }',
        contentHash: "tabs-same",
        contentByteLength: 48,
        hasContent: true,
        exportDetails: [{ name: "Tabs", type: "component" }],
        exports: ["Tabs"],
      },
    ],
  };

  const initial = await runLocalExport({
    outDir: outDirA,
    pluginCapture: capture,
    name: "IntegrationSmoke",
    exportMode: "selection",
    maxAttempts: 1,
    targetFidelity: 0.92,
  });
  const initialManifest = JSON.parse(
    await fs.readFile(initial.revisionManifestPath!, "utf8"),
  ) as { revisionId: string };

  const next = await runLocalExport({
    outDir: outDirB,
    pluginCapture: capture,
    name: "IntegrationSmoke",
    exportMode: "selection",
    maxAttempts: 1,
    targetFidelity: 0.92,
    revisionRequest: {
      kind: "improvement",
      requestedFocus: "components",
      parentRevisionId: initialManifest.revisionId,
    },
  });

  const nextManifest = JSON.parse(
    await fs.readFile(next.revisionManifestPath!, "utf8"),
  ) as Record<string, unknown>;
  const nextReport = JSON.parse(
    await fs.readFile(next.reportPath, "utf8"),
  ) as Record<string, unknown>;
  const invalidationPlan = JSON.parse(
    await fs.readFile(next.invalidationPlanPath!, "utf8"),
  ) as Record<string, unknown>;
  const sourceDiff = invalidationPlan.sourceDiff as Record<string, unknown>;

  assert.equal(next.revisionCacheHit, false);
  assert.equal(nextManifest.parentRevisionId, initialManifest.revisionId);
  assert.equal(nextManifest.reusedBecause, "component-source-unchanged");
  assert.equal(nextReport.reusedBecause, "component-source-unchanged");
  assert.equal(
    (sourceDiff.changedCodeFileArtifactIds as Array<unknown>).length,
    0,
  );
  assert.equal(
    (sourceDiff.unchangedCodeFileArtifactIds as Array<unknown>).length,
    1,
  );
});

test("runLocalExport reuses a completed revision cache on identical exports", async () => {
  const outDir = await fs.mkdtemp(
    path.join(os.tmpdir(), "coderelay-revision-cache-"),
  );

  const input = {
    outDir,
    pluginCapture: createPluginCapture(),
    name: "IntegrationSmoke",
    exportMode: "selection" as const,
    maxAttempts: 1,
    targetFidelity: 0.92,
  };

  const first = await runLocalExport(input);
  const second = await runLocalExport(input);

  assert.equal(first.revisionCacheHit, false);
  assert.equal(second.revisionCacheHit, true);
  assert.equal(
    JSON.parse(await fs.readFile(first.revisionManifestPath!, "utf8")).revisionId,
    JSON.parse(await fs.readFile(second.revisionManifestPath!, "utf8")).revisionId,
  );
});

test("runLocalExport reuses revision cache across different job output directories", async () => {
  const rootDir = await fs.mkdtemp(
    path.join(os.tmpdir(), "coderelay-shared-revision-cache-"),
  );
  const outDirA = path.join(rootDir, "artifacts", "job-a");
  const outDirB = path.join(rootDir, "artifacts", "job-b");
  await fs.mkdir(outDirA, { recursive: true });
  await fs.mkdir(outDirB, { recursive: true });

  const first = await runLocalExport({
    outDir: outDirA,
    pluginCapture: createPluginCapture(),
    name: "IntegrationSmoke",
    exportMode: "selection",
    maxAttempts: 1,
    targetFidelity: 0.92,
  });
  const second = await runLocalExport({
    outDir: outDirB,
    pluginCapture: createPluginCapture(),
    name: "IntegrationSmoke",
    exportMode: "selection",
    maxAttempts: 1,
    targetFidelity: 0.92,
  });

  assert.equal(first.revisionCacheHit, false);
  assert.equal(second.revisionCacheHit, true);
  assert.equal(
    JSON.parse(await fs.readFile(first.revisionManifestPath!, "utf8")).revisionId,
    JSON.parse(await fs.readFile(second.revisionManifestPath!, "utf8")).revisionId,
  );
});

test("runLocalExport can create a revalidate-only revision from a parent revision", async () => {
  const rootDir = await fs.mkdtemp(
    path.join(os.tmpdir(), "coderelay-revalidate-revision-"),
  );
  const outDirA = path.join(rootDir, "artifacts", "job-a");
  const outDirB = path.join(rootDir, "artifacts", "job-b");
  await fs.mkdir(outDirA, { recursive: true });
  await fs.mkdir(outDirB, { recursive: true });

  const initial = await runLocalExport({
    outDir: outDirA,
    pluginCapture: createPluginCapture(),
    name: "IntegrationSmoke",
    exportMode: "selection",
    maxAttempts: 1,
    targetFidelity: 0.92,
  });
  const initialManifest = JSON.parse(
    await fs.readFile(initial.revisionManifestPath!, "utf8"),
  ) as {
    revisionId: string;
  };

  const revalidated = await runLocalExport({
    outDir: outDirB,
    pluginCapture: {
      ...createPluginCapture(),
      selectedNodes: [],
      context: {
        exportMode: "selection",
        captureMode: "plugin-only",
        project: {
          id: "broken-should-not-be-used",
          name: "Broken should not be used",
        },
      },
    },
    name: "IntegrationSmoke",
    exportMode: "selection",
    maxAttempts: 1,
    targetFidelity: 0.92,
    revisionRequest: {
      kind: "improvement",
      requestedFocus: "revalidate",
      parentRevisionId: initialManifest.revisionId,
    },
  });

  const revalidatedManifest = JSON.parse(
    await fs.readFile(revalidated.revisionManifestPath!, "utf8"),
  ) as Record<string, unknown>;
  const revalidatedReport = JSON.parse(
    await fs.readFile(revalidated.reportPath, "utf8"),
  ) as Record<string, unknown>;
  const revalidatedInvalidation = JSON.parse(
    await fs.readFile(revalidated.invalidationPlanPath!, "utf8"),
  ) as Record<string, unknown>;
  const revalidatedArtifactIndex = JSON.parse(
    await fs.readFile(revalidated.artifactIndexPath!, "utf8"),
  ) as Record<string, unknown>;

  assert.equal(revalidated.revisionCacheHit, false);
  assert.notEqual(revalidatedManifest.revisionId, initialManifest.revisionId);
  assert.equal(
    revalidatedManifest.parentRevisionId,
    initialManifest.revisionId,
  );
  assert.equal(
    (revalidatedManifest.revisionRequest as Record<string, unknown>)
      ?.requestedFocus,
    "revalidate",
  );
  assert.equal(
    (revalidatedReport.revisionRequest as Record<string, unknown>)
      ?.requestedFocus,
    "revalidate",
  );
  assert.equal(
    (revalidatedReport.generatedValidation as Record<string, unknown>)?.status,
    "passed",
  );
  assert.equal(revalidatedInvalidation.requestedFocus, "revalidate");
  assert.equal(
    Array.isArray(revalidatedInvalidation.reused) &&
      revalidatedInvalidation.reused.includes("generated/project"),
    true,
  );
  assert.equal(typeof revalidatedArtifactIndex.fileCount, "number");
});

test("runLocalExport rejects revalidate-only revisions without a parent revision id", async () => {
  const outDir = await fs.mkdtemp(
    path.join(os.tmpdir(), "coderelay-revalidate-missing-parent-"),
  );

  await assert.rejects(
    runLocalExport({
      outDir,
      pluginCapture: createPluginCapture(),
      name: "IntegrationSmoke",
      exportMode: "selection",
      maxAttempts: 1,
      targetFidelity: 0.92,
      revisionRequest: {
        kind: "improvement",
        requestedFocus: "revalidate",
      },
    }),
    /Missing parentRevisionId/,
  );
});

test("runLocalExport reconstructs plugin-only runtime nodes from framerTree when selected nodes are empty", async () => {
  const outDir = await fs.mkdtemp(
    path.join(os.tmpdir(), "coderelay-local-export-tree-"),
  );

  const result = await runLocalExport({
    outDir,
    exportMode: "selection",
    pluginCapture: {
      mode: "framer-plugin",
      capturedAt: "2026-06-12T00:00:00.000Z",
      selectedNodes: [],
      context: {
        exportMode: "selection",
        captureMode: "plugin-only",
        project: {
          id: "framer-tree-only",
          name: "Framer Tree Only",
        },
        framerTree: [
          {
            id: "root",
            type: "FrameNode",
            name: "Hero",
            childIds: ["heading", "image"],
            depth: 0,
            path: "1",
            rootId: "root",
            rootName: "Hero",
            rootKind: "component",
            rect: { x: 0, y: 0, width: 720, height: 420 },
            traits: {},
            styles: {
              display: "flex",
              flexDirection: "column",
              gap: "20px",
              padding: "32px",
              backgroundColor: "#0f172a",
            },
          },
          {
            id: "heading",
            type: "TextNode",
            name: "Heading",
            text: "Tree fallback heading",
            parentId: "root",
            childIds: [],
            depth: 1,
            path: "1.1",
            rootId: "root",
            rootName: "Hero",
            rootKind: "component",
            rect: { x: 32, y: 32, width: 280, height: 48 },
            traits: {},
            styles: {
              color: "#f8fafc",
              fontSize: "40px",
              lineHeight: "48px",
            },
          },
          {
            id: "image",
            type: "FrameNode",
            name: "Image",
            parentId: "root",
            childIds: [],
            depth: 1,
            path: "1.2",
            rootId: "root",
            rootName: "Hero",
            rootKind: "component",
            rect: { x: 32, y: 120, width: 320, height: 180 },
            traits: {},
            styles: {
              borderRadius: "16px",
            },
            asset: {
              kind: "image",
              src: "https://example.com/tree-image.png",
              alt: "Tree image",
            },
          },
        ],
      },
    },
    name: "FramerTreeOnly",
    maxAttempts: 1,
    targetFidelity: 0.92,
  });

  const runtimeCapturePath = path.join(result.exportDir, "raw-runtime-capture.json");
  const exportTreePath = path.join(result.exportDir, "export-tree.json");
  const runtimeCapture = JSON.parse(await fs.readFile(runtimeCapturePath, "utf8"));
  const exportTree = JSON.parse(await fs.readFile(exportTreePath, "utf8"));

  assert.equal(runtimeCapture.nodes.length, 3);
  assert.equal(runtimeCapture.nodes[0]?.id, "root");
  assert.equal(runtimeCapture.nodes[0]?.styles?.display, "flex");
  assert.equal(runtimeCapture.nodes[1]?.text, "Tree fallback heading");
  assert.equal(runtimeCapture.nodes[2]?.attributes?.src, "https://example.com/tree-image.png");
  assert.equal(
    String(runtimeCapture.nodes[2]?.domPath).includes("img:nth-child(2)"),
    true,
  );
  assert.equal(exportTree[0]?.children?.length, 2);
});

test("runLocalExport crawls, builds, and validates every full-site route", async () => {
  const server = createServer((request, response) => {
    const pricing = request.url === "/pricing";
    response.setHeader("content-type", "text/html; charset=utf-8");
    response.end(`<!doctype html>
      <html>
        <head><title>${pricing ? "Pricing" : "Home"}</title></head>
        <body style="margin:0">
          <main style="min-height:100vh;background:${pricing ? "#fff7ed" : "#eff6ff"}">
            <section style="padding:48px">
              <h1 style="font-size:48px;color:#172554">${pricing ? "Choose a plan" : "Runtime home"}</h1>
              <p style="font-size:18px">${pricing ? "Pricing route content" : "Home route content"}</p>
            </section>
          </main>
        </body>
      </html>`);
  });
  await new Promise<void>((resolve) =>
    server.listen(0, "127.0.0.1", resolve),
  );
  const address = server.address();
  assert.ok(address && typeof address !== "string");
  const outDir = await fs.mkdtemp(
    path.join(os.tmpdir(), "coderelay-full-site-routes-"),
  );

  try {
    const result = await runLocalExport({
      outDir,
      url: `http://127.0.0.1:${address.port}/`,
      exportMode: "full-site",
      pluginCapture: {
        mode: "framer-plugin",
        capturedAt: "2026-06-30T00:00:00.000Z",
        selectedNodes: [],
        context: {
          exportMode: "full-site",
          captureMode: "runtime-first",
          sitePages: [
            { name: "Home", path: "/" },
            { name: "Pricing", path: "/pricing" },
          ],
        },
      },
      maxAttempts: 1,
      targetFidelity: 0.9,
    });

    assert.equal(result.validation.routes.length, 2);
    assert.equal(
      result.validation.routes.every(
        (route) =>
          route.renderedTextLength > 0 && route.renderedElementCount >= 3,
      ),
      true,
    );
    assert.match(
      await fs.readFile(path.join(result.exportDir, "pages", "Home.tsx"), "utf8"),
      /Runtime home/,
    );
    assert.match(
      await fs.readFile(
        path.join(result.exportDir, "pages", "Pricing.tsx"),
        "utf8",
      ),
      /Choose a plan/,
    );
    const rawRuntime = JSON.parse(
      await fs.readFile(
        path.join(result.exportDir, "raw-runtime-capture.json"),
        "utf8",
      ),
    );
    assert.equal(rawRuntime.routeCaptures.length, 2);
    const revisionManifest = JSON.parse(
      await fs.readFile(
        result.revisionManifestPath ??
          path.join(result.exportDir, "revision-manifest.json"),
        "utf8",
      ),
    );
    assert.match(revisionManifest.revisionId, /^revision_[0-9a-f]{16}$/);
    assert.equal(revisionManifest.summary.routeTemplates.length, 2);
  } finally {
    await new Promise<void>((resolve) => server.close(() => resolve()));
  }
});
