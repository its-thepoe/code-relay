import slugify from "slugify";
import type {
  CaptureMode,
  ExportIR,
  ExportTreeNode,
  FramerCmsCollection,
  FramerCmsCollectionItem,
  FramerCodeFile,
  FramerComponentModule,
  FramerFont,
  FramerTreeNode,
  ExportMode,
  ExportWarning,
  NodeMatch,
  PluginCanvasCapture,
  RuntimeCapture,
  RuntimeNode,
  ViewportName,
} from "../../shared/src/types.js";

type BuildIrInput = {
  url: string;
  name?: string;
  exportMode?: ExportMode;
  captureMode?: CaptureMode;
  runtimeCapture: RuntimeCapture;
  pluginCapture: PluginCanvasCapture;
  nodeMatches: NodeMatch[];
};

export function buildIntermediateRepresentation(input: BuildIrInput): ExportIR {
  const contentNodes = promoteFallbackHeading(
    pickContentNodes(input.runtimeCapture.nodes),
  );
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

  const libraryComponents = buildLibraryComponents(input, componentName);
  const exportMode = readExportMode(input);
  const componentModules = readComponentModules(input.pluginCapture);
  const codeFiles = readCodeFiles(input.pluginCapture);
  const fonts = readFonts(input);
  const cmsCollections = readCmsCollections(input.pluginCapture);
  const framerTree = buildFramerTree(input.pluginCapture);
  const exportTree = buildExportTree(
    framerTree,
    input.runtimeCapture,
    input.nodeMatches,
  );
  const exportEngine = chooseExportEngine({
    exportMode,
    sourceUrl: input.url,
    componentModules,
    pluginCapture: input.pluginCapture,
  });
  const sitePages =
    exportMode === "full-site"
      ? buildSitePages(input, componentName)
      : undefined;

  return {
    jobId: `local-${Date.now()}`,
    sourceUrl: input.url,
    componentName,
    exportMode,
    captureMode: resolveCaptureMode(input),
    exportEngine,
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
    framerTree,
    exportTree,
    componentModules,
    codeFiles,
    fonts,
    cmsCollections,
    libraryComponents,
    sitePages,
    exportTreeDiagnostics: summarizeExportTree(exportTree, input.runtimeCapture),
    warnings,
  };
}

function resolveCaptureMode(input: BuildIrInput): CaptureMode {
  const contextMode = input.pluginCapture.context?.captureMode;
  if (contextMode === "runtime-first" || contextMode === "plugin-only") {
    return contextMode;
  }
  if (input.captureMode === "runtime-first" || input.captureMode === "plugin-only") {
    return input.captureMode;
  }
  return /^https?:\/\//.test(input.url) ? "runtime-first" : "plugin-only";
}

function buildLibraryComponents(input: BuildIrInput, fallbackName: string) {
  const context = input.pluginCapture.context;
  const exportMode = readExportMode(input);
  const selectedComponents = Array.isArray(context?.selectedComponents)
    ? context!.selectedComponents!
    : [];
  const selectedNodes = Array.isArray(input.pluginCapture.selectedNodes)
    ? input.pluginCapture.selectedNodes
    : [];

  const selectedComponentSources =
    selectedComponents.length > 0
      ? selectedComponents
      : selectedNodes.filter((node) => {
          const metadata =
            node.metadata && typeof node.metadata === "object"
              ? (node.metadata as Record<string, unknown>)
              : {};
          return metadata.rootKind !== "page";
        });

  if (exportMode === "selection" && selectedComponents.length === 0) {
    return undefined;
  }

  if (
    selectedComponentSources.length < 2 &&
    exportMode !== "components" &&
    exportMode !== "full-site"
  ) {
    return undefined;
  }

  const usedNames = new Map<string, number>();
  const componentModules = readComponentModules(input.pluginCapture);
  const output = selectedComponentSources.map((source, index) => {
    const sourceRecord = source as Record<string, unknown>;
    const sourceName =
      typeof sourceRecord.name === "string" && sourceRecord.name.trim()
        ? sourceRecord.name.trim()
        : `${fallbackName} ${index + 1}`;
    const baseName = toComponentName(sourceName);
    const count = usedNames.get(baseName) ?? 0;
    usedNames.set(baseName, count + 1);
    const componentName = count === 0 ? baseName : `${baseName}${count + 1}`;

    const matchingRuntimeNodes = findNodesForSource(
      input.runtimeCapture.nodes,
      sourceRecord,
      sourceName,
    );
    const nodes = promoteFallbackHeading(
      pickContentNodes(matchingRuntimeNodes),
    );
    const module = findModuleForSource(componentModules, sourceRecord, sourceName);

    return {
      componentName,
      module,
      nodes:
        nodes.length > 0
          ? nodes
          : [createComponentPlaceholderNode(sourceRecord, sourceName, index)],
    };
  });

  return output.length > 0 ? output : undefined;
}

function findModuleForSource(
  modules: FramerComponentModule[],
  source: Record<string, unknown>,
  sourceName: string,
) {
  const insertURL =
    typeof source.insertURL === "string" ? source.insertURL : undefined;
  const id = typeof source.id === "string" ? source.id : undefined;
  const identifier =
    typeof source.componentIdentifier === "string"
      ? source.componentIdentifier
      : undefined;

  return modules.find((module) => {
    if (insertURL && module.insertURL === insertURL) return true;
    if (id && module.id === id) return true;
    if (identifier && module.componentIdentifier === identifier) return true;
    if (module.name === sourceName || module.componentName === sourceName) {
      return true;
    }
    return false;
  });
}

function buildSitePages(input: BuildIrInput, fallbackName: string) {
  const context = input.pluginCapture.context;
  const sitePages = Array.isArray(context?.sitePages)
    ? context!.sitePages!
    : [];
  const pageSources =
    sitePages.length > 0
      ? sitePages
      : input.runtimeCapture.nodes
          .filter((node) => node.styles.__coderelayRootKind === "page")
          .map((node) => ({
            id: node.styles.__coderelayRootId,
            name: node.sectionName,
          }));

  const uniqueSources = unique(pageSources, (source) => {
    const record = source as Record<string, unknown>;
    return typeof record.id === "string" && record.id
      ? record.id
      : String(record.name ?? "");
  });

  if (uniqueSources.length === 0) {
    return undefined;
  }

  const usedNames = new Map<string, number>();
  return uniqueSources.map((source, index) => {
    const sourceRecord = source as Record<string, unknown>;
    const title =
      typeof sourceRecord.name === "string" && sourceRecord.name.trim()
        ? sourceRecord.name.trim()
        : index === 0
          ? fallbackName
          : `Page ${index + 1}`;
    const baseName = toComponentName(title);
    const count = usedNames.get(baseName) ?? 0;
    usedNames.set(baseName, count + 1);
    const componentName = count === 0 ? baseName : `${baseName}${count + 1}`;
    const matchingRuntimeNodes = findNodesForSource(
      input.runtimeCapture.nodes,
      sourceRecord,
      title,
    );
    const nodes = promoteFallbackHeading(
      pickContentNodes(matchingRuntimeNodes),
    );

    return {
      componentName,
      routePath: index === 0 ? "/" : `/${toRouteSegment(title)}`,
      title,
      nodes:
        nodes.length > 0
          ? nodes
          : [createComponentPlaceholderNode(sourceRecord, title, index)],
    };
  });
}

function findNodesForSource(
  nodes: RuntimeNode[],
  source: Record<string, unknown>,
  sourceName: string,
) {
  const sourceId = typeof source.id === "string" ? source.id : undefined;
  return nodes.filter((node) => {
    if (sourceId && node.styles.__coderelayRootId === sourceId) return true;
    if (sourceId && node.id === sourceId) return true;
    if (node.sectionName === sourceName) return true;
    if (node.text === sourceName) return true;
    return false;
  });
}

function createComponentPlaceholderNode(
  source: Record<string, unknown>,
  name: string,
  index: number,
): RuntimeNode {
  const bounds =
    source.bounds && typeof source.bounds === "object"
      ? (source.bounds as Record<string, unknown>)
      : {};
  const width = typeof bounds.width === "number" ? bounds.width : 320;
  const height = typeof bounds.height === "number" ? bounds.height : 96;

  return {
    id: typeof source.id === "string" ? source.id : `component-${index + 1}`,
    tag: "h1",
    domPath: `plugin > component:nth-child(${index + 1})`,
    text: name,
    sectionIndex: index,
    sectionName: name,
    rect: {
      x: typeof bounds.x === "number" ? bounds.x : 0,
      y: typeof bounds.y === "number" ? bounds.y : index * 120,
      width,
      height,
    },
    attributes: {},
    styles: {
      fontSize: "24px",
      fontWeight: "700",
      lineHeight: "1.1",
      __coderelaySourceId: typeof source.id === "string" ? source.id : "",
      __coderelaySourceType:
        typeof source.type === "string" ? source.type : "ComponentNode",
    },
  };
}

function promoteFallbackHeading(nodes: RuntimeNode[]) {
  if (nodes.some((node) => node.tag === "h1" || node.tag === "h2")) {
    return nodes;
  }

  const headingIndex = nodes.findIndex((node) => {
    const text = node.text?.trim();
    if (!text) return false;
    if (text.length < 8 || text.length > 120) return false;
    if (/^(by|anonymous)$/i.test(text)) return false;
    if (/^(lorem ipsum\b)/i.test(text)) return false;
    return true;
  });

  if (headingIndex < 0) return nodes;

  return nodes.map((node, index) =>
    index === headingIndex ? { ...node, tag: "h1" } : node,
  );
}

function readExportProps(
  pluginCapture: PluginCanvasCapture,
): ExportIR["exportProps"] {
  if (pluginCapture.exportProps) {
    const heroTitle =
      typeof pluginCapture.exportProps.heroTitle === "string"
        ? pluginCapture.exportProps.heroTitle
        : undefined;
    const heroSubtitle =
      typeof pluginCapture.exportProps.heroSubtitle === "string"
        ? pluginCapture.exportProps.heroSubtitle
        : undefined;
    const ctaLabel =
      typeof pluginCapture.exportProps.ctaLabel === "string"
        ? pluginCapture.exportProps.ctaLabel
        : undefined;
    const ctaHref =
      typeof pluginCapture.exportProps.ctaHref === "string"
        ? pluginCapture.exportProps.ctaHref
        : undefined;

    if (heroTitle || heroSubtitle || ctaLabel || ctaHref) {
      return { heroTitle, heroSubtitle, ctaLabel, ctaHref };
    }
  }

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

function readExportMode(input: BuildIrInput): ExportMode {
  const contextMode = input.pluginCapture.context?.exportMode;
  if (contextMode === "full-site") return "full-site";
  if (contextMode === "components") return "components";
  if (input.exportMode === "full-site" || input.exportMode === "components") {
    return input.exportMode;
  }
  return "selection";
}

function chooseExportEngine(input: {
  exportMode: ExportMode;
  sourceUrl: string;
  componentModules: FramerComponentModule[];
  pluginCapture: PluginCanvasCapture;
}): ExportIR["exportEngine"] {
  const contextEngine = input.pluginCapture.context?.exportEngine;
  if (
    contextEngine === "component-module" ||
    contextEngine === "page-node-tree" ||
    contextEngine === "published-runtime" ||
    contextEngine === "hybrid" ||
    contextEngine === "plugin-approximation"
  ) {
    return contextEngine;
  }

  const hasPublishedRuntime = /^https?:\/\//.test(input.sourceUrl);
  if (input.exportMode === "components" && input.componentModules.length > 0) {
    return "component-module";
  }
  if (input.exportMode === "full-site" && hasPublishedRuntime) return "hybrid";
  if (input.exportMode === "full-site") return "page-node-tree";
  if (hasPublishedRuntime) return "published-runtime";
  return input.componentModules.length > 0
    ? "component-module"
    : "plugin-approximation";
}

function readComponentModules(
  pluginCapture: PluginCanvasCapture,
): FramerComponentModule[] {
  const contextModules = Array.isArray(pluginCapture.context?.componentModules)
    ? pluginCapture.context!.componentModules!
    : [];
  const nodeModules = pluginCapture.selectedNodes
    .map((node) => {
      const metadata =
        node.metadata && typeof node.metadata === "object"
          ? (node.metadata as Record<string, unknown>)
          : {};
      const component =
        metadata.component && typeof metadata.component === "object"
          ? (metadata.component as Record<string, unknown>)
          : undefined;
      if (!component) return null;
      const insertURL =
        typeof component.insertURL === "string" ? component.insertURL : "";
      if (!insertURL) return null;
      return {
        id: typeof component.id === "string" ? component.id : node.id,
        name:
          typeof component.name === "string" && component.name.trim()
            ? component.name.trim()
            : node.name ?? "FramerComponent",
        source:
          component.source === "component-instance" ||
          component.source === "component-node" ||
          component.source === "selected-component" ||
          component.source === "code-file-export"
            ? component.source
            : "selected-component",
        insertURL,
        componentIdentifier:
          typeof component.componentIdentifier === "string"
            ? component.componentIdentifier
            : undefined,
        componentName:
          typeof component.componentName === "string"
            ? component.componentName
            : undefined,
        controls: asRecord(component.controls),
        typedControls: asRecord(component.typedControls),
      } satisfies FramerComponentModule;
    })
    .filter(Boolean) as FramerComponentModule[];

  return unique([...contextModules, ...nodeModules], (module) =>
    [module.source, module.insertURL, module.name].join(":"),
  );
}

function readCodeFiles(pluginCapture: PluginCanvasCapture): FramerCodeFile[] {
  const contextFiles = Array.isArray(pluginCapture.context?.codeFiles)
    ? pluginCapture.context.codeFiles
    : [];

  const normalized = contextFiles
    .map((entry) => {
      if (!entry || typeof entry !== "object") return null;
      const record = entry as Record<string, unknown>;
      const name =
        typeof record.name === "string" && record.name.trim()
          ? record.name.trim()
          : typeof record.path === "string" && record.path.trim()
            ? record.path.trim().split("/").at(-1) ?? "CodeFile"
            : "CodeFile";
      const exports = Array.isArray(record.exports)
        ? record.exports.filter((value): value is string => typeof value === "string")
        : [];
      return {
        id: typeof record.id === "string" ? record.id : undefined,
        name,
        path: typeof record.path === "string" ? record.path : undefined,
        exports: exports.length > 0 ? exports : undefined,
        isDefaultExport:
          typeof record.isDefaultExport === "boolean"
            ? record.isDefaultExport
            : undefined,
        insertURL:
          typeof record.insertURL === "string" ? record.insertURL : undefined,
        source: typeof record.source === "string" ? record.source : undefined,
      } satisfies FramerCodeFile;
    })
    .filter(Boolean) as FramerCodeFile[];

  return unique(normalized, (entry) => entry.id ?? `${entry.name}:${entry.path ?? ""}`);
}

function readFonts(input: BuildIrInput): FramerFont[] {
  const pluginFonts = Array.isArray(input.pluginCapture.context?.fonts)
    ? input.pluginCapture.context.fonts
        .map((entry) => {
          if (!entry || typeof entry !== "object") return null;
          const record = entry as Record<string, unknown>;
          const family =
            typeof record.family === "string" && record.family.trim()
              ? record.family.trim()
              : typeof record.name === "string" && record.name.trim()
                ? record.name.trim()
                : undefined;
          if (!family) return null;
          return {
            id: typeof record.id === "string" ? record.id : undefined,
            name:
              typeof record.name === "string" && record.name.trim()
                ? record.name.trim()
                : family,
            family,
            source: "plugin" as const,
            weight:
              typeof record.weight === "string" ? record.weight : undefined,
            style: typeof record.style === "string" ? record.style : undefined,
          } satisfies FramerFont;
        })
        .filter(isNonNullable)
    : [];

  const runtimeFonts = unique(
    input.runtimeCapture.nodes
      .map((node) => node.styles.fontFamily?.trim())
      .filter((value): value is string => Boolean(value))
      .map((family) => ({
        name: firstFontFamily(family),
        family,
        source: "runtime" as const,
      })),
    (entry) => entry.family,
  );

  return unique([...pluginFonts, ...runtimeFonts], (entry) => entry.family);
}

function readCmsCollections(
  pluginCapture: PluginCanvasCapture,
): FramerCmsCollection[] {
  const contextCollections = Array.isArray(pluginCapture.context?.cmsCollections)
    ? pluginCapture.context.cmsCollections
    : [];

  const normalized = contextCollections
    .map((entry) => {
      if (!entry || typeof entry !== "object") return null;
      const record = entry as Record<string, unknown>;
      const rawFields = Array.isArray(record.fields) ? record.fields : [];
      const rawItems = Array.isArray(record.items) ? record.items : [];
      const pluginData =
        record.pluginData && typeof record.pluginData === "object"
          ? (record.pluginData as Record<string, unknown>)
          : undefined;

      const fields: FramerCmsCollection["fields"] = rawFields
        .map((field) => {
          if (!field || typeof field !== "object") return null;
          const fieldRecord = field as Record<string, unknown>;
          const id =
            typeof fieldRecord.id === "string" && fieldRecord.id.trim()
              ? fieldRecord.id.trim()
              : undefined;
          const name =
            typeof fieldRecord.name === "string" && fieldRecord.name.trim()
              ? fieldRecord.name.trim()
              : undefined;
          const type =
            typeof fieldRecord.type === "string" && fieldRecord.type.trim()
              ? fieldRecord.type.trim()
              : undefined;
          if (!id || !name || !type) return null;
          return {
            id,
            name,
            type,
            userEditable:
              typeof fieldRecord.userEditable === "boolean"
                ? fieldRecord.userEditable
                : undefined,
            collectionId:
              typeof fieldRecord.collectionId === "string"
                ? fieldRecord.collectionId
                : undefined,
            cases: Array.isArray(fieldRecord.cases)
              ? fieldRecord.cases
                  .map((value) => {
                    if (!value || typeof value !== "object") return null;
                    const caseRecord = value as Record<string, unknown>;
                    if (
                      typeof caseRecord.id === "string" &&
                      typeof caseRecord.name === "string"
                    ) {
                      return { id: caseRecord.id, name: caseRecord.name };
                    }
                    return null;
                  })
                  .filter(Boolean) as Array<{ id: string; name: string }>
              : undefined,
          };
        })
        .filter(isNonNullable);

      const items: FramerCmsCollectionItem[] = rawItems
        .map((item) => {
          if (!item || typeof item !== "object") return null;
          const itemRecord = item as Record<string, unknown>;
          const id =
            typeof itemRecord.id === "string" && itemRecord.id.trim()
              ? itemRecord.id.trim()
              : undefined;
          if (!id) return null;
          const fieldData =
            itemRecord.fieldData && typeof itemRecord.fieldData === "object"
              ? (itemRecord.fieldData as Record<string, unknown>)
              : {};
          return {
            id,
            slug:
              typeof itemRecord.slug === "string" ? itemRecord.slug : undefined,
            draft:
              typeof itemRecord.draft === "boolean"
                ? itemRecord.draft
                : undefined,
            fieldKeys: Object.keys(fieldData),
            fieldData,
          };
        })
        .filter(isNonNullable);

      const id =
        typeof record.id === "string" && record.id.trim()
          ? record.id.trim()
          : undefined;
      const name =
        typeof record.name === "string" && record.name.trim()
          ? record.name.trim()
          : undefined;
      if (!id || !name) return null;

      return {
        id,
        name,
        managed:
          typeof record.managed === "boolean" ? record.managed : undefined,
        pluginData:
          pluginData && Object.keys(pluginData).length > 0
            ? Object.fromEntries(
                Object.entries(pluginData).filter(
                  (entry): entry is [string, string] =>
                    typeof entry[0] === "string" &&
                    entry[0].trim().length > 0 &&
                    typeof entry[1] === "string",
                ),
              )
            : undefined,
        pluginDataKeys: pluginData ? Object.keys(pluginData) : undefined,
        itemIds: Array.isArray(record.itemIds)
          ? record.itemIds.filter(
              (itemId): itemId is string =>
                typeof itemId === "string" && itemId.trim().length > 0,
            )
          : undefined,
        fields,
        items: items.length > 0 ? items : undefined,
      } satisfies FramerCmsCollection;
    })
    .filter(Boolean) as FramerCmsCollection[];

  return unique(normalized, (entry) => entry.id);
}

function isNonNullable<T>(value: T | null | undefined): value is T {
  return value != null;
}

function firstFontFamily(value: string) {
  return value
    .split(",")[0]
    ?.replace(/^["']|["']$/g, "")
    .trim() || value.trim();
}

function buildFramerTree(pluginCapture: PluginCanvasCapture): FramerTreeNode[] {
  const contextTree = Array.isArray(pluginCapture.context?.framerTree)
    ? pluginCapture.context!.framerTree!
    : [];
  if (contextTree.length > 0) return contextTree;

  return pluginCapture.selectedNodes.map((node, index) => {
    const metadata =
      node.metadata && typeof node.metadata === "object"
        ? (node.metadata as Record<string, unknown>)
        : {};
    const traits = asRecord(metadata.traits) ?? {};
    const styles = asStringRecord(metadata.styles);
    const component = asRecord(metadata.component);
    const childIds = Array.isArray(metadata.childIds)
      ? metadata.childIds.filter((id): id is string => typeof id === "string")
      : [];

    return {
      id: node.id ?? `plugin-node-${index + 1}`,
      type: node.type ?? "UnknownNode",
      name: node.name,
      text: node.text,
      parentId:
        typeof metadata.parentId === "string" ? metadata.parentId : undefined,
      childIds,
      depth: typeof metadata.depth === "number" ? metadata.depth : 0,
      path:
        typeof metadata.path === "string" ? metadata.path : String(index + 1),
      rootId: typeof metadata.rootId === "string" ? metadata.rootId : undefined,
      rootName:
        typeof metadata.rootName === "string" ? metadata.rootName : undefined,
      rootKind:
        metadata.rootKind === "page" ||
        metadata.rootKind === "component" ||
        metadata.rootKind === "canvas-root"
          ? metadata.rootKind
          : undefined,
      rect: node.bounds,
      traits,
      styles,
      asset:
        typeof metadata.src === "string"
          ? {
              kind: "image",
              src: metadata.src,
              alt:
                typeof metadata.alt === "string" ? metadata.alt : undefined,
            }
          : undefined,
      component: component
        ? {
            id: typeof component.id === "string" ? component.id : undefined,
            name:
              typeof component.name === "string"
                ? component.name
                : node.name ?? "FramerComponent",
            source:
              component.source === "component-instance" ||
              component.source === "component-node" ||
              component.source === "selected-component" ||
              component.source === "code-file-export"
                ? component.source
                : undefined,
            insertURL:
              typeof component.insertURL === "string"
                ? component.insertURL
                : "",
            componentIdentifier:
              typeof component.componentIdentifier === "string"
                ? component.componentIdentifier
                : undefined,
            componentName:
              typeof component.componentName === "string"
                ? component.componentName
                : undefined,
            controls: asRecord(component.controls),
            typedControls: asRecord(component.typedControls),
          }
        : undefined,
    };
  });
}

function asRecord(value: unknown): Record<string, unknown> | undefined {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return undefined;
  }
  return value as Record<string, unknown>;
}

function asStringRecord(value: unknown) {
  const record = asRecord(value);
  if (!record) return {};
  const output: Record<string, string> = {};
  for (const [key, entry] of Object.entries(record)) {
    if (typeof entry === "string") output[key] = entry;
  }
  return output;
}

function buildExportTree(
  framerTree: FramerTreeNode[],
  runtimeCapture: RuntimeCapture,
  matches: NodeMatch[],
): ExportTreeNode[] {
  const runtimeByDomPath = new Map(
    runtimeCapture.nodes.map((node) => [node.domPath, node] as const),
  );
  const matchByPluginId = new Map(
    matches
      .filter((match) => match.framerNodeId)
      .map((match) => [match.framerNodeId!, match] as const),
  );
  const pluginById = new Map(framerTree.map((node) => [node.id, node] as const));
  const childIdsByParent = new Map<string, string[]>();

  for (const node of framerTree) {
    if (!node.parentId) continue;
    childIdsByParent.set(node.parentId, [
      ...(childIdsByParent.get(node.parentId) ?? []),
      node.id,
    ]);
  }

  const rootPluginNodes = framerTree.filter(
    (node) => !node.parentId || !pluginById.has(node.parentId),
  );
  const usedRuntimeDomPaths = new Set<string>();

  const buildNode = (pluginNode: FramerTreeNode): ExportTreeNode => {
    const match = matchByPluginId.get(pluginNode.id);
    const runtimeNode = match?.domPath
      ? runtimeByDomPath.get(match.domPath)
      : undefined;
    if (match?.domPath) usedRuntimeDomPaths.add(match.domPath);
    const viewportSnapshots = collectViewportSnapshots(
      runtimeCapture,
      match?.domPath,
    );
    const childIds = childIdsByParent.get(pluginNode.id) ?? pluginNode.childIds;
    const children = childIds
      .map((childId) => pluginById.get(childId))
      .filter(Boolean)
      .map((child) => buildNode(child!));

    return {
      id: pluginNode.id,
      parentId: pluginNode.parentId,
      childIds: children.map((child) => child.id),
      name: pluginNode.name ?? runtimeNode?.sectionName,
      text: pluginNode.text ?? runtimeNode?.text,
      kind: inferExportTreeKind(pluginNode, runtimeNode),
      tag: runtimeNode?.tag ?? inferTagFromPluginNode(pluginNode),
      rect: runtimeNode?.rect ?? pluginNode.rect,
      rectByViewport: viewportSnapshots.rectByViewport,
      styles: {
        ...pluginNode.styles,
        ...(runtimeNode?.styles ?? {}),
      },
      stylesByViewport: viewportSnapshots.stylesByViewport,
      motion: runtimeNode?.motion,
      motionByViewport: viewportSnapshots.motionByViewport,
      interactionStyles: runtimeNode?.interactionStyles,
      interactionStylesByViewport: viewportSnapshots.interactionStylesByViewport,
      attributes: {
        src: runtimeNode?.attributes.src ?? pluginNode.asset?.src,
        href: runtimeNode?.attributes.href,
        alt: runtimeNode?.attributes.alt ?? pluginNode.asset?.alt,
        role: runtimeNode?.attributes.role,
        className: runtimeNode?.attributes.className,
        dataFramerName: runtimeNode?.attributes.dataFramerName,
      },
      source: {
        pluginNodeId: pluginNode.id,
        runtimeNodeId: runtimeNode?.id,
        domPath: runtimeNode?.domPath,
        matchConfidence: match?.confidence,
        runtimeNodeIdsByViewport: viewportSnapshots.runtimeNodeIdsByViewport,
      },
      children,
    };
  };

  const pluginRoots = rootPluginNodes.map(buildNode);
  const unmatchedRuntimeRoots = runtimeCapture.nodes
    .filter((runtimeNode) => !usedRuntimeDomPaths.has(runtimeNode.domPath))
    .filter((runtimeNode) => isLikelyRuntimeRoot(runtimeNode))
    .slice(0, 40)
    .map((runtimeNode, index) => ({
      id: `runtime-root-${index + 1}`,
      childIds: [],
      name: runtimeNode.sectionName,
      text: runtimeNode.text,
      kind: inferRuntimeKind(runtimeNode),
      tag: runtimeNode.tag,
      rect: runtimeNode.rect,
      rectByViewport: collectViewportSnapshots(
        runtimeCapture,
        runtimeNode.domPath,
      ).rectByViewport,
      styles: { ...runtimeNode.styles },
      stylesByViewport: collectViewportSnapshots(
        runtimeCapture,
        runtimeNode.domPath,
      ).stylesByViewport,
      motion: runtimeNode.motion,
      motionByViewport: collectViewportSnapshots(
        runtimeCapture,
        runtimeNode.domPath,
      ).motionByViewport,
      interactionStyles: runtimeNode.interactionStyles,
      interactionStylesByViewport: collectViewportSnapshots(
        runtimeCapture,
        runtimeNode.domPath,
      ).interactionStylesByViewport,
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
        runtimeNodeIdsByViewport: collectViewportSnapshots(
          runtimeCapture,
          runtimeNode.domPath,
        ).runtimeNodeIdsByViewport,
      },
      children: [],
    }));

  return [...pluginRoots, ...unmatchedRuntimeRoots];
}

function collectViewportSnapshots(
  runtimeCapture: RuntimeCapture,
  domPath?: string,
) {
  const rectByViewport: Partial<Record<ViewportName, RuntimeNode["rect"]>> = {};
  const stylesByViewport: Partial<Record<ViewportName, Record<string, string>>> =
    {};
  const motionByViewport: Partial<Record<ViewportName, NonNullable<RuntimeNode["motion"]>>> =
    {};
  const interactionStylesByViewport: Partial<
    Record<ViewportName, NonNullable<RuntimeNode["interactionStyles"]>>
  > = {};
  const runtimeNodeIdsByViewport: Partial<Record<ViewportName, string>> = {};

  if (!domPath) {
    return {
      rectByViewport,
      stylesByViewport,
      motionByViewport,
      interactionStylesByViewport,
      runtimeNodeIdsByViewport,
    };
  }

  const nodesByViewport = runtimeCapture.nodesByViewport ?? {};
  for (const [viewportName, nodes] of Object.entries(nodesByViewport)) {
    const matchedNode = nodes?.find((node) => node.domPath === domPath);
    if (!matchedNode) continue;
    rectByViewport[viewportName as keyof typeof rectByViewport] = matchedNode.rect;
    stylesByViewport[viewportName as keyof typeof stylesByViewport] = {
      ...matchedNode.styles,
    };
    if (matchedNode.motion) {
      motionByViewport[viewportName as keyof typeof motionByViewport] = {
        ...matchedNode.motion,
      };
    }
    if (matchedNode.interactionStyles) {
      interactionStylesByViewport[
        viewportName as keyof typeof interactionStylesByViewport
      ] = {
        ...(matchedNode.interactionStyles.hover
          ? { hover: { ...matchedNode.interactionStyles.hover } }
          : {}),
        ...(matchedNode.interactionStyles.focus
          ? { focus: { ...matchedNode.interactionStyles.focus } }
          : {}),
      };
    }
    runtimeNodeIdsByViewport[viewportName as keyof typeof runtimeNodeIdsByViewport] =
      matchedNode.id;
  }

  return {
    rectByViewport,
    stylesByViewport,
    motionByViewport,
    interactionStylesByViewport,
    runtimeNodeIdsByViewport,
  };
}

function inferExportTreeKind(
  pluginNode: FramerTreeNode,
  runtimeNode?: RuntimeNode,
): ExportTreeNode["kind"] {
  if (pluginNode.asset?.kind === "image" || runtimeNode?.tag === "img") {
    return "image";
  }
  if (runtimeNode?.tag === "a") return "link";
  if (runtimeNode?.tag === "button") return "button";
  if (pluginNode.type === "SVGNode") return "svg";
  if (pluginNode.type === "ComponentNode") return "component";
  if (pluginNode.type === "TextNode") return "text";
  if (pluginNode.type === "FrameNode") return "frame";
  return "unknown";
}

function inferRuntimeKind(runtimeNode: RuntimeNode): ExportTreeNode["kind"] {
  if (runtimeNode.tag === "img") return "image";
  if (runtimeNode.tag === "a") return "link";
  if (runtimeNode.tag === "button") return "button";
  if (runtimeNode.text) return "text";
  return "frame";
}

function inferTagFromPluginNode(pluginNode: FramerTreeNode) {
  if (pluginNode.asset?.kind === "image") return "img";
  if (pluginNode.type === "TextNode") return "p";
  if (pluginNode.type === "SVGNode") return "svg";
  if (pluginNode.type === "ComponentNode") return "section";
  return "div";
}

function isLikelyRuntimeRoot(node: RuntimeNode) {
  return (
    node.rect.width > 120 &&
    node.rect.height > 80 &&
    (Boolean(node.sectionName) ||
      Boolean(node.styles.backgroundColor) ||
      node.tag === "section" ||
      node.tag === "main")
  );
}

function summarizeExportTree(
  exportTree: ExportTreeNode[],
  runtimeCapture: RuntimeCapture,
): NonNullable<ExportIR["exportTreeDiagnostics"]> {
  const flattened = flattenExportTree(exportTree);
  const matchedRuntimePaths = new Set(
    flattened
      .map((node) => node.source.domPath)
      .filter((value): value is string => typeof value === "string"),
  );

  return {
    totalNodes: flattened.length,
    pluginBackedNodes: flattened.filter((node) => node.source.pluginNodeId).length,
    runtimeMatchedNodes: flattened.filter((node) => node.source.runtimeNodeId).length,
    unmatchedRuntimeNodes: runtimeCapture.nodes.filter(
      (node) => !matchedRuntimePaths.has(node.domPath),
    ).length,
    breakpointsWithSnapshots:
      runtimeCapture.captureDiagnostics?.breakpointsCaptured ?? ["desktop"],
  };
}

function flattenExportTree(nodes: ExportTreeNode[]): ExportTreeNode[] {
  return nodes.flatMap((node) => [node, ...flattenExportTree(node.children)]);
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
    if (!usefulTags.has(node.tag) && !isVisualSurfaceNode(node)) {
      continue;
    }

    if (isVisualSurfaceNode(node)) {
      selected.push(node);
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

function isVisualSurfaceNode(node: RuntimeNode) {
  if (node.text?.trim()) return false;
  if (node.tag === "img" || node.tag === "a" || node.tag === "button") {
    return false;
  }
  return Boolean(
    node.styles.backgroundColor ||
      node.styles.backgroundImage ||
      node.styles.border ||
      node.styles.borderRadius ||
      node.styles.boxShadow,
  );
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

function toRouteSegment(value: string) {
  const segment = slugify(value, { lower: true, strict: true });
  return segment || "page";
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
