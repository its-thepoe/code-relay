type ExportMode = "selection" | "components" | "full-site";

type CapabilityReport = {
  projectInfo?: { readable?: boolean };
  publishInfo?: { readable?: boolean };
  codeFiles?: {
    readable?: boolean;
    count?: number;
    contentReadableCount?: number;
  };
  cms?: {
    collectionCount?: number;
  };
  styles?: {
    colorStylesReadable?: boolean;
    textStylesReadable?: boolean;
    fontsReadable?: boolean;
  };
};

type PluginContext = {
  publishedUrl?: string | null;
  sitePages?: Array<Record<string, unknown>>;
  componentModules?: Array<Record<string, unknown>>;
  codeFiles?: Array<Record<string, unknown>>;
  cmsCollections?: Array<Record<string, unknown>>;
  capabilities?: {
    capabilityReport?: CapabilityReport;
  };
};

export type PreflightSummary = {
  runtimeSource: string;
  exportEngine: string;
  capabilityState: "ready" | "partial" | "missing-runtime";
  capabilityBadges: string[];
  staticPageCount: number;
  cmsTemplateCount: number;
  cmsItemCount: number;
  componentCount: number;
  codeFileCount: number;
  responsiveCaptureCount: number;
};

export type JobOutcomeSummary = {
  cacheStatus: string;
  exportHealth: string;
  buildStatus: string;
  routeCount: number | null;
  desktopScore: number | null;
  responsiveScore: number | null;
};

export type FinalReportCard = {
  key:
    | "build-validity"
    | "route-validity"
    | "desktop-fidelity"
    | "responsive-fidelity"
    | "interaction-fidelity"
    | "code-component-portability"
    | "cms-completeness"
    | "asset-portability";
  label: string;
  value: string;
  tone: "good" | "warn" | "neutral";
};

export function createPreflightSummary(input: {
  exportMode: ExportMode;
  sourceUrl: string;
  resolvedSourceUrl: string;
  selectionCount: number;
  selectedComponentCount: number;
  componentCount: number;
  context?: PluginContext | null;
}) : PreflightSummary {
  const runtimeSource =
    input.sourceUrl.trim() || input.resolvedSourceUrl.trim() || "project context";
  const capabilityReport = input.context?.capabilities?.capabilityReport;
  const pages = Array.isArray(input.context?.sitePages) ? input.context!.sitePages! : [];
  const cmsCollections = Array.isArray(input.context?.cmsCollections)
    ? input.context!.cmsCollections!
    : [];
  const componentModules = Array.isArray(input.context?.componentModules)
    ? input.context!.componentModules!
    : [];
  const codeFiles = Array.isArray(input.context?.codeFiles)
    ? input.context!.codeFiles!
    : [];

  const cmsTemplateCount = pages.filter((page) => {
    const templateKind = page.templateKind;
    return templateKind === "cms";
  }).length;
  const cmsItemCount = cmsCollections.reduce((total, collection) => {
    const items = Array.isArray(collection.items) ? collection.items.length : 0;
    const itemIds = Array.isArray(collection.itemIds) ? collection.itemIds.length : 0;
    return total + Math.max(items, itemIds);
  }, 0);
  const staticPageCount = pages.filter((page) => {
    const templateKind = page.templateKind;
    return templateKind !== "cms";
  }).length;

  const capabilityBadges = [
    capabilityReport?.projectInfo?.readable ? "project" : null,
    capabilityReport?.publishInfo?.readable ? "publish" : null,
    capabilityReport?.codeFiles?.readable ? "code files" : null,
    capabilityReport?.styles?.colorStylesReadable ||
    capabilityReport?.styles?.textStylesReadable
      ? "styles"
      : null,
    capabilityReport?.styles?.fontsReadable ? "fonts" : null,
    (capabilityReport?.cms?.collectionCount ?? 0) > 0 ? "cms" : null,
  ].filter((entry): entry is string => Boolean(entry));

  const capabilityState =
    input.exportMode === "full-site" &&
    !/^https?:\/\//.test(runtimeSource) &&
    !/^https?:\/\//.test(String(input.context?.publishedUrl ?? ""))
      ? "missing-runtime"
      : capabilityBadges.length >= 4
        ? "ready"
        : "partial";

  return {
    runtimeSource,
    exportEngine:
      input.exportMode === "full-site"
        ? "hybrid"
        : input.exportMode === "components"
          ? "component-module"
          : /^https?:\/\//.test(runtimeSource)
            ? "published-runtime"
            : "plugin-approximation",
    capabilityState,
    capabilityBadges,
    staticPageCount:
      input.exportMode === "full-site" ? staticPageCount : Math.min(1, input.selectionCount),
    cmsTemplateCount: input.exportMode === "full-site" ? cmsTemplateCount : 0,
    cmsItemCount: input.exportMode === "full-site" ? cmsItemCount : 0,
    componentCount:
      input.exportMode === "components"
        ? input.selectedComponentCount || input.componentCount
        : componentModules.length > 0
          ? componentModules.length
          : input.selectedComponentCount,
    codeFileCount:
      typeof capabilityReport?.codeFiles?.count === "number"
        ? capabilityReport.codeFiles.count
        : codeFiles.length,
    responsiveCaptureCount:
      input.exportMode === "full-site"
        ? staticPageCount + cmsTemplateCount
        : 1,
  };
}

export function describeJobProgress(job: {
  status: "queued" | "running" | "completed" | "failed";
  progress?: {
    stage?: string;
    completed?: number;
    total?: number;
    routePath?: string;
    failed?: number;
  };
}) {
  if (job.status === "completed") {
    return "Build and validation completed.";
  }
  if (job.status === "failed") {
    return "The worker failed before artifacts were ready.";
  }
  if (job.status === "queued") {
    return "Job created. Waiting for the local worker to pick it up.";
  }

  const stage = job.progress?.stage || "Running";
  const counts =
    typeof job.progress?.completed === "number" &&
    typeof job.progress?.total === "number"
      ? ` ${job.progress.completed}/${job.progress.total}`
      : "";
  const route = job.progress?.routePath ? ` • ${job.progress.routePath}` : "";
  const failed =
    typeof job.progress?.failed === "number" && job.progress.failed > 0
      ? ` • ${job.progress.failed} skipped`
      : "";

  return `${stage}${counts}${route}${failed}`;
}

export function createJobOutcomeSummary(report?: Record<string, unknown> | null) {
  const sourceEvidence =
    report?.sourceEvidence && typeof report.sourceEvidence === "object"
      ? (report.sourceEvidence as Record<string, unknown>)
      : null;
  const validation =
    report?.generatedValidation && typeof report.generatedValidation === "object"
      ? (report.generatedValidation as Record<string, unknown>)
      : null;
  const visualFidelity =
    report?.visualFidelity && typeof report.visualFidelity === "object"
      ? (report.visualFidelity as Record<string, unknown>)
      : null;
  const routeCount =
    Array.isArray(validation?.routes) ? validation!.routes.length : null;
  const responsiveScores = [
    readNumber(visualFidelity?.laptop),
    readNumber(visualFidelity?.tablet),
    readNumber(visualFidelity?.mobile),
  ].filter((value): value is number => value !== null);

  return {
    cacheStatus:
      report?.revisionCacheHit === true
        ? "cache hit"
        : report?.revisionCacheHit === false
          ? "fresh write"
          : "unknown",
    exportHealth:
      typeof sourceEvidence?.status === "string" ? sourceEvidence.status : "unknown",
    buildStatus:
      typeof validation?.status === "string" ? validation.status : "unknown",
    routeCount,
    desktopScore: roundNumber(visualFidelity?.desktop),
    responsiveScore:
      responsiveScores.length > 0
        ? Math.round(
            responsiveScores.reduce((total, value) => total + value, 0) /
              responsiveScores.length,
          )
        : null,
  } satisfies JobOutcomeSummary;
}

export function createFinalReportCards(report?: Record<string, unknown> | null) {
  const validation =
    report?.generatedValidation && typeof report.generatedValidation === "object"
      ? (report.generatedValidation as Record<string, unknown>)
      : null;
  const visualFidelity =
    report?.visualFidelity && typeof report.visualFidelity === "object"
      ? (report.visualFidelity as Record<string, unknown>)
      : null;
  const motionExtraction =
    report?.motionExtraction && typeof report.motionExtraction === "object"
      ? (report.motionExtraction as Record<string, unknown>)
      : null;
  const assets =
    report?.assets && typeof report.assets === "object"
      ? (report.assets as Record<string, unknown>)
      : null;
  const routes = Array.isArray(validation?.routes)
    ? (validation!.routes as Array<Record<string, unknown>>)
    : [];
  const failedRoutes = routes.filter((route) => {
    const rendered = route.renderedElementCount;
    return typeof rendered === "number" ? rendered <= 0 : false;
  }).length;
  const responsiveScores = [
    readNumber(visualFidelity?.laptop),
    readNumber(visualFidelity?.tablet),
    readNumber(visualFidelity?.mobile),
  ].filter((value): value is number => value !== null);
  const compatibility =
    report?.codeCompatibility && typeof report.codeCompatibility === "object"
      ? (report.codeCompatibility as Record<string, unknown>)
      : null;
  const compatibilitySummary =
    compatibility?.summary && typeof compatibility.summary === "object"
      ? (compatibility.summary as Record<string, unknown>)
      : null;
  const cmsCollections = Array.isArray(report?.cmsCollections)
    ? (report!.cmsCollections as Array<Record<string, unknown>>)
    : [];
  const cmsItemCount = cmsCollections.reduce((total, collection) => {
    const itemCount = collection.itemCount;
    return total + (typeof itemCount === "number" ? itemCount : 0);
  }, 0);

  return [
    {
      key: "build-validity",
      label: "Build",
      value: typeof validation?.status === "string" ? validation.status : "-",
      tone: validation?.status === "passed" ? "good" : "warn",
    },
    {
      key: "route-validity",
      label: "Routes",
      value: routes.length > 0 ? `${routes.length}` : "-",
      tone: failedRoutes === 0 ? "good" : "warn",
    },
    {
      key: "desktop-fidelity",
      label: "Desktop",
      value: formatScore(visualFidelity?.desktop),
      tone: scoreTone(readNumber(visualFidelity?.desktop)),
    },
    {
      key: "responsive-fidelity",
      label: "Responsive",
      value:
        responsiveScores.length > 0
          ? String(
              Math.round(
                responsiveScores.reduce((total, value) => total + value, 0) /
                  responsiveScores.length,
              ),
            )
          : "-",
      tone: scoreTone(
        responsiveScores.length > 0
          ? responsiveScores.reduce((total, value) => total + value, 0) /
              responsiveScores.length
          : null,
      ),
    },
    {
      key: "interaction-fidelity",
      label: "Interaction",
      value: formatScore(visualFidelity?.motion),
      tone: scoreTone(readNumber(visualFidelity?.motion)),
    },
    {
      key: "code-component-portability",
      label: "Portability",
      value:
        typeof compatibility?.fileCount === "number"
          ? `${Number(compatibilitySummary?.portable ?? 0)}/${compatibility.fileCount}`
          : "-",
      tone:
        Number(compatibilitySummary?.unsupported ?? 0) > 0 ? "warn" : "good",
    },
    {
      key: "cms-completeness",
      label: "CMS",
      value:
        typeof report?.cmsCollectionCount === "number"
          ? `${report.cmsCollectionCount}`
          : "-",
      tone:
        typeof report?.cmsCollectionCount === "number" &&
        report.cmsCollectionCount > 0
          ? "good"
          : "neutral",
    },
    {
      key: "asset-portability",
      label: "Assets",
      value:
        typeof assets?.linked === "number" ? `${assets.linked}` : "-",
      tone: Number(assets?.failed ?? 0) > 0 ? "warn" : "good",
    },
  ] satisfies FinalReportCard[];
}

export function createCapabilityBadges(report?: Record<string, unknown> | null) {
  if (!report) return [];

  return [
    report.projectInfo && typeof report.projectInfo === "object" &&
    (report.projectInfo as Record<string, unknown>).readable
      ? "project"
      : null,
    report.publishInfo && typeof report.publishInfo === "object" &&
    (report.publishInfo as Record<string, unknown>).readable
      ? "publish"
      : null,
    report.codeFiles && typeof report.codeFiles === "object" &&
    (report.codeFiles as Record<string, unknown>).readable
      ? "code files"
      : null,
    report.styles && typeof report.styles === "object" &&
    ((report.styles as Record<string, unknown>).colorStylesReadable ||
      (report.styles as Record<string, unknown>).textStylesReadable)
      ? "styles"
      : null,
    report.styles && typeof report.styles === "object" &&
    (report.styles as Record<string, unknown>).fontsReadable
      ? "fonts"
      : null,
    report.cms && typeof report.cms === "object" &&
    Number((report.cms as Record<string, unknown>).collectionCount ?? 0) > 0
      ? "cms"
      : null,
  ].filter((value): value is string => Boolean(value));
}

function readNumber(value: unknown) {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function roundNumber(value: unknown) {
  const number = readNumber(value);
  return number === null ? null : Math.round(number);
}

function formatScore(value: unknown) {
  const number = roundNumber(value);
  return number === null ? "-" : String(number);
}

function scoreTone(value: number | null): "good" | "warn" | "neutral" {
  if (value === null) return "neutral";
  if (value >= 75) return "good";
  return "warn";
}
