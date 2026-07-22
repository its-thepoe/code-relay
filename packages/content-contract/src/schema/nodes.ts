import type { Completeness, EvidenceRef, Provenanced, ViewportName } from "./common.js";

export type CanonicalNode = {
  id: string;
  parentId?: string;
  childIds: string[];
  routeIds: string[];
  tag?: Provenanced<string>;
  role?: Provenanced<string>;
  text?: Provenanced<string>;
  attributes: Record<string, string>;
  geometryByViewport: Partial<Record<ViewportName, Record<string, number>>>;
  computedStylesByViewport: Partial<Record<ViewportName, Record<string, string>>>;
  assetIds: string[];
  editorNodeId?: string;
  runtimeDomPaths: string[];
  componentInstanceId?: string;
  cmsBindingIds: string[];
  interactionIds: string[];
  completeness: Completeness;
  evidence: EvidenceRef[];
};

export type CanonicalNodesShard = {
  nodes: CanonicalNode[];
};
