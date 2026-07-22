import {
  CANONICAL_BUNDLE_VERSION,
  createEvidenceRef,
  type CanonicalSiteBundle,
  type Completeness,
} from "../../content-contract/src/index.js";

export type FramerSourceInput = {
  projectId: string;
  sourceUrl?: string;
  publishUrl?: string;
  editorRevision?: string;
  publishedRevision?: string;
  capturedAt?: string;
  collections?: Array<{
    id: string;
    name: string;
    management?: "managed" | "unmanaged";
    fields?: Array<{
      id: string;
      name: string;
      type: string;
      required?: boolean;
      editable?: boolean;
      enumCases?: string[];
      references?: string[];
    }>;
    itemsAccess?: "complete" | "ids-only" | "denied" | "truncated" | "unsupported";
    items?: Array<{
      id: string;
      slug?: string;
      draft?: boolean;
      locale?: string;
      fields?: Record<string, unknown>;
    }>;
  }>;
  components?: Array<{
    id: string;
    familyId?: string;
    name: string;
    sourceType?: "framer-component" | "code-component";
    variantIds?: string[];
    controls?: Array<{ id: string; name: string; type: string; defaultValue?: unknown; value?: unknown }>;
    codeFileId?: string;
  }>;
  codeFiles?: Array<{
    id: string;
    path: string;
    hash: string;
    byteLength: number;
    sourceAvailable: boolean;
    exports?: Array<{ name: string; kind: "component" | "override" | "value" | "unknown" }>;
    imports?: string[];
    dependencyNames?: string[];
    compatibility?: "portable" | "portable-with-adapter" | "portable-with-dependencies" | "runtime-fallback-required" | "unsupported" | "unknown";
    reasons?: string[];
  }>;
  capabilityFailures?: Array<{ code: string; message: string }>;
};

const complete: Completeness = {
  status: "complete",
  reasons: [],
  requiredForProfiles: ["handoff", "balanced"],
};

function partial(reason: string): Completeness {
  return {
    status: "partial",
    reasons: [reason],
    requiredForProfiles: ["handoff", "balanced"],
  };
}

export function createFramerEvidenceBundle(input: FramerSourceInput): CanonicalSiteBundle {
  const capturedAt = input.capturedAt ?? new Date().toISOString();
  const evidence = createEvidenceRef({
    source: "framer-editor",
    sourceId: input.projectId,
    capturedAt,
    sourceRevision: input.editorRevision,
    confidence: 1,
  });
  const collections = input.collections ?? [];
  return {
    manifest: emptyManifest(input.sourceUrl, capturedAt),
    project: {
      id: input.projectId,
      sourceUrl: input.sourceUrl,
      publishUrl: input.publishUrl,
      editorRevision: input.editorRevision,
      publishedRevision: input.publishedRevision,
      capturedAt,
      locales: [],
      platform: "framer",
      requestedOutput: {
        framework: "vite",
        styling: "tailwind",
        profile: "balanced",
      },
      capabilities: {
        framer: complete,
        cms: collections.length > 0 ? complete : partial("no Framer collections were captured"),
        code: (input.codeFiles?.length ?? 0) > 0 ? complete : partial("no Framer code files were captured"),
      },
    },
    routes: { routes: [] },
    nodes: { nodes: [] },
    components: {
      components: (input.components ?? []).map((component) => ({
        id: component.id,
        familyId: component.familyId ?? component.id,
        name: component.name,
        sourceType: component.sourceType ?? "framer-component",
        variantIds: component.variantIds ?? [],
        controls: component.controls ?? [],
        instanceIds: [],
        codeFileId: component.codeFileId,
        interactionIds: [],
        portability: component.codeFileId ? "unknown" : "adapter-required",
        safeEditNotes: [],
        completeness: complete,
        evidence: [evidence],
      })),
    },
    cms: {
      index: {
        collections: collections.map((collection) => ({
          id: collection.id,
          name: collection.name,
          management: collection.management ?? "managed",
          itemsAccess: collection.itemsAccess ?? (collection.items ? "complete" : "ids-only"),
          fields: collection.fields ?? [],
          completeness: collection.items ? complete : partial("collection items were not readable"),
          evidence: [evidence],
        })),
        itemShardPaths: collections.map((collection) => `cms/items/${collection.id}.json`),
        bindingShardPath: "cms/bindings.json",
      },
      items: collections.map((collection) => ({
        collectionId: collection.id,
        items:
          collection.items?.map((item) => ({
            id: item.id,
            collectionId: collection.id,
            slug: item.slug,
            draft: item.draft,
            locale: item.locale,
            fields: item.fields ?? {},
            completeness: complete,
            evidence: [evidence],
          })) ?? [],
      })),
      bindings: { bindings: [] },
    },
    code: {
      files:
        input.codeFiles?.map((file) => ({
          id: file.id,
          path: file.path,
          hash: file.hash,
          byteLength: file.byteLength,
          sourceAvailable: file.sourceAvailable,
          exports: file.exports ?? [],
          imports: file.imports ?? [],
          dependencyNames: file.dependencyNames ?? [],
          linkedComponentIds: [],
          compatibility: file.compatibility ?? "unknown",
          reasons: file.reasons ?? [],
          completeness: file.sourceAvailable ? complete : partial("code source was not readable"),
          evidence: [evidence],
        })) ?? [],
    },
    interactions: { interactions: [] },
    styles: { tokens: {}, fonts: [], completeness: partial("style tokens are not normalized by the Framer adapter yet") },
    assets: { assets: [] },
    evidence: { framer: input as unknown as Record<string, unknown>, conflicts: [] },
    diagnostics: {
      domains: {
        framer: complete,
      },
      warnings:
        input.capabilityFailures?.map((failure) => ({
          code: failure.code,
          message: failure.message,
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
