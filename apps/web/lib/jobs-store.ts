import fs from "node:fs/promises";
import fssync from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

export type LocalJobStatus = "queued" | "running" | "completed" | "failed";
export type LocalExportMode = "selection" | "components" | "full-site";
export type LocalRevisionFocus =
  | "responsiveness"
  | "components"
  | "both"
  | "revalidate";

export type LocalExportJob = {
  id: string;
  status: LocalJobStatus;
  sourceUrl?: string;
  selector?: string;
  exportMode?: LocalExportMode;
  pluginCapture?: unknown;
  title?: string;
  createdAt: string;
  updatedAt: string;
  errorMessage?: string;
  progress?: {
    stage: string;
    completed?: number;
    total?: number;
    routePath?: string;
    failed?: number;
  };
  revision?: {
    kind: "initial" | "improvement";
    parentJobId?: string;
    parentRevisionId?: string;
    requestedFocus?: LocalRevisionFocus;
  };
  artifacts?: {
    exportDir?: string;
    zipPath?: string;
    reportPath?: string;
    previewPath?: string;
    resolvedRequestPath?: string;
    statusPath?: string;
    capabilityReportPath?: string;
    codeCompatibilityReportPath?: string;
    beforeAfterReportPath?: string;
    parentInfoPath?: string;
    revisionManifestPath?: string;
    validationPath?: string;
    invalidationPlanPath?: string;
    artifactIndexPath?: string;
    responsiveRecapturePlanPath?: string;
  };
};

function resolveRepoRoot() {
  let current = process.cwd();
  for (let depth = 0; depth < 8; depth += 1) {
    const marker = path.join(current, "apps", "web");
    if (fssync.existsSync(marker)) {
      return current;
    }
    const parent = path.dirname(current);
    if (parent === current) break;
    current = parent;
  }
  return process.cwd();
}

const repoRoot = resolveRepoRoot();
const jobsDir = path.join(repoRoot, ".coderelay", "jobs");
const legacyJobsDir = path.join(process.cwd(), ".coderelay", "jobs");

async function ensureDirs() {
  await fs.mkdir(jobsDir, { recursive: true });
}

function jobPath(id: string) {
  return path.join(jobsDir, `${id}.json`);
}

export async function readAllJobs(): Promise<LocalExportJob[]> {
  await ensureDirs();
  const dirs = legacyJobsDir === jobsDir ? [jobsDir] : [jobsDir, legacyJobsDir];
  const jsonFiles = (
    await Promise.all(
      dirs.map(async (dir) => {
        const files = await fs.readdir(dir).catch(() => []);
        return files
          .filter((file) => file.endsWith(".json"))
          .map((file) => path.join(dir, file));
      }),
    )
  ).flat();

  const jobs = await Promise.all(
    jsonFiles.map(async (filePath) => {
      try {
        const raw = await fs.readFile(filePath, "utf8");
        return JSON.parse(raw) as LocalExportJob;
      } catch {
        return null;
      }
    }),
  );

  const byId = new Map<string, LocalExportJob>();
  for (const job of jobs) {
    if (!job) continue;
    const existing = byId.get(job.id);
    if (!existing || job.updatedAt > existing.updatedAt) {
      byId.set(job.id, job);
    }
  }

  return Array.from(byId.values()).sort((a, b) =>
    b.createdAt.localeCompare(a.createdAt),
  );
}

export async function readJob(id: string): Promise<LocalExportJob | null> {
  await ensureDirs();
  const paths =
    legacyJobsDir === jobsDir
      ? [jobPath(id)]
      : [jobPath(id), path.join(legacyJobsDir, `${id}.json`)];

  for (const filePath of paths) {
    try {
      const raw = await fs.readFile(filePath, "utf8");
      return JSON.parse(raw) as LocalExportJob;
    } catch {
      // Try the next known local job directory.
    }
  }

  return null;
}

export async function writeJob(job: LocalExportJob) {
  await ensureDirs();
  await fs.writeFile(jobPath(job.id), `${JSON.stringify(job, null, 2)}\n`);
}

export async function createJobFromRequest(
  input: any,
): Promise<LocalExportJob> {
  if (typeof input?.parentJobId === "string" && input.parentJobId.trim()) {
    return createImprovementJobFromParent(input.parentJobId.trim(), input);
  }
  const pluginCapture = input?.pluginCapture;
  const projectId =
    typeof pluginCapture?.project?.id === "string"
      ? pluginCapture.project.id
      : undefined;
  const sourceUrlRaw =
    typeof input?.sourceUrl === "string" ? input.sourceUrl.trim() : "";
  const publishedUrlFromContext =
    typeof pluginCapture?.context?.publishedUrl === "string"
      ? pluginCapture.context.publishedUrl.trim()
      : "";
  const productionUrlFromContext =
    typeof pluginCapture?.context?.publishInfo?.production?.url === "string"
      ? pluginCapture.context.publishInfo.production.url.trim()
      : "";
  const stagingUrlFromContext =
    typeof pluginCapture?.context?.publishInfo?.staging?.url === "string"
      ? pluginCapture.context.publishInfo.staging.url.trim()
      : "";
  const sourceUrl =
    sourceUrlRaw ||
    publishedUrlFromContext ||
    productionUrlFromContext ||
    stagingUrlFromContext ||
    (projectId ? `framer://project/${projectId}` : "");
  if (!sourceUrl && !pluginCapture) {
    throw new Error("sourceUrl or pluginCapture is required.");
  }

  const selector =
    typeof input?.selector === "string" && input.selector.trim()
      ? input.selector.trim()
      : undefined;
  const exportMode = normalizeExportMode(
    input?.exportMode ?? pluginCapture?.context?.exportMode,
  );
  if (!exportMode) {
    throw new Error(
      "Missing exportMode: request must specify selection, components, or full-site.",
    );
  }
  const id = `job_${crypto.randomBytes(8).toString("hex")}`;
  const now = new Date().toISOString();

  const job: LocalExportJob = {
    id,
    status: "queued",
    sourceUrl: sourceUrl || undefined,
    selector,
    exportMode,
    pluginCapture,
    createdAt: now,
    updatedAt: now,
    revision: {
      kind: "initial",
    },
  };

  await writeJob(job);
  return job;
}

async function createImprovementJobFromParent(
  parentJobId: string,
  input: Record<string, unknown>,
): Promise<LocalExportJob> {
  const parent = await readJob(parentJobId);
  if (!parent) {
    throw new Error(`Parent job not found: ${parentJobId}`);
  }
  if (!parent.sourceUrl && !parent.pluginCapture) {
    throw new Error(
      `Parent job ${parentJobId} does not have enough source context to create an improved revision.`,
    );
  }

  const requestedFocus = normalizeRevisionFocus(input.requestedFocus);
  const parentRevisionId = await readParentRevisionId(parent);
  const pluginCapture =
    input.pluginCapture !== undefined
      ? cloneSerializable(input.pluginCapture)
      : cloneSerializable(parent.pluginCapture);
  const sourceUrl =
    typeof input.sourceUrl === "string" && input.sourceUrl.trim()
      ? input.sourceUrl.trim()
      : parent.sourceUrl;
  const selector =
    typeof input.selector === "string" && input.selector.trim()
      ? input.selector.trim()
      : parent.selector;
  const exportMode =
    normalizeExportMode(input.exportMode) ?? parent.exportMode;
  const id = `job_${crypto.randomBytes(8).toString("hex")}`;
  const now = new Date().toISOString();

  const job: LocalExportJob = {
    id,
    status: "queued",
    sourceUrl,
    selector,
    exportMode,
    pluginCapture,
    title: createImprovementTitle(parent, requestedFocus),
    createdAt: now,
    updatedAt: now,
    revision: {
      kind: "improvement",
      parentJobId,
      parentRevisionId,
      requestedFocus,
    },
  };

  await writeJob(job);
  return job;
}

function normalizeExportMode(value: unknown): LocalExportMode | undefined {
  if (value === "selection") return "selection";
  if (value === "full-site") return "full-site";
  if (value === "components") return "components";
  return undefined;
}

function normalizeRevisionFocus(value: unknown): LocalRevisionFocus {
  if (value === "responsiveness") return "responsiveness";
  if (value === "components") return "components";
  if (value === "revalidate") return "revalidate";
  return "both";
}

async function readParentRevisionId(job: LocalExportJob) {
  const manifestPath = job.artifacts?.revisionManifestPath;
  if (!manifestPath) return undefined;
  try {
    const raw = JSON.parse(await fs.readFile(manifestPath, "utf8")) as Record<
      string,
      unknown
    >;
    return typeof raw.revisionId === "string" ? raw.revisionId : undefined;
  } catch {
    return undefined;
  }
}

function createImprovementTitle(
  parent: LocalExportJob,
  requestedFocus: LocalRevisionFocus,
) {
  const base = parent.title ?? parent.sourceUrl ?? parent.id;
  const label =
    requestedFocus === "responsiveness"
      ? "Responsive revision"
      : requestedFocus === "components"
        ? "Component revision"
        : requestedFocus === "revalidate"
          ? "Validation rerun"
          : "Improved revision";
  return `${base} · ${label}`;
}

function cloneSerializable<T>(value: T): T {
  if (value === undefined) return value;
  return JSON.parse(JSON.stringify(value)) as T;
}
