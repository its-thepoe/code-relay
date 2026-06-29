import { mkdirp } from "fs-extra";
import {
  chromium,
  type Browser,
  type ElementHandle,
  type Locator,
  type Page,
} from "playwright";
import path from "node:path";
import { PNG } from "pngjs";
import fs from "node:fs/promises";
import type {
  PluginCanvasCapture,
  Rect,
  RuntimeCapture,
  RuntimeNode,
  ViewportName,
} from "../../shared/src/types.js";

type CaptureInput = {
  url: string;
  workDir: string;
  selector?: string;
};

const viewports: Record<ViewportName, { width: number; height: number }> = {
  desktop: { width: 1440, height: 900 },
  laptop: { width: 1280, height: 900 },
  tablet: { width: 768, height: 1024 },
  mobile: { width: 390, height: 844 },
};

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
] as const;

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
] as const;

const INTERACTION_STYLE_PROPERTIES = [
  ...CAPTURED_STYLE_PROPERTIES,
  ...MOTION_STYLE_PROPERTIES,
] as const;

export async function captureRuntime(
  input: CaptureInput,
): Promise<RuntimeCapture> {
  const captureDir = path.join(input.workDir, "original");
  await mkdirp(captureDir);

  const browser = await chromium.launch({ headless: true });

  try {
    const captures = await Promise.all(
      (Object.keys(viewports) as ViewportName[]).map((viewportName) =>
        captureViewport(browser, input, viewportName, captureDir),
      ),
    );
    const desktop =
      captures.find((capture) => capture.viewportName === "desktop") ??
      captures[0]!;
    const stylesheetUrls = unique(
      captures.flatMap((capture) => capture.stylesheetUrls),
    );

    return {
      url: input.url,
      title: desktop.title,
      mode: input.selector ? "section" : "page",
      viewports: Object.fromEntries(
        captures.map((capture) => [capture.viewportName, capture.viewport]),
      ) as RuntimeCapture["viewports"],
      nodes: desktop.nodes,
      nodesByViewport: Object.fromEntries(
        captures.map((capture) => [capture.viewportName, capture.nodes]),
      ),
      captureDiagnostics: {
        breakpointsCaptured: captures.map((capture) => capture.viewportName),
        fontReadiness: Object.fromEntries(
          captures.map((capture) => [
            capture.viewportName,
            capture.fontsReady,
          ]),
        ),
        stylesheetCount: Object.fromEntries(
          captures.map((capture) => [
            capture.viewportName,
            capture.stylesheetUrls.length,
          ]),
        ),
        nodeCount: Object.fromEntries(
          captures.map((capture) => [capture.viewportName, capture.nodes.length]),
        ),
      },
      framerStyleCss: desktop.framerStyleCss,
      stylesheetUrls,
    };
  } finally {
    await browser.close();
  }
}

export function createSimulatedPluginCapture(
  nodes: RuntimeNode[],
): PluginCanvasCapture {
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

async function captureViewport(
  browser: Browser,
  input: CaptureInput,
  viewportName: ViewportName,
  captureDir: string,
) {
  const viewport = viewports[viewportName];
  const page = await browser.newPage({ viewport });

  await page.goto(input.url, { waitUntil: "domcontentloaded", timeout: 60_000 });
  await page.waitForLoadState("load", { timeout: 15_000 }).catch(() => {
    // Modern Framer sites can keep loading analytics/fonts; capture renderable DOM.
  });
  await waitForRenderableContent(page, input.selector);
  const fontsReady = await waitForFonts(page);

  const screenshotPath = path.join(captureDir, `${viewportName}.png`);

  if (input.selector) {
    const rootHandle = await resolveRootHandle(page, input.selector);
    const clip = await getClip(rootHandle, viewport);

    await page.screenshot({
      path: screenshotPath,
      clip,
      animations: "disabled",
    });

    await rootHandle.dispose();
  } else {
    await page.screenshot({
      path: screenshotPath,
      fullPage: true,
      animations: "disabled",
    });
  }

  const nodes = await extractNodes(page, input.selector);
  const nodesWithInteractions = await collectInteractionStyles(page, nodes);
  const stylesheets = await extractStylesheets(page);
  const framerStyleCss = await downloadStylesheets(stylesheets);
  const title = await page.title();
  const imageSize = await getPngSize(screenshotPath);
  await page.close();

  return {
    viewportName,
    title,
    nodes: nodesWithInteractions,
    viewport: {
      screenshotPath,
      width: imageSize.width,
      height: imageSize.height,
    },
    fontsReady,
    framerStyleCss,
    stylesheetUrls: stylesheets,
  };
}

async function waitForFonts(page: Page) {
  const fontsReady = page.evaluate(`(() => {
      if (!('fonts' in document) || !document.fonts?.ready) return true
      return document.fonts.ready.then(() => true).catch(() => false)
    })()`);
  const timeout = page.waitForTimeout(5_000).then(() => false);

  return Promise.race([fontsReady, timeout]).catch(() => false);
}

async function waitForRenderableContent(page: Page, selector?: string) {
  await page
    .waitForFunction(
      (rootSelector) => {
        const root = rootSelector
          ? document.querySelector(rootSelector)
          : document.body;
        if (!root) return false;

        const rect = root.getBoundingClientRect();
        const hasSize = rect.width > 0 && rect.height > 0;
        const hasFramerNodes = Boolean(
          document.querySelector(
            '[data-framer-name], [class*="framer-"], main, section',
          ),
        );
        const hasText = (document.body.innerText ?? "").trim().length > 0;

        return document.readyState !== "loading" && hasSize && (hasFramerNodes || hasText);
      },
      selector ?? null,
      { timeout: 20_000 },
    )
    .catch(() => undefined);
  await page.waitForTimeout(750);
}

async function extractStylesheets(page: Page): Promise<string[]> {
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

async function collectInteractionStyles(page: Page, nodes: RuntimeNode[]) {
  const actionableNodes = nodes.filter(isActionableRuntimeNode).slice(0, 48);
  if (actionableNodes.length === 0) return nodes;

  const byDomPath = new Map<string, RuntimeNode>();
  for (const node of nodes) {
    byDomPath.set(node.domPath, node);
  }

  for (const node of actionableNodes) {
    try {
      const interactionStyles = await captureInteractionStatesForNode(
        page,
        node.domPath,
      );
      if (!interactionStyles) continue;
      const target = byDomPath.get(node.domPath);
      if (!target) continue;
      target.interactionStyles = interactionStyles;
    } catch {
      continue;
    }
  }

  return nodes;
}

async function captureInteractionStatesForNode(page: Page, domPath: string) {
  const locator = page.locator(domPath).first();
  const visible = await locator
    .evaluate((element) => {
      const rect = element.getBoundingClientRect();
      return rect.width > 0 && rect.height > 0;
    })
    .catch(() => false);
  if (!visible) return undefined;

  const baseStyles = await readComputedStylesForInteraction(locator);
  if (!baseStyles) return undefined;

  const hoverStyles = await captureHoverStyles(page, locator, baseStyles);
  const focusStyles = await captureFocusStyles(page, locator, baseStyles);
  const interactionStyles = {
    ...(hoverStyles ? { hover: hoverStyles } : {}),
    ...(focusStyles ? { focus: focusStyles } : {}),
  };

  return Object.keys(interactionStyles).length > 0 ? interactionStyles : undefined;
}

async function captureHoverStyles(
  page: Page,
  locator: Locator,
  baseStyles: Record<string, string>,
) {
  await page.mouse.move(0, 0).catch(() => {});
  const canHover = await locator.hover({ force: true, timeout: 1_500 }).then(
    () => true,
    () => false,
  );
  if (!canHover) return undefined;
  await page.waitForTimeout(40);
  const hoveredStyles = await readComputedStylesForInteraction(locator);
  await page.mouse.move(0, 0).catch(() => {});
  if (!hoveredStyles) return undefined;
  const diff = diffInteractionStyles(baseStyles, hoveredStyles);
  return Object.keys(diff).length > 0 ? diff : undefined;
}

async function captureFocusStyles(
  page: Page,
  locator: Locator,
  baseStyles: Record<string, string>,
) {
  const canFocus = await locator.focus().then(
    () => true,
    () => false,
  );
  if (!canFocus) return undefined;
  await page.waitForTimeout(20);
  const focusedStyles = await readComputedStylesForInteraction(locator);
  await locator.evaluate((element) => {
    if (element instanceof HTMLElement) {
      element.blur();
    }
  }).catch(() => {});
  await page.waitForTimeout(20);
  if (!focusedStyles) return undefined;
  const diff = diffInteractionStyles(baseStyles, focusedStyles);
  return Object.keys(diff).length > 0 ? diff : undefined;
}

async function readComputedStylesForInteraction(
  locator: Locator,
) {
  return locator
    .evaluate(
      (element, properties) => {
        const styles = window.getComputedStyle(element)
        return Object.fromEntries(
          properties
            .map((property) => [property, styles[property as keyof CSSStyleDeclaration] || ""])
            .filter(([, value]) => Boolean(value)),
        )
      },
      INTERACTION_STYLE_PROPERTIES,
    )
    .catch(() => undefined);
}

function diffInteractionStyles(
  baseStyles: Record<string, string>,
  stateStyles: Record<string, string>,
) {
  const diff: Record<string, string> = {};
  for (const [property, value] of Object.entries(stateStyles)) {
    if (!value) continue;
    if ((baseStyles[property] ?? "") === value) continue;
    diff[property] = value;
  }
  return diff;
}

function isActionableRuntimeNode(node: RuntimeNode) {
  return (
    node.tag === "a" ||
    node.tag === "button" ||
    node.attributes.role === "button" ||
    node.attributes.role === "link" ||
    Boolean(node.attributes.href) ||
    node.styles.cursor === "pointer" ||
    hasMotionMetadata(node.motion)
  );
}

function hasMotionMetadata(motion: RuntimeNode["motion"]) {
  if (!motion) return false;
  return MOTION_STYLE_PROPERTIES.some((property) => {
    const value = motion[property];
    return typeof value === "string" && value.trim().length > 0 && value !== "none" && value !== "0s";
  });
}

async function downloadStylesheets(urls: string[]): Promise<string> {
  const filtered = urls.filter((url) => /^https?:\/\//.test(url)).slice(0, 32);
  if (filtered.length === 0) return "";

  const chunks: string[] = [];

  for (const url of filtered) {
    try {
      const response = await fetch(url, {
        headers: { "user-agent": "coderelay-exporter/1.0" },
      });
      if (!response.ok) continue;
      const css = await response.text();
      if (!css.trim()) continue;
      chunks.push(`/* source: ${url} */\n${css}`);
    } catch {
      // best effort
    }
  }

  return chunks.join("\n\n").slice(0, 2_000_000);
}

async function resolveRootHandle(page: Page, selector?: string) {
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

  return handle.asElement() ?? (await page.$("body"))!;
}

async function getClip(
  rootHandle: ElementHandle<Element>,
  viewport: { width: number; height: number },
) {
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

async function extractNodes(
  page: Page,
  selector?: string,
): Promise<RuntimeNode[]> {
  const rootSelector = JSON.stringify(selector ?? null);
  const styleProperties = JSON.stringify(CAPTURED_STYLE_PROPERTIES);

  return page.evaluate(`(() => {
    const rootSelector = ${rootSelector}
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

      const clone = element.cloneNode(true)
      clone.querySelectorAll('script, style, noscript, template').forEach((node) => node.remove())
      const text = clone.innerText?.trim().replace(/\\s+/g, ' ').slice(0, 500)
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

    return Array.from(base.querySelectorAll('*'))
      .filter((element) => !ignoredTags.has(element.tagName.toLowerCase()))
      .map((element, index) => {
        const rect = element.getBoundingClientRect()
        const styles = window.getComputedStyle(element)
        const section = sectionFor(element)
        const styleMap = Object.fromEntries(
          styleProperties
            .map((property) => [property, styles[property] || ''])
            .filter(([, value]) => Boolean(value))
        )

        return {
          id: element.id || 'node-' + (index + 1),
          tag: element.tagName.toLowerCase(),
          domPath: pathFor(element),
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
            href: element.href || undefined,
            alt: element.alt || undefined,
            role: element.getAttribute('role') || undefined,
            className: element.className || undefined,
            dataFramerName: element.getAttribute('data-framer-name') || undefined,
          },
          styles: styleMap,
          motion: {
            transitionProperty: styles.transitionProperty,
            transitionDuration: styles.transitionDuration,
            transitionTimingFunction: styles.transitionTimingFunction,
            transitionDelay: styles.transitionDelay,
            animationName: styles.animationName,
            animationDuration: styles.animationDuration,
            animationTimingFunction: styles.animationTimingFunction,
            animationDelay: styles.animationDelay,
            animationIterationCount: styles.animationIterationCount,
            animationDirection: styles.animationDirection,
            animationFillMode: styles.animationFillMode,
            transformOrigin: styles.transformOrigin,
          },
        }
      })
      .filter((node) => node.rect.width > 0 && node.rect.height > 0)
  })()`);
}

async function getPngSize(filePath: string) {
  const png = PNG.sync.read(await fs.readFile(filePath));

  return {
    width: png.width,
    height: png.height,
  };
}

function unique(values: string[]) {
  return Array.from(new Set(values));
}
