export function collectRevisionFamily(jobs, currentJobId) {
    const byId = new Map(jobs.map((job) => [job.id, job]));
    const currentJob = byId.get(currentJobId);
    if (!currentJob)
        return [];
    const rootId = findRootJobId(currentJob, byId);
    return jobs
        .filter((job) => findRootJobId(job, byId) === rootId)
        .map((job) => ({
        job,
        depth: findRevisionDepth(job, byId),
        isCurrent: job.id === currentJobId,
    }))
        .sort((first, second) => {
        if (first.depth !== second.depth)
            return first.depth - second.depth;
        return first.job.createdAt.localeCompare(second.job.createdAt);
    });
}
export function buildBeforeAfterSummary(currentReport, parentReport) {
    if (!currentReport || !parentReport)
        return [];
    const metrics = [
        createMetricDelta("Overall fidelity", readNumber(currentReport.visualFidelity, "overall"), readNumber(parentReport.visualFidelity, "overall"), formatRoundedNumber),
        createMetricDelta("Rendered routes", readNumber(currentReport.generatedValidation, "routes.length"), readNumber(parentReport.generatedValidation, "routes.length"), formatInteger),
        createMetricDelta("Rendered elements", readNumber(currentReport.generatedValidation, "renderedElementCount"), readNumber(parentReport.generatedValidation, "renderedElementCount"), formatInteger),
        createMetricDelta("Route templates", readNumber(currentReport, "routeTemplateCount"), readNumber(parentReport, "routeTemplateCount"), formatInteger),
        createMetricDelta("Component families", readNumber(currentReport, "componentFamilyCount"), readNumber(parentReport, "componentFamilyCount"), formatInteger),
    ].filter((entry) => Boolean(entry));
    return metrics;
}
function createMetricDelta(label, currentValue, parentValue, formatter) {
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
        delta: deltaValue === 0
            ? "0"
            : `${deltaValue > 0 ? "+" : ""}${formatter(deltaValue)}`,
    };
}
function readNumber(value, path) {
    const parts = path.split(".");
    let current = value;
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
        current = current[part];
    }
    return typeof current === "number" && Number.isFinite(current)
        ? current
        : undefined;
}
function formatInteger(value) {
    return `${Math.round(value)}`;
}
function formatRoundedNumber(value) {
    return `${Math.round(value)}`;
}
function findRootJobId(job, byId) {
    let current = job;
    const seen = new Set();
    while (current?.revision?.parentJobId) {
        if (seen.has(current.id))
            break;
        seen.add(current.id);
        const parent = byId.get(current.revision.parentJobId);
        if (!parent)
            break;
        current = parent;
    }
    return current?.id ?? job.id;
}
function findRevisionDepth(job, byId) {
    let depth = 0;
    let current = job;
    const seen = new Set();
    while (current?.revision?.parentJobId) {
        if (seen.has(current.id))
            break;
        seen.add(current.id);
        const parent = byId.get(current.revision.parentJobId);
        if (!parent)
            break;
        depth += 1;
        current = parent;
    }
    return depth;
}
