import type { CANONICAL_BUNDLE_VERSION, ContractDomain, ShardRef } from "./common.js";

export type CanonicalSiteManifest = {
  version: typeof CANONICAL_BUNDLE_VERSION;
  bundleId: string;
  generatedAt: string;
  sourceUrl?: string;
  root: {
    project: ShardRef;
    routes: ShardRef;
    nodesIndex: ShardRef;
    componentsIndex: ShardRef;
    cmsIndex: ShardRef;
    codeIndex: ShardRef;
    interactionsIndex: ShardRef;
    styles: ShardRef;
    assetsIndex: ShardRef;
    evidence: ShardRef;
    diagnostics: ShardRef;
  };
  domains: Record<ContractDomain, ShardRef[]>;
};
