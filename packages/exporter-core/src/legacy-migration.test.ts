import assert from "node:assert/strict";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { migrateLegacyExportToRevision } from "./local-export.js";

test("migrateLegacyExportToRevision registers a legacy export as a revision and marks invalid responsive captures", async () => {
  const root = await fs.mkdtemp(
    path.join(os.tmpdir(), "coderelay-legacy-migration-"),
  );
  const exportDir = path.join(root, "artifacts", "job_legacy", "run_001", "export");
  await fs.mkdir(exportDir, { recursive: true });

  await fs.writeFile(path.join(exportDir, "preview.html"), "<html></html>\n");
  await fs.writeFile(path.join(exportDir, "index.html"), "<html></html>\n");
  await fs.writeFile(path.join(exportDir, "package.json"), "{\n  \"name\":\"legacy\"\n}\n");

  await fs.writeFile(
    path.join(exportDir, "export-report.json"),
    `${JSON.stringify(
      {
        jobId: "job_legacy",
        sourceUrl: "https://example.com",
        captureMode: "runtime-first",
        exportEngine: "published-runtime",
        componentName: "LegacyExport",
        componentModuleCount: 1,
        codeFileCount: 1,
        fontCount: 0,
        cmsCollectionCount: 0,
        createdAt: "2026-07-02T10:00:00.000Z",
        generatedValidation: {
          status: "passed",
          generatedFileCount: 3,
          tsxBytes: 100,
          cssBytes: 50,
          previewHtmlBytes: 20,
          buildDurationMs: 1000,
          renderedElementCount: 4,
          renderedTextLength: 20,
          consoleErrors: [],
          pageErrors: [],
          routes: [],
        },
        bestAttempt: {
          attempt: 1,
          strategy: { preserveContainerWidths: true },
        },
        visualFidelity: {
          overall: 40,
          layout: 41,
          typography: 42,
          color: 43,
          assets: 100,
          motion: 100,
          nodeMatch: 0,
          desktop: 40,
          laptop: 40,
          tablet: 40,
          mobile: 40,
        },
      },
      null,
      2,
    )}\n`,
  );

  await fs.writeFile(
    path.join(exportDir, "normalized-ir.json"),
    `${JSON.stringify(
      {
        sourceUrl: "https://example.com",
        componentName: "LegacyExport",
        exportMode: "full-site",
        captureMode: "runtime-first",
        exportEngine: "published-runtime",
        codeFiles: [
          {
            id: "code_1",
            name: "Button.tsx",
            path: "Button.tsx",
          },
        ],
        componentModules: [{ id: "component_1", name: "Button" }],
        cmsCollections: [],
        fonts: [],
        sitePages: [
          {
            routePath: "/",
            templateId: "home-template",
            templatePath: "/",
            templateKind: "static",
            sourceTextLength: 100,
            nodeCount: 8,
          },
          {
            routePath: "/pricing",
            templateId: "pricing-template",
            templatePath: "/pricing",
            templateKind: "static",
            sourceTextLength: 90,
            nodeCount: 6,
          },
        ],
      },
      null,
      2,
    )}\n`,
  );

  await fs.writeFile(
    path.join(exportDir, "raw-runtime-capture.json"),
    `${JSON.stringify(
      {
        url: "https://example.com",
        title: "Legacy",
        mode: "page",
        viewports: {
          desktop: { width: 1280 },
          laptop: { width: 1280 },
          tablet: { width: 1280 },
          mobile: { width: 1280 },
        },
      },
      null,
      2,
    )}\n`,
  );

  await fs.writeFile(
    path.join(exportDir, "raw-plugin-payload.json"),
    `${JSON.stringify(
      {
        mode: "framer-plugin",
        capturedAt: "2026-07-02T10:00:00.000Z",
        selectedNodes: [],
        context: {
          project: { id: "project_1", name: "Legacy Project" },
          publishedUrl: "https://example.com",
          capabilities: {
            capabilityReport: {
              codeFiles: { readable: false, count: 1, contentReadableCount: 0 },
            },
          },
        },
      },
      null,
      2,
    )}\n`,
  );

  await fs.writeFile(
    path.join(exportDir, "generated-validation.json"),
    `${JSON.stringify(
      {
        status: "passed",
        generatedFileCount: 3,
        tsxBytes: 100,
        cssBytes: 50,
        previewHtmlBytes: 20,
        buildDurationMs: 1000,
        renderedElementCount: 4,
        renderedTextLength: 20,
        consoleErrors: [],
        pageErrors: [],
        routes: [],
      },
      null,
      2,
    )}\n`,
  );

  const migration = await migrateLegacyExportToRevision({
    jobId: "job_legacy",
    exportDir,
    sourceUrl: "https://example.com",
    exportMode: "full-site",
  });

  const manifest = JSON.parse(
    await fs.readFile(migration.revisionManifestPath, "utf8"),
  ) as Record<string, any>;
  const responsivePlan = JSON.parse(
    await fs.readFile(migration.responsiveRecapturePlanPath!, "utf8"),
  ) as Record<string, any>;
  const status = JSON.parse(
    await fs.readFile(migration.statusPath, "utf8"),
  ) as Record<string, any>;
  const sourceArtifacts = JSON.parse(
    await fs.readFile(migration.sourceArtifactsPath, "utf8"),
  ) as Record<string, any>;

  assert.match(migration.revisionId, /^revision_/);
  assert.equal(manifest.revisionId, migration.revisionId);
  assert.equal(manifest.status, "completed");
  assert.equal(Array.isArray(sourceArtifacts.codeFiles), true);
  assert.equal(sourceArtifacts.codeFiles.length, 1);
  assert.equal(responsivePlan.reuseDesktopCapture, false);
  assert.equal(
    responsivePlan.migration?.legacyResponsiveViewportInvalid,
    true,
  );
  assert.deepEqual(responsivePlan.targetViewports, [
    "laptop",
    "tablet",
    "mobile",
  ]);
  assert.equal(status.stage, "completed");
  assert.equal(Array.isArray(status.history), true);
  assert.equal(
    await fs
      .access(path.join(migration.revisionCacheDir, "export", "revision-manifest.json"))
      .then(() => true)
      .catch(() => false),
    true,
  );
});
