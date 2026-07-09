export function createReportBreakdown(input) {
    const report = input.report ?? {};
    const validation = input.validation ?? {};
    const codeCompatibilityReport = input.codeCompatibilityReport ?? {};
    const fidelity = report.visualFidelity && typeof report.visualFidelity === "object"
        ? report.visualFidelity
        : {};
    const fidelityEvidence = report.fidelityEvidence && typeof report.fidelityEvidence === "object"
        ? report.fidelityEvidence
        : {};
    const motionExtraction = report.motionExtraction && typeof report.motionExtraction === "object"
        ? report.motionExtraction
        : {};
    const assets = report.assets && typeof report.assets === "object"
        ? report.assets
        : {};
    const validationRoutes = Array.isArray(validation.routes)
        ? validation.routes
        : [];
    const failedRoutes = validationRoutes.filter((route) => {
        const rendered = route.renderedElementCount;
        return typeof rendered === "number" ? rendered <= 0 : false;
    }).length;
    const cmsCollectionCount = typeof report.cmsCollectionCount === "number" ? report.cmsCollectionCount : 0;
    const cmsCollections = Array.isArray(report.cmsCollections)
        ? report.cmsCollections
        : [];
    const cmsItemCount = cmsCollections.reduce((total, collection) => {
        const itemCount = collection.itemCount;
        return total + (typeof itemCount === "number" ? itemCount : 0);
    }, 0);
    const compatibilitySummary = codeCompatibilityReport.summary &&
        typeof codeCompatibilityReport.summary === "object"
        ? codeCompatibilityReport.summary
        : {};
    const compatibilityFileCount = typeof codeCompatibilityReport.fileCount === "number"
        ? codeCompatibilityReport.fileCount
        : 0;
    const desktop = readRounded(fidelity.desktop);
    const responsiveScores = [
        readNumber(fidelity.laptop),
        readNumber(fidelity.tablet),
        readNumber(fidelity.mobile),
    ].filter((value) => value !== undefined);
    const responsiveAverage = responsiveScores.length > 0
        ? Math.round(responsiveScores.reduce((sum, value) => sum + value, 0) /
            responsiveScores.length)
        : undefined;
    const motionScore = readRounded(fidelity.motion);
    const runtimeNodesWithMotion = typeof motionExtraction.runtimeNodesWithMotion === "number"
        ? motionExtraction.runtimeNodesWithMotion
        : 0;
    const exportNodesWithMotion = typeof motionExtraction.exportNodesWithMotion === "number"
        ? motionExtraction.exportNodesWithMotion
        : 0;
    const interactionContracts = Array.isArray(validation.interactionContracts)
        ? validation.interactionContracts
        : [];
    const failedInteractionContracts = interactionContracts.filter((contract) => contract.status === "failed").length;
    const passedInteractionContracts = interactionContracts.filter((contract) => contract.status === "passed").length;
    const interactionContractDetail = interactionContracts.length > 0
        ? `${passedInteractionContracts}/${interactionContracts.length} interaction contracts passed`
        : `${exportNodesWithMotion}/${runtimeNodesWithMotion} motion-capable nodes exported`;
    const interactionTone = interactionContracts.length > 0
        ? failedInteractionContracts === 0
            ? "good"
            : "warn"
        : scoreTone(motionScore);
    return [
        {
            key: "build-validity",
            label: "Build validity",
            value: typeof validation.status === "string" ? String(validation.status) : "-",
            tone: validation.status === "passed" ? "good" : "warn",
            detail: `${typeof validation.generatedFileCount === "number" ? validation.generatedFileCount : 0} generated files`,
        },
        {
            key: "route-validity",
            label: "Route validity",
            value: `${validationRoutes.length} checked`,
            tone: failedRoutes === 0 ? "good" : "warn",
            detail: failedRoutes === 0 ? "No empty routes detected" : `${failedRoutes} route(s) rendered empty`,
        },
        {
            key: "desktop-fidelity",
            label: "Desktop fidelity",
            value: desktop !== undefined ? `${desktop}` : "-",
            tone: scoreTone(desktop),
            detail: `Overall visual fidelity baseline on desktop`,
        },
        {
            key: "visual-evidence",
            label: "Visual evidence",
            value: typeof fidelityEvidence.mode === "string"
                ? String(fidelityEvidence.mode)
                : "-",
            tone: fidelityEvidence.mode === "screenshot-backed" ? "good" : "warn",
            detail: typeof fidelityEvidence.reason === "string"
                ? fidelityEvidence.reason
                : "No visual evidence summary recorded",
        },
        {
            key: "responsive-fidelity",
            label: "Responsive fidelity",
            value: responsiveAverage !== undefined ? `${responsiveAverage}` : "-",
            tone: scoreTone(responsiveAverage),
            detail: responsiveScores.length > 0
                ? `Laptop, tablet, and mobile average`
                : "No responsive score recorded",
        },
        {
            key: "interaction-fidelity",
            label: "Interaction fidelity",
            value: motionScore !== undefined ? `${motionScore}` : "-",
            tone: interactionTone,
            detail: interactionContractDetail,
        },
        {
            key: "code-component-portability",
            label: "Code Component portability",
            value: compatibilityFileCount > 0
                ? `${Number(compatibilitySummary.portable ?? 0)}/${compatibilityFileCount} portable`
                : "-",
            tone: compatibilityFileCount === 0 ||
                Number(compatibilitySummary.unsupported ?? 0) === 0
                ? "good"
                : "warn",
            detail: `${Number(compatibilitySummary.runtimeFallbackRequired ?? 0)} runtime fallback, ${Number(compatibilitySummary.unsupported ?? 0)} unsupported`,
        },
        {
            key: "cms-completeness",
            label: "CMS completeness",
            value: `${cmsCollectionCount} collections`,
            tone: cmsCollectionCount > 0 ? "good" : "neutral",
            detail: cmsCollectionCount > 0 ? `${cmsItemCount} items captured` : "No CMS collections detected",
        },
        {
            key: "asset-portability",
            label: "Asset portability",
            value: `${typeof assets.linked === "number" ? assets.linked : 0} linked`,
            tone: Number(assets.failed ?? 0) === 0 ? "good" : "warn",
            detail: `${typeof assets.downloaded === "number" ? assets.downloaded : 0} downloaded, ${typeof assets.failed === "number" ? assets.failed : 0} failed`,
        },
    ];
}
function readNumber(value) {
    return typeof value === "number" && Number.isFinite(value) ? value : undefined;
}
function readRounded(value) {
    const number = readNumber(value);
    return number === undefined ? undefined : Math.round(number);
}
function scoreTone(value) {
    if (value === undefined)
        return "neutral";
    if (value >= 75)
        return "good";
    return "warn";
}
