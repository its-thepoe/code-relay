export type ViewportName = "desktop" | "mobile";

export type Rect = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type RuntimeNode = {
  id: string;
  tag: string;
  domPath: string;
  text?: string;
  rect: Rect;
  sectionIndex?: number;
  sectionName?: string;
  attributes: {
    src?: string;
    href?: string;
    alt?: string;
    role?: string;
  };
  styles: Record<string, string>;
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
};

export type PluginContextSnapshot = {
  pluginMode?: string;
  project?: {
    id?: string;
    name?: string;
  };
  selectionSnapshot?: Array<Record<string, unknown>>;
  selectedComponents?: Array<Record<string, unknown>>;
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

export type ExportIR = {
  jobId: string;
  sourceUrl: string;
  componentName: string;
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
  warnings: ExportWarning[];
};

export type FidelityScores = {
  desktop: number;
  mobile: number;
  overall: number;
  layout: number;
  typography: number;
  color: number;
  assets: number;
  motion: number;
  nodeMatch: number;
};

export type ExportAttemptResult = {
  id: string;
  attemptNumber: number;
  strategy: string;
  projectDir: string;
  fidelity: FidelityScores;
  warnings: ExportWarning[];
  rerunReason?: string;
};
