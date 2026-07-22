import type { Completeness, Provenanced, ViewportName } from "./common.js";

export type CanonicalRoute = {
  id: string;
  path: string;
  aliases: string[];
  kind: "page" | "redirect" | "utility";
  templateKind: "static" | "cms" | "component" | "redirect" | "utility";
  templateId?: string;
  representativeRouteId?: string;
  parameterSchema?: Record<string, string>;
  redirect?: {
    to: string;
    status: number;
    kind: "internal" | "external" | "unknown";
  };
  seo?: {
    title?: Provenanced<string>;
    description?: Provenanced<string>;
  };
  capturedViewports: ViewportName[];
  completeness: Completeness;
  rootNodeId?: string;
};

export type CanonicalRoutesShard = {
  routes: CanonicalRoute[];
};
