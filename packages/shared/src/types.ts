export type ViewportName = "desktop" | "laptop" | "tablet" | "mobile";

export type Rect = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type MotionStyles = {
  transitionProperty?: string;
  transitionDuration?: string;
  transitionTimingFunction?: string;
  transitionDelay?: string;
  animationName?: string;
  animationDuration?: string;
  animationTimingFunction?: string;
  animationDelay?: string;
  animationIterationCount?: string;
  animationDirection?: string;
  animationFillMode?: string;
  transformOrigin?: string;
};

export type InteractionStateStyles = {
  hover?: Record<string, string>;
  focus?: Record<string, string>;
};

export type RuntimeNode = {
  id: string;
  routePath?: string;
  tag: string;
  domPath: string;
  parentDomPath?: string;
  text?: string;
  rect: Rect;
  sectionIndex?: number;
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
  motion?: MotionStyles;
  interactionStyles?: InteractionStateStyles;
};

export type RuntimeCapture = {
  url: string;
  title: string;
  mode: "page" | "section";
  viewports: Record<
    ViewportName,
    {
      screenshotPath: string;
      width: number;
      height: number;
    }
  >;
  nodes: RuntimeNode[];
  nodesByViewport?: Partial<Record<ViewportName, RuntimeNode[]>>;
  captureDiagnostics?: {
    breakpointsCaptured: ViewportName[];
    fontReadiness?: Partial<Record<ViewportName, boolean>>;
    stylesheetCount?: Partial<Record<ViewportName, number>>;
    nodeCount?: Partial<Record<ViewportName, number>>;
  };
  framerStyleCss?: string;
  stylesheetUrls?: string[];
  routeCaptures?: RuntimeRouteCapture[];
};

export type RuntimeRouteCapture = Omit<RuntimeCapture, "routeCaptures"> & {
  routePath: string;
};

export type ExportMode = "selection" | "components" | "full-site";
export type CaptureMode = "runtime-first" | "plugin-only";
export type ExportEngine =
  | "component-module"
  | "page-node-tree"
  | "published-runtime"
  | "hybrid"
  | "plugin-approximation";

export type FramerComponentModule = {
  id?: string;
  name: string;
  source:
    | "component-node"
    | "component-instance"
    | "code-file-export"
    | "selected-component";
  insertURL: string;
  componentIdentifier?: string;
  componentName?: string;
  codeFileId?: string;
  codeFileName?: string;
  isDefaultExport?: boolean;
  controls?: Record<string, unknown>;
  typedControls?: Record<string, unknown>;
};

export type FramerCodeFile = {
  id?: string;
  name: string;
  path?: string;
  exports?: string[];
  isDefaultExport?: boolean;
  insertURL?: string;
  source?: string;
};

export type FramerFont = {
  id?: string;
  name: string;
  family: string;
  source?: "plugin" | "runtime";
  weight?: string;
  style?: string;
};

export type FramerCmsCollectionField = {
  id: string;
  name: string;
  type: string;
  userEditable?: boolean;
  collectionId?: string;
  cases?: Array<{ id: string; name: string }>;
};

export type FramerCmsCollectionItem = {
  id: string;
  slug?: string;
  draft?: boolean;
  fieldKeys: string[];
  fieldData?: Record<string, unknown>;
};

export type FramerCmsCollection = {
  id: string;
  name: string;
  managed?: boolean;
  pluginData?: Record<string, string>;
  pluginDataKeys?: string[];
  itemIds?: string[];
  fields: FramerCmsCollectionField[];
  items?: FramerCmsCollectionItem[];
};

export type FramerTreeNode = {
  id: string;
  type: string;
  name?: string;
  text?: string;
  parentId?: string;
  childIds: string[];
  depth: number;
  path: string;
  rootId?: string;
  rootName?: string;
  rootKind?: "page" | "component" | "canvas-root";
  rect?: Rect;
  traits: Record<string, unknown>;
  styles: Record<string, string>;
  asset?: {
    kind: "image" | "svg";
    src?: string;
    alt?: string;
    svg?: string;
  };
  component?: Omit<FramerComponentModule, "source"> & {
    source?: FramerComponentModule["source"];
  };
};

export type ExportTreeNode = {
  id: string;
  parentId?: string;
  childIds: string[];
  name?: string;
  text?: string;
  kind:
    | "frame"
    | "text"
    | "image"
    | "svg"
    | "component"
    | "link"
    | "button"
    | "unknown";
  tag: string;
  rect?: Rect;
  rectByViewport?: Partial<Record<ViewportName, Rect>>;
  styles: Record<string, string>;
  stylesByViewport?: Partial<Record<ViewportName, Record<string, string>>>;
  motion?: MotionStyles;
  motionByViewport?: Partial<Record<ViewportName, MotionStyles>>;
  interactionStyles?: InteractionStateStyles;
  interactionStylesByViewport?: Partial<Record<ViewportName, InteractionStateStyles>>;
  attributes: Record<string, string | boolean | number | undefined>;
  source: {
    pluginNodeId?: string;
    runtimeNodeId?: string;
    domPath?: string;
    matchConfidence?: number;
    runtimeNodeIdsByViewport?: Partial<Record<ViewportName, string>>;
  };
  children: ExportTreeNode[];
};

export type PluginContextSnapshot = {
  pluginMode?: string;
  exportMode?: ExportMode;
  captureMode?: CaptureMode;
  exportEngine?: ExportEngine;
  project?: {
    id?: string;
    name?: string;
  };
  selectionSnapshot?: Array<Record<string, unknown>>;
  selectedComponents?: Array<Record<string, unknown>>;
  sitePages?: Array<Record<string, unknown>>;
  framerTree?: FramerTreeNode[];
  componentModules?: FramerComponentModule[];
  codeFiles?: Array<Record<string, unknown>>;
  cmsCollections?: Array<Record<string, unknown>>;
  colorStyles?: Array<Record<string, unknown>>;
  textStyles?: Array<Record<string, unknown>>;
  fonts?: Array<Record<string, unknown>>;
  componentCount?: number;
  selectionCount?: number;
  permissions?: Record<string, unknown>;
  capabilities?: Record<string, unknown>;
};

export type PluginCanvasCapture = {
  mode: "simulated" | "canvas" | "framer-plugin";
  selectedNodes: Array<{
    id?: string;
    name?: string;
    type?: string;
    text?: string;
    bounds?: Rect;
    metadata?: Record<string, unknown>;
  }>;
  capturedAt: string;
  exportProps?: {
    heroTitle?: string;
    heroSubtitle?: string;
    ctaLabel?: string;
    ctaHref?: string;
  };
  context?: PluginContextSnapshot;
};

export type NodeMatch = {
  framerNodeId?: string;
  domPath?: string;
  confidence: number;
  matchReasons: Array<
    | "text"
    | "bounds"
    | "asset"
    | "hierarchy"
    | "style"
    | "type"
    | "tree-context"
  >;
};

export type ExportWarning = {
  type: string;
  severity: "info" | "warning" | "error";
  message: string;
};

export type AttemptDiagnosis = {
  category:
    | "initial_baseline"
    | "responsive_mismatch"
    | "layout_mismatch"
    | "asset_mismatch"
    | "low_node_match"
    | "typography_mismatch"
    | "motion_mismatch"
    | "low_overall_fidelity"
    | "plateau";
  message: string;
};

export type PatchOperation =
  | "baseline_strategy"
  | "enable_structured_layout"
  | "enable_compact_spacing"
  | "enable_aggressive_mobile_stacking"
  | "relax_image_aspect_ratio"
  | "preserve_wrapper_surfaces"
  | "reinforce_runtime_styles"
  | "promote_viewport_overrides"
  | "boost_typography_from_runtime"
  | "preserve_motion_styles"
  | "force_inline_styles";

export type ComparisonNodeDiagnostic = {
  nodeId: string;
  tag: string;
  sourceDomPath?: string;
  className: string;
  issueTypes: Array<
    "missing_node"
    | "typography"
    | "layout"
    | "color"
    | "surface"
    | "motion"
  >;
  propertyDiffs: Array<{
    property: string;
    source?: string;
    generated?: string;
  }>;
};

export type ComparisonDiagnostics = {
  viewport: ViewportName | "all";
  summary: {
    nodesCompared: number;
    missingNodes: number;
    typographyIssues: number;
    layoutIssues: number;
    colorIssues: number;
    surfaceIssues: number;
    motionIssues: number;
  };
  nodes: ComparisonNodeDiagnostic[];
  byViewport?: Partial<Record<ViewportName, ComparisonDiagnostics>>;
};

export type PatchPropertyHints = Partial<
  Record<
    PatchOperation,
    Record<string, Partial<Record<ViewportName, string[]>>>
  >
>;

export type ExportIR = {
  jobId: string;
  sourceUrl: string;
  componentName: string;
  exportMode?: ExportMode;
  captureMode?: CaptureMode;
  exportEngine?: ExportEngine;
  exportProps?: {
    heroTitle?: string;
    heroSubtitle?: string;
    ctaLabel?: string;
    ctaHref?: string;
  };
  runtimeCapture: RuntimeCapture;
  pluginCapture: PluginCanvasCapture;
  nodeMatches: NodeMatch[];
  component: {
    semanticType: "hero" | "section" | "grid" | "unknown";
    nodes: RuntimeNode[];
    sections: Array<{
      index: number;
      name: string;
      kind?: "hero" | "content" | "media-grid";
      confidence?: number;
      nodes: RuntimeNode[];
    }>;
  };
  assets: Array<{
    url: string;
    kind: "image" | "link";
    alt?: string;
  }>;
  framerTree?: FramerTreeNode[];
  exportTree?: ExportTreeNode[];
  componentModules?: FramerComponentModule[];
  codeFiles?: FramerCodeFile[];
  fonts?: FramerFont[];
  cmsCollections?: FramerCmsCollection[];
  libraryComponents?: Array<{
    componentName: string;
    nodes: RuntimeNode[];
    module?: FramerComponentModule;
  }>;
  sitePages?: Array<{
    componentName: string;
    routePath: string;
    title: string;
    nodes: RuntimeNode[];
    exportTree?: ExportTreeNode[];
    sourceTextLength?: number;
  }>;
  exportTreeDiagnostics?: {
    totalNodes: number;
    pluginBackedNodes: number;
    runtimeMatchedNodes: number;
    unmatchedRuntimeNodes: number;
    breakpointsWithSnapshots: ViewportName[];
  };
  warnings: ExportWarning[];
};

export type FidelityScores = {
  desktop: number;
  laptop?: number;
  tablet?: number;
  mobile: number;
  overall: number;
  layout: number;
  typography: number;
  color: number;
  assets: number;
  motion: number;
  nodeMatch: number;
  breakpointScores?: Partial<Record<ViewportName, number>>;
};

export type PreviewValidationViewportStats = {
  viewport: ViewportName;
  inspectedNodes: number;
  foundNodes: number;
  nodesWithNonDefaultStyles: number;
  nodesExpectingMotion: number;
  nodesWithNonDefaultMotion: number;
};

export type PreviewValidationResult = {
  status: "validated" | "blocked";
  reason?: string;
  summary: {
    viewportsValidated: number;
    inspectedNodes: number;
    foundNodes: number;
    nodesWithNonDefaultStyles: number;
    nodesExpectingMotion: number;
    nodesWithNonDefaultMotion: number;
  };
  byViewport?: Partial<Record<ViewportName, PreviewValidationViewportStats>>;
};

export type ExportAttemptResult = {
  id: string;
  attemptNumber: number;
  strategy: string;
  projectDir: string;
  fidelity: FidelityScores;
  warnings: ExportWarning[];
  rerunReason?: string;
  diagnosis?: string[];
  patchesApplied?: string[];
  diagnosisDetails?: AttemptDiagnosis[];
  patchOperations?: PatchOperation[];
  patchTargets?: Partial<Record<PatchOperation, string[]>>;
  patchPropertyHints?: PatchPropertyHints;
  comparisonDiagnostics?: ComparisonDiagnostics;
  previewValidation?: PreviewValidationResult;
  stopReason?: string;
  resetToBestStateForNextAttempt?: boolean;
};
