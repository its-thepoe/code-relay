export const CANONICAL_BUNDLE_VERSION = 2 as const;
export const LEGACY_CONTENT_CONTRACT_VERSION = 1 as const;

export type EvidenceSource =
  | "framer-editor"
  | "published-runtime"
  | "inferred"
  | "user";

export type ViewportName = "desktop" | "laptop" | "tablet" | "mobile";

export type EvidenceRef = {
  source: EvidenceSource;
  sourceId?: string;
  routeId?: string;
  viewport?: ViewportName;
  capturedAt: string;
  sourceRevision?: string;
  confidence: number;
  hash?: string;
};

export type Provenanced<T> = {
  value: T;
  selectedEvidence: EvidenceRef;
  alternatives?: Array<{ value: T; evidence: EvidenceRef }>;
  conflict?: "none" | "editor-runtime-mismatch" | "ambiguous" | "missing";
};

export type Completeness = {
  status: "complete" | "partial" | "missing" | "unsupported" | "failed";
  expected?: number;
  captured?: number;
  reasons: string[];
  requiredForProfiles: Array<"snapshot" | "handoff" | "balanced">;
};

export type ContractDomain =
  | "project"
  | "routes"
  | "nodes"
  | "components"
  | "cms"
  | "code"
  | "interactions"
  | "styles"
  | "assets"
  | "evidence"
  | "diagnostics";

export type ShardRef = {
  path: string;
  sha256: string;
};

export type JsonPrimitive = string | number | boolean | null;
export type JsonValue =
  | JsonPrimitive
  | JsonValue[]
  | { [key: string]: JsonValue };

export type ContractValidationIssue = {
  path: string;
  message: string;
};

export class ContractValidationError extends Error {
  readonly issues: ContractValidationIssue[];

  constructor(message: string, issues: ContractValidationIssue[]) {
    super(message);
    this.name = "ContractValidationError";
    this.issues = issues;
  }
}

export function createEvidenceRef(input: Partial<EvidenceRef> & {
  source: EvidenceSource;
}): EvidenceRef {
  return {
    source: input.source,
    sourceId: input.sourceId,
    routeId: input.routeId,
    viewport: input.viewport,
    capturedAt: input.capturedAt ?? new Date(0).toISOString(),
    sourceRevision: input.sourceRevision,
    confidence: input.confidence ?? 1,
    hash: input.hash,
  };
}
