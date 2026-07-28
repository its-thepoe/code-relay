import fs from "node:fs/promises";
import path from "node:path";
import { generateNextProject } from "../packages/codegen/src/next-project.js";

type Strategy = {
  id: string;
  structuredLayout: boolean;
  compactSpacing: boolean;
  aggressiveMobileStacking: boolean;
  preserveImageAspectRatio: boolean;
};

function parseArgs(argv: string[]) {
  const parsed: {
    ir?: string;
    out?: string;
    strategy?: string;
    cacheDir?: string;
  } = {};

  for (let index = 0; index < argv.length; index += 1) {
    const value = argv[index];
    const next = argv[index + 1];
    if (value === "--ir" && next) {
      parsed.ir = next;
      index += 1;
      continue;
    }
    if (value === "--out" && next) {
      parsed.out = next;
      index += 1;
      continue;
    }
    if (value === "--strategy" && next) {
      parsed.strategy = next;
      index += 1;
      continue;
    }
    if (value === "--cache-dir" && next) {
      parsed.cacheDir = next;
      index += 1;
    }
  }

  return parsed;
}

function resolveStrategy(id: string | undefined): Strategy {
  if (id === "structured-layout") {
    return {
      id,
      structuredLayout: true,
      compactSpacing: false,
      aggressiveMobileStacking: false,
      preserveImageAspectRatio: true,
    };
  }

  return {
    id: id ?? "semantic-layout",
    structuredLayout: false,
    compactSpacing: false,
    aggressiveMobileStacking: false,
    preserveImageAspectRatio: true,
  };
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (!args.ir || !args.out) {
    throw new Error(
      "Usage: tsx scripts/regenerate-from-ir.ts --ir /path/to/normalized-ir.json --out /path/to/project [--strategy semantic-layout]",
    );
  }

  const irPath = path.resolve(args.ir);
  const outDir = path.resolve(args.out);
  const ir = JSON.parse(await fs.readFile(irPath, "utf8"));
  const runtimeCapturePath = path.join(path.dirname(irPath), "raw-runtime-capture.json");
  try {
    const runtimeCapture = JSON.parse(
      await fs.readFile(runtimeCapturePath, "utf8"),
    );
    if (!Array.isArray(ir.runtimeCapture?.nodes)) {
      ir.runtimeCapture = runtimeCapture;
    }
  } catch {}
  await hydrateThinFullSiteIrFromRouteCache(ir, irPath, args.cacheDir);
  await fs.rm(outDir, { recursive: true, force: true });
  await generateNextProject({
    ir,
    projectDir: outDir,
    strategy: resolveStrategy(args.strategy),
  });
  console.log(outDir);
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.stack ?? error.message : error);
  process.exit(1);
});

type RuntimeNode = {
  id: string;
  routePath?: string;
  tag: string;
  domPath: string;
  parentDomPath?: string;
  text?: string;
  rect: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  sectionName?: string;
  attributes: {
    src?: string;
    href?: string;
    alt?: string;
    role?: string;
    className?: string;
    dataFramerName?: string;
  };
  styles: Record<string, string>;
  motion?: Record<string, string>;
  interactionStyles?: {
    hover?: Record<string, string>;
    focus?: Record<string, string>;
  };
};

type RuntimeRouteCapture = {
  routePath: string;
  url?: string;
  title?: string;
  templateId?: string;
  templatePath?: string;
  templateKind?: "static" | "cms" | "component" | "redirect" | "utility";
  routeKind?: "page" | "redirect";
  template?: string;
  destination?: string;
  destinationKind?: string;
  redirectTo?: string;
  redirectStatus?: number;
  captureDiagnostics?: Record<string, unknown>;
  nodes: RuntimeNode[];
  nodesByViewport?: Record<string, RuntimeNode[]>;
  rootStyles?: Record<string, string>;
  rootStylesByViewport?: Record<string, Record<string, string>>;
  viewports?: Record<string, unknown>;
  stylesheetUrls?: string[];
  interactionReplay?: unknown[];
  mode?: string;
};

async function hydrateThinFullSiteIrFromRouteCache(
  ir: Record<string, any>,
  irPath: string,
  explicitCacheDir?: string,
) {
  if (ir.exportMode !== "full-site") return;

  const sitePages = Array.isArray(ir.sitePages) ? ir.sitePages : [];
  if (sitePages.length === 0) return;

  const routeCaptures = Array.isArray(ir.runtimeCapture?.routeCaptures)
    ? ir.runtimeCapture.routeCaptures
    : [];
  const thinPages = sitePages.some(
    (page) =>
      !Array.isArray(page?.nodes) ||
      page.nodes.length === 0 ||
      !Array.isArray(page?.exportTree) ||
      page.exportTree.length === 0,
  );
  const thinCaptures = routeCaptures.some(
    (capture) => !Array.isArray(capture?.nodes) || capture.nodes.length === 0,
  );
  const hasUsefulCaptures = routeCaptures.some(
    (capture) => Array.isArray(capture?.nodes) && capture.nodes.length > 0,
  );
  if (!thinPages && (routeCaptures.length === 0 || !thinCaptures || hasUsefulCaptures)) {
    return;
  }

  const cacheDir = await findRouteCacheRoot(irPath, explicitCacheDir);
  if (!cacheDir) return;

  const capturesByRoute = new Map<string, RuntimeRouteCapture>();
  for (const page of sitePages) {
    const routePath =
      typeof page?.routePath === "string" && page.routePath.length > 0
        ? page.routePath
        : "/";
    const cached = await readRouteCacheCapture(cacheDir, routePath);
    if (cached && Array.isArray(cached.nodes) && cached.nodes.length > 0) {
      capturesByRoute.set(routePath, cached);
    }
  }

  if (capturesByRoute.size === 0) return;

  ir.runtimeCapture = {
    ...(ir.runtimeCapture ?? {}),
    routeCaptures: sitePages.map((page) => {
      const routePath =
        typeof page?.routePath === "string" && page.routePath.length > 0
          ? page.routePath
          : "/";
      const existing = routeCaptures.find(
        (capture: Record<string, unknown>) => capture?.routePath === routePath,
      );
      const cached = capturesByRoute.get(routePath);
      return cached ? { ...(existing ?? {}), ...cached } : existing;
    }).filter(Boolean),
  };

  ir.sitePages = sitePages.map((page) => {
    const routePath =
      typeof page?.routePath === "string" && page.routePath.length > 0
        ? page.routePath
        : "/";
    const capture = capturesByRoute.get(routePath);
    if (!capture) return page;
    const canonicalNodes = preferredRuntimeNodes(capture);
    const exportTree = buildRuntimeExportTree(capture);
    return {
      ...page,
      routePath,
      title:
        typeof page?.title === "string" && page.title.length > 0
          ? page.title
          : typeof capture.title === "string" && capture.title.length > 0
            ? capture.title
            : routePath === "/"
              ? "Home"
              : routePath.split("/").filter(Boolean).at(-1) ?? "Page",
      templateId:
        typeof page?.templateId === "string" && page.templateId.length > 0
          ? page.templateId
          : capture.templateId ?? routePath,
      templatePath:
        typeof page?.templatePath === "string" && page.templatePath.length > 0
          ? page.templatePath
          : capture.templatePath ?? routePath,
      routeKind:
        typeof page?.routeKind === "string" && page.routeKind.length > 0
          ? page.routeKind
          : capture.routeKind ?? "page",
      template:
        typeof page?.template === "string" && page.template.length > 0
          ? page.template
          : capture.template,
      templateKind:
        typeof page?.templateKind === "string" && page.templateKind.length > 0
          ? page.templateKind
          : capture.templateKind ?? inferTemplateKind(routePath),
      destination: page?.destination ?? capture.destination,
      destinationKind: page?.destinationKind ?? capture.destinationKind,
      redirectTo: page?.redirectTo ?? capture.redirectTo,
      redirectStatus: page?.redirectStatus ?? capture.redirectStatus,
      nodes: canonicalNodes,
      exportTree,
      sourceTextLength:
        typeof page?.sourceTextLength === "number"
          ? page.sourceTextLength
          : runtimeTextLength(canonicalNodes),
      nodeCount: canonicalNodes.length,
      exportTreeNodeCount: countExportTreeNodes(exportTree),
    };
  });

  ir.routeTemplates = summarizeRouteTemplates(ir.sitePages);
}

async function findRouteCacheRoot(irPath: string, explicitCacheDir?: string) {
  const irDir = path.dirname(irPath);
  const candidates = [
    ...(explicitCacheDir ? [path.resolve(explicitCacheDir)] : []),
    path.join(irDir, ".capture-cache"),
    path.join(path.dirname(irDir), ".capture-cache"),
    path.join(path.dirname(path.dirname(irDir)), ".capture-cache"),
    path.join(path.dirname(path.dirname(path.dirname(irDir))), ".capture-cache"),
  ];
  for (const candidate of candidates) {
    try {
      const stats = await fs.stat(candidate);
      if (stats.isDirectory()) return candidate;
    } catch {}
  }
  return null;
}

async function readRouteCacheCapture(cacheDir: string, routePath: string) {
  const routeDir = routeDirectoryName(routePath);
  const candidates = [
    path.join(cacheDir, routeDir, "route-cache.json"),
    path.join(cacheDir, `${routeDir}.json`),
  ];
  for (const candidate of candidates) {
    try {
      const raw = JSON.parse(await fs.readFile(candidate, "utf8"));
      if (
        raw &&
        typeof raw === "object" &&
        raw.capture &&
        typeof raw.capture === "object" &&
        Array.isArray(raw.capture.nodes)
      ) {
        return raw.capture as RuntimeRouteCapture;
      }
    } catch {}
  }
  return null;
}

function routeDirectoryName(routePath: string) {
  if (routePath === "/") return "home";
  return routePath
    .replace(/^\/+|\/+$/g, "")
    .replace(/[^a-zA-Z0-9_-]+/g, "-")
    .slice(0, 120);
}

function inferTemplateKind(routePath: string) {
  return routePath.includes(":slug") ? "cms" : "static";
}

function runtimeTextLength(nodes: RuntimeNode[]) {
  return nodes.reduce((total, node) => total + (node.text?.length ?? 0), 0);
}

function countExportTreeNodes(nodes: Array<Record<string, any>>) {
  return nodes.reduce(
    (total, node) => total + 1 + countExportTreeNodes(Array.isArray(node.children) ? node.children : []),
    0,
  );
}

function summarizeRouteTemplates(sitePages: Array<Record<string, any>>) {
  const grouped = new Map<
    string,
    {
      templateId: string;
      templatePath: string;
      templateKind: "static" | "cms" | "component" | "redirect" | "utility";
      representativeRoutePath: string;
      routePaths: string[];
      routeCount: number;
      sourceTextLength: number;
      nodeCount: number;
    }
  >();

  for (const page of sitePages) {
    const routePath =
      typeof page.routePath === "string" && page.routePath.length > 0
        ? page.routePath
        : "/";
    const templateId =
      typeof page.templateId === "string" && page.templateId.length > 0
        ? page.templateId
        : routePath;
    const templatePath =
      typeof page.templatePath === "string" && page.templatePath.length > 0
        ? page.templatePath
        : routePath;
    const templateKind =
      page.templateKind === "cms" ||
      page.templateKind === "component" ||
      page.templateKind === "redirect" ||
      page.templateKind === "utility"
        ? page.templateKind
        : "static";
    const key = `${templateKind}:${templateId}:${templatePath}`;
    const existing = grouped.get(key);
    const nodeCount = Array.isArray(page.exportTree)
      ? countExportTreeNodes(page.exportTree)
      : Array.isArray(page.nodes)
        ? page.nodes.length
        : 0;
    if (existing) {
      existing.routePaths.push(routePath);
      existing.routeCount += 1;
      existing.nodeCount = Math.max(existing.nodeCount, nodeCount);
      existing.sourceTextLength = Math.max(
        existing.sourceTextLength,
        typeof page.sourceTextLength === "number" ? page.sourceTextLength : 0,
      );
      continue;
    }
    grouped.set(key, {
      templateId,
      templatePath,
      templateKind,
      representativeRoutePath: routePath,
      routePaths: [routePath],
      routeCount: 1,
      sourceTextLength:
        typeof page.sourceTextLength === "number" ? page.sourceTextLength : 0,
      nodeCount,
    });
  }

  return [...grouped.values()].sort((left, right) =>
    left.representativeRoutePath.localeCompare(right.representativeRoutePath),
  );
}

function buildRuntimeExportTree(runtimeCapture: {
  nodes: RuntimeNode[];
  nodesByViewport?: Record<string, RuntimeNode[]>;
}) {
  const canonicalNodes = preferredRuntimeNodes(runtimeCapture);
  const runtimeByDomPath = new Map(
    canonicalNodes.map((node) => [node.domPath, node] as const),
  );
  const childrenByDomPath = new Map<string, RuntimeNode[]>();
  const roots: RuntimeNode[] = [];

  for (const node of canonicalNodes) {
    const parentPath =
      node.parentDomPath && runtimeByDomPath.has(node.parentDomPath)
        ? node.parentDomPath
        : nearestCapturedParentDomPath(node.domPath, runtimeByDomPath);
    const parent = parentPath ? runtimeByDomPath.get(parentPath) : undefined;
    if (!parent || !parentPath) {
      roots.push(node);
      continue;
    }
    childrenByDomPath.set(parentPath, [
      ...(childrenByDomPath.get(parentPath) ?? []),
      node,
    ]);
  }

  const buildNode = (runtimeNode: RuntimeNode): Record<string, unknown> => {
    const children = (childrenByDomPath.get(runtimeNode.domPath) ?? []).map(buildNode);
    const snapshots = collectViewportSnapshots(runtimeCapture, runtimeNode.domPath);

    return {
      id: runtimeNode.id,
      parentId: parentDomPath(runtimeNode.domPath),
      childIds: children.map((child) => String(child.id ?? "")),
      name: runtimeNode.sectionName,
      text: sanitizeRuntimeTextForTag(runtimeNode.tag, runtimeNode.text),
      kind: inferRuntimeKind(runtimeNode),
      tag: runtimeNode.tag,
      rect: runtimeNode.rect,
      rectByViewport: snapshots.rectByViewport,
      styles: { ...runtimeNode.styles },
      stylesByViewport: snapshots.stylesByViewport,
      motion: runtimeNode.motion,
      motionByViewport: snapshots.motionByViewport,
      interactionStyles: runtimeNode.interactionStyles,
      interactionStylesByViewport: snapshots.interactionStylesByViewport,
      attributes: {
        src: runtimeNode.attributes.src,
        href: runtimeNode.attributes.href,
        alt: runtimeNode.attributes.alt,
        role: runtimeNode.attributes.role,
        className: runtimeNode.attributes.className,
        dataFramerName: runtimeNode.attributes.dataFramerName,
      },
      source: {
        runtimeNodeId: runtimeNode.id,
        domPath: runtimeNode.domPath,
        runtimeNodeIdsByViewport: snapshots.runtimeNodeIdsByViewport,
      },
      children,
    };
  };

  return roots.map(buildNode);
}

function preferredRuntimeNodes(runtimeCapture: {
  nodes: RuntimeNode[];
  nodesByViewport?: Record<string, RuntimeNode[]>;
}) {
  const candidates = [
    Array.isArray(runtimeCapture.nodes) ? runtimeCapture.nodes : [],
    ...Object.values(runtimeCapture.nodesByViewport ?? {}).filter(
      (nodes): nodes is RuntimeNode[] => Array.isArray(nodes),
    ),
  ].filter((nodes) => nodes.length > 0);

  if (candidates.length === 0) return [];

  const score = (nodes: RuntimeNode[]) => {
    const textCount = nodes.filter(
      (node) => typeof node.text === "string" && node.text.trim().length > 0,
    ).length;
    const contentNodes = nodes.filter(
      (node) =>
        (typeof node.text === "string" && node.text.trim().length > 0) ||
        Boolean(node.attributes.href) ||
        Boolean(node.attributes.src),
    ).length;
    return contentNodes * 10_000 + textCount * 100 + nodes.length;
  };

  return candidates.reduce((best, candidate) =>
    score(candidate) > score(best) ? candidate : best,
  );
}

function nearestCapturedParentDomPath(
  domPath: string,
  runtimeByDomPath: Map<string, RuntimeNode>,
) {
  let current = parentDomPath(domPath);
  while (current) {
    if (runtimeByDomPath.has(current)) return current;
    current = parentDomPath(current);
  }
  return undefined;
}

function parentDomPath(domPath: string) {
  const index = domPath.lastIndexOf(" > ");
  if (index < 0) return undefined;
  return domPath.slice(0, index);
}

function collectViewportSnapshots(
  runtimeCapture: {
    nodesByViewport?: Record<string, RuntimeNode[]>;
  },
  domPath?: string,
) {
  const rectByViewport: Record<string, RuntimeNode["rect"]> = {};
  const stylesByViewport: Record<string, Record<string, string>> = {};
  const motionByViewport: Record<string, Record<string, string>> = {};
  const interactionStylesByViewport: Record<string, Record<string, unknown>> = {};
  const runtimeNodeIdsByViewport: Record<string, string> = {};

  if (!domPath) {
    return {
      rectByViewport,
      stylesByViewport,
      motionByViewport,
      interactionStylesByViewport,
      runtimeNodeIdsByViewport,
    };
  }

  for (const [viewportName, nodes] of Object.entries(runtimeCapture.nodesByViewport ?? {})) {
    const matchedNode = nodes?.find((node) => node.domPath === domPath);
    if (!matchedNode) continue;
    rectByViewport[viewportName] = matchedNode.rect;
    stylesByViewport[viewportName] = { ...matchedNode.styles };
    if (matchedNode.motion) {
      motionByViewport[viewportName] = { ...matchedNode.motion };
    }
    if (matchedNode.interactionStyles) {
      interactionStylesByViewport[viewportName] = {
        ...(matchedNode.interactionStyles.hover
          ? { hover: { ...matchedNode.interactionStyles.hover } }
          : {}),
        ...(matchedNode.interactionStyles.focus
          ? { focus: { ...matchedNode.interactionStyles.focus } }
          : {}),
      };
    }
    runtimeNodeIdsByViewport[viewportName] = matchedNode.id;
  }

  return {
    rectByViewport,
    stylesByViewport,
    motionByViewport,
    interactionStylesByViewport,
    runtimeNodeIdsByViewport,
  };
}

function inferRuntimeKind(runtimeNode: RuntimeNode) {
  if (runtimeNode.tag === "img") return "image";
  if (runtimeNode.tag === "a") return "link";
  if (runtimeNode.tag === "button") return "button";
  if (sanitizeRuntimeTextForTag(runtimeNode.tag, runtimeNode.text)) return "text";
  return "frame";
}

function sanitizeRuntimeTextForTag(tag: string, text: string | undefined) {
  if (!isTextBearingRuntimeTag(tag)) return undefined;
  return normalizeRuntimeText(text);
}

function normalizeRuntimeText(text: string | undefined) {
  if (!text) return undefined;
  const normalized = text.trim().replace(/\s+/g, " ").slice(0, 500);
  return normalized.length > 0 ? normalized : undefined;
}

function isTextBearingRuntimeTag(tag: string) {
  return new Set([
    "p",
    "span",
    "li",
    "a",
    "button",
    "label",
    "strong",
    "em",
    "small",
    "blockquote",
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
  ]).has(tag);
}
