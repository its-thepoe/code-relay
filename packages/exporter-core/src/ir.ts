import slugify from "slugify";
import type {
  ExportIR,
  ExportWarning,
  NodeMatch,
  PluginCanvasCapture,
  RuntimeCapture,
  RuntimeNode,
} from "../../shared/src/types.js";

type BuildIrInput = {
  url: string;
  name?: string;
  runtimeCapture: RuntimeCapture;
  pluginCapture: PluginCanvasCapture;
  nodeMatches: NodeMatch[];
};

export function buildIntermediateRepresentation(input: BuildIrInput): ExportIR {
  const contentNodes = pickContentNodes(input.runtimeCapture.nodes);
  const componentName = toComponentName(
    input.name ?? inferName(input.runtimeCapture.title, contentNodes),
  );
  const warnings: ExportWarning[] = [];
  const lowConfidenceMatches = input.nodeMatches.filter(
    (match) => match.confidence < 0.45,
  );

  if (lowConfidenceMatches.length > 0) {
    warnings.push({
      type: "node_match_low_confidence",
      severity: "warning",
      message: `${lowConfidenceMatches.length} selected nodes had low confidence runtime matches.`,
    });
  }

  if (contentNodes.length === 0) {
    warnings.push({
      type: "layout_approximated",
      severity: "warning",
      message:
        "No rich content nodes were detected, so the output uses a generic section structure.",
    });
  }

  const assets = unique(
    input.runtimeCapture.nodes
      .filter((node) => node.tag === "img" && node.attributes.src)
      .map((node) => ({
        url: node.attributes.src!,
        kind: "image" as const,
        alt: node.attributes.alt,
      })),
    (asset) => asset.url,
  );

  return {
    jobId: `local-${Date.now()}`,
    sourceUrl: input.url,
    componentName,
    exportProps: readExportProps(input.pluginCapture),
    runtimeCapture: input.runtimeCapture,
    pluginCapture: input.pluginCapture,
    nodeMatches: input.nodeMatches,
    component: {
      semanticType: inferSemanticType(contentNodes),
      nodes: contentNodes,
      sections: groupSections(contentNodes, input.nodeMatches),
    },
    assets,
    warnings,
  };
}

function readExportProps(
  pluginCapture: PluginCanvasCapture,
): ExportIR["exportProps"] {
  const meta = pluginCapture.selectedNodes[0]?.metadata;
  if (!meta || typeof meta !== "object") return undefined;
  const exportProps = (meta as any).exportProps;
  if (!exportProps || typeof exportProps !== "object") return undefined;

  const heroTitle =
    typeof exportProps.heroTitle === "string"
      ? exportProps.heroTitle
      : undefined;
  const heroSubtitle =
    typeof exportProps.heroSubtitle === "string"
      ? exportProps.heroSubtitle
      : undefined;
  const ctaLabel =
    typeof exportProps.ctaLabel === "string" ? exportProps.ctaLabel : undefined;
  const ctaHref =
    typeof exportProps.ctaHref === "string" ? exportProps.ctaHref : undefined;

  if (!heroTitle && !heroSubtitle && !ctaLabel && !ctaHref) return undefined;
  return { heroTitle, heroSubtitle, ctaLabel, ctaHref };
}

function pickContentNodes(nodes: RuntimeNode[]) {
  const usefulTags = new Set([
    "h1",
    "h2",
    "h3",
    "p",
    "a",
    "button",
    "img",
    "span",
    "li",
  ]);
  const seenText = new Set<string>();
  const selected: RuntimeNode[] = [];

  for (const node of nodes) {
    if (!usefulTags.has(node.tag)) {
      continue;
    }

    if (node.tag === "img" && node.attributes.src) {
      selected.push(node);
      continue;
    }

    const text = node.text?.trim();

    if (!text || text.length < 2 || seenText.has(text)) {
      continue;
    }

    seenText.add(text);
    selected.push(node);
  }

  return selected.slice(0, 160);
}

function groupSections(nodes: RuntimeNode[], matches: NodeMatch[]) {
  const grouped = new Map<number, RuntimeNode[]>();

  for (const node of nodes) {
    const index = node.sectionIndex ?? 0;
    grouped.set(index, [...(grouped.get(index) ?? []), node]);
  }

  const sections = Array.from(grouped.entries()).map(
    ([index, sectionNodes], sectionNumber) => ({
      index,
      name: sectionNodes[0]?.sectionName ?? `Section ${sectionNumber + 1}`,
      kind: inferSectionKind(sectionNodes, sectionNumber),
      confidence: sectionConfidence(sectionNodes, matches),
      nodes: sectionNodes,
    }),
  );

  if (sections.length <= 1 && nodes.length > 12) {
    return splitLongPageIntoSections(nodes, matches);
  }

  return sections;
}

function splitLongPageIntoSections(nodes: RuntimeNode[], matches: NodeMatch[]) {
  const sorted = [...nodes].sort(
    (first, second) => first.rect.y - second.rect.y,
  );
  const sections: ExportIR["component"]["sections"] = [];
  let current: RuntimeNode[] = [];

  for (const node of sorted) {
    const previous = current.at(-1);
    const startsNewByHeading =
      (node.tag === "h1" || node.tag === "h2") && current.length >= 5;
    const startsNewByGap = previous
      ? node.rect.y - (previous.rect.y + previous.rect.height) > 420
      : false;

    if ((startsNewByHeading || startsNewByGap) && current.length > 0) {
      sections.push({
        index: sections.length,
        name: inferSectionName(current, sections.length),
        kind: inferSectionKind(current, sections.length),
        confidence: sectionConfidence(current, matches),
        nodes: current,
      });
      current = [];
    }

    current.push(node);
  }

  if (current.length > 0) {
    sections.push({
      index: sections.length,
      name: inferSectionName(current, sections.length),
      kind: inferSectionKind(current, sections.length),
      confidence: sectionConfidence(current, matches),
      nodes: current,
    });
  }

  return sections;
}

function inferSectionName(nodes: RuntimeNode[], index: number) {
  return (
    nodes
      .find(
        (node) => node.tag === "h1" || node.tag === "h2" || node.tag === "h3",
      )
      ?.text?.slice(0, 48) ?? `Section ${index + 1}`
  );
}

function inferSectionKind(
  nodes: RuntimeNode[],
  index: number,
): "hero" | "content" | "media-grid" {
  const images = nodes.filter((node) => node.tag === "img").length;
  const headings = nodes.filter(
    (node) => node.tag === "h1" || node.tag === "h2",
  ).length;
  const text = nodes.filter((node) => node.text && node.tag !== "img").length;

  if (index === 0 && (headings > 0 || images > 0)) {
    return "hero";
  }

  if (images >= 2 && text <= 6) {
    return "media-grid";
  }

  return "content";
}

function sectionConfidence(nodes: RuntimeNode[], matches: NodeMatch[]) {
  if (matches.length === 0) {
    return 0;
  }

  const sectionPaths = new Set(nodes.map((node) => node.domPath));
  const relevant = matches.filter((match) =>
    match.domPath ? sectionPaths.has(match.domPath) : false,
  );

  if (relevant.length === 0) {
    return 0;
  }

  return Number(
    (
      relevant.reduce((sum, match) => sum + match.confidence, 0) /
      relevant.length
    ).toFixed(3),
  );
}

function inferSemanticType(
  nodes: RuntimeNode[],
): ExportIR["component"]["semanticType"] {
  const hasHeading = nodes.some(
    (node) => node.tag === "h1" || node.tag === "h2",
  );
  const imageCount = nodes.filter((node) => node.tag === "img").length;
  const textCount = nodes.filter((node) => node.text).length;

  if (hasHeading && imageCount > 0) {
    return "hero";
  }

  if (textCount > 6) {
    return "grid";
  }

  return hasHeading ? "section" : "unknown";
}

function inferName(title: string, nodes: RuntimeNode[]) {
  const heading = nodes.find(
    (node) => node.tag === "h1" || node.tag === "h2",
  )?.text;
  return heading ?? title ?? "Exported Section";
}

function toComponentName(value: string) {
  const slug = slugify(value, { lower: false, strict: true });
  const words = slug.split("-").filter(Boolean);
  const name = words
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join("");

  return name && /^[A-Z]/.test(name) ? name : "ExportedSection";
}

function unique<T>(items: T[], keyFor: (item: T) => string) {
  const seen = new Set<string>();
  const result: T[] = [];

  for (const item of items) {
    const key = keyFor(item);

    if (seen.has(key)) {
      continue;
    }

    seen.add(key);
    result.push(item);
  }

  return result;
}
