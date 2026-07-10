import { mkdirp } from "fs-extra";
import crypto from "node:crypto";
import { chromium, } from "playwright";
import path from "node:path";
import { PNG } from "pngjs";
import fs from "node:fs/promises";
export const FULL_SITE_VIEWPORTS = {
    desktop: { width: 1440, height: 900 },
    laptop: { width: 1280, height: 900 },
    tablet: { width: 768, height: 1024 },
    mobile: { width: 390, height: 844 },
};
const viewports = FULL_SITE_VIEWPORTS;
const ROUTE_CAPTURE_TIMEOUT_MS = 3 * 60_000;
const INTERACTION_REPLAY_TIMEOUT_MS = 20_000;
const ROUTE_CAPTURE_CACHE_SCHEMA_VERSION = 5;
const MOTION_STYLE_PROPERTIES = [
    "transitionProperty",
    "transitionDuration",
    "transitionTimingFunction",
    "transitionDelay",
    "animationName",
    "animationDuration",
    "animationTimingFunction",
    "animationDelay",
    "animationIterationCount",
    "animationDirection",
    "animationFillMode",
    "transformOrigin",
];
export const CAPTURED_STYLE_PROPERTIES = [
    "display",
    "position",
    "top",
    "right",
    "bottom",
    "left",
    "fontSize",
    "fontFamily",
    "fontWeight",
    "fontStyle",
    "lineHeight",
    "letterSpacing",
    "textAlign",
    "textTransform",
    "textDecoration",
    "whiteSpace",
    "wordBreak",
    "color",
    "background",
    "backgroundColor",
    "backgroundImage",
    "backgroundBlendMode",
    "backgroundPosition",
    "backgroundSize",
    "backgroundRepeat",
    "borderRadius",
    "border",
    "boxShadow",
    "transform",
    "opacity",
    "padding",
    "paddingTop",
    "paddingRight",
    "paddingBottom",
    "paddingLeft",
    "margin",
    "marginTop",
    "marginRight",
    "marginBottom",
    "marginLeft",
    "width",
    "height",
    "minWidth",
    "minHeight",
    "maxWidth",
    "maxHeight",
    "gridTemplateColumns",
    "gridTemplateRows",
    "gridAutoFlow",
    "gridColumn",
    "gridRow",
    "gap",
    "rowGap",
    "columnGap",
    "justifyContent",
    "alignItems",
    "alignSelf",
    "justifySelf",
    "placeItems",
    "placeContent",
    "placeSelf",
    "flexDirection",
    "flexWrap",
    "overflow",
    "overflowX",
    "overflowY",
    "objectFit",
    "objectPosition",
    "aspectRatio",
    "pointerEvents",
    "zIndex",
    "cursor",
];
const INTERACTION_STYLE_PROPERTIES = [
    ...CAPTURED_STYLE_PROPERTIES,
    ...MOTION_STYLE_PROPERTIES,
];
export async function captureRuntime(input) {
    const browser = await chromium.launch({ headless: true });
    try {
        return await captureRuntimeWithBrowser(browser, input);
    }
    finally {
        await browser.close();
    }
}
export async function captureRuntimeRoutes(input) {
    await mkdirp(input.workDir);
    const routes = unique(input.routes
        .map((route) => ({
        path: normalizeRoutePath(route.path),
        title: route.title,
        templateId: route.templateId,
        templatePath: route.templatePath,
        templateKind: route.templateKind,
    }))
        .filter((route) => route.path), (route) => route.path);
    if (routes.length === 0) {
        routes.push({
            path: "/",
            title: undefined,
            templateId: "/",
            templatePath: "/",
            templateKind: "static",
        });
    }
    const browser = await chromium.launch({ headless: true });
    const routeCaptures = [];
    const routeFailures = [];
    let consecutiveNetworkFailures = 0;
    if (input.cacheDir)
        await mkdirp(input.cacheDir);
    try {
        // Published Framer origins can abort bursts of simultaneous document requests.
        // Each route already captures four responsive viewports, so process routes serially.
        const concurrency = 1;
        for (let index = 0; index < routes.length; index += concurrency) {
            const batch = routes.slice(index, index + concurrency);
            const captures = await Promise.all(batch.map(async (route) => {
                const url = new URL(route.path, input.originUrl).toString();
                const baseCapture = input.baseCapturesByRoute?.[route.path];
                const cached = input.cacheDir
                    ? await readCachedRouteCapture(input.cacheDir, route.path, url)
                    : null;
                if (cached) {
                    console.log("[coderelay:capture:route-cache-hit]", JSON.stringify({ routePath: route.path }));
                    consecutiveNetworkFailures = 0;
                    return cached;
                }
                const routeWorkDir = path.join(input.workDir, "routes", routeDirectoryName(route.path));
                console.log("[coderelay:capture:route]", JSON.stringify({ routePath: route.path, url }));
                const context = await browser.newContext();
                try {
                    const capture = await withTimeout(captureRuntimeWithBrowser(context, {
                        url,
                        workDir: routeWorkDir,
                        routePath: route.path,
                        viewportNames: input.viewportNames,
                        baseCapture,
                        interactionReplayTimeoutMs: input.interactionReplayTimeoutMs,
                    }), ROUTE_CAPTURE_TIMEOUT_MS, `Route capture exceeded ${ROUTE_CAPTURE_TIMEOUT_MS / 60_000} minutes: ${route.path}`);
                    const result = {
                        ...capture,
                        title: route.title?.trim() || capture.title,
                        routePath: route.path,
                        templateId: route.templateId,
                        templatePath: route.templatePath,
                        templateKind: route.templateKind,
                    };
                    consecutiveNetworkFailures = 0;
                    if (input.cacheDir) {
                        await writeCachedRouteCapture(input.cacheDir, route.path, url, result);
                    }
                    return result;
                }
                catch (error) {
                    if (/ERR_INTERNET_DISCONNECTED|ERR_NAME_NOT_RESOLVED/i.test(formatError(error))) {
                        consecutiveNetworkFailures += 1;
                    }
                    else {
                        consecutiveNetworkFailures = 0;
                    }
                    routeFailures.push({
                        routePath: route.path,
                        error: formatError(error),
                    });
                    console.warn("[coderelay:capture:route-skipped]", JSON.stringify({ routePath: route.path, error: formatError(error) }));
                    return null;
                }
                finally {
                    await context.close().catch(() => undefined);
                }
            }));
            routeCaptures.push(...captures.filter((capture) => capture !== null));
            const completed = Math.min(index + batch.length, routes.length);
            await fs.writeFile(path.join(input.workDir, "capture-progress.json"), `${JSON.stringify({
                completed,
                total: routes.length,
                captured: routeCaptures.map((capture) => capture.routePath),
                failures: routeFailures,
            }, null, 2)}\n`);
            await input.onProgress?.({
                completed,
                total: routes.length,
                routePath: batch.at(-1)?.path ?? "/",
                failed: routeFailures.length,
            });
            if (consecutiveNetworkFailures >= 3) {
                throw new Error("Network unavailable for three consecutive routes. Capture stopped safely; restart the job when connectivity returns to resume from the route cache.");
            }
        }
    }
    finally {
        await browser.close();
    }
    if (routeCaptures.length === 0) {
        throw new Error(`Full-site capture failed for all ${routes.length} routes. First error: ${routeFailures[0]?.error ?? "unknown capture error"}`);
    }
    const primary = routeCaptures.find((capture) => capture.routePath === "/") ??
        routeCaptures[0];
    const stylesheetUrls = unique(routeCaptures.flatMap((capture) => capture.stylesheetUrls ?? []));
    const framerStyleCss = Array.from(new Set(routeCaptures
        .map((capture) => capture.framerStyleCss?.trim())
        .filter((css) => Boolean(css)))).join("\n\n");
    return {
        ...primary,
        stylesheetUrls,
        framerStyleCss,
        routeCaptures,
    };
}
export async function validateFullSiteCapture(input) {
    const expectedRoutes = new Set(input.routes.map((route) => normalizeRoutePath(route.path)));
    const capturedRoutes = new Map((input.capture.routeCaptures ?? []).map((capture) => [
        normalizeRoutePath(capture.routePath),
        capture,
    ]));
    for (const routePath of expectedRoutes) {
        const capture = capturedRoutes.get(routePath);
        if (!capture) {
            throw new Error(`Full-site capture incomplete: route ${routePath} was not captured.`);
        }
        const breakpoints = capture.captureDiagnostics?.breakpointsCaptured ?? [];
        const observedWidths = new Set();
        for (const viewportName of Object.keys(FULL_SITE_VIEWPORTS)) {
            const expected = FULL_SITE_VIEWPORTS[viewportName];
            const validation = capture.captureDiagnostics?.viewportValidation?.[viewportName];
            const viewport = capture.viewports[viewportName];
            if (!breakpoints.includes(viewportName) || !validation || !viewport) {
                throw new Error(`Full-site capture incomplete: route ${routePath} is missing ${viewportName} evidence.`);
            }
            if (!validation.valid) {
                throw new Error(`Full-site capture invalid: route ${routePath} at ${viewportName} (${validation.reason ?? "viewport validation failed"}).`);
            }
            if (validation.requestedWidth !== expected.width ||
                validation.observedInnerWidth !== expected.width ||
                Math.abs(validation.screenshotWidth - expected.width) > 1) {
                throw new Error(`Full-site capture width mismatch: route ${routePath} at ${viewportName} requested=${validation.requestedWidth}, observed=${validation.observedInnerWidth}, screenshot=${validation.screenshotWidth}.`);
            }
            if (!viewport.screenshotPath) {
                throw new Error(`Full-site capture incomplete: route ${routePath} at ${viewportName} has no screenshot path.`);
            }
            await fs.stat(viewport.screenshotPath).catch(() => {
                throw new Error(`Full-site capture incomplete: route ${routePath} at ${viewportName} screenshot does not exist (${viewport.screenshotPath}).`);
            });
            if (observedWidths.has(validation.observedInnerWidth)) {
                throw new Error(`Full-site capture invalid: route ${routePath} has duplicate observed viewport width ${validation.observedInnerWidth}.`);
            }
            observedWidths.add(validation.observedInnerWidth);
        }
    }
    for (const routePath of capturedRoutes.keys()) {
        if (!expectedRoutes.has(routePath)) {
            throw new Error(`Full-site capture returned an unexpected route ${routePath}.`);
        }
    }
}
async function captureRuntimeWithBrowser(browser, input) {
    const captureDir = path.join(input.workDir, "original");
    await mkdirp(captureDir);
    const captures = [];
    const viewportNames = input.viewportNames && input.viewportNames.length > 0
        ? input.viewportNames
        : Object.keys(viewports);
    for (let index = 0; index < viewportNames.length; index += 2) {
        captures.push(...(await Promise.all(viewportNames
            .slice(index, index + 2)
            .map((viewportName) => captureViewport(browser, input, viewportName, captureDir)))));
    }
    const baseCapture = input.baseCapture;
    const desktop = captures.find((capture) => capture.viewportName === "desktop") ??
        readBaseViewportCapture(baseCapture, "desktop") ??
        captures[0];
    const stylesheetUrls = unique([
        ...(baseCapture?.stylesheetUrls ?? []),
        ...captures.flatMap((capture) => capture.stylesheetUrls),
    ]);
    const viewportEntries = Object.fromEntries(unique([
        ...(baseCapture?.captureDiagnostics?.breakpointsCaptured ?? []),
        ...captures.map((capture) => capture.viewportName),
    ]).map((viewportName) => [
        viewportName,
        captures.find((capture) => capture.viewportName === viewportName)?.viewport ??
            baseCapture?.viewports[viewportName],
    ]));
    const nodesByViewport = Object.fromEntries(unique([
        ...(baseCapture?.captureDiagnostics?.breakpointsCaptured ?? []),
        ...captures.map((capture) => capture.viewportName),
    ]).map((viewportName) => [
        viewportName,
        captures.find((capture) => capture.viewportName === viewportName)?.nodes ??
            baseCapture?.nodesByViewport?.[viewportName] ??
            (viewportName === "desktop" ? baseCapture?.nodes : undefined),
    ]));
    const rootStylesByViewport = Object.fromEntries(unique([
        ...(baseCapture?.captureDiagnostics?.breakpointsCaptured ?? []),
        ...captures.map((capture) => capture.viewportName),
    ]).map((viewportName) => [
        viewportName,
        captures.find((capture) => capture.viewportName === viewportName)?.rootStyles ??
            baseCapture?.rootStylesByViewport?.[viewportName] ??
            (viewportName === "desktop" ? baseCapture?.rootStyles : undefined),
    ]));
    const breakpointsCaptured = unique([
        ...(baseCapture?.captureDiagnostics?.breakpointsCaptured ?? []),
        ...captures.map((capture) => capture.viewportName),
    ]);
    return {
        url: input.url,
        title: desktop.title,
        mode: input.selector ? "section" : "page",
        viewports: viewportEntries,
        nodes: desktop.nodes,
        nodesByViewport,
        rootStyles: desktop.rootStyles,
        rootStylesByViewport,
        captureDiagnostics: {
            breakpointsCaptured,
            viewportValidation: Object.fromEntries(breakpointsCaptured.map((viewportName) => {
                const fromCapture = captures.find((capture) => capture.viewportName === viewportName)?.viewportValidation;
                const fromBase = baseCapture?.captureDiagnostics?.viewportValidation?.[viewportName];
                return [viewportName, fromCapture ?? fromBase];
            })),
            fontReadiness: Object.fromEntries(breakpointsCaptured.map((viewportName) => [
                viewportName,
                captures.find((capture) => capture.viewportName === viewportName)
                    ?.fontsReady ??
                    baseCapture?.captureDiagnostics?.fontReadiness?.[viewportName],
            ])),
            stylesheetCount: Object.fromEntries(breakpointsCaptured.map((viewportName) => [
                viewportName,
                captures.find((capture) => capture.viewportName === viewportName)
                    ?.stylesheetUrls.length ??
                    baseCapture?.captureDiagnostics?.stylesheetCount?.[viewportName] ??
                    0,
            ])),
            nodeCount: Object.fromEntries(breakpointsCaptured.map((viewportName) => [
                viewportName,
                captures.find((capture) => capture.viewportName === viewportName)
                    ?.nodes.length ??
                    baseCapture?.captureDiagnostics?.nodeCount?.[viewportName] ??
                    (viewportName === "desktop" ? baseCapture?.nodes.length : 0) ??
                    0,
            ])),
        },
        interactionReplay: ("interactionReplay" in desktop
            ? desktop.interactionReplay
            : undefined) ??
            baseCapture?.interactionReplay ??
            [],
        framerStyleCss: desktop.framerStyleCss || baseCapture?.framerStyleCss,
        stylesheetUrls,
    };
}
async function readCachedRouteCapture(cacheDir, routePath, sourceUrl) {
    try {
        const raw = await fs.readFile(routeCachePath(cacheDir, routePath), "utf8");
        const cached = JSON.parse(raw);
        return cached.schemaVersion === ROUTE_CAPTURE_CACHE_SCHEMA_VERSION &&
            cached.sourceUrl === sourceUrl &&
            hasValidCachedResponsiveEvidence(cached.capture) &&
            cached.capture
            ? cached.capture
            : null;
    }
    catch {
        return null;
    }
}
async function writeCachedRouteCapture(cacheDir, routePath, sourceUrl, capture) {
    await fs.writeFile(routeCachePath(cacheDir, routePath), `${JSON.stringify({
        schemaVersion: ROUTE_CAPTURE_CACHE_SCHEMA_VERSION,
        sourceUrl,
        templateId: capture.templateId,
        capture,
    }, null, 2)}\n`);
}
function routeCachePath(cacheDir, routePath) {
    return path.join(cacheDir, `${routeDirectoryName(routePath)}.json`);
}
async function withTimeout(promise, timeoutMs, message) {
    let timer;
    try {
        return await Promise.race([
            promise,
            new Promise((_, reject) => {
                timer = setTimeout(() => reject(new Error(message)), timeoutMs);
            }),
        ]);
    }
    finally {
        if (timer)
            clearTimeout(timer);
    }
}
function normalizeRoutePath(value) {
    const trimmed = value.trim();
    if (!trimmed || trimmed === "/")
        return "/";
    try {
        const pathname = /^https?:\/\//.test(trimmed)
            ? new URL(trimmed).pathname
            : trimmed;
        return `/${pathname.replace(/^\/+|\/+$/g, "")}`.replace(/\/{2,}/g, "/");
    }
    catch {
        return "/";
    }
}
function routeDirectoryName(routePath) {
    if (routePath === "/")
        return "home";
    return routePath
        .replace(/^\/+|\/+$/g, "")
        .replace(/[^a-zA-Z0-9_-]+/g, "-")
        .slice(0, 120);
}
export function createSimulatedPluginCapture(nodes) {
    const selectedNodes = nodes
        .filter((node) => node.rect.width > 0 && node.rect.height > 0)
        .slice(0, 80)
        .map((node) => ({
        id: node.id,
        name: node.text ? node.text.slice(0, 48) : node.tag,
        type: node.tag,
        text: node.text,
        bounds: node.rect,
        metadata: {
            domPath: node.domPath,
            sectionName: node.sectionName,
            src: node.attributes.src,
            href: node.attributes.href,
            className: node.attributes.className,
            dataFramerName: node.attributes.dataFramerName,
            motion: node.motion,
        },
    }));
    return {
        mode: "simulated",
        selectedNodes,
        capturedAt: new Date().toISOString(),
    };
}
async function captureViewport(browser, input, viewportName, captureDir) {
    const viewport = viewports[viewportName];
    const page = await createPageWithViewport(browser, viewport);
    try {
        await navigateForCapture(page, input.url);
        const finalUrl = page.url();
        if (isExternalRedirect(input.url, finalUrl)) {
            const safeUrl = escapeHtml(finalUrl);
            await showExternalRedirect(page, safeUrl);
        }
        else {
            await page
                .waitForLoadState("domcontentloaded", { timeout: 15_000 })
                .catch(() => undefined);
            await page.waitForLoadState("load", { timeout: 15_000 }).catch(() => {
                // Modern Framer sites can keep loading analytics/fonts; capture renderable DOM.
            });
            const settledUrl = page.url();
            if (isExternalRedirect(input.url, settledUrl)) {
                const safeUrl = escapeHtml(settledUrl);
                await showExternalRedirect(page, safeUrl);
            }
        }
        await waitForRenderableContent(page, input.selector);
        const fontsReady = await waitForFonts(page);
        const screenshotPath = path.join(captureDir, `${viewportName}.png`);
        if (input.selector) {
            const rootHandle = await resolveRootHandle(page, input.selector);
            const clip = await getClip(rootHandle, viewport);
            try {
                await captureScreenshot(page, screenshotPath, fontsReady, clip);
            }
            finally {
                await rootHandle.dispose();
            }
        }
        else {
            await captureScreenshot(page, screenshotPath, fontsReady);
        }
        const nodes = await extractNodes(page, input.selector, input.routePath ?? "/");
        const rootStyles = await extractRootStyles(page, input.selector);
        const nodesWithInteractions = viewportName === "desktop"
            ? await collectInteractionStyles(page, nodes)
            : nodes;
        const stylesheets = await extractStylesheets(page);
        const framerStyleCss = viewportName === "desktop"
            ? await downloadStylesheets(stylesheets, input.url)
            : "";
        const title = await page.title();
        const imageSize = await getPngSize(screenshotPath).catch(() => viewport);
        const observedViewport = await readObservedViewport(page);
        const interactionReplay = viewportName === "desktop"
            ? await withTimeout(collectSafeInteractionReplay(page, input.selector, captureDir, input.routePath ?? "/", viewportName), input.interactionReplayTimeoutMs ?? INTERACTION_REPLAY_TIMEOUT_MS, `Interaction replay exceeded ${(input.interactionReplayTimeoutMs ?? INTERACTION_REPLAY_TIMEOUT_MS) / 1_000} seconds`).catch((error) => {
                console.warn("[coderelay:capture:interaction-replay-skipped]", JSON.stringify({
                    routePath: input.routePath ?? "/",
                    viewport: viewportName,
                    reason: formatError(error),
                }));
                return [];
            })
            : undefined;
        const viewportValidation = createViewportValidation(viewport, observedViewport, imageSize);
        return {
            viewportName,
            title,
            nodes: nodesWithInteractions,
            rootStyles,
            viewport: {
                screenshotPath,
                width: imageSize.width,
                height: imageSize.height,
                requested: viewport,
                observed: observedViewport,
                valid: viewportValidation.valid,
            },
            viewportValidation,
            fontsReady,
            framerStyleCss,
            stylesheetUrls: stylesheets,
            interactionReplay,
        };
    }
    finally {
        await page.close().catch(() => undefined);
    }
}
async function createPageWithViewport(browser, viewport) {
    if ("newContext" in browser) {
        const context = await browser.newContext({ viewport });
        const page = await context.newPage();
        return page;
    }
    const page = await browser.newPage();
    await page.setViewportSize(viewport);
    return page;
}
async function readObservedViewport(page) {
    return page.evaluate(() => ({
        innerWidth: window.innerWidth,
        innerHeight: window.innerHeight,
        clientWidth: document.documentElement.clientWidth,
        devicePixelRatio: window.devicePixelRatio,
    }));
}
function createViewportValidation(requested, observed, screenshot) {
    const reasons = [];
    if (observed.innerWidth !== requested.width) {
        reasons.push("innerWidth-mismatch");
    }
    if (Math.abs(observed.clientWidth - requested.width) > 1) {
        reasons.push("clientWidth-mismatch");
    }
    if (Math.abs(screenshot.width - requested.width) > 1) {
        reasons.push("screenshotWidth-mismatch");
    }
    return {
        requestedWidth: requested.width,
        requestedHeight: requested.height,
        observedInnerWidth: observed.innerWidth,
        observedInnerHeight: observed.innerHeight,
        observedClientWidth: observed.clientWidth,
        screenshotWidth: screenshot.width,
        screenshotHeight: screenshot.height,
        valid: reasons.length === 0,
        reason: reasons.length > 0 ? reasons.join(",") : undefined,
    };
}
function hasValidCachedResponsiveEvidence(capture) {
    if (!capture?.captureDiagnostics?.viewportValidation)
        return false;
    const breakpoints = capture.captureDiagnostics.breakpointsCaptured ?? [];
    const observedWidths = new Set();
    for (const viewportName of breakpoints) {
        const entry = capture.captureDiagnostics.viewportValidation[viewportName];
        if (!entry?.valid)
            return false;
        if (observedWidths.has(entry.observedInnerWidth))
            return false;
        observedWidths.add(entry.observedInnerWidth);
    }
    return observedWidths.size > 0;
}
function readBaseViewportCapture(baseCapture, viewportName) {
    if (!baseCapture)
        return undefined;
    const viewport = baseCapture.viewports[viewportName];
    if (!viewport)
        return undefined;
    return {
        viewportName,
        title: baseCapture.title,
        nodes: baseCapture.nodesByViewport?.[viewportName] ??
            (viewportName === "desktop" ? baseCapture.nodes : []),
        rootStyles: baseCapture.rootStylesByViewport?.[viewportName] ??
            (viewportName === "desktop" ? baseCapture.rootStyles ?? {} : {}),
        viewport,
        viewportValidation: baseCapture.captureDiagnostics?.viewportValidation?.[viewportName],
        fontsReady: baseCapture.captureDiagnostics?.fontReadiness?.[viewportName] ?? true,
        framerStyleCss: viewportName === "desktop" ? baseCapture.framerStyleCss ?? "" : "",
        stylesheetUrls: baseCapture.stylesheetUrls ?? [],
        interactionReplay: viewportName === "desktop" ? baseCapture.interactionReplay : undefined,
    };
}
async function navigateForCapture(page, url) {
    let lastError;
    for (let attempt = 1; attempt <= 3; attempt += 1) {
        try {
            await page.goto(url, { waitUntil: "commit", timeout: 30_000 });
            return;
        }
        catch (error) {
            lastError = error;
            const recovered = await page
                .waitForLoadState("domcontentloaded", { timeout: 3_000 })
                .then(() => page.evaluate(() => Boolean(document.body) &&
                (document.body.childElementCount > 0 ||
                    Boolean(document.body.textContent?.trim()))), () => false)
                .catch(() => false);
            if (recovered) {
                console.warn("[coderelay:capture:navigation-recovered]", JSON.stringify({ url, attempt, reason: formatError(error) }));
                return;
            }
            if (attempt < 3) {
                console.warn("[coderelay:capture:navigation-retry]", JSON.stringify({ url, attempt, reason: formatError(error) }));
                await page.waitForTimeout(500 * attempt);
            }
        }
    }
    throw lastError;
}
function formatError(error) {
    return error instanceof Error ? error.message : String(error);
}
async function captureScreenshot(page, screenshotPath, fontsReady, clip) {
    try {
        if (!fontsReady) {
            await captureScreenshotWithCdp(page, screenshotPath, clip);
            return;
        }
        await page.screenshot({
            path: screenshotPath,
            ...(clip ? { clip } : { fullPage: true }),
            animations: "disabled",
            timeout: 15_000,
        });
    }
    catch (error) {
        console.warn("[coderelay:capture:screenshot-fallback]", JSON.stringify({
            url: page.url(),
            reason: error instanceof Error ? error.message : String(error),
        }));
        await captureScreenshotWithCdp(page, screenshotPath, clip).catch((fallbackError) => {
            console.warn("[coderelay:capture:screenshot-skipped]", JSON.stringify({
                url: page.url(),
                reason: fallbackError instanceof Error
                    ? fallbackError.message
                    : String(fallbackError),
            }));
        });
    }
}
async function captureScreenshotWithCdp(page, screenshotPath, clip) {
    const session = await page.context().newCDPSession(page);
    try {
        const dimensions = clip ??
            (await page.evaluate(() => ({
                x: 0,
                y: 0,
                width: Math.max(document.documentElement.scrollWidth, document.body?.scrollWidth ?? 0),
                height: Math.max(document.documentElement.scrollHeight, document.body?.scrollHeight ?? 0),
            })));
        const result = await session.send("Page.captureScreenshot", {
            format: "png",
            captureBeyondViewport: true,
            fromSurface: true,
            clip: { ...dimensions, scale: 1 },
        });
        await fs.writeFile(screenshotPath, Buffer.from(result.data, "base64"));
    }
    finally {
        await session.detach();
    }
}
async function extractRootStyles(page, selector) {
    return page.evaluate(({ selector, styleProperties }) => {
        const root = selector
            ? document.querySelector(selector)
            : document.body;
        if (!(root instanceof HTMLElement))
            return {};
        const styles = window.getComputedStyle(root);
        return Object.fromEntries(styleProperties
            .map((property) => [property, styles[property] || ""])
            .filter(([, value]) => Boolean(value)));
    }, { selector, styleProperties: [...CAPTURED_STYLE_PROPERTIES] });
}
function isExternalRedirect(requestedUrl, finalUrl) {
    try {
        return new URL(requestedUrl).origin !== new URL(finalUrl).origin;
    }
    catch {
        return false;
    }
}
function escapeHtml(value) {
    return value
        .replaceAll("&", "&amp;")
        .replaceAll('"', "&quot;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;");
}
async function showExternalRedirect(page, safeUrl) {
    const html = `<!doctype html><html><head><title>External redirect</title></head>` +
        `<body><main style="min-height:100vh;display:grid;place-items:center">` +
        `<a href="${safeUrl}">Continue to ${safeUrl}</a></main></body></html>`;
    // A redirected document may enforce Trusted Types, making setContent unsafe.
    await page.goto(`data:text/html;charset=utf-8,${encodeURIComponent(html)}`, {
        waitUntil: "domcontentloaded",
        timeout: 10_000,
    });
}
async function waitForFonts(page) {
    const fontsReady = page.evaluate(`(() => {
      if (!('fonts' in document) || !document.fonts?.ready) return true
      return document.fonts.ready.then(() => true).catch(() => false)
    })()`);
    const timeout = page.waitForTimeout(5_000).then(() => false);
    return Promise.race([fontsReady, timeout]).catch(() => false);
}
async function waitForRenderableContent(page, selector) {
    await page
        .waitForFunction((rootSelector) => {
        const root = rootSelector
            ? document.querySelector(rootSelector)
            : document.body;
        if (!root)
            return false;
        const rect = root.getBoundingClientRect();
        const hasSize = rect.width > 0 && rect.height > 0;
        const hasFramerNodes = Boolean(document.querySelector('[data-framer-name], [class*="framer-"], main, section'));
        const hasText = (document.body.innerText ?? "").trim().length > 0;
        return document.readyState !== "loading" && hasSize && (hasFramerNodes || hasText);
    }, selector ?? null, { timeout: 20_000 })
        .catch(() => undefined);
    await page.waitForTimeout(750);
}
async function extractStylesheets(page) {
    return page.evaluate(`(() => {
    const urls = Array.from(document.querySelectorAll('link[rel="stylesheet"]'))
      .map((link) => link.getAttribute('href') || '')
      .filter(Boolean)
      .map((href) => {
        try {
          return new URL(href, window.location.href).toString()
        } catch {
          return ''
        }
      })
      .filter(Boolean)

    // Framer-managed selectors often live in published stylesheet bundles.
    return Array.from(new Set(urls))
  })()`);
}
async function collectInteractionStyles(page, nodes) {
    const actionableNodes = nodes.filter(isActionableRuntimeNode).slice(0, 16);
    if (actionableNodes.length === 0)
        return nodes;
    const byDomPath = new Map();
    for (const node of nodes) {
        byDomPath.set(node.domPath, node);
    }
    for (const node of actionableNodes) {
        try {
            const interactionStyles = await captureInteractionStatesForNode(page, node.domPath);
            if (!interactionStyles)
                continue;
            const target = byDomPath.get(node.domPath);
            if (!target)
                continue;
            target.interactionStyles = interactionStyles;
        }
        catch {
            continue;
        }
    }
    return nodes;
}
async function collectSafeInteractionReplay(page, selector, captureDir, routePath, viewport) {
    const replayDir = path.join(captureDir, "replay");
    await mkdirp(replayDir);
    const baseUrl = page.url();
    const candidates = await annotateReplayCandidates(page, selector);
    if (candidates.length === 0)
        return [];
    const requestStats = {
        totalRequests: 0,
        fetchRequests: 0,
        xhrRequests: 0,
        documentRequests: 0,
        blockedRequests: 0,
        blockedNavigationRequests: 0,
        blockedMutationRequests: 0,
    };
    const routeHandler = async (route) => {
        const request = route.request();
        requestStats.totalRequests += 1;
        if (request.resourceType() === "fetch")
            requestStats.fetchRequests += 1;
        if (request.resourceType() === "xhr")
            requestStats.xhrRequests += 1;
        if (request.isNavigationRequest())
            requestStats.documentRequests += 1;
        const method = request.method().toUpperCase();
        const isMutation = ["POST", "PUT", "PATCH", "DELETE"].includes(method);
        const isMainFrameNavigation = request.isNavigationRequest() &&
            request.frame() === page.mainFrame() &&
            request.url() !== baseUrl;
        if (isMainFrameNavigation) {
            requestStats.blockedRequests += 1;
            requestStats.blockedNavigationRequests += 1;
            await route.abort();
            return;
        }
        if (isMutation) {
            requestStats.blockedRequests += 1;
            requestStats.blockedMutationRequests += 1;
            await route.abort();
            return;
        }
        await route.continue();
    };
    await page.route("**/*", routeHandler);
    const records = [];
    try {
        for (let index = 0; index < Math.min(candidates.length, 4); index += 1) {
            const candidate = candidates[index];
            const beforeDomSnapshot = await readReplayDomSnapshot(page, selector);
            const beforeStyles = await readReplayCandidateStyles(page, candidate.id);
            const beforeAnimation = await readReplayAnimationSnapshot(page, candidate.id);
            const beforeScreenshotPath = path.join(replayDir, `${viewport}-${index + 1}-before.png`);
            await page.screenshot({
                path: beforeScreenshotPath,
                animations: "disabled",
            });
            if (!candidate.allowed) {
                records.push({
                    id: `${routePath}:${viewport}:${candidate.id}:blocked-click`,
                    routePath,
                    viewport,
                    action: "blocked-click",
                    target: candidate.target,
                    allowed: false,
                    blockedReason: candidate.blockedReason,
                    beforeDomSignature: hashReplaySnapshot(beforeDomSnapshot),
                    beforeComputedStyles: beforeStyles,
                    beforeScreenshotPath,
                    urlChanged: false,
                    networkActivity: diffReplayStats({ ...requestStats }, requestStats),
                    consoleErrors: [],
                    animationSamples: { before: beforeAnimation },
                    stateChanged: false,
                    provenance: "runtime",
                });
                continue;
            }
            records.push(await executeReplayAction({
                page,
                selector,
                routePath,
                viewport,
                replayDir,
                index,
                candidate,
                action: "click",
                keyPress: undefined,
                beforeDomSnapshot,
                beforeStyles,
                beforeAnimation,
                beforeScreenshotPath,
                beforeUrl: page.url(),
                statsBeforeAction: { ...requestStats },
                requestStats,
            }));
            await page.goto(baseUrl, { waitUntil: "domcontentloaded", timeout: 15_000 });
            await waitForRenderableContent(page, selector);
            await annotateReplayCandidates(page, selector);
            records.push(await executeReplayAction({
                page,
                selector,
                routePath,
                viewport,
                replayDir,
                index,
                candidate,
                action: "keyboard-enter",
                keyPress: "Enter",
                beforeDomSnapshot: await readReplayDomSnapshot(page, selector),
                beforeStyles: await readReplayCandidateStyles(page, candidate.id),
                beforeAnimation: await readReplayAnimationSnapshot(page, candidate.id),
                beforeScreenshotPath: await writeReplayScreenshot(page, path.join(replayDir, `${viewport}-${index + 1}-keyboard-before.png`)),
                beforeUrl: page.url(),
                statsBeforeAction: { ...requestStats },
                requestStats,
            }));
            await page.goto(baseUrl, { waitUntil: "domcontentloaded", timeout: 15_000 });
            await waitForRenderableContent(page, selector);
            await annotateReplayCandidates(page, selector);
        }
    }
    finally {
        await page.unroute("**/*", routeHandler).catch(() => undefined);
    }
    return records;
}
async function executeReplayAction(input) {
    const consoleErrors = [];
    const onConsole = (message) => {
        if (message.type() === "error")
            consoleErrors.push(message.text());
    };
    input.page.on("console", onConsole);
    try {
        const locator = input.page.locator(`[data-coderelay-replay-id="${input.candidate.id}"]`);
        if ((await locator.count()) === 0) {
            return {
                id: `${input.routePath}:${input.viewport}:${input.candidate.id}:${input.action}`,
                routePath: input.routePath,
                viewport: input.viewport,
                action: input.action,
                target: input.candidate.target,
                allowed: false,
                blockedReason: "candidate-missing-after-reset",
                beforeDomSignature: hashReplaySnapshot(input.beforeDomSnapshot),
                beforeComputedStyles: input.beforeStyles,
                beforeScreenshotPath: input.beforeScreenshotPath,
                urlChanged: false,
                networkActivity: diffReplayStats(input.statsBeforeAction, input.requestStats),
                consoleErrors,
                animationSamples: { before: input.beforeAnimation },
                stateChanged: false,
                provenance: "runtime",
            };
        }
        try {
            if (input.keyPress) {
                await locator.focus();
                await input.page.keyboard.press(input.keyPress);
            }
            else {
                await locator.click({ timeout: 2_000 });
            }
        }
        catch (error) {
            return {
                id: `${input.routePath}:${input.viewport}:${input.candidate.id}:${input.action}`,
                routePath: input.routePath,
                viewport: input.viewport,
                action: input.action,
                target: input.candidate.target,
                allowed: false,
                blockedReason: formatError(error),
                beforeDomSignature: hashReplaySnapshot(input.beforeDomSnapshot),
                beforeComputedStyles: input.beforeStyles,
                beforeScreenshotPath: input.beforeScreenshotPath,
                urlChanged: false,
                networkActivity: diffReplayStats(input.statsBeforeAction, input.requestStats),
                consoleErrors,
                animationSamples: { before: input.beforeAnimation },
                stateChanged: false,
                provenance: "runtime",
            };
        }
        await input.page.waitForTimeout(250);
        const afterDomSnapshot = await readReplayDomSnapshot(input.page, input.selector);
        const afterStyles = await readReplayCandidateStyles(input.page, input.candidate.id);
        const afterAnimation = await readReplayAnimationSnapshot(input.page, input.candidate.id);
        const afterScreenshotPath = await writeReplayScreenshot(input.page, path.join(input.replayDir, `${input.viewport}-${input.index + 1}-${input.action}-after.png`));
        return {
            id: `${input.routePath}:${input.viewport}:${input.candidate.id}:${input.action}`,
            routePath: input.routePath,
            viewport: input.viewport,
            action: input.action,
            target: input.candidate.target,
            allowed: true,
            beforeDomSignature: hashReplaySnapshot(input.beforeDomSnapshot),
            afterDomSignature: hashReplaySnapshot(afterDomSnapshot),
            beforeComputedStyles: input.beforeStyles,
            afterComputedStyles: afterStyles,
            beforeScreenshotPath: input.beforeScreenshotPath,
            afterScreenshotPath,
            urlChanged: input.page.url() !== input.beforeUrl,
            networkActivity: diffReplayStats(input.statsBeforeAction, input.requestStats),
            consoleErrors,
            animationSamples: {
                before: input.beforeAnimation,
                after: afterAnimation,
            },
            stateChanged: hashReplaySnapshot(input.beforeDomSnapshot) !==
                hashReplaySnapshot(afterDomSnapshot) ||
                JSON.stringify(input.beforeStyles) !== JSON.stringify(afterStyles),
            provenance: "runtime",
        };
    }
    finally {
        input.page.off("console", onConsole);
    }
}
function diffReplayStats(before, after) {
    return {
        totalRequests: after.totalRequests - before.totalRequests,
        fetchRequests: after.fetchRequests - before.fetchRequests,
        xhrRequests: after.xhrRequests - before.xhrRequests,
        documentRequests: after.documentRequests - before.documentRequests,
        blockedRequests: after.blockedRequests - before.blockedRequests,
        blockedNavigationRequests: after.blockedNavigationRequests - before.blockedNavigationRequests,
        blockedMutationRequests: after.blockedMutationRequests - before.blockedMutationRequests,
    };
}
async function annotateReplayCandidates(page, selector) {
    return page.evaluate((activeSelector) => {
        const root = activeSelector
            ? document.querySelector(activeSelector)
            : document.body;
        if (!(root instanceof HTMLElement))
            return [];
        root.querySelectorAll("[data-coderelay-replay-id]").forEach((element) => {
            element.removeAttribute("data-coderelay-replay-id");
        });
        return Array.from(root.querySelectorAll('button, [role="button"], [role="tab"], [aria-controls], [aria-expanded]'))
            .filter((element) => {
            const style = window.getComputedStyle(element);
            const rect = element.getBoundingClientRect();
            return (style.display !== "none" &&
                style.visibility !== "hidden" &&
                Number(style.opacity || "1") > 0 &&
                rect.width > 0 &&
                rect.height > 0);
        })
            .slice(0, 6)
            .map((element, index) => {
            const blockedReason = element.closest("form")
                ? "inside-form"
                : element instanceof HTMLButtonElement &&
                    ["submit", "reset"].includes(element.type)
                    ? `button-type-${element.type}`
                    : element.closest('a[href]')
                        ? "inside-anchor"
                        : element.hasAttribute("disabled") ||
                            element.getAttribute("aria-disabled") === "true"
                            ? "disabled"
                            : undefined;
            const id = `candidate-${index + 1}`;
            element.setAttribute("data-coderelay-replay-id", id);
            return {
                id,
                allowed: !blockedReason,
                blockedReason,
                target: {
                    tag: element.tagName.toLowerCase(),
                    text: element.textContent?.trim().slice(0, 120),
                    role: element.getAttribute("role") ?? undefined,
                    name: element.getAttribute("aria-label") ??
                        element.getAttribute("name") ??
                        undefined,
                },
            };
        });
    }, selector);
}
async function readReplayDomSnapshot(page, selector) {
    return page.evaluate((activeSelector) => {
        const root = activeSelector
            ? document.querySelector(activeSelector)
            : document.body;
        if (!(root instanceof HTMLElement))
            return "";
        return JSON.stringify({
            html: root.innerHTML.slice(0, 20_000),
            text: root.textContent?.trim().slice(0, 4_000) ?? "",
            nodeCount: root.querySelectorAll("*").length,
            ariaExpanded: Array.from(root.querySelectorAll("[aria-expanded]")).map((element) => ({
                tag: element.tagName.toLowerCase(),
                value: element.getAttribute("aria-expanded"),
                text: element.textContent?.trim().slice(0, 60) ?? "",
            })),
        });
    }, selector);
}
async function readReplayCandidateStyles(page, id) {
    return page.evaluate((replayId) => {
        const element = document.querySelector(`[data-coderelay-replay-id="${replayId}"]`);
        if (!element)
            return {};
        const style = window.getComputedStyle(element);
        return {
            display: style.display ?? "",
            visibility: style.visibility ?? "",
            opacity: style.opacity ?? "",
            color: style.color ?? "",
            backgroundColor: style.backgroundColor ?? "",
            transform: style.transform ?? "",
            width: style.width ?? "",
            height: style.height ?? "",
            ariaExpanded: element.getAttribute("aria-expanded") ?? "",
            ariaSelected: element.getAttribute("aria-selected") ?? "",
        };
    }, id);
}
async function readReplayAnimationSnapshot(page, id) {
    return page.evaluate((replayId) => {
        const element = document.querySelector(`[data-coderelay-replay-id="${replayId}"]`);
        if (!element)
            return {};
        const style = window.getComputedStyle(element);
        return {
            transitionProperty: style.transitionProperty ?? "",
            transitionDuration: style.transitionDuration ?? "",
            transitionTimingFunction: style.transitionTimingFunction ?? "",
            animationName: style.animationName ?? "",
            animationDuration: style.animationDuration ?? "",
            animationTimingFunction: style.animationTimingFunction ?? "",
        };
    }, id);
}
async function writeReplayScreenshot(page, targetPath) {
    await page.screenshot({ path: targetPath, animations: "disabled" });
    return targetPath;
}
function hashReplaySnapshot(value) {
    return crypto.createHash("sha1").update(value).digest("hex");
}
async function captureInteractionStatesForNode(page, domPath) {
    const locator = page.locator(domPath).first();
    const visible = await locator
        .evaluate((element) => {
        const rect = element.getBoundingClientRect();
        return rect.width > 0 && rect.height > 0;
    })
        .catch(() => false);
    if (!visible)
        return undefined;
    const baseStyles = await readComputedStylesForInteraction(locator);
    if (!baseStyles)
        return undefined;
    const hoverStyles = await captureHoverStyles(page, locator, baseStyles);
    const focusStyles = await captureFocusStyles(page, locator, baseStyles);
    const interactionStyles = {
        ...(hoverStyles ? { hover: hoverStyles } : {}),
        ...(focusStyles ? { focus: focusStyles } : {}),
    };
    return Object.keys(interactionStyles).length > 0 ? interactionStyles : undefined;
}
async function captureHoverStyles(page, locator, baseStyles) {
    await page.mouse.move(0, 0).catch(() => { });
    const canHover = await locator.hover({ force: true, timeout: 500 }).then(() => true, () => false);
    if (!canHover)
        return undefined;
    await page.waitForTimeout(40);
    const hoveredStyles = await readComputedStylesForInteraction(locator);
    await page.mouse.move(0, 0).catch(() => { });
    if (!hoveredStyles)
        return undefined;
    const diff = diffInteractionStyles(baseStyles, hoveredStyles);
    return Object.keys(diff).length > 0 ? diff : undefined;
}
async function captureFocusStyles(page, locator, baseStyles) {
    const canFocus = await locator.focus().then(() => true, () => false);
    if (!canFocus)
        return undefined;
    await page.waitForTimeout(20);
    const focusedStyles = await readComputedStylesForInteraction(locator);
    await locator.evaluate((element) => {
        if (element instanceof HTMLElement) {
            element.blur();
        }
    }).catch(() => { });
    await page.waitForTimeout(20);
    if (!focusedStyles)
        return undefined;
    const diff = diffInteractionStyles(baseStyles, focusedStyles);
    return Object.keys(diff).length > 0 ? diff : undefined;
}
async function readComputedStylesForInteraction(locator) {
    return locator
        .evaluate((element, properties) => {
        const styles = window.getComputedStyle(element);
        return Object.fromEntries(properties
            .map((property) => [property, styles[property] || ""])
            .filter(([, value]) => Boolean(value)));
    }, INTERACTION_STYLE_PROPERTIES)
        .catch(() => undefined);
}
function diffInteractionStyles(baseStyles, stateStyles) {
    const diff = {};
    for (const [property, value] of Object.entries(stateStyles)) {
        if (!value)
            continue;
        if ((baseStyles[property] ?? "") === value)
            continue;
        diff[property] = value;
    }
    return diff;
}
function isActionableRuntimeNode(node) {
    return (node.tag === "a" ||
        node.tag === "button" ||
        node.attributes.role === "button" ||
        node.attributes.role === "link" ||
        Boolean(node.attributes.href) ||
        node.styles.cursor === "pointer" ||
        hasMotionMetadata(node.motion));
}
function hasMotionMetadata(motion) {
    if (!motion)
        return false;
    return MOTION_STYLE_PROPERTIES.some((property) => {
        const value = motion[property];
        return typeof value === "string" && value.trim().length > 0 && value !== "none" && value !== "0s";
    });
}
async function downloadStylesheets(urls, sourceUrl) {
    const sourceOrigin = new URL(sourceUrl).origin;
    const filtered = urls
        .filter((url) => {
        if (!/^https?:\/\//.test(url))
            return false;
        try {
            const parsed = new URL(url);
            return (parsed.origin === sourceOrigin ||
                parsed.hostname.endsWith("framerusercontent.com") ||
                parsed.hostname.endsWith("framer.com") ||
                parsed.hostname.endsWith("framerstatic.com"));
        }
        catch {
            return false;
        }
    })
        .slice(0, 32);
    if (filtered.length === 0)
        return "";
    const chunks = (await Promise.all(filtered.map(async (url) => {
        try {
            const response = await fetch(url, {
                headers: { "user-agent": "coderelay-exporter/1.0" },
                signal: AbortSignal.timeout(8_000),
            });
            if (!response.ok)
                return "";
            const css = await response.text();
            if (!css.trim())
                return "";
            const sanitized = css.replaceAll(/@charset\s+[^;]+;/gi, "");
            return `/* source: ${url} */\n${sanitized}`;
        }
        catch {
            return "";
        }
    }))).filter(Boolean);
    return chunks.join("\n\n").slice(0, 2_000_000);
}
async function resolveRootHandle(page, selector) {
    if (selector) {
        const selected = await page.$(selector);
        if (!selected) {
            throw new Error(`No element found for selector: ${selector}`);
        }
        return selected;
    }
    const handle = await page.evaluateHandle(`() => {
    const candidates = Array.from(document.querySelectorAll('section, main, header, footer, [data-framer-name]'))
      .filter((element) => {
        const rect = element.getBoundingClientRect()
        return rect.width > 120 && rect.height > 80
      })
      .sort((first, second) => {
        const firstRect = first.getBoundingClientRect()
        const secondRect = second.getBoundingClientRect()
        return secondRect.width * secondRect.height - firstRect.width * firstRect.height
      })

    return candidates[0] ?? document.body
  }`);
    return handle.asElement() ?? (await page.$("body"));
}
async function getClip(rootHandle, viewport) {
    const box = await rootHandle.boundingBox();
    if (!box) {
        return {
            x: 0,
            y: 0,
            width: viewport.width,
            height: viewport.height,
        };
    }
    return {
        x: Math.max(0, box.x),
        y: Math.max(0, box.y),
        width: Math.min(viewport.width, Math.max(1, box.width)),
        height: Math.min(2400, Math.max(1, box.height)),
    };
}
async function extractNodes(page, selector, routePath = "/") {
    const rootSelector = JSON.stringify(selector ?? null);
    const route = JSON.stringify(routePath);
    const styleProperties = JSON.stringify(CAPTURED_STYLE_PROPERTIES);
    return page.evaluate(`(() => {
    const rootSelector = ${rootSelector}
    const routePath = ${route}
    const styleProperties = ${styleProperties}
    const root = rootSelector ? document.querySelector(rootSelector) : document.body
    const base = root ?? document.body
    const ignoredTags = new Set(['script', 'style', 'noscript', 'template', 'meta', 'link'])
    const textLikeTags = new Set([
      'p',
      'span',
      'li',
      'a',
      'button',
      'label',
      'strong',
      'em',
      'small',
      'blockquote',
      'h1',
      'h2',
      'h3',
      'h4',
      'h5',
      'h6',
    ])

    const pathFor = (element) => {
      const parts = []
      let current = element

      while (current && current !== document.documentElement) {
        const parent = current.parentElement
        const index = parent ? Array.from(parent.children).indexOf(current) + 1 : 1
        parts.unshift(current.tagName.toLowerCase() + ':nth-child(' + index + ')')
        current = parent
      }

      return parts.join(' > ')
    }

    const readText = (element) => {
      const tag = element.tagName.toLowerCase()
      if (!textLikeTags.has(tag)) return undefined

      const directText = Array.from(element.childNodes)
        .filter((node) => node.nodeType === Node.TEXT_NODE)
        .map((node) => node.textContent || '')
        .join(' ')
        .trim()
        .replace(/\\s+/g, ' ')
      if (directText) return directText.slice(0, 500)

      const ownsOnlyText =
        !Array.from(element.querySelectorAll('*')).some((descendant) =>
          textLikeTags.has(descendant.tagName.toLowerCase())
        )
      if (!ownsOnlyText) return undefined
      const text = element.innerText?.trim().replace(/\\s+/g, ' ').slice(0, 500)
      return text || undefined
    }

    const sectionElements = Array.from(base.querySelectorAll('section, header, main, footer, [data-framer-name]'))
      .filter((element) => {
        const rect = element.getBoundingClientRect()
        return rect.width > 120 && rect.height > 80
      })

    const sectionFor = (element) => {
      const section = sectionElements.find((candidate) => candidate === element || candidate.contains(element))

      if (!section) {
        return {
          index: 0,
          name: 'Page',
        }
      }

      return {
        index: sectionElements.indexOf(section),
        name: section.getAttribute('data-framer-name') || section.getAttribute('aria-label') || section.tagName.toLowerCase(),
      }
    }

    const inheritedProperties = new Set([
      'fontSize',
      'fontFamily',
      'fontWeight',
      'fontStyle',
      'lineHeight',
      'letterSpacing',
      'textAlign',
      'textTransform',
      'textDecoration',
      'whiteSpace',
      'wordBreak',
      'color',
      'cursor',
    ])
    const defaultValues = {
      top: 'auto',
      right: 'auto',
      bottom: 'auto',
      left: 'auto',
      position: 'static',
      fontStyle: 'normal',
      letterSpacing: 'normal',
      textTransform: 'none',
      textDecoration: 'none',
      whiteSpace: 'normal',
      wordBreak: 'normal',
      backgroundColor: 'rgba(0, 0, 0, 0)',
      backgroundImage: 'none',
      backgroundBlendMode: 'normal',
      backgroundPosition: '0% 0%',
      backgroundSize: 'auto',
      backgroundRepeat: 'repeat',
      borderRadius: '0px',
      boxShadow: 'none',
      transform: 'none',
      opacity: '1',
      marginTop: '0px',
      marginRight: '0px',
      marginBottom: '0px',
      marginLeft: '0px',
      paddingTop: '0px',
      paddingRight: '0px',
      paddingBottom: '0px',
      paddingLeft: '0px',
      minWidth: '0px',
      minHeight: '0px',
      maxWidth: 'none',
      maxHeight: 'none',
      gridTemplateColumns: 'none',
      gridTemplateRows: 'none',
      gridAutoFlow: 'row',
      gridColumn: 'auto',
      gridRow: 'auto',
      justifyContent: 'normal',
      alignItems: 'normal',
      gap: 'normal',
      rowGap: 'normal',
      columnGap: 'normal',
      alignSelf: 'auto',
      justifySelf: 'auto',
      flexDirection: 'row',
      flexWrap: 'nowrap',
      overflow: 'visible',
      overflowX: 'visible',
      overflowY: 'visible',
      objectFit: 'fill',
      objectPosition: '50% 50%',
      aspectRatio: 'auto',
      pointerEvents: 'auto',
      zIndex: 'auto',
      cursor: 'auto',
    }
    const compactStyles = (element, styles, captureRoot) => {
      const emittedParent =
        element.parentElement && element.parentElement !== captureRoot
      const parentStyles = emittedParent
        ? window.getComputedStyle(element.parentElement)
        : null
      const output = {}

      for (const property of styleProperties) {
        const value = styles[property] || ''
        if (!value) continue
        if (property === 'background' || property === 'margin' || property === 'padding') continue
        if (property === 'placeItems' || property === 'placeContent' || property === 'placeSelf') continue
        if (defaultValues[property] === value) continue
        if (property === 'border' && value.startsWith('0px none')) continue
        if (
          inheritedProperties.has(property) &&
          parentStyles &&
          parentStyles[property] === value
        ) {
          continue
        }
        if (
          !styles.display.includes('grid') &&
          property.startsWith('grid')
        ) {
          continue
        }
        if (
          !styles.display.includes('flex') &&
          ['flexDirection', 'flexWrap', 'justifyContent', 'alignItems'].includes(property)
        ) {
          continue
        }
        output[property] = value
      }

      if (styles.paddingTop !== '0px' || styles.paddingRight !== '0px' ||
          styles.paddingBottom !== '0px' || styles.paddingLeft !== '0px') {
        output.padding = styles.padding
        delete output.paddingTop
        delete output.paddingRight
        delete output.paddingBottom
        delete output.paddingLeft
      }
      if (styles.marginTop !== '0px' || styles.marginRight !== '0px' ||
          styles.marginBottom !== '0px' || styles.marginLeft !== '0px') {
        output.margin = styles.margin
        delete output.marginTop
        delete output.marginRight
        delete output.marginBottom
        delete output.marginLeft
      }
      if (styles.overflowX === styles.overflowY && styles.overflow !== 'visible') {
        output.overflow = styles.overflow
        delete output.overflowX
        delete output.overflowY
      }
      return output
    }
    const compactMotion = (styles) => {
      const hasTransition =
        styles.transitionDuration !== '0s' &&
        styles.transitionProperty !== 'none'
      const hasAnimation =
        styles.animationName !== 'none' &&
        styles.animationDuration !== '0s'
      if (!hasTransition && !hasAnimation) return undefined
      return {
        ...(hasTransition
          ? {
              transitionProperty: styles.transitionProperty,
              transitionDuration: styles.transitionDuration,
              transitionTimingFunction: styles.transitionTimingFunction,
              transitionDelay: styles.transitionDelay,
            }
          : {}),
        ...(hasAnimation
          ? {
              animationName: styles.animationName,
              animationDuration: styles.animationDuration,
              animationTimingFunction: styles.animationTimingFunction,
              animationDelay: styles.animationDelay,
              animationIterationCount: styles.animationIterationCount,
              animationDirection: styles.animationDirection,
              animationFillMode: styles.animationFillMode,
            }
          : {}),
        transformOrigin: styles.transformOrigin,
      }
    }

    return Array.from(base.querySelectorAll('*'))
      .filter((element) => !ignoredTags.has(element.tagName.toLowerCase()))
      .map((element, index) => {
        const rect = element.getBoundingClientRect()
        const styles = window.getComputedStyle(element)
        const section = sectionFor(element)
        const styleMap = compactStyles(element, styles, base)

        return {
          id: routePath + '::' + (element.id || 'node-' + (index + 1)),
          routePath,
          tag: element.tagName.toLowerCase(),
          domPath: pathFor(element),
          parentDomPath:
            element.parentElement && element.parentElement !== base
              ? pathFor(element.parentElement)
              : undefined,
          text: readText(element),
          sectionIndex: section.index,
          sectionName: section.name,
          rect: {
            x: Math.round(rect.x),
            y: Math.round(rect.y),
            width: Math.round(rect.width),
            height: Math.round(rect.height),
          },
          attributes: {
            src: element.currentSrc || element.src || undefined,
            href:
              element.href && new URL(element.href, window.location.href).origin === window.location.origin
                ? new URL(element.href, window.location.href).pathname +
                  new URL(element.href, window.location.href).search +
                  new URL(element.href, window.location.href).hash
                : element.href || undefined,
            alt: element.alt || undefined,
            role: element.getAttribute('role') || undefined,
            className: element.className || undefined,
            dataFramerName: element.getAttribute('data-framer-name') || undefined,
          },
          styles: styleMap,
          motion: compactMotion(styles),
        }
      })
      .filter((node) => node.rect.width > 0 && node.rect.height > 0)
  })()`);
}
async function getPngSize(filePath) {
    const png = PNG.sync.read(await fs.readFile(filePath));
    return {
        width: png.width,
        height: png.height,
    };
}
function unique(values, key) {
    if (!key)
        return Array.from(new Set(values));
    const seen = new Set();
    return values.filter((value) => {
        const identity = key(value);
        if (seen.has(identity))
            return false;
        seen.add(identity);
        return true;
    });
}
