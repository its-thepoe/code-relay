import fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";

export type LocalJobStatus = "queued" | "running" | "completed" | "failed";

export type LocalExportJob = {
  id: string;
  status: LocalJobStatus;
  sourceUrl?: string;
  selector?: string;
  pluginCapture?: unknown;
  title?: string;
  createdAt: string;
  updatedAt: string;
  errorMessage?: string;
  artifacts?: {
    exportDir?: string;
    zipPath?: string;
    reportPath?: string;
    previewPath?: string;
  };
};

const rootDir = process.cwd();
const jobsDir = path.join(rootDir, ".coderelay", "jobs");

async function ensureDirs() {
  await fs.mkdir(jobsDir, { recursive: true });
}

function jobPath(id: string) {
  return path.join(jobsDir, `${id}.json`);
}

export async function readAllJobs(): Promise<LocalExportJob[]> {
  await ensureDirs();
  const files = await fs.readdir(jobsDir).catch(() => []);
  const jsonFiles = files.filter((file) => file.endsWith(".json"));

  const jobs = await Promise.all(
    jsonFiles.map(async (file) => {
      try {
        const raw = await fs.readFile(path.join(jobsDir, file), "utf8");
        return JSON.parse(raw) as LocalExportJob;
      } catch {
        return null;
      }
    }),
  );

  return jobs
    .filter(Boolean)
    .sort((a, b) =>
      b!.createdAt.localeCompare(a!.createdAt),
    ) as LocalExportJob[];
}

export async function readJob(id: string): Promise<LocalExportJob | null> {
  await ensureDirs();
  const filePath = jobPath(id);
  try {
    const raw = await fs.readFile(filePath, "utf8");
    return JSON.parse(raw) as LocalExportJob;
  } catch {
    return null;
  }
}

export async function writeJob(job: LocalExportJob) {
  await ensureDirs();
  await fs.writeFile(jobPath(job.id), `${JSON.stringify(job, null, 2)}\n`);
}

export async function createJobFromRequest(
  input: any,
): Promise<LocalExportJob> {
  const pluginCapture = input?.pluginCapture;
  const projectId =
    typeof pluginCapture?.project?.id === "string"
      ? pluginCapture.project.id
      : undefined;
  const sourceUrlRaw =
    typeof input?.sourceUrl === "string" ? input.sourceUrl.trim() : "";
  const sourceUrl =
    sourceUrlRaw || (projectId ? `framer://project/${projectId}` : "");
  if (!sourceUrl && !pluginCapture) {
    throw new Error(
      "sourceUrl or pluginCapture is required.",
    );
  }

  const selector =
    typeof input?.selector === "string" && input.selector.trim()
      ? input.selector.trim()
      : undefined;
  const id = `job_${crypto.randomBytes(8).toString("hex")}`;
  const now = new Date().toISOString();

  const job: LocalExportJob = {
    id,
    status: "queued",
    sourceUrl: sourceUrl || undefined,
    selector,
    pluginCapture,
    createdAt: now,
    updatedAt: now,
  };

  await writeJob(job);
  return job;
}
