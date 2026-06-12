import test from "node:test";
import assert from "node:assert/strict";
import os from "node:os";
import path from "node:path";
import fs from "node:fs/promises";
import {
  aggregateComparisonDiagnostics,
  collectNodePropertyDiffs,
  compareGeneratedPreview,
  inspectGeneratedPreviewNodes,
  scorePreviewValidation,
  scorePreviewValidationByViewport,
} from "./compare.js";
import type { ExportIR } from "../../shared/src/types.js";

function createIr(): ExportIR {
  return {
    jobId: "motion-score-smoke",
    sourceUrl: "framer://project/motion-score",
    componentName: "MotionScoreCard",
    runtimeCapture: {
      url: "framer://project/motion-score",
      title: "Motion Score",
      mode: "section",
      viewports: {
        desktop: { screenshotPath: "", width: 1440, height: 900 },
        laptop: { screenshotPath: "", width: 1280, height: 900 },
        tablet: { screenshotPath: "", width: 768, height: 1024 },
        mobile: { screenshotPath: "", width: 390, height: 844 },
      },
      nodes: [
        {
          id: "heading",
          tag: "h1",
          domPath: "body > div:nth-child(1) > h1:nth-child(1)",
          text: "Animated heading",
          rect: { x: 0, y: 0, width: 320, height: 48 },
          attributes: {},
          styles: {
            color: "#111111",
            fontSize: "40px",
            lineHeight: "48px",
          },
          motion: {
            transitionProperty: "transform, opacity",
            transitionDuration: "0.32s",
            transitionTimingFunction: "cubic-bezier(0.23, 1, 0.32, 1)",
          },
          interactionStyles: {
            hover: {
              transform: "matrix(1, 0, 0, 1, 0, -2)",
            },
          },
        },
      ],
    },
    pluginCapture: {
      mode: "simulated",
      selectedNodes: [],
      capturedAt: "2026-06-12T00:00:00.000Z",
    },
    nodeMatches: [
      {
        framerNodeId: "heading",
        domPath: "body > div:nth-child(1) > h1:nth-child(1)",
        confidence: 0.96,
        matchReasons: ["text", "type"],
      },
    ],
    component: {
      semanticType: "section",
      nodes: [
        {
          id: "heading",
          tag: "h1",
          domPath: "body > div:nth-child(1) > h1:nth-child(1)",
          text: "Animated heading",
          rect: { x: 0, y: 0, width: 320, height: 48 },
          attributes: {},
          styles: {
            color: "#111111",
            fontSize: "40px",
            lineHeight: "48px",
          },
          motion: {
            transitionProperty: "transform, opacity",
            transitionDuration: "0.32s",
            transitionTimingFunction: "cubic-bezier(0.23, 1, 0.32, 1)",
          },
          interactionStyles: {
            hover: {
              transform: "matrix(1, 0, 0, 1, 0, -2)",
            },
          },
        },
      ],
      sections: [
        {
          index: 0,
          name: "Motion Score",
          kind: "content",
          confidence: 1,
          nodes: [],
        },
      ],
    },
    assets: [],
    exportTree: [
      {
        id: "heading",
        childIds: [],
        kind: "text",
        tag: "h1",
        text: "Animated heading",
        styles: {
          color: "#111111",
          fontSize: "40px",
          lineHeight: "48px",
        },
        motion: {
          transitionProperty: "transform, opacity",
          transitionDuration: "0.32s",
          transitionTimingFunction: "cubic-bezier(0.23, 1, 0.32, 1)",
        },
        interactionStyles: {
          hover: {
            transform: "matrix(1, 0, 0, 1, 0, -2)",
          },
        },
        attributes: {},
        source: {
          pluginNodeId: "heading",
          runtimeNodeId: "heading",
          domPath: "body > div:nth-child(1) > h1:nth-child(1)",
          matchConfidence: 0.96,
        },
        children: [],
      },
    ],
    warnings: [],
  };
}

function createResponsiveIr(): ExportIR {
  const ir = createIr();
  return {
    ...ir,
    exportTree: [
      {
        ...ir.exportTree![0]!,
        stylesByViewport: {
          desktop: {
            color: "#111111",
            fontSize: "40px",
            lineHeight: "48px",
          },
          laptop: {
            color: "#111111",
            fontSize: "38px",
            lineHeight: "46px",
          },
          tablet: {
            color: "#111111",
            fontSize: "28px",
            lineHeight: "34px",
          },
          mobile: {
            color: "#111111",
            fontSize: "22px",
            lineHeight: "28px",
          },
        },
      },
    ],
  };
}

test("compareGeneratedPreview scores captured motion when screenshots are unavailable", async () => {
  const attemptDir = await fs.mkdtemp(
    path.join(os.tmpdir(), "coderelay-compare-motion-"),
  );
  const previewPath = path.join(attemptDir, "preview.html");
  await fs.writeFile(previewPath, "<!doctype html><html><body></body></html>\n");

  const fidelity = await compareGeneratedPreview({
    ir: createIr(),
    previewHtmlPath: previewPath,
    attemptDir,
  });

  assert.equal(fidelity.fidelity.motion, 100);
  assert.equal(fidelity.fidelity.desktop > 0, true);
  assert.equal(typeof fidelity.previewValidation?.status, "string");
  assert.equal(fidelity.diagnostics?.viewport, "all");
  assert.equal((fidelity.diagnostics?.summary.nodesCompared ?? 0) > 0, true);
  assert.equal((fidelity.diagnostics?.summary.missingNodes ?? 0) > 0, true);
  await fs.access(path.join(attemptDir, "compare-diagnostics.json"));
});

test("scorePreviewValidation rewards found styled nodes", () => {
  const score = scorePreviewValidation({
    status: "validated",
    summary: {
      viewportsValidated: 1,
      inspectedNodes: 4,
      foundNodes: 4,
      nodesWithNonDefaultStyles: 3,
      nodesExpectingMotion: 1,
      nodesWithNonDefaultMotion: 1,
    },
    byViewport: {
      desktop: {
        viewport: "desktop",
        inspectedNodes: 4,
        foundNodes: 4,
        nodesWithNonDefaultStyles: 3,
        nodesExpectingMotion: 1,
        nodesWithNonDefaultMotion: 1,
      },
    },
  });

  assert.equal(typeof score, "number");
  assert.equal((score ?? 0) > 80, true);
});

test("scorePreviewValidation returns undefined when validation is blocked", () => {
  const score = scorePreviewValidation({
    status: "blocked",
    reason: "browser launch blocked",
    summary: {
      viewportsValidated: 0,
      inspectedNodes: 0,
      foundNodes: 0,
      nodesWithNonDefaultStyles: 0,
      nodesExpectingMotion: 0,
      nodesWithNonDefaultMotion: 0,
    },
  });

  assert.equal(score, undefined);
});

test("scorePreviewValidationByViewport returns viewport-specific scores", () => {
  const previewValidation = {
    status: "validated" as const,
    summary: {
      viewportsValidated: 2,
      inspectedNodes: 2,
      foundNodes: 2,
      nodesWithNonDefaultStyles: 1,
      nodesExpectingMotion: 0,
      nodesWithNonDefaultMotion: 0,
    },
    byViewport: {
      desktop: {
        viewport: "desktop" as const,
        inspectedNodes: 1,
        foundNodes: 1,
        nodesWithNonDefaultStyles: 1,
        nodesExpectingMotion: 0,
        nodesWithNonDefaultMotion: 0,
      },
      mobile: {
        viewport: "mobile" as const,
        inspectedNodes: 1,
        foundNodes: 1,
        nodesWithNonDefaultStyles: 0,
        nodesExpectingMotion: 0,
        nodesWithNonDefaultMotion: 0,
      },
    },
  };

  const desktop = scorePreviewValidationByViewport(previewValidation, "desktop");
  const mobile = scorePreviewValidationByViewport(previewValidation, "mobile");

  assert.equal(typeof desktop, "number");
  assert.equal(typeof mobile, "number");
  assert.equal((desktop ?? 0) > (mobile ?? 0), true);
});

test("compareGeneratedPreview gives styled previews a higher fallback score than unstyled previews", async () => {
  const attemptDir = await fs.mkdtemp(
    path.join(os.tmpdir(), "coderelay-compare-preview-score-"),
  );
  const styledPreviewPath = path.join(attemptDir, "styled-preview.html");
  const unstyledPreviewPath = path.join(attemptDir, "unstyled-preview.html");

  await fs.writeFile(
    styledPreviewPath,
    `<!doctype html>
<html>
  <body>
    <h1
      class="nodeHeading"
      style="color: rgb(17, 17, 17); font-size: 40px; line-height: 48px; transition-duration: 0.32s; transition-timing-function: cubic-bezier(0.23, 1, 0.32, 1);"
    >
      Animated heading
    </h1>
  </body>
</html>
`,
  );
  await fs.writeFile(
    unstyledPreviewPath,
    `<!doctype html><html><body><h1 class="nodeHeading">Animated heading</h1></body></html>\n`,
  );

  const styled = await compareGeneratedPreview({
    ir: createIr(),
    previewHtmlPath: styledPreviewPath,
    attemptDir,
  });
  const unstyled = await compareGeneratedPreview({
    ir: createIr(),
    previewHtmlPath: unstyledPreviewPath,
    attemptDir,
  });

  assert.equal(styled.previewValidation?.status, "validated");
  assert.equal(unstyled.previewValidation?.status, "validated");
  assert.equal(
    (styled.previewValidation?.summary.nodesWithNonDefaultStyles ?? 0) >
      (unstyled.previewValidation?.summary.nodesWithNonDefaultStyles ?? 0),
    true,
  );
  assert.equal(styled.fidelity.overall > unstyled.fidelity.overall, true);
});

test("inspectGeneratedPreviewNodes captures hover and focus interaction deltas", async () => {
  const attemptDir = await fs.mkdtemp(
    path.join(os.tmpdir(), "coderelay-inspect-preview-interactions-"),
  );
  const previewPath = path.join(attemptDir, "interactive-preview.html");

  await fs.writeFile(
    previewPath,
    `<!doctype html>
<html>
  <head>
    <style>
      .nodeHeading {
        color: rgb(17, 17, 17);
        font-size: 40px;
        line-height: 48px;
        transition-duration: 0.32s;
        transition-timing-function: cubic-bezier(0.23, 1, 0.32, 1);
        transform: translateY(0px);
        display: inline-block;
      }
      .nodeHeading:hover {
        color: rgb(255, 255, 255);
        transform: translateY(-2px);
      }
      .nodeHeading:focus-visible {
        color: rgb(255, 255, 255);
      }
    </style>
  </head>
  <body><div class="nodeHeading" role="button" tabindex="0">Animated heading</div></body>
</html>
`,
  );

  const inspected = await inspectGeneratedPreviewNodes({
    previewHtmlPath: previewPath,
    viewport: "desktop",
    nodeClasses: [{ nodeId: "heading", className: "nodeHeading" }],
  });

  assert.deepEqual(
    inspected[0]?.interactionStyles?.hover?.transform,
    "matrix(1, 0, 0, 1, 0, -2)",
  );
  assert.equal(inspected[0]?.interactionStyles?.hover != null, true);
});

test("compareGeneratedPreview validates hover and focus interaction motion", async () => {
  const attemptDir = await fs.mkdtemp(
    path.join(os.tmpdir(), "coderelay-compare-interactive-motion-"),
  );
  const previewPath = path.join(attemptDir, "interactive-motion-preview.html");

  await fs.writeFile(
    previewPath,
    `<!doctype html>
<html>
  <head>
    <style>
      .nodeHeading {
        color: rgb(17, 17, 17);
        font-size: 40px;
        line-height: 48px;
        transition-duration: 0.32s;
        transition-timing-function: cubic-bezier(0.23, 1, 0.32, 1);
        transform: translateY(0px);
        display: inline-block;
      }
      .nodeHeading:hover {
        color: rgb(255, 255, 255);
        transform: translateY(-2px);
      }
      .nodeHeading:focus-visible {
        color: rgb(255, 255, 255);
      }
    </style>
  </head>
  <body><div class="nodeHeading" role="button" tabindex="0">Animated heading</div></body>
</html>
`,
  );

  const result = await compareGeneratedPreview({
    ir: createIr(),
    previewHtmlPath: previewPath,
    attemptDir,
  });

  assert.equal(result.previewValidation?.summary.nodesExpectingMotion, 4);
  assert.equal(result.previewValidation?.summary.nodesWithNonDefaultMotion, 4);
  assert.equal(
    result.diagnostics?.nodes[0]?.propertyDiffs.some((diff) => diff.property === "hover.transform"),
    false,
  );
});

test("compareGeneratedPreview uses viewport-specific preview validation for fallback breakpoint scores", async () => {
  const attemptDir = await fs.mkdtemp(
    path.join(os.tmpdir(), "coderelay-compare-responsive-preview-score-"),
  );
  const responsivePreviewPath = path.join(
    attemptDir,
    "responsive-preview.html",
  );
  const desktopOnlyPreviewPath = path.join(
    attemptDir,
    "desktop-only-preview.html",
  );

  await fs.writeFile(
    responsivePreviewPath,
    `<!doctype html>
<html>
  <head>
    <style>
      .nodeHeading { color: rgb(17, 17, 17); font-size: 40px; line-height: 48px; }
      @media (max-width: 1280px) {
        .nodeHeading { font-size: 38px; line-height: 46px; }
      }
      @media (max-width: 768px) {
        .nodeHeading { font-size: 28px; line-height: 34px; }
      }
      @media (max-width: 390px) {
        .nodeHeading { font-size: 22px; line-height: 28px; }
      }
    </style>
  </head>
  <body><h1 class="nodeHeading">Animated heading</h1></body>
</html>
`,
  );
  await fs.writeFile(
    desktopOnlyPreviewPath,
    `<!doctype html>
<html>
  <head>
    <style>
      .nodeHeading { color: rgb(17, 17, 17); font-size: 40px; line-height: 48px; }
    </style>
  </head>
  <body><h1 class="nodeHeading">Animated heading</h1></body>
</html>
`,
  );

  const responsive = await compareGeneratedPreview({
    ir: createResponsiveIr(),
    previewHtmlPath: responsivePreviewPath,
    attemptDir,
  });
  const desktopOnly = await compareGeneratedPreview({
    ir: createResponsiveIr(),
    previewHtmlPath: desktopOnlyPreviewPath,
    attemptDir,
  });

  assert.equal(responsive.previewValidation?.status, "validated");
  assert.equal(desktopOnly.previewValidation?.status, "validated");
  assert.equal(
    (responsive.fidelity.tablet ?? 0) > (desktopOnly.fidelity.tablet ?? 0),
    true,
  );
  assert.equal(
    (responsive.fidelity.mobile ?? 0) > (desktopOnly.fidelity.mobile ?? 0),
    true,
  );
});

test("aggregateComparisonDiagnostics merges multi-viewport summaries", () => {
  const aggregate = aggregateComparisonDiagnostics({
    desktop: {
      viewport: "desktop",
      summary: {
        nodesCompared: 2,
        missingNodes: 1,
        typographyIssues: 1,
        layoutIssues: 0,
        colorIssues: 0,
        surfaceIssues: 1,
        motionIssues: 1,
      },
      nodes: [
        {
          nodeId: "heading",
          tag: "h1",
          className: "nodeHeading",
          issueTypes: ["typography", "motion"],
          propertyDiffs: [],
        },
      ],
    },
    mobile: {
      viewport: "mobile",
      summary: {
        nodesCompared: 2,
        missingNodes: 0,
        typographyIssues: 1,
        layoutIssues: 2,
        colorIssues: 0,
        surfaceIssues: 0,
        motionIssues: 0,
      },
      nodes: [
        {
          nodeId: "root",
          tag: "div",
          className: "nodeRoot",
          issueTypes: ["layout"],
          propertyDiffs: [],
        },
      ],
    },
  });

  assert.equal(aggregate.viewport, "all");
  assert.equal(aggregate.byViewport?.desktop?.viewport, "desktop");
  assert.equal(aggregate.byViewport?.mobile?.viewport, "mobile");
  assert.equal(aggregate.summary.nodesCompared, 4);
  assert.equal(aggregate.summary.missingNodes, 1);
  assert.equal(aggregate.summary.typographyIssues, 2);
  assert.equal(aggregate.summary.layoutIssues, 2);
  assert.equal(aggregate.summary.surfaceIssues, 1);
  assert.equal(aggregate.summary.motionIssues, 1);
  assert.equal(aggregate.nodes.length, 2);
});

test("collectNodePropertyDiffs compares broader layout and surface properties", () => {
  const compared = collectNodePropertyDiffs({
    sourceStyles: {
      display: "grid",
      justifyContent: "space-between",
      alignItems: "center",
      gap: "24px",
      width: "640px",
      gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
      backgroundImage: 'url("https://example.com/bg.png")',
      padding: "32px",
      margin: "12px",
      border: "1px solid rgb(0 0 0 / 0.1)",
      boxShadow: "0px 8px 24px 0px rgba(0,0,0,0.15)",
      objectFit: "cover",
    },
    sourceMotion: {
      transitionDuration: "0.3s",
      transitionTimingFunction: "ease",
    },
    sourceInteractionStyles: {
      hover: {
        color: "rgb(255, 255, 255)",
      },
    },
    generatedStyles: {
      display: "flex",
      justifyContent: "flex-start",
      alignItems: "stretch",
      gap: "12px",
      width: "320px",
      gridTemplateColumns: "none",
      backgroundImage: "none",
      padding: "16px",
      margin: "0px",
      border: "0px none rgb(0, 0, 0)",
      boxShadow: "none",
      objectFit: "contain",
      transitionDuration: "0.1s",
      transitionTimingFunction: "linear",
    },
    generatedInteractionStyles: {
      hover: {
        color: "rgb(0, 0, 0)",
      },
    },
  });

  assert.equal(compared.issueTypes.has("layout"), true);
  assert.equal(compared.issueTypes.has("surface"), true);
  assert.equal(compared.issueTypes.has("motion"), true);
  assert.equal(
    compared.propertyDiffs.some((diff) => diff.property === "gridTemplateColumns"),
    true,
  );
  assert.equal(
    compared.propertyDiffs.some((diff) => diff.property === "backgroundImage"),
    true,
  );
  assert.equal(
    compared.propertyDiffs.some((diff) => diff.property === "objectFit"),
    true,
  );
  assert.equal(
    compared.propertyDiffs.some((diff) => diff.property === "hover.color"),
    true,
  );
});
