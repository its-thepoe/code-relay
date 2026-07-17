export function readExportHealth(report) {
    const sourceEvidence = report?.sourceEvidence && typeof report.sourceEvidence === "object"
        ? report.sourceEvidence
        : null;
    const status = sourceEvidence?.status;
    if (status === "complete" || status === "partial") {
        return status;
    }
    return "unknown";
}
export function readExportCompletion(report) {
    const generatedValidation = report?.generatedValidation &&
        typeof report.generatedValidation === "object"
        ? report.generatedValidation
        : null;
    const packagedArchive = generatedValidation?.packagedArchive &&
        typeof generatedValidation.packagedArchive === "object"
        ? generatedValidation.packagedArchive
        : null;
    const routes = Array.isArray(generatedValidation?.routes)
        ? generatedValidation.routes
        : null;
    const pageErrors = Array.isArray(generatedValidation?.pageErrors)
        ? generatedValidation.pageErrors
        : null;
    const externalRequests = Array.isArray(generatedValidation?.externalRequests)
        ? generatedValidation.externalRequests
        : null;
    const failedRequests = Array.isArray(generatedValidation?.failedRequests)
        ? generatedValidation.failedRequests
        : null;
    if (generatedValidation?.status === "passed" &&
        packagedArchive?.verified === true &&
        routes &&
        pageErrors &&
        externalRequests &&
        failedRequests &&
        pageErrors.length === 0 &&
        externalRequests.length === 0 &&
        failedRequests.length === 0) {
        return "verified";
    }
    return "incomplete";
}
export function createCompletedOutcomeCopy(input) {
    const exportHealth = readExportHealth(input.report);
    const exportCompletion = readExportCompletion(input.report);
    if (exportHealth === "partial") {
        if (input.surface === "plugin-card") {
            return "Export complete with partial source-aware evidence. Review the report before trusting it as a reusable baseline.";
        }
        if (input.surface === "job-banner") {
            return "Export completed with partial source-aware evidence. Review warnings before trusting the output as a full-fidelity baseline.";
        }
        return "completed with partial source-aware evidence";
    }
    if (exportCompletion !== "verified") {
        if (input.surface === "plugin-card") {
            return "Export finished, but required completion evidence is incomplete. Review validation before trusting this output.";
        }
        if (input.surface === "job-banner") {
            return "Export finished, but required completion evidence is incomplete. Review validation before using the artifacts.";
        }
        return "finished with incomplete completion evidence";
    }
    if (input.surface === "plugin-card") {
        return "Export complete. Download the ZIP or inspect the dashboard.";
    }
    if (input.surface === "job-banner") {
        return "Export completed. Artifacts are ready.";
    }
    return "completed";
}
