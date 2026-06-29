import test from "node:test";
import assert from "node:assert/strict";
import os from "node:os";
import path from "node:path";
import fs from "node:fs/promises";
import { runLocalExport } from "./local-export.js";
import { CAPTURED_STYLE_PROPERTIES } from "./capture.js";
import type { PluginCanvasCapture } from "../../shared/src/types.js";

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
