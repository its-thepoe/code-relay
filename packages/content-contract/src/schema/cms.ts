import type { Completeness, EvidenceRef } from "./common.js";

export type CanonicalCmsCollection = {
  id: string;
  name: string;
  management: "managed" | "unmanaged" | "inferred";
  itemsAccess: "complete" | "ids-only" | "denied" | "truncated" | "unsupported";
  fields: Array<{
    id: string;
    name: string;
    type: string;
    required?: boolean;
    editable?: boolean;
    enumCases?: string[];
    references?: string[];
  }>;
  completeness: Completeness;
  evidence: EvidenceRef[];
};

export type CanonicalCmsItem = {
  id: string;
  collectionId: string;
  slug?: string;
  draft?: boolean;
  locale?: string;
  fields: Record<string, unknown>;
  completeness: Completeness;
  evidence: EvidenceRef[];
};

export type CanonicalCmsBinding = {
  id: string;
  nodeId: string;
  collectionId: string;
  fieldId: string;
  transform?: string;
  fallback?: unknown;
  confidence: number;
  evidence: EvidenceRef[];
};

export type CanonicalCmsIndexShard = {
  collections: CanonicalCmsCollection[];
  itemShardPaths: string[];
  bindingShardPath?: string;
};

export type CanonicalCmsItemsShard = {
  collectionId: string;
  items: CanonicalCmsItem[];
};

export type CanonicalCmsBindingsShard = {
  bindings: CanonicalCmsBinding[];
};
