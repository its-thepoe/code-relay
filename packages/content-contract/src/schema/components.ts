import type { Completeness, EvidenceRef } from "./common.js";

export type CanonicalComponent = {
  id: string;
  familyId: string;
  name: string;
  sourceType:
    | "framer-component"
    | "code-component"
    | "inferred-repeat"
    | "section"
    | "runtime-only";
  variantIds: string[];
  controls: Array<{
    id: string;
    name: string;
    type: string;
    defaultValue?: unknown;
    value?: unknown;
  }>;
  instanceIds: string[];
  rootNodeId?: string;
  codeFileId?: string;
  interactionIds: string[];
  portability: "portable" | "adapter-required" | "fallback-required" | "unsupported" | "unknown";
  fallbackBehavior?: string;
  safeEditNotes: string[];
  completeness: Completeness;
  evidence: EvidenceRef[];
};

export type CanonicalComponentsShard = {
  components: CanonicalComponent[];
};
