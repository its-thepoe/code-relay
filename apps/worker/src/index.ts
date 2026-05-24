import path from "node:path";
import fs from "node:fs/promises";
import { runLocalExport } from "../../../packages/exporter-core/src/local-export.js";

type LocalJobStatus = "queued" | "running" | "completed" | "failed";

type LocalExportJob = {
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
const artifactsDir = path.join(rootDir, ".coderelay", "artifacts");

async function sleep(ms: number) {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

async function ensureDirs() {
  await fs.mkdir(jobsDir, { recursive: true });
  await fs.mkdir(artifactsDir, { recursive: true });
}

function jobPath(id: string) {
  return path.join(jobsDir, `${id}.json`);
}

async function readJobFile(filePath: string): Promise<LocalExportJob | null> {
  try {
    const raw = await fs.readFile(filePath, "utf8");
    return JSON.parse(raw) as LocalExportJob;
  } catch {
    return null;
  }
}

async function writeJob(job: LocalExportJob) {
  const now = new Date().toISOString();
  job.updatedAt = now;
  await fs.writeFile(jobPath(job.id), `${JSON.stringify(job, null, 2)}\n`);
}

async function claimNextJob(): Promise<LocalExportJob | null> {
  const files = await fs.readdir(jobsDir).catch(() => []);
  for (const file of files) {
    if (!file.endsWith(".json")) continue;
    const full = path.join(jobsDir, file);
    const job = await readJobFile(full);
    if (!job) continue;
    if (job.status !== "queued") continue;

    job.status = "running";
    await writeJob(job);
    return job;
  }
  return null;
}

async function processJob(job: LocalExportJob) {
  const outDir = path.join(artifactsDir, job.id);
  await fs.mkdir(outDir, { recursive: true });

  try {
    const result = await runLocalExport({
      url: job.sourceUrl,
      pluginCapture: job.pluginCapture as any,
      outDir,
      selector: job.selector,
      maxAttempts: 3,
      targetFidelity: 0.95,
    });

    job.status = "completed";
    job.artifacts = {
      exportDir: result.exportDir,
      zipPath: result.zipPath,
      reportPath: result.reportPath,
      previewPath: result.previewPath,
    };
    job.errorMessage = undefined;
    await writeJob(job);
  } catch (error) {
    job.status = "failed";
    job.errorMessage = error instanceof Error ? error.message : String(error);
    await writeJob(job);
  }
}

async function main() {
  await ensureDirs();
  // eslint-disable-next-line no-console
  console.log("[worker] coderelay local worker started");

  // simple forever loop
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const job = await claimNextJob();
    if (!job) {
      await sleep(750);
      continue;
    }

    // eslint-disable-next-line no-console
    console.log(`[worker] processing ${job.id} (${job.sourceUrl ?? "no-url"})`);
    await processJob(job);
    // eslint-disable-next-line no-console
    console.log(`[worker] done ${job.id}`);
  }
}

await main();
