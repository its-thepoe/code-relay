import { chromium } from "playwright";
import { PNG } from "pngjs";
import fs from "node:fs/promises";
import path from "node:path";
import pixelmatch from "pixelmatch";
const COMPARISON_PROPERTY_MATRIX = [
    ["fontSize", "typography"],
    ["lineHeight", "typography"],
    ["fontWeight", "typography"],
    ["color", "color"],
    ["display", "layout"],
    ["flexDirection", "layout"],
    ["justifyContent", "layout"],
    ["alignItems", "layout"],
    ["gap", "layout"],
    ["width", "layout"],
    ["minHeight", "layout"],
    ["gridTemplateColumns", "layout"],
    ["gridTemplateRows", "layout"],
    ["backgroundColor", "surface"],
    ["backgroundImage", "surface"],
    ["padding", "surface"],
    ["margin", "surface"],
    ["borderRadius", "surface"],
    ["border", "surface"],
    ["boxShadow", "surface"],
    ["objectFit", "surface"],
    ["transitionDuration", "motion"],
    ["transitionTimingFunction", "motion"],
];
const viewports = {
    desktop: { width: 1440, height: 900 },
    laptop: { width: 1280, height: 900 },
    tablet: { width: 768, height: 1024 },
    mobile: { width: 390, height: 844 },
};
const PREVIEW_INSPECTION_NODE_LIMIT = 120;
export async function compareGeneratedPreview(input) {
    const allViewports = Object.keys(input.ir.runtimeCapture.viewports);
    const comparisonViewports = activeOrAllViewports(input.ir);
    const activeViewports = Object.keys(input.ir.runtimeCapture.viewports)
        .filter((name) => input.ir.runtimeCapture.viewports[name]?.screenshotPath?.length);
    const previewValidation = await withTimeout(validateGeneratedPreview({
        previewHtmlPath: input.previewHtmlPath,
        ir: input.ir,
        viewports: comparisonViewports,
    }), 45_000, createBlockedPreviewValidation("Preview validation timed out."));
    const diagnostics = await withTimeout(tryCollectAggregateComparisonDiagnostics(input.previewHtmlPath, input.ir, comparisonViewports), 45_000, undefined);
    if (diagnostics) {
        await fs.writeFile(path.join(input.attemptDir, "compare-diagnostics.json"), `${JSON.stringify(diagnostics, null, 2)}\n`);
    }
    const hasOriginalScreens = activeViewports.length > 0;
    if (!hasOriginalScreens) {
        return {
            fidelity: scoreWithoutGeneratedScreens(input.ir, allViewports, previewValidation),
            evidence: createHeuristicEvidence({
                reason: "No runtime screenshots were available for the source export.",
                sourceScreenshotViewports: [],
                generatedScreenshotViewports: [],
                comparedViewports: [],
                previewValidation,
            }),
            previewValidation,
            diagnostics,
        };
    }
    const generated = await withTimeout(captureGeneratedPreview(input.previewHtmlPath, input.attemptDir, input.ir).catch(() => null), 60_000, null);
    if (!generated) {
        return {
            fidelity: scoreWithoutGeneratedScreens(input.ir, allViewports, previewValidation),
            evidence: createHeuristicEvidence({
                reason: "Generated preview screenshots could not be captured.",
                sourceScreenshotViewports: activeViewports,
                generatedScreenshotViewports: [],
                comparedViewports: [],
                previewValidation,
            }),
            diagnostics,
            previewValidation,
        };
    }
    const breakpointScores = Object.fromEntries(await Promise.all(activeViewports.map(async (name) => [
        name,
        await compareImages(input.ir.runtimeCapture.viewports[name].screenshotPath, generated[name]),
    ])));
    const desktop = breakpointScores.desktop ?? 0;
    const laptop = breakpointScores.laptop;
    const tablet = breakpointScores.tablet;
    const mobile = breakpointScores.mobile ?? desktop;
    const nodeMatch = average(input.ir.nodeMatches.map((match) => match.confidence * 100));
    const motion = motionScore(input.ir);
    const overall = weightedAverage([
        [desktop, 0.38],
        [laptop ?? desktop, 0.12],
        [tablet ?? mobile, 0.16],
        [mobile, 0.28],
        [nodeMatch, 0.14],
        [assetScore(input.ir), 0.1],
        [typographyScore(input.ir), 0.1],
        [motion, 0.06],
    ]);
    return {
        fidelity: {
            desktop,
            laptop,
            tablet,
            mobile,
            overall,
            layout: Math.min(100, weightedAverage([
                [desktop, 0.6],
                [tablet ?? mobile, 0.15],
                [mobile, 0.25],
            ]) + 4),
            typography: typographyScore(input.ir),
            color: Math.min(100, desktop + 8),
            assets: assetScore(input.ir),
            motion,
            nodeMatch,
            breakpointScores,
        },
        evidence: {
            mode: "screenshot-backed",
            reason: `Compared rendered screenshots for ${activeViewports.length} viewport(s).`,
            sourceScreenshotViewports: activeViewports,
            generatedScreenshotViewports: activeViewports,
            comparedViewports: activeViewports,
            previewValidationStatus: previewValidation.status,
        },
        diagnostics,
        previewValidation,
    };
}
function activeOrAllViewports(ir) {
    const active = Object.keys(ir.runtimeCapture.viewports).filter((name) => ir.runtimeCapture.viewports[name]?.screenshotPath?.length);
    return active.length > 0
        ? active
        : Object.keys(ir.runtimeCapture.viewports);
}
function scoreWithoutGeneratedScreens(ir, allViewports, previewValidation) {
    const nodeMatch = average(ir.nodeMatches.map((match) => match.confidence * 100));
    const typography = typographyScore(ir);
    const assets = assetScore(ir);
    const motion = motionScore(ir);
    const breakpointScores = Object.fromEntries(allViewports.map((viewport) => [
        viewport,
        weightedAverageDefined([
            [nodeMatch, 0.35],
            [typography, 0.2],
            [assets, 0.15],
            [scorePreviewValidationByViewport(previewValidation, viewport), 0.3],
        ]),
    ]));
    const desktop = breakpointScores.desktop ?? 0;
    const laptop = breakpointScores.laptop ?? desktop;
    const tablet = breakpointScores.tablet ?? laptop;
    const mobile = breakpointScores.mobile ?? tablet;
    const overall = weightedAverage([
        [desktop, 0.38],
        [laptop, 0.12],
        [tablet, 0.16],
        [mobile, 0.28],
        [nodeMatch, 0.06],
    ]);
    return {
        desktop,
        laptop,
        tablet,
        mobile,
        overall,
        layout: Math.min(100, weightedAverage([
            [desktop, 0.6],
            [tablet, 0.15],
            [mobile, 0.25],
        ]) + 4),
        typography,
        color: Math.min(100, desktop + 8),
        assets,
        motion,
        nodeMatch,
        breakpointScores,
    };
}
function createBlockedPreviewValidation(reason) {
    return {
        status: "blocked",
        reason,
        summary: {
            viewportsValidated: 0,
            inspectedNodes: 0,
            foundNodes: 0,
            nodesWithNonDefaultStyles: 0,
            nodesExpectingMotion: 0,
            nodesWithNonDefaultMotion: 0,
        },
    };
}
function createHeuristicEvidence(input) {
    return {
        mode: "heuristic",
        reason: input.reason,
        sourceScreenshotViewports: input.sourceScreenshotViewports,
        generatedScreenshotViewports: input.generatedScreenshotViewports,
        comparedViewports: input.comparedViewports,
        previewValidationStatus: input.previewValidation?.status,
    };
}
function selectRepresentativePreviewNodes(ir) {
    return flattenExportTree(ir.exportTree ?? [])
        .filter((node) => node.source.runtimeNodeId || node.source.domPath)
        .slice(0, PREVIEW_INSPECTION_NODE_LIMIT);
}
async function waitForPreviewReady(page) {
    await page
        .waitForFunction(() => document.readyState !== "loading" &&
        Boolean(document.querySelector("[data-coderelay-source], body")), undefined, { timeout: 10_000 })
        .catch(() => undefined);
    await page.waitForTimeout(250);
}
async function withTimeout(promise, timeoutMs, fallback) {
    let timeout;
    try {
        return await Promise.race([
            promise,
            new Promise((resolve) => {
                timeout = setTimeout(() => resolve(fallback), timeoutMs);
            }),
        ]);
    }
    finally {
        if (timeout)
            clearTimeout(timeout);
    }
}
export function scorePreviewValidation(previewValidation) {
    if (!previewValidation || previewValidation.status !== "validated") {
        return undefined;
    }
    const inspected = previewValidation.summary.inspectedNodes;
    if (inspected <= 0)
        return 0;
    const foundCoverage = (previewValidation.summary.foundNodes / inspected) * 100;
    const styledCoverage = (previewValidation.summary.nodesWithNonDefaultStyles / inspected) * 100;
    const motionCoverage = previewValidation.summary.nodesExpectingMotion > 0
        ? (previewValidation.summary.nodesWithNonDefaultMotion /
            previewValidation.summary.nodesExpectingMotion) *
            100
        : 100;
    return Number(weightedAverageDefined([
        [foundCoverage, 0.35],
        [styledCoverage, 0.45],
        [motionCoverage, previewValidation.summary.nodesExpectingMotion > 0 ? 0.2 : 0],
    ]).toFixed(2));
}
export function scorePreviewValidationByViewport(previewValidation, viewport) {
    if (!previewValidation || previewValidation.status !== "validated") {
        return undefined;
    }
    const stats = previewValidation.byViewport?.[viewport];
    if (!stats || stats.inspectedNodes <= 0) {
        return undefined;
    }
    const foundCoverage = (stats.foundNodes / stats.inspectedNodes) * 100;
    const styledCoverage = (stats.nodesWithNonDefaultStyles / stats.inspectedNodes) * 100;
    const motionCoverage = stats.nodesExpectingMotion > 0
        ? (stats.nodesWithNonDefaultMotion / stats.nodesExpectingMotion) * 100
        : 100;
    return Number(weightedAverageDefined([
        [foundCoverage, 0.35],
        [styledCoverage, 0.45],
        [motionCoverage, stats.nodesExpectingMotion > 0 ? 0.2 : 0],
    ]).toFixed(2));
}
async function validateGeneratedPreview(input) {
    try {
        const entries = await Promise.all(input.viewports.map(async (viewport) => [
            viewport,
            await collectPreviewValidationForViewport(input.previewHtmlPath, input.ir, viewport),
        ]));
        const byViewport = Object.fromEntries(entries);
        const stats = Object.values(byViewport);
        return {
            status: "validated",
            summary: {
                viewportsValidated: stats.length,
                inspectedNodes: stats.reduce((sum, entry) => sum + entry.inspectedNodes, 0),
                foundNodes: stats.reduce((sum, entry) => sum + entry.foundNodes, 0),
                nodesWithNonDefaultStyles: stats.reduce((sum, entry) => sum + entry.nodesWithNonDefaultStyles, 0),
                nodesExpectingMotion: stats.reduce((sum, entry) => sum + entry.nodesExpectingMotion, 0),
                nodesWithNonDefaultMotion: stats.reduce((sum, entry) => sum + entry.nodesWithNonDefaultMotion, 0),
            },
            byViewport,
        };
    }
    catch (error) {
        return {
            status: "blocked",
            reason: error instanceof Error ? error.message : String(error),
            summary: {
                viewportsValidated: 0,
                inspectedNodes: 0,
                foundNodes: 0,
                nodesWithNonDefaultStyles: 0,
                nodesExpectingMotion: 0,
                nodesWithNonDefaultMotion: 0,
            },
        };
    }
}
async function captureGeneratedPreview(previewHtmlPath, attemptDir, ir) {
    const browser = await chromium.launch({ headless: true });
    const output = {
        desktop: path.join(attemptDir, "generated-desktop.png"),
        laptop: path.join(attemptDir, "generated-laptop.png"),
        tablet: path.join(attemptDir, "generated-tablet.png"),
        mobile: path.join(attemptDir, "generated-mobile.png"),
    };
    try {
        for (const [name, viewport] of Object.entries(viewports)) {
            const page = await browser.newPage({ viewport });
            await page.goto(`file://${previewHtmlPath}`, {
                waitUntil: "domcontentloaded",
                timeout: 20_000,
            });
            await waitForPreviewReady(page);
            if (ir.runtimeCapture.mode === "page") {
                await page.screenshot({
                    path: output[name],
                    fullPage: true,
                    animations: "disabled",
                });
            }
            else {
                await page.screenshot({
                    path: output[name],
                    clip: {
                        x: 0,
                        y: 0,
                        width: ir.runtimeCapture.viewports[name].width,
                        height: ir.runtimeCapture.viewports[name].height,
                    },
                    animations: "disabled",
                });
            }
            await page.close();
        }
    }
    finally {
        await browser.close();
    }
    return output;
}
async function collectComparisonDiagnostics(previewHtmlPath, ir, viewport) {
    const browser = await chromium.launch({ headless: true });
    try {
        const sourceNodes = selectRepresentativePreviewNodes(ir);
        const generatedNodes = await inspectGeneratedPreviewNodes({
            previewHtmlPath,
            viewport,
            nodeClasses: sourceNodes.map((node) => ({
                nodeId: node.id,
                className: treeNodeClass(node),
            })),
            browser,
        });
        const diagnosticNodes = sourceNodes.map((node) => {
            const generated = generatedNodes.find((entry) => entry.nodeId === node.id);
            const propertyDiffs = [];
            const issueTypes = new Set();
            const sourceStyles = node.stylesByViewport?.[viewport] ?? node.styles;
            const sourceMotion = node.motionByViewport?.[viewport] ?? node.motion;
            const sourceInteractionStyles = node.interactionStylesByViewport?.[viewport] ?? node.interactionStyles;
            if (!generated?.found || !generated.styles) {
                issueTypes.add("missing_node");
            }
            else {
                const compared = collectNodePropertyDiffs({
                    sourceStyles,
                    sourceMotion,
                    sourceInteractionStyles,
                    generatedStyles: generated.styles,
                    generatedInteractionStyles: generated.interactionStyles ?? undefined,
                });
                propertyDiffs.push(...compared.propertyDiffs);
                for (const issueType of compared.issueTypes) {
                    issueTypes.add(issueType);
                }
            }
            return {
                nodeId: node.id,
                tag: node.tag,
                sourceDomPath: node.source.domPath,
                className: treeNodeClass(node),
                issueTypes: Array.from(issueTypes),
                propertyDiffs,
            };
        });
        return {
            viewport,
            summary: {
                nodesCompared: diagnosticNodes.length,
                missingNodes: diagnosticNodes.filter((node) => node.issueTypes.includes("missing_node")).length,
                typographyIssues: diagnosticNodes.filter((node) => node.issueTypes.includes("typography")).length,
                layoutIssues: diagnosticNodes.filter((node) => node.issueTypes.includes("layout")).length,
                colorIssues: diagnosticNodes.filter((node) => node.issueTypes.includes("color")).length,
                surfaceIssues: diagnosticNodes.filter((node) => node.issueTypes.includes("surface")).length,
                motionIssues: diagnosticNodes.filter((node) => node.issueTypes.includes("motion")).length,
            },
            nodes: diagnosticNodes,
        };
    }
    finally {
        await browser.close();
    }
}
export async function inspectGeneratedPreviewNodes(input) {
    const ownsBrowser = !input.browser;
    const browser = input.browser ?? (await chromium.launch({ headless: true }));
    try {
        const page = await browser.newPage({ viewport: viewports[input.viewport] });
        await page.goto(`file://${input.previewHtmlPath}`, {
            waitUntil: "domcontentloaded",
            timeout: 20_000,
        });
        await waitForPreviewReady(page);
        const nodes = [];
        for (const entry of input.nodeClasses) {
            const locator = page.locator(`.${entry.className}`).first();
            const found = await locator.count().then((count) => count > 0);
            if (!found) {
                nodes.push({
                    nodeId: entry.nodeId,
                    className: entry.className,
                    found: false,
                    styles: null,
                    interactionStyles: null,
                });
                continue;
            }
            const styles = await readPreviewStyles(locator);
            const interactionStyles = await readPreviewInteractionStyles(page, locator, styles);
            nodes.push({
                nodeId: entry.nodeId,
                className: entry.className,
                found: true,
                styles,
                interactionStyles,
            });
        }
        await page.close();
        return nodes;
    }
    finally {
        if (ownsBrowser) {
            await browser.close();
        }
    }
}
async function readPreviewStyles(locator) {
    return locator.evaluate((element) => {
        const styles = window.getComputedStyle(element);
        return {
            display: styles.display,
            flexDirection: styles.flexDirection,
            justifyContent: styles.justifyContent,
            alignItems: styles.alignItems,
            gap: styles.gap,
            color: styles.color,
            backgroundColor: styles.backgroundColor,
            backgroundImage: styles.backgroundImage,
            fontSize: styles.fontSize,
            lineHeight: styles.lineHeight,
            fontWeight: styles.fontWeight,
            padding: styles.padding,
            margin: styles.margin,
            border: styles.border,
            boxShadow: styles.boxShadow,
            borderRadius: styles.borderRadius,
            width: styles.width,
            minHeight: styles.minHeight,
            gridTemplateColumns: styles.gridTemplateColumns,
            gridTemplateRows: styles.gridTemplateRows,
            objectFit: styles.objectFit,
            transform: styles.transform,
            opacity: styles.opacity,
            transitionDuration: styles.transitionDuration,
            transitionTimingFunction: styles.transitionTimingFunction,
            transitionProperty: styles.transitionProperty,
        };
    });
}
async function readPreviewInteractionStyles(page, locator, baseStyles) {
    if (!baseStyles)
        return null;
    const interactionStyles = {};
    await page.mouse.move(0, 0).catch(() => { });
    const hovered = await locator.hover({ force: true, timeout: 1500 }).then(async () => {
        await page.waitForTimeout(380);
        return readPreviewStyles(locator);
    }, () => null);
    await page.mouse.move(0, 0).catch(() => { });
    if (hovered) {
        const hoverDiff = diffGeneratedStateStyles(baseStyles, hovered);
        if (Object.keys(hoverDiff).length > 0) {
            interactionStyles.hover = hoverDiff;
        }
    }
    const focused = await locator.focus().then(async () => {
        await page.waitForTimeout(380);
        return readPreviewStyles(locator);
    }, () => null);
    await locator.evaluate((element) => {
        if (element instanceof HTMLElement) {
            element.blur();
        }
    }).catch(() => { });
    if (focused) {
        const focusDiff = diffGeneratedStateStyles(baseStyles, focused);
        if (Object.keys(focusDiff).length > 0) {
            interactionStyles.focus = focusDiff;
        }
    }
    return Object.keys(interactionStyles).length > 0 ? interactionStyles : null;
}
function diffGeneratedStateStyles(baseStyles, stateStyles) {
    const diff = {};
    for (const [property, value] of Object.entries(stateStyles)) {
        if (!value)
            continue;
        if (roughlyEquivalent(baseStyles[property] ?? "", value))
            continue;
        diff[property] = value;
    }
    return diff;
}
async function collectPreviewValidationForViewport(previewHtmlPath, ir, viewport) {
    const sourceNodes = selectRepresentativePreviewNodes(ir);
    const inspectedNodes = await inspectGeneratedPreviewNodes({
        previewHtmlPath,
        viewport,
        nodeClasses: sourceNodes.map((node) => ({
            nodeId: node.id,
            className: treeNodeClass(node),
        })),
    });
    const foundNodes = inspectedNodes.filter((node) => node.found && node.styles).length;
    const nodesWithNonDefaultStyles = sourceNodes.filter((node) => {
        const inspected = inspectedNodes.find((entry) => entry.nodeId === node.id);
        if (!inspected?.styles)
            return false;
        return hasNonDefaultGeneratedStyles({
            sourceStyles: node.stylesByViewport?.[viewport] ?? node.styles,
            generatedStyles: inspected.styles,
        });
    }).length;
    const nodesWithNonDefaultMotion = sourceNodes.filter((node) => {
        const inspected = inspectedNodes.find((entry) => entry.nodeId === node.id);
        if (!inspected?.styles)
            return false;
        return hasNonDefaultGeneratedMotion({
            sourceMotion: node.motionByViewport?.[viewport] ?? node.motion,
            sourceInteractionStyles: node.interactionStylesByViewport?.[viewport] ?? node.interactionStyles,
            generatedStyles: inspected.styles,
            generatedInteractionStyles: inspected.interactionStyles ?? undefined,
        });
    }).length;
    const nodesExpectingMotion = sourceNodes.filter((node) => hasMotionStyles(node.motionByViewport?.[viewport] ?? node.motion) ||
        hasInteractionStateStyles(node.interactionStylesByViewport?.[viewport] ?? node.interactionStyles)).length;
    return {
        viewport,
        inspectedNodes: sourceNodes.length,
        foundNodes,
        nodesWithNonDefaultStyles,
        nodesExpectingMotion,
        nodesWithNonDefaultMotion,
    };
}
export function collectNodePropertyDiffs(input) {
    const propertyDiffs = [];
    const issueTypes = new Set();
    for (const [property, issueType] of COMPARISON_PROPERTY_MATRIX) {
        const source = issueType === "motion"
            ? input.sourceMotion?.[property]
            : input.sourceStyles[property];
        const generated = input.generatedStyles[property];
        compareProperty(source, generated, property, propertyDiffs, issueTypes, issueType);
    }
    const interactionDiffs = collectInteractionStateDiffs({
        sourceInteractionStyles: input.sourceInteractionStyles,
        generatedInteractionStyles: input.generatedInteractionStyles,
    });
    propertyDiffs.push(...interactionDiffs.propertyDiffs);
    for (const issueType of interactionDiffs.issueTypes) {
        issueTypes.add(issueType);
    }
    return {
        propertyDiffs,
        issueTypes,
    };
}
async function collectAggregateComparisonDiagnostics(previewHtmlPath, ir, activeViewports) {
    const entries = await Promise.all(activeViewports.map(async (viewport) => [
        viewport,
        await collectComparisonDiagnostics(previewHtmlPath, ir, viewport),
    ]));
    const byViewport = Object.fromEntries(entries);
    const diagnosticsList = Object.values(byViewport);
    const mergedNodes = diagnosticsList.flatMap((entry) => entry.nodes);
    return aggregateComparisonDiagnostics(byViewport, mergedNodes);
}
async function tryCollectAggregateComparisonDiagnostics(previewHtmlPath, ir, activeViewports) {
    try {
        return await collectAggregateComparisonDiagnostics(previewHtmlPath, ir, activeViewports);
    }
    catch {
        return undefined;
    }
}
export function aggregateComparisonDiagnostics(byViewport, mergedNodes) {
    const diagnosticsList = Object.values(byViewport);
    return {
        viewport: "all",
        summary: {
            nodesCompared: diagnosticsList.reduce((sum, entry) => sum + entry.summary.nodesCompared, 0),
            missingNodes: diagnosticsList.reduce((sum, entry) => sum + entry.summary.missingNodes, 0),
            typographyIssues: diagnosticsList.reduce((sum, entry) => sum + entry.summary.typographyIssues, 0),
            layoutIssues: diagnosticsList.reduce((sum, entry) => sum + entry.summary.layoutIssues, 0),
            colorIssues: diagnosticsList.reduce((sum, entry) => sum + entry.summary.colorIssues, 0),
            surfaceIssues: diagnosticsList.reduce((sum, entry) => sum + entry.summary.surfaceIssues, 0),
            motionIssues: diagnosticsList.reduce((sum, entry) => sum + entry.summary.motionIssues, 0),
        },
        nodes: mergedNodes ?? diagnosticsList.flatMap((entry) => entry.nodes),
        byViewport,
    };
}
async function compareImages(originalPath, generatedPath) {
    const original = PNG.sync.read(await fs.readFile(originalPath));
    const generated = PNG.sync.read(await fs.readFile(generatedPath));
    const width = Math.min(original.width, generated.width);
    const height = Math.min(original.height, generated.height);
    const originalCrop = cropPng(original, width, height);
    const generatedCrop = cropPng(generated, width, height);
    const diff = new PNG({ width, height });
    const mismatched = pixelmatch(originalCrop.data, generatedCrop.data, diff.data, width, height, {
        threshold: 0.15,
        includeAA: true,
    });
    const total = width * height;
    return Number(Math.max(0, 100 - (mismatched / total) * 100).toFixed(2));
}
function cropPng(source, width, height) {
    if (source.width === width && source.height === height) {
        return source;
    }
    const cropped = new PNG({ width, height });
    PNG.bitblt(source, cropped, 0, 0, width, height, 0, 0);
    return cropped;
}
function assetScore(ir) {
    if (ir.assets.length === 0) {
        return 100;
    }
    const usableAssets = ir.assets.filter((asset) => asset.url.startsWith("http") || asset.url.startsWith("data:"));
    return Number(((usableAssets.length / ir.assets.length) * 100).toFixed(2));
}
function typographyScore(ir) {
    const textNodes = ir.component.nodes.filter((node) => node.text);
    if (textNodes.length === 0) {
        return 80;
    }
    const withFonts = textNodes.filter((node) => node.styles.fontSize && node.styles.lineHeight);
    return Number(Math.max(70, (withFonts.length / textNodes.length) * 100).toFixed(2));
}
function motionScore(ir) {
    const runtimeMotionNodes = ir.runtimeCapture.nodes.filter((node) => hasMotionStyles(node.motion) || hasInteractionStateStyles(node.interactionStyles));
    if (runtimeMotionNodes.length === 0) {
        return 100;
    }
    const exportMotionNodes = flattenExportTree(ir.exportTree ?? []).filter((node) => hasMotionStyles(node.motion) || hasInteractionStateStyles(node.interactionStyles));
    const matched = runtimeMotionNodes.filter((runtimeNode) => exportMotionNodes.some((exportNode) => exportNode.source.runtimeNodeId === runtimeNode.id ||
        exportNode.source.domPath === runtimeNode.domPath)).length;
    return Number(((matched / runtimeMotionNodes.length) * 100).toFixed(2));
}
function average(values) {
    if (values.length === 0) {
        return 0;
    }
    return Number((values.reduce((sum, value) => sum + value, 0) / values.length).toFixed(2));
}
function weightedAverage(entries) {
    const weight = entries.reduce((sum, entry) => sum + entry[1], 0);
    const total = entries.reduce((sum, [value, entryWeight]) => sum + value * entryWeight, 0);
    return Number((total / weight).toFixed(2));
}
function weightedAverageDefined(entries) {
    const present = entries.filter((entry) => typeof entry[0] === "number" && Number.isFinite(entry[0]) && entry[1] > 0);
    if (present.length === 0) {
        return 0;
    }
    return weightedAverage(present);
}
function flattenExportTree(nodes) {
    return nodes.flatMap((node) => [node, ...flattenExportTree(node.children)]);
}
function treeNodeClass(node) {
    return `node${toSafeIdentifier(stableTreeNodeKey(node))}`;
}
function stableTreeNodeKey(node) {
    if (typeof node.source.pluginNodeId === "string" && node.source.pluginNodeId.length > 0) {
        return node.source.pluginNodeId;
    }
    if (typeof node.source.domPath === "string" && node.source.domPath.length > 0) {
        return node.source.domPath;
    }
    return node.id;
}
function toSafeIdentifier(value) {
    const sanitized = value.replace(/[^a-zA-Z0-9_$]+/g, " ");
    const parts = sanitized
        .trim()
        .split(/\s+/)
        .filter(Boolean);
    if (parts.length === 0)
        return "Node";
    return parts
        .map((part, index) => index === 0
        ? `${part.charAt(0).toUpperCase()}${part.slice(1)}`
        : `${part.charAt(0).toUpperCase()}${part.slice(1)}`)
        .join("");
}
function compareProperty(source, generated, property, propertyDiffs, issueTypes, issueType) {
    if (!source)
        return;
    if (!generated) {
        propertyDiffs.push({ property, source, generated });
        issueTypes.add(issueType);
        return;
    }
    if (!roughlyEquivalent(source, generated)) {
        propertyDiffs.push({ property, source, generated });
        issueTypes.add(issueType);
    }
}
function roughlyEquivalent(source, generated) {
    const normalize = (value) => value.replace(/\s+/g, " ").trim().toLowerCase();
    const sourceNormalized = normalize(source);
    const generatedNormalized = normalize(generated);
    if (sourceNormalized === generatedNormalized)
        return true;
    if (sourceNormalized === "0px" && generatedNormalized === "0px")
        return true;
    return false;
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
function hasNonDefaultGeneratedStyles(input) {
    return COMPARISON_PROPERTY_MATRIX.some(([property, issueType]) => {
        if (issueType === "motion")
            return false;
        const source = input.sourceStyles[property];
        const generated = input.generatedStyles[property];
        if (!source || !generated)
            return false;
        if (!roughlyEquivalent(source, generated))
            return false;
        return !isDefaultComputedStyle(property, generated);
    });
}
function hasNonDefaultGeneratedMotion(input) {
    const matchedBaseMotion = Boolean(input.sourceMotion &&
        ["transitionDuration", "transitionTimingFunction"].some((property) => {
            const source = input.sourceMotion?.[property];
            const generated = input.generatedStyles[property];
            if (!source || !generated)
                return false;
            if (!roughlyEquivalent(source, generated))
                return false;
            return !isDefaultComputedStyle(property, generated);
        }));
    const matchedInteractionMotion = Boolean(input.sourceInteractionStyles &&
        ["hover", "focus"].some((state) => {
            const sourceState = input.sourceInteractionStyles?.[state];
            const generatedState = input.generatedInteractionStyles?.[state];
            if (!sourceState || !generatedState)
                return false;
            return Object.entries(sourceState).some(([property, source]) => {
                const generated = generatedState[property];
                return Boolean(source &&
                    generated &&
                    roughlyEquivalent(source, generated) &&
                    !isDefaultComputedStyle(property, generated));
            });
        }));
    return matchedBaseMotion || matchedInteractionMotion;
}
function collectInteractionStateDiffs(input) {
    const propertyDiffs = [];
    const issueTypes = new Set();
    if (!input.sourceInteractionStyles) {
        return { propertyDiffs, issueTypes };
    }
    for (const state of ["hover", "focus"]) {
        const sourceState = input.sourceInteractionStyles[state];
        if (!sourceState)
            continue;
        const generatedState = input.generatedInteractionStyles?.[state];
        for (const [property, source] of Object.entries(sourceState)) {
            if (!source)
                continue;
            const generated = generatedState?.[property];
            if (!generated || !roughlyEquivalent(source, generated)) {
                propertyDiffs.push({
                    property: `${state}.${property}`,
                    source,
                    generated,
                });
                issueTypes.add("motion");
            }
        }
    }
    return { propertyDiffs, issueTypes };
}
function isDefaultComputedStyle(property, value) {
    const normalized = value.replace(/\s+/g, " ").trim().toLowerCase();
    switch (property) {
        case "backgroundColor":
            return normalized === "rgba(0, 0, 0, 0)" || normalized === "transparent";
        case "backgroundImage":
            return normalized === "none";
        case "border":
            return normalized === "0px none rgb(0, 0, 0)";
        case "borderRadius":
            return normalized === "0px";
        case "boxShadow":
            return normalized === "none";
        case "padding":
        case "margin":
        case "gap":
            return normalized === "0px" || normalized === "0px 0px 0px 0px";
        case "transitionDuration":
            return normalized === "0s";
        case "transitionTimingFunction":
            return normalized === "ease";
        default:
            return false;
    }
}
