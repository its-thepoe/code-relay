import type { Completeness, EvidenceRef } from "./common.js";

export type CanonicalCapabilityReport = {
  domains: Record<string, Completeness>;
  warnings: Array<{ code: string; message: string; evidence?: EvidenceRef[] }>;
  errors: Array<{ code: string; message: string; evidence?: EvidenceRef[] }>;
};

export type CanonicalEvidenceShard = {
  runtime?: Record<string, unknown>;
  framer?: Record<string, unknown>;
  conflicts: Array<{
    id: string;
    domain: string;
    summary: string;
    evidence: EvidenceRef[];
  }>;
};
