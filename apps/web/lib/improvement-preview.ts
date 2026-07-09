import fs from "node:fs/promises";
import path from "node:path";
import type {
  LocalExportJob,
  LocalRevisionFocus,
} from "./jobs-store.js";

type SourceArtifactsManifest = {
  componentFamiliesArtifactId?: string;
  codeFiles?: Array<{
    id?: string;
    name?: string;
    path?: string;
    versionId?: string;
    artifactId: string;
    metadataArtifactId?: string;
    sourceArtifactId?: string;
    hasContent: boolean;
    contentHash?: string;
    contentByteLength?: number;
  }>;
};

type ResponsivePlan = {
  templateCount?: number;
  routeCount?: number;
  templates?: Array<{
    routesToCapture?: string[];
  }>;
  targetViewports?: string[];
};

export type ImprovementPreview = {
  requestedFocus: LocalRevisionFocus;
  reusedCount: number;
  invalidatedCount: number;
  reusedArtifacts: string[];
  invalidatedArtifacts: string[];
  estimatedTemplates: number;
  estimatedRoutes: number;
  expectedTime: string;
  responsiveViewports: string[];
};

export async function buildImprovementPreviewsForJob(
  job: LocalExportJob,
): Promise<ImprovementPreview[]> {
  const sourceArtifacts = await readSourceArtifactsManifest(job);
  const responsivePlan = await readResponsivePlan(job);
  const report = await readJsonIfExists(job.artifacts?.reportPath);
  const parentRevisionId = await readParentRevisionId(job);

  const routeTemplateCount =
    typeof report?.routeTemplateCount === "number"
      ? report.routeTemplateCount
      : typeof responsivePlan?.templateCount === "number"
        ? responsivePlan.templateCount
        : 0;
  const componentFamilyCount =
    typeof report?.componentFamilyCount === "number"
      ? report.componentFamilyCount
      : 0;
  const codeFileCount =
    typeof report?.codeFileCount === "number" ? report.codeFileCount : 0;

  const focuses: LocalRevisionFocus[] = [
    "responsiveness",
    "components",
    "both",
    "revalidate",
  ];

  return focuses.map((requestedFocus) => {
    const invalidationPlan = buildImprovementInvalidationPreview({
      requestedFocus,
      parentRevisionId,
      sourceArtifacts,
      parentSourceArtifacts: sourceArtifacts,
      codeFileCount,
      routeTemplateCount,
      componentFamilyCount,
    }) as {
      reused?: string[];
      invalidated?: Array<{ artifact?: string }>;
    };

    const estimatedTemplates =
      requestedFocus === "responsiveness" || requestedFocus === "both"
        ? Number(responsivePlan?.templateCount ?? routeTemplateCount ?? 0)
        : 0;
    const estimatedRoutes =
      requestedFocus === "responsiveness" || requestedFocus === "both"
        ? countResponsiveRoutes(responsivePlan)
        : 0;
    const responsiveViewports =
      requestedFocus === "responsiveness" || requestedFocus === "both"
        ? Array.isArray(responsivePlan?.targetViewports)
          ? responsivePlan.targetViewports
          : ["laptop", "tablet", "mobile"]
        : [];

    return {
      requestedFocus,
      reusedCount: Array.isArray(invalidationPlan.reused)
        ? invalidationPlan.reused.length
        : 0,
      invalidatedCount: Array.isArray(invalidationPlan.invalidated)
        ? invalidationPlan.invalidated.length
        : 0,
      reusedArtifacts: Array.isArray(invalidationPlan.reused)
        ? invalidationPlan.reused
        : [],
      invalidatedArtifacts: Array.isArray(invalidationPlan.invalidated)
        ? invalidationPlan.invalidated
            .map((entry) =>
              entry && typeof entry.artifact === "string"
                ? entry.artifact
                : null,
            )
            .filter((entry): entry is string => Boolean(entry))
        : [],
      estimatedTemplates,
      estimatedRoutes,
      expectedTime: formatExpectedTime({
        requestedFocus,
        estimatedTemplates,
        estimatedRoutes,
        codeFileCount,
      }),
      responsiveViewports,
    };
  });
}

async function readSourceArtifactsManifest(job: LocalExportJob) {
  const exportDir = job.artifacts?.exportDir;
  if (!exportDir) return null;
  const manifestPath = path.join(exportDir, "source-artifacts", "manifest.json");
  return (await readJsonIfExists(manifestPath)) as SourceArtifactsManifest | null;
}

async function readResponsivePlan(job: LocalExportJob) {
  return (await readJsonIfExists(job.artifacts?.responsiveRecapturePlanPath)) as
    | ResponsivePlan
    | null;
}

async function readParentRevisionId(job: LocalExportJob) {
  const manifest = (await readJsonIfExists(
    job.artifacts?.revisionManifestPath,
  )) as Record<string, unknown> | null;
  if (!manifest) return job.revision?.parentRevisionId ?? null;
  return typeof manifest.revisionId === "string"
    ? manifest.revisionId
    : job.revision?.parentRevisionId ?? null;
}

async function readJsonIfExists(filePath?: string) {
  if (!filePath) return null;
  try {
    return JSON.parse(await fs.readFile(filePath, "utf8")) as Record<
      string,
      unknown
    >;
  } catch {
    return null;
  }
}

function countResponsiveRoutes(plan: ResponsivePlan | null) {
  if (!plan) return 0;
  if (!Array.isArray(plan.templates)) {
    return typeof plan.routeCount === "number" ? plan.routeCount : 0;
  }
  return plan.templates.reduce((total, template) => {
    return total + (Array.isArray(template.routesToCapture) ? template.routesToCapture.length : 0);
  }, 0);
}

function formatExpectedTime(input: {
  requestedFocus: LocalRevisionFocus;
  estimatedTemplates: number;
  estimatedRoutes: number;
  codeFileCount: number;
}) {
  const minutes =
    input.requestedFocus === "revalidate"
      ? 1
      : input.requestedFocus === "components"
        ? Math.max(2, Math.ceil(input.codeFileCount / 3))
        : input.requestedFocus === "responsiveness"
          ? Math.max(
              3,
              Math.ceil((input.estimatedTemplates + input.estimatedRoutes) / 4),
            )
          : Math.max(
              4,
              Math.ceil(
                (input.estimatedTemplates + input.estimatedRoutes) / 4 +
                  input.codeFileCount / 4,
              ),
            );

  return `~${minutes} min`;
}

function buildImprovementInvalidationPreview(input: {
  requestedFocus: LocalRevisionFocus;
  parentRevisionId?: string | null;
  sourceArtifacts?: SourceArtifactsManifest | null;
  parentSourceArtifacts?: SourceArtifactsManifest | null;
  codeFileCount?: number;
  routeTemplateCount?: number;
  componentFamilyCount?: number;
}) {
  return createInvalidationPlan({
    revisionRequest: {
      kind: "improvement",
      requestedFocus: input.requestedFocus,
      parentRevisionId: input.parentRevisionId ?? undefined,
    },
    sourceArtifacts: input.sourceArtifacts ?? null,
    parentSourceArtifacts: input.parentSourceArtifacts ?? null,
    codeFileCount: input.codeFileCount,
    routeTemplateCount: input.routeTemplateCount,
    componentFamilyCount: input.componentFamilyCount,
  });
}

function createInvalidationPlan(input: {
  revisionRequest?: {
    kind?: "initial" | "improvement";
    requestedFocus?: LocalRevisionFocus;
    parentRevisionId?: string;
  };
  sourceArtifacts?: SourceArtifactsManifest | null;
  parentSourceArtifacts?: SourceArtifactsManifest | null;
  codeFileCount?: number;
  routeTemplateCount?: number;
  componentFamilyCount?: number;
}) {
  const revisionRequest = input.revisionRequest;
  const sourceArtifacts = input.sourceArtifacts ?? null;
  const parentSourceArtifacts = input.parentSourceArtifacts ?? null;
  const sourceDiff = createSourceArtifactDiff(
    sourceArtifacts,
    parentSourceArtifacts,
  );
  const codeFileArtifactIds = unique(
    (sourceArtifacts?.codeFiles ?? []).flatMap((entry) =>
      allCodeFileArtifactIds(entry),
    ),
  );
  const readableCodeFileArtifactIds = (sourceArtifacts?.codeFiles ?? [])
    .filter((entry) => entry.hasContent)
    .map((entry) => primaryCodeFileArtifactId(entry));
  const missingCodeFileArtifactIds = (sourceArtifacts?.codeFiles ?? [])
    .filter((entry) => !entry.hasContent)
    .map((entry) => primaryCodeFileArtifactId(entry));
  const componentFamiliesArtifactId =
    sourceArtifacts?.componentFamiliesArtifactId ?? "source/component-families";

  if (!revisionRequest || revisionRequest.kind !== "improvement") {
    return {
      kind: "initial" as const,
      requestedFocus: null,
      parentRevisionId: null,
      sourceDiff,
      reused: [],
      invalidated: [
        {
          artifact: "generated/project",
          reason: "initial-export",
          dependsOn: [
            "plugin/raw-payload",
            "runtime/raw-capture",
            "ir/normalized",
          ],
        },
      ],
    };
  }

  if (revisionRequest.requestedFocus === "revalidate") {
    return {
      kind: "improvement" as const,
      requestedFocus: "revalidate" as const,
      parentRevisionId: revisionRequest.parentRevisionId ?? null,
      sourceDiff,
      reused: [
        "generated/project",
        "debug/*",
        "manifest/revision",
        "manifest/source-artifacts",
      ],
      invalidated: [
        {
          artifact: "validation/generated",
          reason: "revalidate-only",
          dependsOn: ["generated/project"],
        },
        {
          artifact: "report/export",
          reason: "validation-refreshed",
          dependsOn: ["validation/generated", "manifest/revision"],
        },
      ],
    };
  }

  if (revisionRequest.requestedFocus === "components") {
    return {
      kind: "improvement" as const,
      requestedFocus: "components" as const,
      parentRevisionId: revisionRequest.parentRevisionId ?? null,
      sourceDiff,
      reused: [
        "runtime/raw-capture",
        "cms/*",
        "assets/*",
        ...(input.routeTemplateCount ? ["routes/templates"] : []),
        ...sourceDiff.unchangedCodeFileArtifactIds,
      ],
      invalidated: [
        ...(input.codeFileCount && missingCodeFileArtifactIds.length > 0
          ? [
              {
                artifact: "source/code-files",
                reason: "code-file-content-not-captured",
                dependsOn: missingCodeFileArtifactIds,
              },
            ]
          : []),
        {
          artifact: componentFamiliesArtifactId,
          reason: "component-source-refresh",
          dependsOn:
            sourceDiff.changedCodeFileArtifactIds.length > 0
              ? sourceDiff.changedCodeFileArtifactIds
              : readableCodeFileArtifactIds.length > 0
                ? readableCodeFileArtifactIds
                : ["plugin/raw-payload"],
        },
        {
          artifact: "ir/normalized",
          reason: "depends-on-component-model",
          dependsOn: [componentFamiliesArtifactId, ...codeFileArtifactIds],
        },
        {
          artifact: "generated/project",
          reason: "depends-on-component-model",
          dependsOn: ["ir/normalized"],
        },
        {
          artifact: "report/export",
          reason: "depends-on-generated-project",
          dependsOn: ["generated/project", "validation/generated"],
        },
      ],
    };
  }

  if (revisionRequest.requestedFocus === "responsiveness") {
    return {
      kind: "improvement" as const,
      requestedFocus: "responsiveness" as const,
      parentRevisionId: revisionRequest.parentRevisionId ?? null,
      sourceDiff,
      reused: [
        "plugin/raw-payload",
        "source/code-files",
        componentFamiliesArtifactId,
        "cms/*",
        "assets/*",
      ],
      invalidated: [
        {
          artifact: "runtime/responsive",
          reason: "responsive-improvement",
          dependsOn: ["runtime/raw-capture"],
        },
        {
          artifact: "generated/project",
          reason: "depends-on-responsive-model",
          dependsOn: ["runtime/responsive", "ir/normalized"],
        },
        {
          artifact: "report/export",
          reason: "depends-on-generated-project",
          dependsOn: ["generated/project", "validation/generated"],
        },
      ],
    };
  }

  return {
    kind: "improvement" as const,
    requestedFocus: revisionRequest.requestedFocus ?? "both",
    parentRevisionId: revisionRequest.parentRevisionId ?? null,
    sourceDiff,
    reused: ["cms/*", "assets/*", ...sourceDiff.unchangedCodeFileArtifactIds],
    invalidated: [
      {
        artifact: "runtime/responsive",
        reason: "responsive-improvement",
        dependsOn: ["runtime/raw-capture"],
      },
      {
        artifact: componentFamiliesArtifactId,
        reason: "component-source-refresh",
        dependsOn:
          sourceDiff.changedCodeFileArtifactIds.length > 0
            ? sourceDiff.changedCodeFileArtifactIds
            : readableCodeFileArtifactIds.length > 0
              ? readableCodeFileArtifactIds
              : ["plugin/raw-payload"],
      },
      {
        artifact: "ir/normalized",
        reason: "depends-on-updated-models",
        dependsOn: [
          "runtime/responsive",
          componentFamiliesArtifactId,
          ...codeFileArtifactIds,
        ],
      },
      {
        artifact: "generated/project",
        reason: "depends-on-updated-models",
        dependsOn: ["ir/normalized"],
      },
      {
        artifact: "report/export",
        reason: "depends-on-generated-project",
        dependsOn: ["generated/project", "validation/generated"],
      },
    ],
  };
}

function createSourceArtifactDiff(
  current: SourceArtifactsManifest | null,
  parent: SourceArtifactsManifest | null,
) {
  const currentEntries = current?.codeFiles ?? [];
  const parentEntries = parent?.codeFiles ?? [];
  const currentByIdentity = new Map(
    currentEntries.map((entry) => [sourceArtifactIdentity(entry), entry] as const),
  );
  const parentByIdentity = new Map(
    parentEntries.map((entry) => [sourceArtifactIdentity(entry), entry] as const),
  );

  const changedCodeFileArtifactIds: string[] = [];
  const unchangedCodeFileArtifactIds: string[] = [];
  const addedCodeFileArtifactIds: string[] = [];
  const removedCodeFileArtifactIds: string[] = [];

  for (const [identity, currentEntry] of currentByIdentity) {
    const parentEntry = parentByIdentity.get(identity);
    if (!parentEntry) {
      addedCodeFileArtifactIds.push(primaryCodeFileArtifactId(currentEntry));
      continue;
    }

    if (
      currentEntry.contentHash &&
      parentEntry.contentHash &&
      currentEntry.contentHash === parentEntry.contentHash
    ) {
      unchangedCodeFileArtifactIds.push(primaryCodeFileArtifactId(currentEntry));
    } else if (
      currentEntry.contentHash &&
      parentEntry.contentHash &&
      currentEntry.contentHash !== parentEntry.contentHash
    ) {
      changedCodeFileArtifactIds.push(primaryCodeFileArtifactId(currentEntry));
    } else if (
      currentEntry.hasContent === parentEntry.hasContent &&
      currentEntry.contentByteLength === parentEntry.contentByteLength &&
      currentEntry.name === parentEntry.name &&
      currentEntry.path === parentEntry.path
    ) {
      unchangedCodeFileArtifactIds.push(primaryCodeFileArtifactId(currentEntry));
    } else {
      changedCodeFileArtifactIds.push(primaryCodeFileArtifactId(currentEntry));
    }
  }

  for (const [identity, parentEntry] of parentByIdentity) {
    if (!currentByIdentity.has(identity)) {
      removedCodeFileArtifactIds.push(primaryCodeFileArtifactId(parentEntry));
    }
  }

  const currentFamiliesArtifactId = current?.componentFamiliesArtifactId;
  const parentFamiliesArtifactId = parent?.componentFamiliesArtifactId;
  const componentFamiliesChanged =
    changedCodeFileArtifactIds.length > 0 ||
    addedCodeFileArtifactIds.length > 0 ||
    removedCodeFileArtifactIds.length > 0 ||
    currentFamiliesArtifactId !== parentFamiliesArtifactId;

  return {
    changedCodeFileArtifactIds,
    unchangedCodeFileArtifactIds,
    addedCodeFileArtifactIds,
    removedCodeFileArtifactIds,
    parentComponentFamiliesArtifactId: parentFamiliesArtifactId,
    currentComponentFamiliesArtifactId: currentFamiliesArtifactId,
    componentFamiliesChanged,
  };
}

function sourceArtifactIdentity(
  entry: NonNullable<SourceArtifactsManifest["codeFiles"]>[number],
) {
  return entry.id ?? entry.path ?? `${entry.name ?? "unknown"}:${entry.versionId ?? ""}`;
}

function primaryCodeFileArtifactId(
  entry: NonNullable<SourceArtifactsManifest["codeFiles"]>[number],
) {
  return entry.sourceArtifactId ?? entry.metadataArtifactId ?? entry.artifactId;
}

function allCodeFileArtifactIds(
  entry: NonNullable<SourceArtifactsManifest["codeFiles"]>[number],
) {
  return unique(
    [entry.metadataArtifactId, entry.sourceArtifactId].filter(
      (value): value is string => typeof value === "string" && value.length > 0,
    ),
  );
}

function unique<T>(values: T[]) {
  return [...new Set(values)];
}
