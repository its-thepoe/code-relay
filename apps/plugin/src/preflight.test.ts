import assert from "node:assert/strict";
import test from "node:test";
import { createPreflightSummary, describeJobProgress } from "./preflight.js";

test("createPreflightSummary builds full-site expected counts from plugin context", () => {
  const summary = createPreflightSummary({
    exportMode: "full-site",
    sourceUrl: "",
    resolvedSourceUrl: "https://example.com",
    selectionCount: 0,
    selectedComponentCount: 0,
    componentCount: 12,
    context: {
      publishedUrl: "https://example.com",
      sitePages: [
        { routePath: "/", templateKind: "static" },
        { routePath: "/pricing", templateKind: "static" },
        { routePath: "/blog/[slug]", templateKind: "cms" },
      ],
      componentModules: [{ id: "a" }, { id: "b" }],
      codeFiles: [{ id: "file-1" }],
      cmsCollections: [{ items: [{}, {}, {}] }],
      capabilities: {
        capabilityReport: {
          projectInfo: { readable: true },
          publishInfo: { readable: true },
          codeFiles: { readable: true, count: 1, contentReadableCount: 1 },
          cms: { collectionCount: 1 },
          styles: {
            colorStylesReadable: true,
            textStylesReadable: true,
            fontsReadable: true,
          },
        },
      },
    },
  });

  assert.equal(summary.runtimeSource, "https://example.com");
  assert.equal(summary.capabilityState, "ready");
  assert.equal(summary.staticPageCount, 2);
  assert.equal(summary.cmsTemplateCount, 1);
  assert.equal(summary.cmsItemCount, 3);
  assert.equal(summary.componentCount, 2);
  assert.equal(summary.codeFileCount, 1);
  assert.equal(summary.responsiveCaptureCount, 3);
});

test("createPreflightSummary flags missing runtime for full-site exports", () => {
  const summary = createPreflightSummary({
    exportMode: "full-site",
    sourceUrl: "",
    resolvedSourceUrl: "",
    selectionCount: 0,
    selectedComponentCount: 0,
    componentCount: 0,
    context: null,
  });

  assert.equal(summary.capabilityState, "missing-runtime");
});

test("describeJobProgress includes stage, counts, route, and skipped totals", () => {
  const copy = describeJobProgress({
    status: "running",
    progress: {
      stage: "Capturing routes",
      completed: 4,
      total: 10,
      routePath: "/blog/first-post",
      failed: 1,
    },
  });

  assert.equal(copy, "Capturing routes 4/10 • /blog/first-post • 1 skipped");
});
