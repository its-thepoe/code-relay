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

export type RuntimeInteractionReplayRecord = {
  id: string;
  routePath?: string;
  viewport: ViewportName;
  action:
    | "click"
    | "keyboard-enter"
    | "blocked-click"
    | "blocked-keyboard-enter";
  target: {
    tag: string;
    text?: string;
    role?: string;
    name?: string;
  };
  allowed: boolean;
  blockedReason?: string;
  beforeDomSignature: string;
  afterDomSignature?: string;
  beforeComputedStyles: Record<string, string>;
  afterComputedStyles?: Record<string, string>;
  beforeScreenshotPath?: string;
  afterScreenshotPath?: string;
  urlChanged: boolean;
  networkActivity: {
    totalRequests: number;
    fetchRequests: number;
    xhrRequests: number;
    documentRequests: number;
    blockedRequests: number;
    blockedNavigationRequests: number;
    blockedMutationRequests: number;
  };
  consoleErrors: string[];
  animationSamples: {
    before: Record<string, string>;
    after?: Record<string, string>;
  };
  stateChanged: boolean;
  provenance: "runtime";
};

export type RouteCapturePhaseName =
  | "navigate"
  | "stabilize"
  | "capture-desktop"
  | "capture-laptop"
  | "capture-tablet"
  | "capture-mobile"
  | "extract-dom"
  | "extract-stylesheets"
  | "interaction-replay"
  | "route-finalize";

export type RouteCapturePhaseStatus =
  | "pending"
  | "running"
  | "completed"
  | "failed"
  | "skipped"
  | "reused";

export type RouteCaptureEvidenceClass =
  | "screenshot-backed"
  | "heuristic-backed"
  | "dom-backed"
  | "replay-backed"
  | "redirect-backed"
  | "invalid";

export type RouteCapturePhaseRecord = {
  phase: RouteCapturePhaseName;
  routePath?: string;
  required: boolean;
  status: RouteCapturePhaseStatus;
  startedAt?: string;
  finishedAt?: string;
  durationMs?: number;
  viewportName?: ViewportName;
  detail?: string;
  reuseKind?: "fresh" | "reused" | "retried";
};

export type RouteCaptureProgressSummary = {
  routePath: string;
  status: "fresh" | "reused" | "retried" | "failed";
  evidenceClasses: RouteCaptureEvidenceClass[];
  capturedViewports: ViewportName[];
  warningCount: number;
  failedPhase?: RouteCapturePhaseName;
  failedReason?: string;
  reusedFromCache?: boolean;
  reusedFromProgress?: boolean;
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
  redirectTo?: string;
  redirectStatus?: number;
  viewports: Record<
    ViewportName,
    {
      screenshotPath: string;
      width: number;
      height: number;
      requested?: {
        width: number;
        height: number;
      };
      observed?: {
        innerWidth: number;
        innerHeight: number;
        clientWidth: number;
        devicePixelRatio: number;
      };
      valid?: boolean;
    }
  >;
  nodes: RuntimeNode[];
  nodesByViewport?: Partial<Record<ViewportName, RuntimeNode[]>>;
  rootStyles?: Record<string, string>;
  rootStylesByViewport?: Partial<
    Record<ViewportName, Record<string, string>>
  >;
  captureDiagnostics?: {
    breakpointsCaptured: ViewportName[];
    viewportValidation?: Partial<
      Record<
        ViewportName,
        {
          requestedWidth: number;
          requestedHeight: number;
          observedBeforeInnerWidth: number | undefined;
          observedBeforeInnerHeight: number | undefined;
          observedBeforeClientWidth: number | undefined;
          observedInnerWidth: number;
          observedInnerHeight: number;
          observedClientWidth: number;
          screenshotWidth: number;
          screenshotHeight: number;
          screenshotAttempts: number | undefined;
          valid: boolean;
          reason?: string;
        }
      >
    >;
    fontReadiness?: Partial<Record<ViewportName, boolean>>;
    stylesheetCount?: Partial<Record<ViewportName, number>>;
    nodeCount?: Partial<Record<ViewportName, number>>;
    routeFailures?: Array<{
      routePath: string;
      error: string;
      phase?: RouteCapturePhaseName;
      required?: boolean;
      reused?: boolean;
    }>;
    phaseHistory?: RouteCapturePhaseRecord[];
    routeProgress?: RouteCaptureProgressSummary[];
  };
  interactionReplay?: RuntimeInteractionReplayRecord[];
  framerStyleCss?: string;
  stylesheetUrls?: string[];
  routeCaptures?: RuntimeRouteCapture[];
};

export type ExportRouteKind = "page" | "redirect";
export type ExportRouteTemplate = "static" | "cms";
export type ExportRouteDestinationKind = "internal" | "external";

export type RuntimeRouteCapture = Omit<RuntimeCapture, "routeCaptures"> & {
  routePath: string;
  templateId?: string;
  templatePath?: string;
  routeKind?: ExportRouteKind;
  template?: ExportRouteTemplate;
  templateKind?: "static" | "cms" | "component" | "redirect" | "utility";
  destination?: string;
  destinationKind?: ExportRouteDestinationKind;
  redirectTo?: string;
  redirectStatus?: number;
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
  isVariant?: boolean;
  isPrimaryVariant?: boolean;
  gesture?: string;
  inheritsFromId?: string;
  breakpoint?: string;
  variantName?: string;
  controls?: Record<string, unknown>;
  typedControls?: Record<string, unknown>;
};

export type FramerCodeFile = {
  id?: string;
  name: string;
  path?: string;
  versionId?: string;
  exports?: string[];
  exportDetails?: Array<{
    name?: string;
    type?: string;
    insertURL?: string;
    isDefaultExport?: boolean;
    componentIdentifier?: string;
    componentName?: string;
    isVariant?: boolean;
    isPrimaryVariant?: boolean;
    gesture?: string;
    inheritsFromId?: string;
    breakpoint?: string;
    variantName?: string;
  }>;
  isDefaultExport?: boolean;
  insertURL?: string;
  source?: string;
  content?: string;
  contentHash?: string;
  contentByteLength?: number;
  hasContent?: boolean;
};

export type FramerComponentFamily = {
  id: string;
  name: string;
  primaryVariantId: string;
  variants: Array<{
    id: string;
    name: string;
    gesture?: string;
    inheritsFromId?: string;
    breakpoint?: string;
    variantName?: string;
    codeFileId?: string;
  }>;
  instances: Array<{
    nodeId: string;
    routePath?: string;
    controls?: Record<string, unknown>;
    initialVariantId?: string;
  }>;
  transitions: Array<{
    fromVariantId: string;
    toVariantId?: string;
    trigger?: string;
    confidence: number;
    provenance: "plugin" | "runtime" | "source" | "merged";
  }>;
  provenance: "plugin" | "runtime" | "source" | "merged";
};

export type FramerOverrideAssignment = {
  id: string;
  codeFileId?: string;
  codeFileName?: string;
  exportName: string;
  exportType: "override";
  source: "plugin";
  insertURL?: string;
  targetNodeId?: string;
  targetComponentId?: string;
  affectedProps?: string[];
  dependencyNames?: string[];
  assignmentStatus: "resolved" | "unresolved";
  assignmentConfidence: number;
  unresolvedReason?: string;
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
  publishedUrl?: string | null;
  publishInfo?: {
    production?: {
      url?: string | null;
    } | null;
    staging?: {
      url?: string | null;
    } | null;
  } | null;
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
  captureDiagnostics?: PluginCaptureDiagnostics;
};

export type PluginCaptureRootSummary = {
  rootId: string;
  rootName?: string;
  rootKind: "page" | "component" | "canvas-root";
  capturedCount: number;
  stoppedBecause?: "complete" | "limit" | "read-failure" | "unknown";
};

export type PluginCaptureDiagnostics = {
  captureSource?: "full-site" | "component-catalog" | "canvas-selection";
  totalMaxNodes?: number;
  maxNodesPerRoot?: number;
  capturedNodeCount: number;
  truncated: boolean;
  truncatedRootIds: string[];
  rootSummaries: PluginCaptureRootSummary[];
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
  componentFamilies?: FramerComponentFamily[];
  overrideAssignments?: FramerOverrideAssignment[];
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
    templateId?: string;
    templatePath?: string;
    routeKind?: ExportRouteKind;
    template?: ExportRouteTemplate;
    templateKind?: "static" | "cms" | "component" | "redirect" | "utility";
    destination?: string;
    destinationKind?: ExportRouteDestinationKind;
    redirectTo?: string;
    redirectStatus?: number;
  }>;
  routeTemplates?: Array<{
    templateId: string;
    templatePath: string;
    templateKind: "static" | "cms" | "component" | "redirect" | "utility";
    representativeRoutePath: string;
    routePaths: string[];
    routeCount: number;
    sourceTextLength: number;
    nodeCount: number;
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

export type FidelityEvidenceMode = "screenshot-backed" | "heuristic";

export type FidelityEvidence = {
  mode: FidelityEvidenceMode;
  reason: string;
  sourceScreenshotViewports: ViewportName[];
  generatedScreenshotViewports: ViewportName[];
  comparedViewports: ViewportName[];
  previewValidationStatus?: PreviewValidationResult["status"];
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
  fidelityEvidence?: FidelityEvidence;
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

export type ArtifactStatus = "complete" | "failed";

export type ArtifactRecord = {
  id: string;
  artifactType: string;
  schemaVersion: number;
  hash: string;
  sourceFingerprint: string;
  dependencyArtifactIds: string[];
  dependencyHashes: string[];
  dependsOn?: string[];
  path: string;
  byteSize: number;
  status: ArtifactStatus;
  routePath?: string;
  templateId?: string;
  componentId?: string;
  codeFileId?: string;
  viewport?: ViewportName;
  createdAt?: string;
};

export type ArtifactIndex = {
  schemaVersion: number;
  generatedAt: string;
  revisionId?: string;
  sourceFingerprint: string;
  fileCount: number;
  entries: ArtifactRecord[];
};

export type ArtifactReference = {
  id: string;
  artifactType: string;
  hash: string;
  path: string;
};

export type ArtifactInvalidation = {
  artifact: string;
  reason: string;
  dependsOn?: string[];
};

export type ExportRevisionRecord = {
  revisionId: string;
  schemaVersion: number;
  sourceFingerprint: string;
  pluginFingerprint?: string;
  artifactGraphHash?: string;
  status: "queued" | "planning" | "capturing" | "generating" | "validating" | "completed" | "failed";
  parentRevisionId?: string | null;
  revisionRequest?: {
    kind?: "initial" | "improvement";
    requestedFocus?: "responsiveness" | "components" | "both" | "revalidate";
    parentJobId?: string;
    parentRevisionId?: string;
  } | null;
  summary: Record<string, unknown>;
  sourceEvidence?: Record<string, unknown> | null;
  sourceArtifacts?: Record<string, unknown> | null;
  responsiveRecapturePlan?: Record<string, unknown> | null;
  generatedValidation?: Record<string, unknown> | null;
  reusedArtifactIds?: string[];
  invalidatedArtifacts?: ArtifactInvalidation[];
  parentInfoPath?: string | null;
  createdAt?: string;
  updatedAt?: string;
};
