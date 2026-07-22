import type { Completeness, EvidenceRef } from "./common.js";

export type CanonicalCodeFile = {
  id: string;
  path: string;
  hash: string;
  byteLength: number;
  sourceAvailable: boolean;
  sourceArtifactPath?: string;
  adaptedSourcePath?: string;
  exports: Array<{ name: string; kind: "component" | "override" | "value" | "unknown" }>;
  imports: string[];
  dependencyNames: string[];
  linkedComponentIds: string[];
  compatibility:
    | "portable"
    | "portable-with-adapter"
    | "portable-with-dependencies"
    | "runtime-fallback-required"
    | "unsupported"
    | "unknown";
  reasons: string[];
  completeness: Completeness;
  evidence: EvidenceRef[];
};

export type CanonicalCodeShard = {
  files: CanonicalCodeFile[];
};
