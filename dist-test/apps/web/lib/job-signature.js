export function buildJobSignature(payload) {
    if (Array.isArray(payload)) {
        return payload
            .map((job) => (isJobLike(job) ? buildSingleJobSignature(job) : ""))
            .join("|");
    }
    return isJobLike(payload) ? buildSingleJobSignature(payload) : "";
}
export function buildSingleJobSignature(job) {
    const progress = job.progress;
    const artifacts = job.artifacts;
    return [
        job.id,
        job.status,
        progress?.stage ?? "",
        progress?.routePath ?? "",
        progress?.failed ?? "",
        artifacts?.exportDir ? "export" : "",
        artifacts?.zipPath ? "zip" : "",
        artifacts?.reportPath ? "report" : "",
        artifacts?.previewPath ? "preview" : "",
        artifacts?.capabilityReportPath ? "capability" : "",
        artifacts?.codeCompatibilityReportPath ? "compatibility" : "",
        artifacts?.revisionManifestPath ? "revision" : "",
        artifacts?.validationPath ? "validation" : "",
        artifacts?.invalidationPlanPath ? "invalidation" : "",
        artifacts?.artifactIndexPath ? "artifact-index" : "",
        artifacts?.responsiveRecapturePlanPath ? "responsive-plan" : "",
        job.errorMessage ?? "",
    ].join(":");
}
function isJobLike(value) {
    return (typeof value === "object" &&
        value !== null &&
        "id" in value &&
        "status" in value &&
        typeof value.id === "string" &&
        typeof value.status === "string");
}
