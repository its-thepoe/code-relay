import type { LocalExportJob } from "./jobs-store.js";

type JsonRecord = Record<string, unknown>;

export type RevisionFamilyMember = {
  job: LocalExportJob;
  depth: number;
  isCurrent: boolean;
};

export type RevisionMetricDelta = {
  label: string;
  current: string;
  parent: string;
  delta: string;
};

export function collectRevisionFamily(
  jobs: LocalExportJob[],
  currentJobId: string,
): RevisionFamilyMember[] {
  const byId = new Map(jobs.map((job) => [job.id, job]));
  const currentJob = byId.get(currentJobId);
  if (!currentJob) return [];

  const rootId = findRootJobId(currentJob, byId);

  return jobs
    .filter((job) => findRootJobId(job, byId) === rootId)
    .map((job) => ({
      job,
      depth: findRevisionDepth(job, byId),
      isCurrent: job.id === currentJobId,
    }))
    .sort((first, second) => {
      if (first.depth !== second.depth) return first.depth - second.depth;
      return first.job.createdAt.localeCompare(second.job.createdAt);
    });
}

export function buildBeforeAfterSummary(
  currentReport: JsonRecord | undefined,
  parentReport: JsonRecord | undefined,
): RevisionMetricDelta[] {
  if (!currentReport || !parentReport) return [];

  const metrics = [
    createMetricDelta(
      "Overall fidelity",
      readNumber(currentReport.visualFidelity, "overall"),
      readNumber(parentReport.visualFidelity, "overall"),
      formatRoundedNumber,
    ),
    createMetricDelta(
      "Rendered routes",
      readNumber(currentReport.generatedValidation, "routes.length"),
      readNumber(parentReport.generatedValidation, "routes.length"),
      formatInteger,
    ),
    createMetricDelta(
      "Rendered elements",
      readNumber(currentReport.generatedValidation, "renderedElementCount"),
      readNumber(parentReport.generatedValidation, "renderedElementCount"),
      formatInteger,
    ),
    createMetricDelta(
      "Route templates",
      readNumber(currentReport, "routeTemplateCount"),
      readNumber(parentReport, "routeTemplateCount"),
      formatInteger,
    ),
    createMetricDelta(
      "Component families",
      readNumber(currentReport, "componentFamilyCount"),
      readNumber(parentReport, "componentFamilyCount"),
      formatInteger,
    ),
  ].filter((entry): entry is RevisionMetricDelta => Boolean(entry));

  return metrics;
}

function createMetricDelta(
  label: string,
  currentValue: number | undefined,
  parentValue: number | undefined,
  formatter: (value: number) => string,
): RevisionMetricDelta | null {
  if (currentValue === undefined && parentValue === undefined) {
    return null;
  }

  const current = currentValue ?? 0;
  const parent = parentValue ?? 0;
  const deltaValue = current - parent;

  return {
    label,
    current: formatter(current),
    parent: formatter(parent),
    delta:
      deltaValue === 0
        ? "0"
        : `${deltaValue > 0 ? "+" : ""}${formatter(deltaValue)}`,
  };
}

function readNumber(value: unknown, path: string): number | undefined {
  const parts = path.split(".");
  let current: unknown = value;

  for (const part of parts) {
    if (part === "length") {
      if (Array.isArray(current)) {
        current = current.length;
        continue;
      }
      return undefined;
    }

    if (!current || typeof current !== "object") {
      return undefined;
    }

    current = (current as JsonRecord)[part];
  }

  return typeof current === "number" && Number.isFinite(current)
    ? current
    : undefined;
}

function formatInteger(value: number) {
  return `${Math.round(value)}`;
}

function formatRoundedNumber(value: number) {
  return `${Math.round(value)}`;
}

function findRootJobId(
  job: LocalExportJob,
  byId: Map<string, LocalExportJob>,
): string {
  let current: LocalExportJob | undefined = job;
  const seen = new Set<string>();

  while (current?.revision?.parentJobId) {
    if (seen.has(current.id)) break;
    seen.add(current.id);
    const parent = byId.get(current.revision.parentJobId);
    if (!parent) break;
    current = parent;
  }

  return current?.id ?? job.id;
}

function findRevisionDepth(
  job: LocalExportJob,
  byId: Map<string, LocalExportJob>,
): number {
  let depth = 0;
  let current: LocalExportJob | undefined = job;
  const seen = new Set<string>();

  while (current?.revision?.parentJobId) {
    if (seen.has(current.id)) break;
    seen.add(current.id);
    const parent = byId.get(current.revision.parentJobId);
    if (!parent) break;
    depth += 1;
    current = parent;
  }

  return depth;
}
