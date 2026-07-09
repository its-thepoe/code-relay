export function canServeArtifactWhilePending(type) {
    return type !== "zip";
}
export function resolveJobArtifact(job, type) {
    const artifactPath = type === "zip"
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
    const filename = type === "zip"
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
    const contentType = type === "zip"
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
