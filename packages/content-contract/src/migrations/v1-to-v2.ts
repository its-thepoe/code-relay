import {
  CANONICAL_BUNDLE_VERSION,
  LEGACY_CONTENT_CONTRACT_VERSION,
  createEvidenceRef,
  type Completeness,
} from "../schema/common.js";
import type { CanonicalSiteBundle } from "../validate.js";

export type CanonicalContentPrimitive = string | number | boolean | null;

export type CanonicalContentValue =
  | CanonicalContentPrimitive
  | CanonicalContentValue[]
  | { [key: string]: CanonicalContentValue };

export type CanonicalContentMap = Record<string, CanonicalContentValue>;

export type CanonicalEditArea =
  | "content"
  | "components"
  | "sections"
  | "docs"
  | "styles";

export type CanonicalComponentDoc = {
  id: string;
  name: string;
  summary?: string;
  props: string[];
  slots?: string[];
  notes?: string[];
};

export type CanonicalContentSection = {
  id: string;
  name: string;
  kind: "page" | "section" | "collection" | "component";
  summary?: string;
  content: CanonicalContentMap;
  components?: CanonicalComponentDoc[];
};

export type CanonicalContentBundleV1 = {
  version: typeof LEGACY_CONTENT_CONTRACT_VERSION;
  sourceUrl: string;
  routePath?: string;
  title?: string;
  description?: string;
  content: CanonicalContentMap;
  sections?: CanonicalContentSection[];
  components?: CanonicalComponentDoc[];
  safeEditAreas?: CanonicalEditArea[];
  generatedFiles?: string[];
  runtimeUtilities?: string[];
  notes?: string[];
};

export type CanonicalContentDocs = {
  sourceUrl: string;
  routePath?: string;
  safeEditAreas: CanonicalEditArea[];
  generatedFiles: string[];
  runtimeUtilities: string[];
  notes?: string[];
};

export type CanonicalContentBundleInput = {
  sourceUrl: string;
  routePath?: string;
  title?: string;
  description?: string;
  content?: CanonicalContentMap;
  routes?: Array<{
    routePath: string;
    title?: string;
    templateKind?: string;
    templateId?: string;
    templatePath?: string;
    routeKind?: string;
    destination?: string | null;
    destinationKind?: string | null;
    redirectTo?: string | null;
    redirectStatus?: number | null;
    sourceTextLength?: number;
  }>;
  componentModules?: Array<{
    name: string;
    source?: string;
    isDefaultExport?: boolean;
    componentIdentifier?: string;
    componentName?: string;
  }>;
  sections?: CanonicalContentSection[];
  components?: CanonicalComponentDoc[];
  safeEditAreas?: CanonicalEditArea[];
  generatedFiles?: string[];
  runtimeUtilities?: string[];
  notes?: string[];
};

const complete: Completeness = {
  status: "complete",
  reasons: [],
  requiredForProfiles: ["snapshot", "balanced"],
};

const missing: Completeness = {
  status: "missing",
  reasons: ["not present in legacy v1 content contract"],
  requiredForProfiles: ["handoff", "balanced"],
};

export function canonicalEditAreas(input: {
  hasContentModule?: boolean;
  hasSections?: boolean;
  hasComponents?: boolean;
  hasDocs?: boolean;
  hasStyles?: boolean;
}): CanonicalEditArea[] {
  const editAreas: CanonicalEditArea[] = ["docs"];
  if (input.hasContentModule) editAreas.unshift("content");
  if (input.hasComponents) editAreas.push("components");
  if (input.hasSections) editAreas.push("sections");
  if (input.hasStyles) editAreas.push("styles");
  return [...new Set(editAreas)];
}

export function createCanonicalContentBundle(
  input: CanonicalContentBundleInput,
): CanonicalContentBundleV1 {
  const routeSections: CanonicalContentSection[] =
    input.routes?.map((route, index) => ({
      id: route.templateId ?? route.routePath ?? `route-${index + 1}`,
      name: route.title ?? route.routePath,
      kind:
        route.templateKind === "cms"
          ? "collection"
          : route.templateKind === "component"
            ? "component"
            : "page",
      summary:
        route.templatePath ??
        (route.destination ? `Redirects to ${route.destination}` : undefined),
      content: {
        routePath: route.routePath,
        title: route.title ?? route.routePath,
        templateKind: route.templateKind ?? "static",
        templateId: route.templateId ?? null,
        templatePath: route.templatePath ?? null,
        routeKind: route.routeKind ?? null,
        destination: route.destination ?? null,
        destinationKind: route.destinationKind ?? null,
        redirectTo: route.redirectTo ?? null,
        redirectStatus: route.redirectStatus ?? null,
        sourceTextLength: route.sourceTextLength ?? null,
      },
    })) ?? [];

  const componentDocs =
    input.componentModules?.map((module) => ({
      id: module.componentIdentifier ?? module.name,
      name: module.componentName ?? module.name,
      summary: module.source,
      props: module.isDefaultExport ? ["children"] : [],
      notes:
        module.componentIdentifier || module.componentName
          ? [
              module.componentIdentifier ? `componentIdentifier: ${module.componentIdentifier}` : "",
              module.componentName ? `componentName: ${module.componentName}` : "",
            ].filter(Boolean)
          : undefined,
    })) ?? input.components;

  return {
    version: LEGACY_CONTENT_CONTRACT_VERSION,
    sourceUrl: input.sourceUrl,
    routePath: input.routePath,
    title: input.title,
    description: input.description,
    content: input.content ?? {},
    sections: input.sections ?? routeSections,
    components: componentDocs,
    safeEditAreas: input.safeEditAreas ?? canonicalEditAreas({
      hasContentModule: Boolean(input.content && Object.keys(input.content).length > 0),
      hasSections: (input.sections?.length ?? routeSections.length) > 0,
      hasComponents: (componentDocs?.length ?? 0) > 0,
      hasDocs: true,
      hasStyles: false,
    }),
    generatedFiles: input.generatedFiles ?? [],
    runtimeUtilities: input.runtimeUtilities ?? [],
    notes: input.notes,
  };
}

export function isCanonicalContentBundle(
  value: unknown,
): value is CanonicalContentBundleV1 {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Partial<CanonicalContentBundleV1>;
  return candidate.version === LEGACY_CONTENT_CONTRACT_VERSION &&
    typeof candidate.sourceUrl === "string" &&
    typeof candidate.content === "object" &&
    candidate.content !== null;
}

export function migrateV1ContentContractToV2(input: CanonicalContentBundleV1): CanonicalSiteBundle {
  const capturedAt = new Date(0).toISOString();
  const evidence = createEvidenceRef({
    source: "inferred",
    sourceId: "content-contract-v1",
    capturedAt,
    confidence: 0.4,
  });
  const routes = (input.sections ?? [])
    .filter((section) => section.kind === "page" || section.kind === "collection")
    .map((section, index) => {
      const routePath =
        typeof section.content.routePath === "string"
          ? section.content.routePath
          : input.routePath ?? "/";
      return {
        id: `route-${index + 1}`,
        path: routePath.startsWith("/") ? routePath : `/${routePath}`,
        aliases: [],
        kind: "page" as const,
        templateKind: section.kind === "collection" ? ("cms" as const) : ("static" as const),
        templateId: section.id,
        capturedViewports: [],
        completeness: {
          ...complete,
          reasons: ["migrated from legacy content summary"],
        },
      };
    });
  if (routes.length === 0) {
    routes.push({
      id: "route-1",
      path: input.routePath ?? "/",
      aliases: [],
      kind: "page",
      templateKind: "static",
      templateId: "legacy-root",
      capturedViewports: [],
      completeness: {
        ...complete,
        reasons: ["migrated from legacy content summary"],
      },
    });
  }

  return {
    manifest: {
      version: CANONICAL_BUNDLE_VERSION,
      bundleId: "pending",
      generatedAt: capturedAt,
      sourceUrl: input.sourceUrl,
      root: emptyRootRefs(),
      domains: emptyDomainRefs(),
    },
    project: {
      id: "legacy-project",
      sourceUrl: input.sourceUrl,
      capturedAt,
      locales: [],
      platform: "unknown",
      requestedOutput: {
        framework: "vite",
        styling: "tailwind",
        profile: "balanced",
      },
      capabilities: {
        legacyContent: complete,
        cms: missing,
        code: missing,
        interactions: missing,
      },
      title: input.title ? { value: input.title, selectedEvidence: evidence, conflict: "none" } : undefined,
      description: input.description
        ? { value: input.description, selectedEvidence: evidence, conflict: "none" }
        : undefined,
    },
    routes: { routes },
    nodes: { nodes: [] },
    components: {
      components:
        input.components?.map((component) => ({
          id: component.id,
          familyId: component.id,
          name: component.name,
          sourceType: "inferred-repeat" as const,
          variantIds: [],
          controls: component.props.map((prop) => ({ id: prop, name: prop, type: "unknown" })),
          instanceIds: [],
          interactionIds: [],
          portability: "unknown" as const,
          safeEditNotes: component.notes ?? [],
          completeness: {
            ...complete,
            reasons: ["migrated from legacy component docs"],
          },
          evidence: [evidence],
        })) ?? [],
    },
    cms: {
      index: { collections: [], itemShardPaths: [], bindingShardPath: "cms/bindings.json" },
      items: [],
      bindings: { bindings: [] },
    },
    code: { files: [] },
    interactions: { interactions: [] },
    styles: { tokens: {}, fonts: [], completeness: missing },
    assets: { assets: [] },
    evidence: { conflicts: [] },
    diagnostics: {
      domains: {
        legacyContent: complete,
        cms: missing,
        code: missing,
        interactions: missing,
      },
      warnings: [
        {
          code: "legacy-contract-migration",
          message: "Bundle was migrated from the shallow v1 content contract; source evidence is partial.",
          evidence: [evidence],
        },
      ],
      errors: [],
    },
  };
}

function emptyRootRefs() {
  const empty = { path: "", sha256: "0".repeat(64) };
  return {
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
  };
}

function emptyDomainRefs() {
  return {
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
  };
}
