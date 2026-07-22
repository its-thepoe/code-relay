import {
  CANONICAL_BUNDLE_VERSION,
  createEvidenceRef,
  type CanonicalSiteBundle,
  type Completeness,
  type ViewportName,
} from "../../content-contract/src/index.js";

export type RuntimeSourceInput = {
  projectId?: string;
  sourceUrl: string;
  capturedAt?: string;
  title?: string;
  description?: string;
  routes: Array<{
    id?: string;
    path: string;
    title?: string;
    templateKind?: "static" | "cms" | "component" | "redirect" | "utility";
    redirectTo?: string;
    redirectStatus?: number;
    capturedViewports?: ViewportName[];
    rootNodeId?: string;
  }>;
  nodes?: Array<{
    id: string;
    parentId?: string;
    childIds?: string[];
    routeIds?: string[];
    tag?: string;
    role?: string;
    text?: string;
    attributes?: Record<string, string>;
    runtimeDomPaths?: string[];
  }>;
  assets?: Array<{
    id: string;
    originalUrl?: string;
    localizedPath?: string;
    hash?: string;
    mediaType?: string;
    byteSize?: number;
    width?: number;
    height?: number;
    consumingNodeIds?: string[];
    downloadState?: "complete" | "external" | "failed" | "skipped" | "unknown";
    reason?: string;
  }>;
  warnings?: Array<{ code: string; message: string }>;
};

const complete: Completeness = {
  status: "complete",
  reasons: [],
  requiredForProfiles: ["snapshot", "balanced"],
};

export function createRuntimeEvidenceBundle(input: RuntimeSourceInput): CanonicalSiteBundle {
  const capturedAt = input.capturedAt ?? new Date().toISOString();
  const evidence = createEvidenceRef({
    source: "published-runtime",
    sourceId: input.sourceUrl,
    capturedAt,
    confidence: 1,
  });
  return {
    manifest: emptyManifest(input.sourceUrl, capturedAt),
    project: {
      id: input.projectId ?? input.sourceUrl,
      sourceUrl: input.sourceUrl,
      capturedAt,
      locales: [],
      platform: "web",
      requestedOutput: {
        framework: "vite",
        styling: "tailwind",
        profile: "balanced",
      },
      capabilities: {
        runtime: complete,
      },
      title: input.title ? { value: input.title, selectedEvidence: evidence, conflict: "none" } : undefined,
      description: input.description
        ? { value: input.description, selectedEvidence: evidence, conflict: "none" }
        : undefined,
    },
    routes: {
      routes: input.routes.map((route, index) => ({
        id: route.id ?? `route-${index + 1}`,
        path: route.path.startsWith("/") ? route.path : `/${route.path}`,
        aliases: [],
        kind: route.redirectTo ? "redirect" : "page",
        templateKind: route.redirectTo ? "redirect" : (route.templateKind ?? "static"),
        redirect: route.redirectTo
          ? {
              to: route.redirectTo,
              status: route.redirectStatus ?? 302,
              kind: route.redirectTo.startsWith("/") ? "internal" : "external",
            }
          : undefined,
        capturedViewports: route.capturedViewports ?? [],
        completeness: complete,
        rootNodeId: route.rootNodeId,
      })),
    },
    nodes: {
      nodes:
        input.nodes?.map((node) => ({
          id: node.id,
          parentId: node.parentId,
          childIds: node.childIds ?? [],
          routeIds: node.routeIds ?? [],
          tag: node.tag ? { value: node.tag, selectedEvidence: evidence, conflict: "none" } : undefined,
          role: node.role ? { value: node.role, selectedEvidence: evidence, conflict: "none" } : undefined,
          text: node.text ? { value: node.text, selectedEvidence: evidence, conflict: "none" } : undefined,
          attributes: node.attributes ?? {},
          geometryByViewport: {},
          computedStylesByViewport: {},
          assetIds: [],
          runtimeDomPaths: node.runtimeDomPaths ?? [],
          cmsBindingIds: [],
          interactionIds: [],
          completeness: complete,
          evidence: [evidence],
        })) ?? [],
    },
    components: { components: [] },
    cms: {
      index: { collections: [], itemShardPaths: [], bindingShardPath: "cms/bindings.json" },
      items: [],
      bindings: { bindings: [] },
    },
    code: { files: [] },
    interactions: { interactions: [] },
    styles: { tokens: {}, fonts: [], completeness: complete },
    assets: {
      assets:
        input.assets?.map((asset) => ({
          id: asset.id,
          originalUrl: asset.originalUrl,
          localizedPath: asset.localizedPath,
          hash: asset.hash,
          mediaType: asset.mediaType,
          byteSize: asset.byteSize,
          width: asset.width,
          height: asset.height,
          consumingNodeIds: asset.consumingNodeIds ?? [],
          downloadState: asset.downloadState ?? "unknown",
          reason: asset.reason,
          evidence: [evidence],
        })) ?? [],
    },
    evidence: { runtime: input as unknown as Record<string, unknown>, conflicts: [] },
    diagnostics: {
      domains: { runtime: complete },
      warnings:
        input.warnings?.map((warning) => ({
          code: warning.code,
          message: warning.message,
          evidence: [evidence],
        })) ?? [],
      errors: [],
    },
  };
}

function emptyManifest(sourceUrl: string | undefined, generatedAt: string) {
  const empty = { path: "", sha256: "0".repeat(64) };
  return {
    version: CANONICAL_BUNDLE_VERSION,
    bundleId: "pending",
    generatedAt,
    sourceUrl,
    root: {
      project: empty,
      routes: empty,
      nodesIndex: empty,
      componentsIndex: empty,
      cmsIndex: empty,
      codeIndex: empty,
      interactionsIndex: empty,
      styles: empty,
      assetsIndex: empty,
      evidence: empty,
      diagnostics: empty,
    },
    domains: {
      project: [],
      routes: [],
      nodes: [],
      components: [],
      cms: [],
      code: [],
      interactions: [],
      styles: [],
      assets: [],
      evidence: [],
      diagnostics: [],
    },
  };
}
