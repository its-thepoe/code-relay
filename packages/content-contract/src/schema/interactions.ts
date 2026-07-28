import type { Completeness, EvidenceRef } from "./common.js";

export type CanonicalInteraction = {
  id: string;
  trigger: string;
  accessibleEquivalent?: string;
  targetNodeIds: string[];
  initialState?: Record<string, unknown>;
  states: string[];
  transitions: Array<{
    from: string;
    to: string;
    event: string;
    effects: string[];
  }>;
  safety: "replayable" | "adapter-required" | "external-side-effect" | "unsupported";
  reducedMotionBehavior?: string;
  validationStatus: "passed" | "failed" | "not-run" | "unsupported";
  completeness: Completeness;
  evidence: EvidenceRef[];
};

export type CanonicalInteractionsShard = {
  interactions: CanonicalInteraction[];
};
