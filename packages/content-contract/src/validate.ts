import type {
  ContractValidationIssue,
  ShardRef,
} from "./schema/common.js";
import {
  CANONICAL_BUNDLE_VERSION,
  ContractValidationError,
} from "./schema/common.js";
import type { CanonicalSiteManifest } from "./schema/manifest.js";
import type { CanonicalRoutesShard } from "./schema/routes.js";
import type { CanonicalNodesShard } from "./schema/nodes.js";
import type { CanonicalComponentsShard } from "./schema/components.js";
import type {
  CanonicalCmsBindingsShard,
  CanonicalCmsIndexShard,
  CanonicalCmsItemsShard,
} from "./schema/cms.js";
import type { CanonicalCodeShard } from "./schema/code.js";
import type { CanonicalInteractionsShard } from "./schema/interactions.js";
import type { CanonicalAssetsShard, CanonicalStylesShard } from "./schema/assets.js";
import type { CanonicalCapabilityReport, CanonicalEvidenceShard } from "./schema/diagnostics.js";
import type { CanonicalProject } from "./schema/project.js";

export type CanonicalSiteBundle = {
  manifest: CanonicalSiteManifest;
  project: CanonicalProject;
  routes: CanonicalRoutesShard;
  nodes: CanonicalNodesShard;
  components: CanonicalComponentsShard;
  cms: {
    index: CanonicalCmsIndexShard;
    items: CanonicalCmsItemsShard[];
    bindings: CanonicalCmsBindingsShard;
  };
  code: CanonicalCodeShard;
  interactions: CanonicalInteractionsShard;
  styles: CanonicalStylesShard;
  assets: CanonicalAssetsShard;
  evidence: CanonicalEvidenceShard;
  diagnostics: CanonicalCapabilityReport;
};

function issue(path: string, message: string): ContractValidationIssue {
  return { path, message };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function hasText(record: Record<string, unknown>, key: string) {
  return typeof record[key] === "string" && String(record[key]).length > 0;
}

function hasArray(record: Record<string, unknown>, key: string) {
  return Array.isArray(record[key]);
}

function validateShardRef(value: unknown, path: string, issues: ContractValidationIssue[]) {
  if (!isRecord(value)) {
    issues.push(issue(path, "must be an object with path and sha256"));
    return;
  }
  if (!hasText(value, "path")) issues.push(issue(`${path}.path`, "must be a non-empty string"));
  if (!/^[a-f0-9]{64}$/.test(String(value.sha256 ?? ""))) {
    issues.push(issue(`${path}.sha256`, "must be a sha256 hex digest"));
  }
  if (typeof value.path === "string") {
    if (value.path.startsWith("/") || value.path.includes("..")) {
      issues.push(issue(`${path}.path`, "must be a safe relative bundle path"));
    }
  }
}

export function validateManifest(value: unknown): CanonicalSiteManifest {
  const issues: ContractValidationIssue[] = [];
  if (!isRecord(value)) {
    throw new ContractValidationError("Invalid canonical manifest.", [
      issue("manifest", "must be an object"),
    ]);
  }
  if (value.version !== CANONICAL_BUNDLE_VERSION) {
    issues.push(issue("manifest.version", `must be ${CANONICAL_BUNDLE_VERSION}`));
  }
  if (!hasText(value, "bundleId")) issues.push(issue("manifest.bundleId", "must be a non-empty string"));
  if (!hasText(value, "generatedAt")) issues.push(issue("manifest.generatedAt", "must be a non-empty string"));
  if (!isRecord(value.root)) issues.push(issue("manifest.root", "must be an object"));
  if (!isRecord(value.domains)) issues.push(issue("manifest.domains", "must be an object"));
  if (isRecord(value.root)) {
    for (const key of [
      "project",
      "routes",
      "nodesIndex",
      "componentsIndex",
      "cmsIndex",
      "codeIndex",
      "interactionsIndex",
      "styles",
      "assetsIndex",
      "evidence",
      "diagnostics",
    ]) {
      validateShardRef(value.root[key], `manifest.root.${key}`, issues);
    }
  }
  if (issues.length > 0) {
    throw new ContractValidationError("Invalid canonical manifest.", issues);
  }
  return value as CanonicalSiteManifest;
}

export function validateCanonicalSiteBundle(bundle: CanonicalSiteBundle): CanonicalSiteBundle {
  validateManifest(bundle.manifest);
  const issues: ContractValidationIssue[] = [];
  const routeIds = uniqueIds(bundle.routes.routes, "routes", issues);
  const routePaths = new Set<string>();
  for (const route of bundle.routes.routes) {
    if (!route.path.startsWith("/")) issues.push(issue(`routes.${route.id}.path`, "must start with /"));
    if (routePaths.has(route.path)) issues.push(issue(`routes.${route.id}.path`, `duplicate route path ${route.path}`));
    routePaths.add(route.path);
  }

  const nodeIds = uniqueIds(bundle.nodes.nodes, "nodes", issues);
  const componentIds = uniqueIds(bundle.components.components, "components", issues);
  const assetIds = uniqueIds(bundle.assets.assets, "assets", issues);
  const interactionIds = uniqueIds(bundle.interactions.interactions, "interactions", issues);
  const collectionIds = uniqueIds(bundle.cms.index.collections, "cms.collections", issues);
  const codeFileIds = uniqueIds(bundle.code.files, "code.files", issues);
  const bindingIds = uniqueIds(bundle.cms.bindings.bindings, "cms.bindings", issues);

  for (const route of bundle.routes.routes) {
    if (route.rootNodeId && !nodeIds.has(route.rootNodeId)) {
      issues.push(issue(`routes.${route.id}.rootNodeId`, `dangling node reference ${route.rootNodeId}`));
    }
  }
  for (const node of bundle.nodes.nodes) {
    for (const routeId of node.routeIds) {
      if (!routeIds.has(routeId)) issues.push(issue(`nodes.${node.id}.routeIds`, `dangling route reference ${routeId}`));
    }
    for (const childId of node.childIds) {
      if (!nodeIds.has(childId)) issues.push(issue(`nodes.${node.id}.childIds`, `dangling node reference ${childId}`));
    }
    for (const assetId of node.assetIds) {
      if (!assetIds.has(assetId)) issues.push(issue(`nodes.${node.id}.assetIds`, `dangling asset reference ${assetId}`));
    }
    for (const bindingId of node.cmsBindingIds) {
      if (!bindingIds.has(bindingId)) issues.push(issue(`nodes.${node.id}.cmsBindingIds`, `dangling CMS binding reference ${bindingId}`));
    }
    for (const interactionId of node.interactionIds) {
      if (!interactionIds.has(interactionId)) issues.push(issue(`nodes.${node.id}.interactionIds`, `dangling interaction reference ${interactionId}`));
    }
  }
  for (const component of bundle.components.components) {
    if (component.rootNodeId && !nodeIds.has(component.rootNodeId)) {
      issues.push(issue(`components.${component.id}.rootNodeId`, `dangling node reference ${component.rootNodeId}`));
    }
    if (component.codeFileId && !codeFileIds.has(component.codeFileId)) {
      issues.push(issue(`components.${component.id}.codeFileId`, `dangling code file reference ${component.codeFileId}`));
    }
  }
  for (const itemShard of bundle.cms.items) {
    if (!collectionIds.has(itemShard.collectionId)) {
      issues.push(issue(`cms.items.${itemShard.collectionId}`, `dangling collection reference ${itemShard.collectionId}`));
    }
    uniqueIds(itemShard.items, `cms.items.${itemShard.collectionId}`, issues);
  }
  for (const binding of bundle.cms.bindings.bindings) {
    if (!nodeIds.has(binding.nodeId)) issues.push(issue(`cms.bindings.${binding.id}.nodeId`, `dangling node reference ${binding.nodeId}`));
    if (!collectionIds.has(binding.collectionId)) issues.push(issue(`cms.bindings.${binding.id}.collectionId`, `dangling collection reference ${binding.collectionId}`));
  }
  for (const asset of bundle.assets.assets) {
    for (const nodeId of asset.consumingNodeIds) {
      if (!nodeIds.has(nodeId)) issues.push(issue(`assets.${asset.id}.consumingNodeIds`, `dangling node reference ${nodeId}`));
    }
  }
  for (const interaction of bundle.interactions.interactions) {
    for (const nodeId of interaction.targetNodeIds) {
      if (!nodeIds.has(nodeId)) issues.push(issue(`interactions.${interaction.id}.targetNodeIds`, `dangling node reference ${nodeId}`));
    }
  }

  if (issues.length > 0) {
    throw new ContractValidationError("Invalid canonical site bundle.", issues);
  }
  return bundle;
}

function uniqueIds(
  records: Array<{ id: string }>,
  path: string,
  issues: ContractValidationIssue[],
) {
  const seen = new Set<string>();
  for (const record of records) {
    if (!record.id) {
      issues.push(issue(path, "record id must be a non-empty string"));
      continue;
    }
    if (seen.has(record.id)) issues.push(issue(`${path}.${record.id}`, `duplicate id ${record.id}`));
    seen.add(record.id);
  }
  return seen;
}

export function assertShardHash(path: string, ref: ShardRef, actualSha256: string) {
  if (ref.sha256 !== actualSha256) {
    throw new ContractValidationError("Canonical bundle shard hash mismatch.", [
      issue(path, `expected ${ref.sha256}, got ${actualSha256}`),
    ]);
  }
}

export function assertShardPath(path: string) {
  if (!path || path.startsWith("/") || path.includes("..")) {
    throw new ContractValidationError("Unsafe canonical bundle shard path.", [
      issue("path", `unsafe relative path ${path}`),
    ]);
  }
}
