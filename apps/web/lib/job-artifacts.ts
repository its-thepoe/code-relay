import path from "node:path";
import type { LocalExportJob } from "./jobs-store.js";

export type JobArtifactType =
  | "zip"
  | "resolved-request"
  | "status"
  | "report"
  | "capability-report"
  | "code-compatibility"
  | "before-after"
  | "parent"
  | "revision"
  | "validation"
  | "invalidation"
  | "artifact-index"
  | "responsive-plan"
  | "preview";

export function canServeArtifactWhilePending(type: JobArtifactType) {
  return type !== "zip";
}

export function resolveJobArtifact(
  job: LocalExportJob,
  type: JobArtifactType,
): { path?: string; filename: string; contentType: string } {
  const artifactPath =
    type === "zip"
      ? job.artifacts?.zipPath
      : type === "resolved-request"
        ? job.artifacts?.resolvedRequestPath
      : type === "status"
        ? job.artifacts?.statusPath
        : type === "report"
          ? job.artifacts?.reportPath
          : type === "capability-report"
            ? job.artifacts?.capabilityReportPath
            : type === "code-compatibility"
              ? job.artifacts?.codeCompatibilityReportPath
              : type === "before-after"
                ? job.artifacts?.beforeAfterReportPath
              : type === "parent"
                ? job.artifacts?.parentInfoPath
                : type === "revision"
                  ? job.artifacts?.revisionManifestPath
                  : type === "validation"
                    ? job.artifacts?.validationPath
                    : type === "invalidation"
                      ? job.artifacts?.invalidationPlanPath
                      : type === "artifact-index"
                        ? job.artifacts?.artifactIndexPath
                        : type === "responsive-plan"
                          ? job.artifacts?.responsiveRecapturePlanPath
                          : job.artifacts?.previewPath;

  const filename =
    type === "zip"
      ? `${job.id}.zip`
      : type === "resolved-request"
        ? `${job.id}-resolved-request.json`
      : type === "status"
        ? `${job.id}-status.json`
        : type === "report"
          ? `${job.id}-report.json`
          : type === "capability-report"
            ? `${job.id}-capability-report.json`
            : type === "code-compatibility"
              ? `${job.id}-code-compatibility-report.json`
              : type === "before-after"
                ? `${job.id}-before-after-report.json`
              : type === "parent"
                ? `${job.id}-parent.json`
                : type === "revision"
                  ? `${job.id}-revision.json`
                  : type === "validation"
                    ? `${job.id}-validation.json`
                    : type === "invalidation"
                      ? `${job.id}-invalidation.json`
                      : type === "artifact-index"
                        ? `${job.id}-artifact-index.json`
                        : type === "responsive-plan"
                          ? `${job.id}-responsive-recapture-plan.json`
                          : `${job.id}-preview.html`;

  const contentType =
    type === "zip"
      ? "application/zip"
      : type === "preview"
        ? "text/html; charset=utf-8"
        : "application/json; charset=utf-8";

  return {
    path: artifactPath,
    filename,
    contentType,
  };
}

export function resolveSafeJobArtifact(
  job: LocalExportJob,
  type: JobArtifactType,
): { path?: string; filename: string; contentType: string; blocked?: boolean } {
  const artifact = resolveJobArtifact(job, type);
  if (!artifact.path) return artifact;

  const allowedDirs = [
    job.artifacts?.exportDir,
    job.artifacts?.zipPath ? path.dirname(job.artifacts.zipPath) : undefined,
  ].filter((dir): dir is string => Boolean(dir));

  if (
    allowedDirs.length === 0 ||
    !allowedDirs.some((dir) => isPathInside(dir, artifact.path!))
  ) {
    return { ...artifact, path: undefined, blocked: true };
  }

  return artifact;
}

function isPathInside(parentDir: string, childPath: string) {
  const parent = path.resolve(parentDir);
  const child = path.resolve(childPath);
  const relative = path.relative(parent, child);

  return (
    relative === "" ||
    (!relative.startsWith("..") && !path.isAbsolute(relative))
  );
}
