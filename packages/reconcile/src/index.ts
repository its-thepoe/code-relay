import {
  CANONICAL_BUNDLE_VERSION,
  createEvidenceRef,
  type CanonicalSiteBundle,
  type Completeness,
} from "../../content-contract/src/index.js";

export type ReconcileInput = {
  runtime?: CanonicalSiteBundle;
  framer?: CanonicalSiteBundle;
  capturedAt?: string;
};

const complete: Completeness = {
  status: "complete",
  reasons: [],
  requiredForProfiles: ["snapshot", "handoff", "balanced"],
};

const partial: Completeness = {
  status: "partial",
  reasons: ["only one source supplied"],
  requiredForProfiles: ["balanced"],
};

export function reconcileEvidenceBundles(input: ReconcileInput): CanonicalSiteBundle {
  if (!input.runtime && !input.framer) {
    throw new Error("At least one runtime or Framer bundle is required.");
  }
  const runtime = input.runtime;
  const framer = input.framer;
  const base = runtime ?? framer!;
  const capturedAt = input.capturedAt ?? new Date().toISOString();
  const conflictEvidence = createEvidenceRef({
    source: "inferred",
    sourceId: "reconcile",
    capturedAt,
    confidence: 0.5,
  });
  const conflicts = [
    ...(runtime?.evidence.conflicts ?? []),
    ...(framer?.evidence.conflicts ?? []),
  ];

  if (
    runtime?.project.publishedRevision &&
    framer?.project.publishedRevision &&
    runtime.project.publishedRevision !== framer.project.publishedRevision
  ) {
    conflicts.push({
      id: "published-revision-mismatch",
      domain: "project",
      summary: `Runtime published revision ${runtime.project.publishedRevision} does not match Framer revision ${framer.project.publishedRevision}.`,
      evidence: [conflictEvidence],
    });
  }

  const bundle: CanonicalSiteBundle = {
    manifest: {
      version: CANONICAL_BUNDLE_VERSION,
      bundleId: "pending",
      generatedAt: capturedAt,
      sourceUrl: runtime?.project.sourceUrl ?? framer?.project.sourceUrl,
      root: emptyRootRefs(),
      domains: emptyDomainRefs(),
    },
    project: {
      ...base.project,
      id: framer?.project.id ?? runtime?.project.id ?? base.project.id,
      sourceUrl: runtime?.project.sourceUrl ?? framer?.project.sourceUrl,
      publishUrl: framer?.project.publishUrl ?? runtime?.project.publishUrl,
      editorRevision: framer?.project.editorRevision ?? runtime?.project.editorRevision,
      publishedRevision: runtime?.project.publishedRevision ?? framer?.project.publishedRevision,
      capturedAt,
      platform: framer ? "framer" : runtime?.project.platform,
      capabilities: {
        ...(runtime?.project.capabilities ?? {}),
        ...(framer?.project.capabilities ?? {}),
        reconciliation: runtime && framer ? complete : partial,
      },
    },
    routes: runtime?.routes ?? framer?.routes ?? { routes: [] },
    nodes: runtime?.nodes ?? framer?.nodes ?? { nodes: [] },
    components: mergeById(
      runtime?.components.components ?? [],
      framer?.components.components ?? [],
    ),
    cms: {
      index: framer?.cms.index ?? runtime?.cms.index ?? { collections: [], itemShardPaths: [], bindingShardPath: "cms/bindings.json" },
      items: framer?.cms.items ?? runtime?.cms.items ?? [],
      bindings: framer?.cms.bindings ?? runtime?.cms.bindings ?? { bindings: [] },
    },
    code: framer?.code ?? runtime?.code ?? { files: [] },
    interactions: runtime?.interactions ?? framer?.interactions ?? { interactions: [] },
    styles: runtime?.styles ?? framer?.styles ?? {
      tokens: {},
      fonts: [],
      completeness: partial,
    },
    assets: runtime?.assets ?? framer?.assets ?? { assets: [] },
    evidence: {
      runtime: runtime?.evidence.runtime,
      framer: framer?.evidence.framer,
      conflicts,
    },
    diagnostics: {
      domains: {
        ...(runtime?.diagnostics.domains ?? {}),
        ...(framer?.diagnostics.domains ?? {}),
        reconciliation: runtime && framer ? complete : partial,
      },
      warnings: [
        ...(runtime?.diagnostics.warnings ?? []),
        ...(framer?.diagnostics.warnings ?? []),
      ],
      errors: [
        ...(runtime?.diagnostics.errors ?? []),
        ...(framer?.diagnostics.errors ?? []),
      ],
    },
  };

  return bundle;
}

function mergeById<T extends { id: string }>(runtimeRecords: T[], framerRecords: T[]) {
  const records = new Map<string, T>();
  for (const record of runtimeRecords) records.set(record.id, record);
  for (const record of framerRecords) records.set(record.id, record);
  return { components: [...records.values()] };
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
