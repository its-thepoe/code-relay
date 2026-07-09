import assert from "node:assert/strict";
import test from "node:test";
import {
  createCapabilityBadges,
  createFinalReportCards,
  createJobOutcomeSummary,
} from "./preflight.js";

test("createJobOutcomeSummary summarizes completed report health and cache state", () => {
  const summary = createJobOutcomeSummary({
    revisionCacheHit: true,
    sourceEvidence: {
      status: "partial",
    },
    generatedValidation: {
      status: "passed",
      routes: [{ path: "/" }, { path: "/pricing" }],
    },
    visualFidelity: {
      desktop: 88,
      laptop: 77,
      tablet: 71,
      mobile: 64,
    },
  });

  assert.deepEqual(summary, {
    cacheStatus: "cache hit",
    exportHealth: "partial",
    buildStatus: "passed",
    routeCount: 2,
    desktopScore: 88,
    responsiveScore: 71,
  });
});

test("createJobOutcomeSummary falls back cleanly when report fields are missing", () => {
  const summary = createJobOutcomeSummary({});

  assert.deepEqual(summary, {
    cacheStatus: "unknown",
    exportHealth: "unknown",
    buildStatus: "unknown",
    routeCount: null,
    desktopScore: null,
    responsiveScore: null,
  });
});

test("createFinalReportCards produces the final fidelity buckets", () => {
  const cards = createFinalReportCards({
    generatedValidation: {
      status: "passed",
      routes: [{ renderedElementCount: 12 }, { renderedElementCount: 8 }],
    },
    visualFidelity: {
      desktop: 92,
      laptop: 80,
      tablet: 74,
      mobile: 70,
      motion: 68,
    },
    codeCompatibility: {
      fileCount: 4,
      summary: {
        portable: 3,
        unsupported: 0,
      },
    },
    cmsCollectionCount: 2,
    cmsCollections: [{ itemCount: 3 }, { itemCount: 4 }],
    assets: {
      linked: 8,
      failed: 0,
    },
  });

  assert.deepEqual(
    cards.map((card) => card.key),
    [
      "build-validity",
      "route-validity",
      "desktop-fidelity",
      "responsive-fidelity",
      "interaction-fidelity",
      "code-component-portability",
      "cms-completeness",
      "asset-portability",
    ],
  );
  assert.equal(cards[0]?.value, "passed");
  assert.equal(cards[2]?.tone, "good");
  assert.equal(cards[4]?.tone, "warn");
});

test("createCapabilityBadges derives readable capability labels", () => {
  const badges = createCapabilityBadges({
    projectInfo: { readable: true },
    publishInfo: { readable: true },
    codeFiles: { readable: true },
    cms: { collectionCount: 1 },
    styles: {
      colorStylesReadable: true,
      textStylesReadable: false,
      fontsReadable: true,
    },
  });

  assert.deepEqual(badges, [
    "project",
    "publish",
    "code files",
    "styles",
    "fonts",
    "cms",
  ]);
});
