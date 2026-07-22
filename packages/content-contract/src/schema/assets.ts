import type { Completeness, EvidenceRef } from "./common.js";

export type CanonicalAsset = {
  id: string;
  originalUrl?: string;
  localizedPath?: string;
  hash?: string;
  mediaType?: string;
  byteSize?: number;
  width?: number;
  height?: number;
  consumingNodeIds: string[];
  downloadState: "complete" | "external" | "failed" | "skipped" | "unknown";
  reason?: string;
  evidence: EvidenceRef[];
};

export type CanonicalAssetsShard = {
  assets: CanonicalAsset[];
};

export type CanonicalStylesShard = {
  tokens: Record<string, string>;
  fonts: Array<{
    id: string;
    family: string;
    source?: string;
    fallbackState: "complete" | "fallback" | "failed" | "unknown";
  }>;
  completeness: Completeness;
};
