import path from "node:path";
import fs from "node:fs/promises";
import fssync from "node:fs";
import { runLocalExport } from "../../../packages/exporter-core/src/local-export.js";

type LocalJobStatus = "queued" | "running" | "completed" | "failed";
type LocalExportMode = "selection" | "components" | "full-site";

type LocalExportJob = {
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
    requestedFocus?:
      | "responsiveness"
      | "components"
      | "both"
      | "revalidate";
  };
  artifacts?: {
    exportDir?: string;
    zipPath?: string;
    reportPath?: string;
    previewPath?: string;
    revisionManifestPath?: string;
    validationPath?: string;
    invalidationPlanPath?: string;
    artifactIndexPath?: string;
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
const artifactsDir = path.join(repoRoot, ".coderelay", "artifacts");
const legacyJobsDir = path.join(process.cwd(), ".coderelay", "jobs");
const staleRunningJobMs = 2 * 60 * 1000;
const runningHeartbeatMs = 5_000;

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
  const dirs = legacyJobsDir === jobsDir ? [jobsDir] : [jobsDir, legacyJobsDir];

  for (const dir of dirs) {
    const files = await fs.readdir(dir).catch(() => []);
    for (const file of files) {
      if (!file.endsWith(".json")) continue;
      const full = path.join(dir, file);
      const job = await readJobFile(full);
      if (!job) continue;
      const isStaleRunning =
        job.status === "running" &&
        Date.now() - new Date(job.updatedAt).getTime() > staleRunningJobMs;
      if (job.status !== "queued" && !isStaleRunning) continue;

      job.status = "running";
      if (isStaleRunning) {
        job.errorMessage = undefined;
      }
      await writeJob(job);

      // If this job lived in a legacy directory, delete the stale copy after
      // writing the authoritative version under repoRoot.
      if (dir !== jobsDir) {
        await fs.unlink(full).catch(() => undefined);
      }

      return job;
    }
  }

  return null;
}

async function processJob(job: LocalExportJob) {
  const outDir = path.join(artifactsDir, job.id);
  await fs.mkdir(outDir, { recursive: true });
  const heartbeat = setInterval(() => {
    if (job.status === "running") {
      void writeJob(job).catch(() => undefined);
    }
  }, runningHeartbeatMs);

  try {
    if (!job.exportMode) {
      throw new Error(
        "Missing exportMode: queued job cannot be passed to runLocalExport.",
      );
    }
    console.log(
      "[coderelay:worker:runLocalExport]",
      JSON.stringify({
        jobId: job.id,
        url: job.sourceUrl,
        selector: job.selector,
        exportMode: job.exportMode,
        pluginNodeCount: Array.isArray(
          (job.pluginCapture as any)?.selectedNodes,
        )
          ? (job.pluginCapture as any).selectedNodes.length
          : 0,
        revision: job.revision,
        maxAttempts: 3,
        targetFidelity: 0.95,
      }),
    );
    const result = await runLocalExport({
      url: job.sourceUrl,
      pluginCapture: job.pluginCapture as any,
      outDir,
      selector: job.selector,
      exportMode: job.exportMode,
      maxAttempts: 3,
      targetFidelity: 0.95,
      revisionRequest: job.revision,
      onProgress: async (progress) => {
        job.progress = progress;
        await writeJob(job);
      },
    });

    console.log(
      "[coderelay:worker:export-result]",
      JSON.stringify({
        jobId: job.id,
        exportMode: job.exportMode,
        exportDir: result.exportDir,
        zipPath: result.zipPath,
        validation: result.validation,
      }),
    );
    job.status = "completed";
    job.artifacts = {
      exportDir: result.exportDir,
      zipPath: result.zipPath,
      reportPath: result.reportPath,
      previewPath: result.previewPath,
      revisionManifestPath: result.revisionManifestPath,
      validationPath: path.join(result.exportDir, "generated-validation.json"),
      invalidationPlanPath: result.invalidationPlanPath,
      artifactIndexPath: result.artifactIndexPath,
    };
    job.errorMessage = undefined;
    job.progress = { stage: "Completed" };
    await writeJob(job);
  } catch (error) {
    job.status = "failed";
    job.errorMessage = error instanceof Error ? error.message : String(error);
    job.progress = {
      ...(job.progress ?? { stage: "Failed" }),
      stage: "Failed",
    };
    await writeJob(job);
  } finally {
    clearInterval(heartbeat);
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
    console.log(`[worker] ${job.status} ${job.id}`);
  }
}

await main();
