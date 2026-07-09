import test from "node:test";
import assert from "node:assert/strict";
import { applyAttemptPlan, baselineStrategy, buildAttemptPlan, detectAttemptPlateau, } from "./attempt-planner.js";
test("buildAttemptPlan returns baseline strategy for first attempt", () => {
    const plan = buildAttemptPlan({ attemptNumber: 1 });
    assert.equal(plan.strategy.id, "semantic-layout");
    assert.equal(plan.strategy.structuredLayout, false);
    assert.equal(plan.strategy.compactSpacing, false);
    assert.equal(plan.strategy.aggressiveMobileStacking, false);
    assert.deepEqual(plan.patchOperations, ["baseline_strategy"]);
});
test("buildAttemptPlan produces targeted diagnosis and patch operations", () => {
    const plan = buildAttemptPlan({
        attemptNumber: 2,
        previousAttempt: {
            strategy: {
                id: "semantic-layout",
                structuredLayout: false,
                compactSpacing: false,
                aggressiveMobileStacking: false,
                preserveImageAspectRatio: true,
            },
            fidelity: {
                desktop: 91,
                laptop: 84,
                tablet: 76,
                mobile: 68,
                overall: 74,
                layout: 72,
                typography: 90,
                color: 88,
                assets: 92,
                motion: 55,
                nodeMatch: 61,
            },
            warnings: [
                {
                    type: "responsive_mismatch",
                    severity: "warning",
                    message: "Responsive fidelity is meaningfully lower than desktop fidelity on one or more smaller breakpoints.",
                },
                {
                    type: "preview_validation_unstyled",
                    severity: "warning",
                    message: "Rendered preview validation found exported nodes, but none resolved to non-default visual styles.",
                },
            ],
            previewValidation: {
                status: "validated",
                summary: {
                    viewportsValidated: 1,
                    inspectedNodes: 3,
                    foundNodes: 3,
                    nodesWithNonDefaultStyles: 0,
                    nodesExpectingMotion: 1,
                    nodesWithNonDefaultMotion: 0,
                },
                byViewport: {
                    desktop: {
                        viewport: "desktop",
                        inspectedNodes: 3,
                        foundNodes: 3,
                        nodesWithNonDefaultStyles: 0,
                        nodesExpectingMotion: 1,
                        nodesWithNonDefaultMotion: 0,
                    },
                },
            },
            comparisonDiagnostics: {
                viewport: "desktop",
                summary: {
                    nodesCompared: 4,
                    missingNodes: 1,
                    typographyIssues: 1,
                    layoutIssues: 1,
                    colorIssues: 0,
                    surfaceIssues: 1,
                    motionIssues: 1,
                },
                nodes: [
                    {
                        nodeId: "heading",
                        tag: "h1",
                        className: "nodeHeading",
                        issueTypes: ["typography", "surface", "motion"],
                        propertyDiffs: [
                            {
                                property: "hover.transform",
                                source: "matrix(1, 0, 0, 1, 0, -2)",
                                generated: "none",
                            },
                        ],
                    },
                    {
                        nodeId: "missing-wrapper",
                        tag: "div",
                        className: "nodeMissingWrapper",
                        issueTypes: ["missing_node", "layout"],
                        propertyDiffs: [],
                    },
                ],
                byViewport: {
                    desktop: {
                        viewport: "desktop",
                        summary: {
                            nodesCompared: 4,
                            missingNodes: 1,
                            typographyIssues: 1,
                            layoutIssues: 1,
                            colorIssues: 0,
                            surfaceIssues: 1,
                            motionIssues: 1,
                        },
                        nodes: [
                            {
                                nodeId: "heading",
                                tag: "h1",
                                className: "nodeHeading",
                                issueTypes: ["typography", "surface", "motion"],
                                propertyDiffs: [
                                    {
                                        property: "hover.transform",
                                        source: "matrix(1, 0, 0, 1, 0, -2)",
                                        generated: "none",
                                    },
                                ],
                            },
                            {
                                nodeId: "missing-wrapper",
                                tag: "div",
                                className: "nodeMissingWrapper",
                                issueTypes: ["missing_node", "layout"],
                                propertyDiffs: [],
                            },
                        ],
                    },
                },
            },
        },
    });
    assert.equal(plan.strategy.structuredLayout, true);
    assert.equal(plan.strategy.compactSpacing, true);
    assert.equal(plan.strategy.aggressiveMobileStacking, true);
    assert.equal(plan.strategy.preserveImageAspectRatio, false);
    assert.ok(plan.patchOperations.includes("promote_viewport_overrides"));
    assert.ok(plan.patchOperations.includes("preserve_wrapper_surfaces"));
    assert.ok(plan.patchOperations.includes("preserve_motion_styles"));
    assert.ok(plan.patchOperations.includes("boost_typography_from_runtime"));
    assert.ok(plan.patchOperations.includes("reinforce_runtime_styles"));
    assert.ok(plan.patchOperations.includes("force_inline_styles"));
    assert.deepEqual(plan.patchTargets?.boost_typography_from_runtime, ["heading"]);
    assert.deepEqual(plan.patchTargets?.preserve_motion_styles, ["heading"]);
    assert.deepEqual(plan.patchPropertyHints?.preserve_motion_styles?.heading, {
        desktop: ["hover.transform"],
    });
    assert.deepEqual(plan.patchTargets?.force_inline_styles, [
        "heading",
        "missing-wrapper",
    ]);
    assert.ok(plan.diagnosisDetails.some((entry) => entry.category === "motion_mismatch"));
    assert.ok(plan.diagnosis.some((message) => message.includes("without non-default styles")));
});
test("buildAttemptPlan scopes responsive patch targets to smaller-breakpoint diagnostics", () => {
    const plan = buildAttemptPlan({
        attemptNumber: 2,
        previousAttempt: {
            strategy: {
                id: "semantic-layout",
                structuredLayout: false,
                compactSpacing: false,
                aggressiveMobileStacking: false,
                preserveImageAspectRatio: true,
            },
            fidelity: {
                desktop: 93,
                laptop: 91,
                tablet: 80,
                mobile: 70,
                overall: 78,
                layout: 75,
                typography: 90,
                color: 90,
                assets: 96,
                motion: 88,
                nodeMatch: 82,
            },
            warnings: [
                {
                    type: "responsive_mismatch",
                    severity: "warning",
                    message: "Responsive fidelity is meaningfully lower than desktop fidelity on one or more smaller breakpoints.",
                },
            ],
            comparisonDiagnostics: {
                viewport: "all",
                summary: {
                    nodesCompared: 6,
                    missingNodes: 0,
                    typographyIssues: 1,
                    layoutIssues: 2,
                    colorIssues: 0,
                    surfaceIssues: 1,
                    motionIssues: 1,
                },
                nodes: [
                    {
                        nodeId: "desktop-heading",
                        tag: "h1",
                        className: "nodeDesktopHeading",
                        issueTypes: ["motion"],
                        propertyDiffs: [],
                    },
                    {
                        nodeId: "tablet-wrapper",
                        tag: "div",
                        className: "nodeTabletWrapper",
                        issueTypes: ["layout", "surface"],
                        propertyDiffs: [
                            { property: "paddingTop", source: "24px", generated: "32px" },
                            { property: "gap", source: "16px", generated: "24px" },
                        ],
                    },
                    {
                        nodeId: "mobile-body",
                        tag: "p",
                        className: "nodeMobileBody",
                        issueTypes: ["typography"],
                        propertyDiffs: [
                            { property: "fontSize", source: "16px", generated: "18px" },
                            { property: "lineHeight", source: "22px", generated: "24px" },
                        ],
                    },
                ],
                byViewport: {
                    desktop: {
                        viewport: "desktop",
                        summary: {
                            nodesCompared: 2,
                            missingNodes: 0,
                            typographyIssues: 0,
                            layoutIssues: 0,
                            colorIssues: 0,
                            surfaceIssues: 0,
                            motionIssues: 1,
                        },
                        nodes: [
                            {
                                nodeId: "desktop-heading",
                                tag: "h1",
                                className: "nodeDesktopHeading",
                                issueTypes: ["motion"],
                                propertyDiffs: [],
                            },
                        ],
                    },
                    tablet: {
                        viewport: "tablet",
                        summary: {
                            nodesCompared: 2,
                            missingNodes: 0,
                            typographyIssues: 0,
                            layoutIssues: 1,
                            colorIssues: 0,
                            surfaceIssues: 1,
                            motionIssues: 0,
                        },
                        nodes: [
                            {
                                nodeId: "tablet-wrapper",
                                tag: "div",
                                className: "nodeTabletWrapper",
                                issueTypes: ["layout", "surface"],
                                propertyDiffs: [
                                    { property: "paddingTop", source: "24px", generated: "32px" },
                                    { property: "gap", source: "16px", generated: "24px" },
                                ],
                            },
                        ],
                    },
                    mobile: {
                        viewport: "mobile",
                        summary: {
                            nodesCompared: 2,
                            missingNodes: 0,
                            typographyIssues: 1,
                            layoutIssues: 0,
                            colorIssues: 0,
                            surfaceIssues: 0,
                            motionIssues: 0,
                        },
                        nodes: [
                            {
                                nodeId: "mobile-body",
                                tag: "p",
                                className: "nodeMobileBody",
                                issueTypes: ["typography"],
                                propertyDiffs: [
                                    { property: "fontSize", source: "16px", generated: "18px" },
                                    { property: "lineHeight", source: "22px", generated: "24px" },
                                ],
                            },
                        ],
                    },
                },
            },
        },
    });
    assert.deepEqual(plan.patchTargets?.promote_viewport_overrides, [
        "tablet-wrapper",
        "mobile-body",
    ]);
    assert.deepEqual(plan.patchTargets?.preserve_wrapper_surfaces, [
        "tablet-wrapper",
        "mobile-body",
    ]);
    assert.deepEqual(plan.patchPropertyHints?.promote_viewport_overrides?.["tablet-wrapper"], {
        tablet: ["paddingTop", "gap"],
    });
    assert.deepEqual(plan.patchPropertyHints?.promote_viewport_overrides?.["mobile-body"], {
        mobile: ["fontSize", "lineHeight"],
    });
    assert.equal(plan.patchTargets?.promote_viewport_overrides?.includes("desktop-heading"), false);
});
test("applyAttemptPlan mutates export tree styles and motion from corrective patches", () => {
    const ir = {
        jobId: "attempt-plan-ir",
        sourceUrl: "framer://project/attempt-plan-ir",
        componentName: "AttemptPlanCard",
        runtimeCapture: {
            url: "framer://project/attempt-plan-ir",
            title: "Attempt Plan",
            mode: "section",
            viewports: {
                desktop: { screenshotPath: "", width: 1440, height: 900 },
                laptop: { screenshotPath: "", width: 1280, height: 900 },
                tablet: { screenshotPath: "", width: 768, height: 1024 },
                mobile: { screenshotPath: "", width: 390, height: 844 },
            },
            nodes: [],
        },
        pluginCapture: {
            mode: "simulated",
            selectedNodes: [],
            capturedAt: "2026-06-12T00:00:00.000Z",
        },
        nodeMatches: [],
        component: {
            semanticType: "section",
            nodes: [],
            sections: [],
        },
        assets: [],
        exportTree: [
            {
                id: "root",
                childIds: ["heading"],
                kind: "frame",
                tag: "div",
                rect: { x: 0, y: 0, width: 640, height: 320 },
                rectByViewport: {
                    desktop: { x: 0, y: 0, width: 640, height: 320 },
                    mobile: { x: 0, y: 0, width: 360, height: 420 },
                },
                styles: {
                    backgroundColor: "#101828",
                },
                stylesByViewport: {
                    desktop: {
                        backgroundColor: "#101828",
                        padding: "32px",
                        gap: "24px",
                    },
                    mobile: {
                        backgroundColor: "#101828",
                        padding: "18px",
                        gap: "16px",
                    },
                },
                attributes: {},
                source: {},
                children: [
                    {
                        id: "heading",
                        parentId: "root",
                        childIds: [],
                        kind: "text",
                        tag: "h1",
                        text: "Attempt plan heading",
                        rect: { x: 0, y: 0, width: 280, height: 48 },
                        styles: {},
                        stylesByViewport: {
                            desktop: {
                                fontSize: "44px",
                                lineHeight: "48px",
                                color: "#f8fafc",
                            },
                        },
                        motionByViewport: {
                            desktop: {
                                transitionProperty: "transform, opacity",
                                transitionDuration: "0.28s",
                            },
                        },
                        attributes: {},
                        source: {},
                        children: [],
                    },
                    {
                        id: "body",
                        parentId: "root",
                        childIds: [],
                        kind: "text",
                        tag: "p",
                        text: "Body copy",
                        rect: { x: 0, y: 0, width: 280, height: 24 },
                        styles: {},
                        stylesByViewport: {
                            desktop: {
                                fontSize: "18px",
                                lineHeight: "24px",
                                color: "#cbd5e1",
                            },
                        },
                        attributes: {},
                        source: {},
                        children: [],
                    },
                ],
            },
        ],
        warnings: [],
    };
    const plan = buildAttemptPlan({
        attemptNumber: 2,
        previousAttempt: {
            strategy: baselineStrategy,
            fidelity: {
                desktop: 92,
                laptop: 84,
                tablet: 78,
                mobile: 70,
                overall: 76,
                layout: 73,
                typography: 90,
                color: 91,
                assets: 97,
                motion: 62,
                nodeMatch: 75,
            },
            warnings: [],
            previewValidation: {
                status: "validated",
                summary: {
                    viewportsValidated: 1,
                    inspectedNodes: 2,
                    foundNodes: 2,
                    nodesWithNonDefaultStyles: 1,
                    nodesExpectingMotion: 1,
                    nodesWithNonDefaultMotion: 0,
                },
                byViewport: {
                    desktop: {
                        viewport: "desktop",
                        inspectedNodes: 2,
                        foundNodes: 2,
                        nodesWithNonDefaultStyles: 1,
                        nodesExpectingMotion: 1,
                        nodesWithNonDefaultMotion: 0,
                    },
                },
            },
            comparisonDiagnostics: {
                viewport: "desktop",
                summary: {
                    nodesCompared: 2,
                    missingNodes: 0,
                    typographyIssues: 1,
                    layoutIssues: 0,
                    colorIssues: 0,
                    surfaceIssues: 0,
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
        },
    });
    const next = applyAttemptPlan({
        ir,
        strategy: baselineStrategy,
    }, plan);
    const root = next.ir.exportTree?.[0];
    const heading = root?.children[0];
    const body = root?.children[1];
    assert.equal(next.strategy.structuredLayout, true);
    assert.equal(root?.styles.width, "640px");
    assert.equal(root?.styles.minHeight, "320px");
    assert.equal(root?.styles.display, "flex");
    assert.equal(root?.stylesByViewport?.mobile?.width, "360px");
    assert.equal(heading?.styles.fontSize, "44px");
    assert.equal(heading?.motion?.transitionDuration, "0.28s");
    assert.equal(body?.styles.fontSize, "18px");
    assert.equal(body?.motion, undefined);
});
test("applyAttemptPlan limits motion preservation to hinted interactive properties", () => {
    const ir = {
        jobId: "attempt-plan-motion-hints-ir",
        sourceUrl: "framer://project/attempt-plan-motion-hints-ir",
        componentName: "AttemptPlanMotionHintCard",
        runtimeCapture: {
            url: "framer://project/attempt-plan-motion-hints-ir",
            title: "Attempt Plan Motion Hints",
            mode: "section",
            viewports: {
                desktop: { screenshotPath: "", width: 1440, height: 900 },
                laptop: { screenshotPath: "", width: 1280, height: 900 },
                tablet: { screenshotPath: "", width: 768, height: 1024 },
                mobile: { screenshotPath: "", width: 390, height: 844 },
            },
            nodes: [],
        },
        pluginCapture: {
            mode: "simulated",
            selectedNodes: [],
            capturedAt: "2026-06-12T00:00:00.000Z",
        },
        nodeMatches: [],
        component: {
            semanticType: "section",
            nodes: [],
            sections: [],
        },
        assets: [],
        exportTree: [
            {
                id: "cta",
                childIds: [],
                kind: "button",
                tag: "button",
                rect: { x: 0, y: 0, width: 160, height: 48 },
                styles: {
                    color: "#111111",
                },
                motionByViewport: {
                    desktop: {
                        transitionDuration: "0.3s",
                        transitionTimingFunction: "cubic-bezier(0.23, 1, 0.32, 1)",
                    },
                },
                interactionStylesByViewport: {
                    desktop: {
                        hover: {
                            transform: "matrix(1, 0, 0, 1, 0, -2)",
                            color: "rgb(255, 255, 255)",
                        },
                        focus: {
                            color: "rgb(255, 255, 255)",
                        },
                    },
                },
                attributes: {},
                source: {},
                children: [],
            },
        ],
        warnings: [],
    };
    const next = applyAttemptPlan({
        ir,
        strategy: baselineStrategy,
    }, {
        strategy: baselineStrategy,
        diagnosis: [],
        patchesApplied: [],
        diagnosisDetails: [],
        patchOperations: ["preserve_motion_styles"],
        patchTargets: {
            preserve_motion_styles: ["cta"],
        },
        patchPropertyHints: {
            preserve_motion_styles: {
                cta: {
                    desktop: ["hover.transform"],
                },
            },
        },
    });
    assert.deepEqual(next.ir.exportTree?.[0]?.interactionStyles, {
        hover: {
            transform: "matrix(1, 0, 0, 1, 0, -2)",
        },
    });
    assert.equal(next.ir.exportTree?.[0]?.motion?.transitionDuration, "0.3s");
    assert.equal("color" in (next.ir.exportTree?.[0]?.interactionStyles?.hover ?? {}), false);
});
test("applyAttemptPlan limits viewport override promotion to hinted properties", () => {
    const ir = {
        jobId: "attempt-plan-hints-ir",
        sourceUrl: "framer://project/attempt-plan-hints-ir",
        componentName: "AttemptPlanHintCard",
        runtimeCapture: {
            url: "framer://project/attempt-plan-hints-ir",
            title: "Attempt Plan Hints",
            mode: "section",
            viewports: {
                desktop: { screenshotPath: "", width: 1440, height: 900 },
                laptop: { screenshotPath: "", width: 1280, height: 900 },
                tablet: { screenshotPath: "", width: 768, height: 1024 },
                mobile: { screenshotPath: "", width: 390, height: 844 },
            },
            nodes: [],
        },
        pluginCapture: {
            mode: "simulated",
            selectedNodes: [],
            capturedAt: "2026-06-12T00:00:00.000Z",
        },
        nodeMatches: [],
        component: {
            semanticType: "section",
            nodes: [],
            sections: [],
        },
        assets: [],
        exportTree: [
            {
                id: "root",
                childIds: [],
                kind: "frame",
                tag: "div",
                rect: { x: 0, y: 0, width: 640, height: 320 },
                rectByViewport: {
                    mobile: { x: 0, y: 0, width: 360, height: 420 },
                },
                styles: {
                    padding: "32px",
                    backgroundColor: "#101828",
                },
                stylesByViewport: {
                    desktop: {
                        padding: "32px",
                        backgroundColor: "#101828",
                    },
                    mobile: {
                        padding: "20px",
                        backgroundColor: "#101828",
                        borderRadius: "20px",
                    },
                },
                attributes: {},
                source: {},
                children: [],
            },
        ],
        warnings: [],
    };
    const next = applyAttemptPlan({
        ir,
        strategy: baselineStrategy,
    }, {
        strategy: baselineStrategy,
        diagnosis: [],
        patchesApplied: [],
        diagnosisDetails: [],
        patchOperations: ["promote_viewport_overrides"],
        patchTargets: {
            promote_viewport_overrides: ["root"],
        },
        patchPropertyHints: {
            promote_viewport_overrides: {
                root: {
                    mobile: ["padding"],
                },
            },
        },
    });
    assert.deepEqual(next.ir.exportTree?.[0]?.stylesByViewport?.mobile, {
        padding: "20px",
        width: "360px",
        minHeight: "420px",
    });
});
test("detectAttemptPlateau identifies weak consecutive improvements", () => {
    assert.equal(detectAttemptPlateau([82, 82.4, 82.7]), true);
    assert.equal(detectAttemptPlateau([82, 84.1, 86.3]), false);
});
