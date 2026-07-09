import fs from "node:fs/promises";
import path from "node:path";
import { migrateLegacyExportToRevision } from "../packages/exporter-core/src/local-export.js";

type LocalExportJob = {
  id: string;
  status: "queued" | "running" | "completed" | "failed";
  sourceUrl?: string;
  selector?: string;
  exportMode?: "selection" | "components" | "full-site";
  pluginCapture?: unknown;
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
    statusPath?: string;
    capabilityReportPath?: string;
    codeCompatibilityReportPath?: string;
    parentInfoPath?: string;
    revisionManifestPath?: string;
    validationPath?: string;
    invalidationPlanPath?: string;
    artifactIndexPath?: string;
    responsiveRecapturePlanPath?: string;
  };
};

async function main() {
  const jobId = readFlagValue("--job");
  if (!jobId) {
    throw new Error("Missing --job. Example: npm run export:migrate-job -- --job job_042076bbe22a7e55");
  }

  const repoRoot = process.cwd();
  const jobPath = path.join(repoRoot, ".coderelay", "jobs", `${jobId}.json`);
  const raw = JSON.parse(await fs.readFile(jobPath, "utf8")) as LocalExportJob;

  if (raw.status !== "completed") {
    throw new Error(`Job ${jobId} is not completed and cannot be migrated.`);
  }
  if (!raw.artifacts?.exportDir) {
    throw new Error(`Job ${jobId} does not have an exportDir to migrate.`);
  }

  const migration = await migrateLegacyExportToRevision({
    jobId,
    exportDir: raw.artifacts.exportDir,
    sourceUrl: raw.sourceUrl,
    exportMode: raw.exportMode,
    selector: raw.selector,
    pluginCapture: raw.pluginCapture as any,
  });

  raw.revision = raw.revision ?? { kind: "initial" };
  raw.artifacts = {
    ...raw.artifacts,
    exportDir: raw.artifacts.exportDir,
    statusPath: migration.statusPath,
    capabilityReportPath: migration.capabilityReportPath,
    revisionManifestPath: migration.revisionManifestPath,
    validationPath: path.join(raw.artifacts.exportDir, "generated-validation.json"),
    invalidationPlanPath: migration.invalidationPlanPath,
    artifactIndexPath: migration.artifactIndexPath,
    responsiveRecapturePlanPath: migration.responsiveRecapturePlanPath,
  };

  await fs.writeFile(jobPath, `${JSON.stringify(raw, null, 2)}\n`);

  console.log(
    JSON.stringify(
      {
        jobId,
        revisionId: migration.revisionId,
        revisionManifestPath: migration.revisionManifestPath,
        artifactIndexPath: migration.artifactIndexPath,
        responsiveRecapturePlanPath: migration.responsiveRecapturePlanPath ?? null,
        statusPath: migration.statusPath,
        revisionCacheDir: migration.revisionCacheDir,
      },
      null,
      2,
    ),
  );
}

function readFlagValue(flag: string) {
  const index = process.argv.indexOf(flag);
  if (index < 0) return undefined;
  return process.argv[index + 1];
}

await main();
