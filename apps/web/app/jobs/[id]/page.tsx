import fs from "node:fs/promises";
import Link from "next/link";
import { notFound } from "next/navigation";
import { buildImprovementPreviewsForJob } from "../../../lib/improvement-preview";
import { createCompletedOutcomeCopy } from "../../../lib/export-health";
import { buildJobSignature } from "../../../lib/job-signature";
import { createReportBreakdown } from "../../../lib/report-breakdown";
import {
  buildBeforeAfterSummary,
  collectRevisionFamily,
} from "../../../lib/revision-insights";
import { readAllJobs, readJob } from "../../../lib/jobs-store";
import { AutoRefresh } from "../auto-refresh";

export const dynamic = "force-dynamic";

export default async function JobPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const job = await readJob(id);

  if (!job) {
    notFound();
  }

  const allJobs = await readAllJobs();
  const revisionFamily = collectRevisionFamily(allJobs, job.id);
  const improvementPreviews = await buildImprovementPreviewsForJob(job);
  const parentJob = job.revision?.parentJobId
    ? allJobs.find((entry) => entry.id === job.revision?.parentJobId)
    : undefined;
  const hasZip = Boolean(job.artifacts?.zipPath);
  const report =
    (await readJsonIfExists(job.artifacts?.reportPath)) as
      | Record<string, unknown>
      | undefined;
  const hasReport = Boolean(report);
  const hasPreview = Boolean(job.artifacts?.previewPath);
  const beforeAfterReport =
    (await readJsonIfExists(job.artifacts?.beforeAfterReportPath)) as
      | Record<string, unknown>
      | undefined;
  const hasBeforeAfterReport = Boolean(beforeAfterReport);
  const resolvedRequest =
    (await readJsonIfExists(job.artifacts?.resolvedRequestPath)) as
      | Record<string, unknown>
      | undefined;
  const hasResolvedRequest = Boolean(resolvedRequest);
  const revisionStatus =
    (await readJsonIfExists(job.artifacts?.statusPath)) as
      | Record<string, unknown>
      | undefined;
  const hasStatus = Boolean(revisionStatus);
  const revisionManifest =
    (await readJsonIfExists(job.artifacts?.revisionManifestPath)) as
      | Record<string, unknown>
      | undefined;
  const hasRevisionManifest = Boolean(revisionManifest);
  const validation =
    (await readJsonIfExists(job.artifacts?.validationPath)) as
      | Record<string, unknown>
      | undefined;
  const hasValidation = Boolean(validation);
  const invalidationPlan =
    (await readJsonIfExists(job.artifacts?.invalidationPlanPath)) as
      | Record<string, unknown>
      | undefined;
  const hasInvalidationPlan = Boolean(invalidationPlan);
  const artifactIndex =
    (await readJsonIfExists(job.artifacts?.artifactIndexPath)) as
      | Record<string, unknown>
      | undefined;
  const hasArtifactIndex = Boolean(artifactIndex);
  const responsivePlan =
    (await readJsonIfExists(job.artifacts?.responsiveRecapturePlanPath)) as
      | Record<string, unknown>
      | undefined;
  const hasResponsivePlan = Boolean(responsivePlan);
  const capabilityReport = readCapabilityReport(job.pluginCapture);
  const persistedCapabilityReport =
    (await readJsonIfExists(job.artifacts?.capabilityReportPath)) as
      | Record<string, any>
      | undefined;
  const hasCapabilityReport = Boolean(persistedCapabilityReport);
  const effectiveCapabilityReport =
    (persistedCapabilityReport ?? capabilityReport) as
      | Record<string, any>
      | undefined;
  const codeCompatibilityReport =
    (await readJsonIfExists(job.artifacts?.codeCompatibilityReportPath)) as
      | Record<string, any>
      | undefined;
  const hasCodeCompatibilityReport = Boolean(codeCompatibilityReport);
  const parentInfo =
    (await readJsonIfExists(job.artifacts?.parentInfoPath)) as
      | Record<string, unknown>
      | undefined;
  const hasParentInfo = Boolean(parentInfo);
  const parentReport =
    (await readJsonIfExists(parentJob?.artifacts?.reportPath)) as
      | Record<string, unknown>
      | undefined;
  const beforeAfterSummary = Array.isArray(beforeAfterReport?.metrics)
    ? (beforeAfterReport.metrics as Array<Record<string, unknown>>)
        .filter(
          (entry) =>
            entry &&
            typeof entry === "object" &&
            typeof entry.label === "string" &&
            typeof entry.current === "string" &&
            typeof entry.parent === "string" &&
            typeof entry.delta === "string",
        )
        .map((entry) => ({
          label: String(entry.label),
          current: String(entry.current),
          parent: String(entry.parent),
          delta: String(entry.delta),
        }))
    : buildBeforeAfterSummary(report, parentReport);
  const isPending = job.status === "queued" || job.status === "running";
  const refreshSignature = buildJobSignature(job);
  const routeTemplates = Array.isArray(report?.routeTemplates)
    ? report.routeTemplates
    : [];
  const sourceEvidence =
    report?.sourceEvidence && typeof report.sourceEvidence === "object"
      ? (report.sourceEvidence as Record<string, unknown>)
      : revisionManifest?.sourceEvidence &&
          typeof revisionManifest.sourceEvidence === "object"
        ? (revisionManifest.sourceEvidence as Record<string, unknown>)
        : undefined;
  const fidelityEvidence =
    report?.fidelityEvidence && typeof report.fidelityEvidence === "object"
      ? (report.fidelityEvidence as Record<string, unknown>)
      : revisionManifest?.summary &&
          typeof revisionManifest.summary === "object" &&
          typeof (revisionManifest.summary as Record<string, unknown>)
            .fidelityEvidence === "object"
        ? ((revisionManifest.summary as Record<string, unknown>)
            .fidelityEvidence as Record<string, unknown>)
        : undefined;
  const generatedValidation =
    validation && typeof validation === "object"
      ? validation
      : report?.generatedValidation && typeof report.generatedValidation === "object"
        ? (report.generatedValidation as Record<string, unknown>)
        : undefined;
  const validationRoutes = Array.isArray(generatedValidation?.routes)
    ? generatedValidation.routes
    : [];
  const artifactCountsByType = createArtifactCountsByType(artifactIndex);
  const reportBreakdown = createReportBreakdown({
    report,
    validation: generatedValidation,
    capabilityReport: effectiveCapabilityReport,
    codeCompatibilityReport,
  });
  const revisionLineage = createRevisionLineage({
    jobId: job.id,
    revisionManifest,
    invalidationPlan,
    report,
  });
  const unreadableCodeFiles =
    typeof effectiveCapabilityReport?.codeFiles?.count === "number" &&
    typeof effectiveCapabilityReport?.codeFiles?.contentReadableCount === "number"
      ? Math.max(
          0,
          Number(effectiveCapabilityReport.codeFiles.count) -
            Number(effectiveCapabilityReport.codeFiles.contentReadableCount),
        )
      : undefined;
  const reusedArtifactCount =
    Array.isArray(revisionManifest?.reusedArtifactIds)
      ? revisionManifest.reusedArtifactIds.length
      : Array.isArray(invalidationPlan?.reused)
        ? invalidationPlan.reused.length
        : undefined;
  const invalidatedArtifactCount =
    Array.isArray(revisionManifest?.invalidatedArtifacts)
      ? revisionManifest.invalidatedArtifacts.length
      : Array.isArray(invalidationPlan?.invalidated)
        ? invalidationPlan.invalidated.length
        : undefined;
  const canCreateImprovement =
    job.status === "completed" &&
    Boolean(job.sourceUrl || job.pluginCapture);

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8">
      <AutoRefresh
        enabled={isPending}
        initialSignature={refreshSignature}
        statusUrl={`/api/jobs/${job.id}`}
      />
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
            Job
          </div>
          <h1 className="mt-1 text-3xl font-black tracking-tight text-zinc-950">
            {job.id}
          </h1>
          <div className="mt-2">
            <StatusPill status={job.status} />
          </div>
        </div>
        <div className="flex gap-3 text-sm text-zinc-600">
          <Link
            className="underline underline-offset-4 hover:text-zinc-900"
            href="/jobs"
          >
            Jobs
          </Link>
          <Link
            className="underline underline-offset-4 hover:text-zinc-900"
            href="/"
          >
            Home
          </Link>
        </div>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <div className="rounded-xl border border-black/10 bg-white p-5 shadow-sm lg:col-span-2">
          <div className="text-sm font-extrabold text-zinc-950">
            Job Details
          </div>
          <div className="mt-4 grid gap-3">
            <Row label="Source URL" value={job.sourceUrl ?? "-"} />
            <Row label="Export mode" value={job.exportMode ?? "selection"} />
            <Row
              label="Revision"
              value={
                typeof revisionManifest?.revisionId === "string"
                  ? revisionManifest.revisionId
                  : typeof report?.revisionId === "string"
                    ? report.revisionId
                    : "-"
              }
            />
            <Row label="Selector" value={job.selector ?? "-"} />
            <Row
              label="Progress"
              value={
                job.progress
                  ? `${job.progress.stage}${
                      job.progress.completed !== undefined &&
                      job.progress.total !== undefined
                        ? `: ${job.progress.completed}/${job.progress.total}`
                        : ""
                    }${
                      job.progress.failed
                        ? ` (${job.progress.failed} skipped)`
                        : ""
                    }`
                  : "-"
              }
            />
            <Row
              label="Current route"
              value={job.progress?.routePath ?? "-"}
            />
            <Row
              label="Created"
              value={new Date(job.createdAt).toLocaleString()}
            />
            <Row
              label="Revision kind"
              value={job.revision?.kind ?? "initial"}
            />
            <Row
              label="Parent job"
              value={job.revision?.parentJobId ?? "-"}
            />
            <Row
              label="Requested focus"
              value={job.revision?.requestedFocus ?? "-"}
            />
            <Row
              label="Updated"
              value={new Date(job.updatedAt).toLocaleString()}
            />
            <Row
              label="Templates"
              value={
                typeof report?.routeTemplateCount === "number"
                  ? String(report.routeTemplateCount)
                  : `${routeTemplates.length}`
              }
            />
            <Row
              label="Code files"
              value={
                typeof report?.codeFileCount === "number"
                  ? String(report.codeFileCount)
                  : Array.isArray((job.pluginCapture as any)?.context?.codeFiles)
                    ? String((job.pluginCapture as any).context.codeFiles.length)
                    : "-"
              }
            />
            <Row label="Error" value={job.errorMessage ?? "-"} />
          </div>
        </div>

        <div className="rounded-xl border border-black/10 bg-white p-5 shadow-sm">
          <div className="text-sm font-extrabold text-zinc-950">Actions</div>
          <div className="mt-4 grid gap-2">
            {hasPreview ? (
              <Link
                className="inline-flex h-10 items-center justify-center rounded-lg border border-black/10 bg-white px-3 text-sm font-bold text-zinc-950 hover:bg-zinc-50"
                href={`/api/jobs/${job.id}/artifact?type=preview`}
                target="_blank"
                rel="noreferrer"
              >
                Open Preview
              </Link>
            ) : (
              <div className="inline-flex h-10 items-center justify-center rounded-lg border border-dashed border-black/10 bg-zinc-50 px-3 text-sm font-semibold text-zinc-500">
                Preview unavailable
              </div>
            )}
            {hasZip ? (
              <Link
                className="inline-flex h-10 items-center justify-center rounded-lg bg-zinc-950 px-3 text-sm font-extrabold text-white hover:bg-zinc-900"
                href={`/api/jobs/${job.id}/artifact?type=zip`}
                download
                target="_blank"
                rel="noreferrer"
              >
                Download ZIP
              </Link>
            ) : (
              <div className="inline-flex h-10 items-center justify-center rounded-lg bg-zinc-200 px-3 text-sm font-extrabold text-zinc-500">
                ZIP unavailable
              </div>
            )}
            {hasReport ? (
              <Link
                className="inline-flex h-10 items-center justify-center rounded-lg border border-black/10 bg-white px-3 text-sm font-bold text-zinc-950 hover:bg-zinc-50"
                href={`/api/jobs/${job.id}/artifact?type=report`}
                target="_blank"
                rel="noreferrer"
              >
                Open Report JSON
              </Link>
            ) : (
              <div className="inline-flex h-10 items-center justify-center rounded-lg border border-dashed border-black/10 bg-zinc-50 px-3 text-sm font-semibold text-zinc-500">
                Report unavailable
              </div>
            )}
            {hasResolvedRequest ? (
              <Link
                className="inline-flex h-10 items-center justify-center rounded-lg border border-black/10 bg-white px-3 text-sm font-bold text-zinc-950 hover:bg-zinc-50"
                href={`/api/jobs/${job.id}/artifact?type=resolved-request`}
                target="_blank"
                rel="noreferrer"
              >
                Open Request JSON
              </Link>
            ) : null}
            {hasStatus ? (
              <Link
                className="inline-flex h-10 items-center justify-center rounded-lg border border-black/10 bg-white px-3 text-sm font-bold text-zinc-950 hover:bg-zinc-50"
                href={`/api/jobs/${job.id}/artifact?type=status`}
                target="_blank"
                rel="noreferrer"
              >
                Open Status JSON
              </Link>
            ) : null}
            {hasCapabilityReport ? (
              <Link
                className="inline-flex h-10 items-center justify-center rounded-lg border border-black/10 bg-white px-3 text-sm font-bold text-zinc-950 hover:bg-zinc-50"
                href={`/api/jobs/${job.id}/artifact?type=capability-report`}
                target="_blank"
                rel="noreferrer"
              >
                Open Capability JSON
              </Link>
            ) : null}
            {hasCodeCompatibilityReport ? (
              <Link
                className="inline-flex h-10 items-center justify-center rounded-lg border border-black/10 bg-white px-3 text-sm font-bold text-zinc-950 hover:bg-zinc-50"
                href={`/api/jobs/${job.id}/artifact?type=code-compatibility`}
                target="_blank"
                rel="noreferrer"
              >
                Open Compatibility JSON
              </Link>
            ) : null}
            {hasBeforeAfterReport ? (
              <Link
                className="inline-flex h-10 items-center justify-center rounded-lg border border-black/10 bg-white px-3 text-sm font-bold text-zinc-950 hover:bg-zinc-50"
                href={`/api/jobs/${job.id}/artifact?type=before-after`}
                target="_blank"
                rel="noreferrer"
              >
                Open Before/After JSON
              </Link>
            ) : null}
            {hasParentInfo ? (
              <Link
                className="inline-flex h-10 items-center justify-center rounded-lg border border-black/10 bg-white px-3 text-sm font-bold text-zinc-950 hover:bg-zinc-50"
                href={`/api/jobs/${job.id}/artifact?type=parent`}
                target="_blank"
                rel="noreferrer"
              >
                Open Parent JSON
              </Link>
            ) : null}
            {hasRevisionManifest ? (
              <Link
                className="inline-flex h-10 items-center justify-center rounded-lg border border-black/10 bg-white px-3 text-sm font-bold text-zinc-950 hover:bg-zinc-50"
                href={`/api/jobs/${job.id}/artifact?type=revision`}
                target="_blank"
                rel="noreferrer"
              >
                Open Revision JSON
              </Link>
            ) : null}
            {hasValidation ? (
              <Link
                className="inline-flex h-10 items-center justify-center rounded-lg border border-black/10 bg-white px-3 text-sm font-bold text-zinc-950 hover:bg-zinc-50"
                href={`/api/jobs/${job.id}/artifact?type=validation`}
                target="_blank"
                rel="noreferrer"
              >
                Open Validation JSON
              </Link>
            ) : null}
            {hasInvalidationPlan ? (
              <Link
                className="inline-flex h-10 items-center justify-center rounded-lg border border-black/10 bg-white px-3 text-sm font-bold text-zinc-950 hover:bg-zinc-50"
                href={`/api/jobs/${job.id}/artifact?type=invalidation`}
                target="_blank"
                rel="noreferrer"
              >
                Open Invalidation JSON
              </Link>
            ) : null}
            {hasArtifactIndex ? (
              <Link
                className="inline-flex h-10 items-center justify-center rounded-lg border border-black/10 bg-white px-3 text-sm font-bold text-zinc-950 hover:bg-zinc-50"
                href={`/api/jobs/${job.id}/artifact?type=artifact-index`}
                target="_blank"
                rel="noreferrer"
              >
                Open Artifact Index
              </Link>
            ) : null}
            {hasResponsivePlan ? (
              <Link
                className="inline-flex h-10 items-center justify-center rounded-lg border border-black/10 bg-white px-3 text-sm font-bold text-zinc-950 hover:bg-zinc-50"
                href={`/api/jobs/${job.id}/artifact?type=responsive-plan`}
                target="_blank"
                rel="noreferrer"
              >
                Open Responsive Plan
              </Link>
            ) : null}
          </div>

          <div className="mt-4 rounded-lg border border-black/10 bg-zinc-50 p-3 text-xs text-zinc-700">
            {hasZip || hasReport || hasPreview ? (
              <span>
                {createCompletedOutcomeCopy({
                  report,
                  surface: "job-banner",
                })}
              </span>
            ) : job.status === "failed" ? (
              <span>
                Export failed. The error above is from the worker process.
              </span>
            ) : (
              <span>
                Export is still running. Status updates automatically.
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="mt-4 grid gap-3">
        <div className="text-sm font-extrabold text-zinc-700">
          Improve Revision
        </div>
        <div className="rounded-xl border border-black/10 bg-white p-5 text-sm shadow-sm">
          {canCreateImprovement ? (
            <form action="/api/jobs" method="post" className="grid gap-3">
              <input type="hidden" name="parentJobId" value={job.id} />
              <div className="text-zinc-700">
                Create a new queued job that reuses this export as the parent context.
              </div>
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                {improvementPreviews.map((preview) => (
                  <button
                    key={preview.requestedFocus}
                    type="submit"
                    name="requestedFocus"
                    value={preview.requestedFocus}
                    className="grid gap-3 rounded-xl border border-black/10 bg-white p-4 text-left hover:bg-zinc-50"
                  >
                    <div className="text-sm font-bold text-zinc-950">
                      {labelForImprovementFocus(preview.requestedFocus)}
                    </div>
                    <div className="grid gap-1 text-xs text-zinc-600">
                      <div>Reuse: {preview.reusedCount} artifact groups</div>
                      <div>Rebuild: {preview.invalidatedCount} artifact groups</div>
                      <div>
                        Estimate: {preview.estimatedRoutes} routes /{" "}
                        {preview.estimatedTemplates} templates
                      </div>
                      <div>Time: {preview.expectedTime}</div>
                      <div>
                        Viewports:{" "}
                        {preview.responsiveViewports.length > 0
                          ? preview.responsiveViewports.join(", ")
                          : "-"}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
              <div className="rounded-lg border border-black/10 bg-zinc-50 p-3 text-xs text-zinc-600">
                Expected reuse: source URL, export mode, plugin capture, route manifests,
                revision artifacts, and generated baseline where compatible.
              </div>
            </form>
          ) : (
            <div className="text-zinc-500">
              Improvement revisions are available after the current job completes.
            </div>
          )}
        </div>
      </div>

      <div className="mt-4 grid gap-3">
        <div className="text-sm font-extrabold text-zinc-700">Revision</div>
        <div className="rounded-xl border border-black/10 bg-white p-5 text-sm shadow-sm">
          <div className="grid gap-2">
            <ArtifactRow
              label="Resolved request"
              value={job.artifacts?.resolvedRequestPath}
              pending={!hasResolvedRequest}
            />
            <ArtifactRow
              label="Status"
              value={job.artifacts?.statusPath}
              pending={!hasStatus}
            />
            <ArtifactRow
              label="Parent link"
              value={job.artifacts?.parentInfoPath}
              pending={!hasParentInfo}
            />
            <ArtifactRow
              label="Manifest"
              value={job.artifacts?.revisionManifestPath}
              pending={!hasRevisionManifest}
            />
            <ArtifactRow
              label="Capability report"
              value={job.artifacts?.capabilityReportPath}
              pending={!hasCapabilityReport}
            />
            <ArtifactRow
              label="Compatibility report"
              value={job.artifacts?.codeCompatibilityReportPath}
              pending={!hasCodeCompatibilityReport}
            />
            <ArtifactRow
              label="Before/after"
              value={job.artifacts?.beforeAfterReportPath}
              pending={!hasBeforeAfterReport}
            />
            <ArtifactRow
              label="Validation"
              value={job.artifacts?.validationPath}
              pending={!hasValidation}
            />
            <ArtifactRow
              label="Invalidation"
              value={job.artifacts?.invalidationPlanPath}
              pending={!hasInvalidationPlan}
            />
            <ArtifactRow
              label="Artifact index"
              value={job.artifacts?.artifactIndexPath}
              pending={!hasArtifactIndex}
            />
            <ArtifactRow
              label="Responsive plan"
              value={job.artifacts?.responsiveRecapturePlanPath}
              pending={!hasResponsivePlan}
            />
            <ArtifactRow
              label="Cache hit"
              value={
                typeof report?.revisionCacheHit === "boolean"
                  ? String(report.revisionCacheHit)
                  : undefined
              }
              pending={typeof report?.revisionCacheHit !== "boolean"}
            />
          </div>
        </div>
      </div>

      <div className="mt-4 grid gap-3 lg:grid-cols-2">
        <div>
          <div className="text-sm font-extrabold text-zinc-700">
            Revision Status
          </div>
          <div className="mt-3 rounded-xl border border-black/10 bg-white p-5 text-sm shadow-sm">
            {revisionStatus ? (
              <div className="grid gap-3">
                <Row label="Stage" value={String(revisionStatus.stage ?? "-")} />
                <Row
                  label="Updated"
                  value={String(revisionStatus.updatedAt ?? "-")}
                />
                <Row
                  label="History"
                  value={String(
                    Array.isArray(revisionStatus.history)
                      ? revisionStatus.history.length
                      : 0,
                  )}
                />
                <Row
                  label="Recent"
                  value={
                    Array.isArray(revisionStatus.history) &&
                    revisionStatus.history.length > 0
                      ? revisionStatus.history
                          .slice(-3)
                          .map((entry) =>
                            entry &&
                            typeof entry === "object" &&
                            typeof (entry as Record<string, unknown>).stage ===
                              "string"
                              ? String(
                                  (entry as Record<string, unknown>).stage,
                                )
                              : "-",
                          )
                          .join(" -> ")
                      : "-"
                  }
                />
              </div>
            ) : (
              <div className="text-zinc-500">No revision status recorded yet.</div>
            )}
          </div>
        </div>

        <div>
          <div className="text-sm font-extrabold text-zinc-700">
            Revision Lineage
          </div>
          <div className="mt-3 rounded-xl border border-black/10 bg-white p-5 text-sm shadow-sm">
            <div className="grid gap-3">
              <Row label="Revision id" value={revisionLineage.revisionId} mono />
              <Row label="Parent revision" value={revisionLineage.parentRevisionId} mono />
              <Row label="Kind" value={revisionLineage.kind} />
              <Row label="Focus" value={revisionLineage.focus} />
              <Row label="Source fingerprint" value={revisionLineage.sourceFingerprint} mono />
              <Row label="Plugin fingerprint" value={revisionLineage.pluginFingerprint} mono />
              <Row label="Artifact graph" value={revisionLineage.artifactGraphHash} mono />
            </div>
          </div>
        </div>

        <div>
          <div className="text-sm font-extrabold text-zinc-700">
            Reuse Summary
          </div>
          <div className="mt-3 rounded-xl border border-black/10 bg-white p-5 text-sm shadow-sm">
            <div className="grid gap-3">
              <Row label="Reused artifacts" value={formatCount(reusedArtifactCount)} />
              <Row
                label="Invalidated artifacts"
                value={formatCount(invalidatedArtifactCount)}
              />
              <Row
                label="Unreadable code files"
                value={formatCount(unreadableCodeFiles)}
              />
              <Row
                label="Families"
                value={String(
                  Array.isArray(
                    (report?.sourceArtifacts as Record<string, unknown> | undefined)
                      ?.componentFamilies,
                  )
                    ? (
                        (report?.sourceArtifacts as Record<string, unknown>)
                          ?.componentFamilies as Array<unknown>
                      ).length
                    : typeof report?.componentFamilyCount === "number"
                      ? report.componentFamilyCount
                      : "-",
                )}
              />
            </div>
          </div>
        </div>

        <div>
          <div className="text-sm font-extrabold text-zinc-700">
            Invalidation Plan
          </div>
          <div className="mt-3 rounded-xl border border-black/10 bg-white p-5 text-sm shadow-sm">
            {invalidationPlan ? (
              <div className="grid gap-3">
                <Row
                  label="Kind"
                  value={String(invalidationPlan.kind ?? "-")}
                />
                <Row
                  label="Focus"
                  value={String(invalidationPlan.requestedFocus ?? "-")}
                />
                <Row
                  label="Parent revision"
                  value={String(invalidationPlan.parentRevisionId ?? "-")}
                />
                <Row
                  label="Parent link"
                  value={String(parentInfo?.parentJobId ?? "-")}
                />
                <Row
                  label="Reused"
                  value={String(
                    Array.isArray(invalidationPlan.reused)
                      ? invalidationPlan.reused.length
                      : 0,
                  )}
                />
                <Row
                  label="Invalidated"
                  value={String(
                    Array.isArray(invalidationPlan.invalidated)
                      ? invalidationPlan.invalidated.length
                      : 0,
                  )}
                />
              </div>
            ) : (
              <div className="text-zinc-500">
                No invalidation plan recorded yet.
              </div>
            )}
          </div>
        </div>

        <div>
          <div className="text-sm font-extrabold text-zinc-700">
            Responsive Plan
          </div>
          <div className="mt-3 rounded-xl border border-black/10 bg-white p-5 text-sm shadow-sm">
            {responsivePlan ? (
              <div className="grid gap-3">
                <Row
                  label="Templates"
                  value={String(responsivePlan.templateCount ?? "-")}
                />
                <Row
                  label="Routes"
                  value={String(responsivePlan.routeCount ?? "-")}
                />
                <Row
                  label="Target viewports"
                  value={Array.isArray(responsivePlan.targetViewports)
                    ? responsivePlan.targetViewports.join(", ")
                    : "-"}
                />
                <Row
                  label="Reuse desktop"
                  value={String(responsivePlan.reuseDesktopCapture ?? "-")}
                />
              </div>
            ) : (
              <div className="text-zinc-500">
                No responsive plan recorded yet.
              </div>
            )}
          </div>
        </div>

        <div>
          <div className="text-sm font-extrabold text-zinc-700">
            Artifact Index
          </div>
          <div className="mt-3 rounded-xl border border-black/10 bg-white p-5 text-sm shadow-sm">
            {artifactIndex ? (
              <div className="grid gap-3">
                <Row
                  label="Schema"
                  value={String(artifactIndex.schemaVersion ?? "-")}
                />
                <Row
                  label="Files"
                  value={String(artifactIndex.fileCount ?? "-")}
                />
                <Row
                  label="Revision"
                  value={String(artifactIndex.revisionId ?? "-")}
                />
                <Row
                  label="Generated"
                  value={String(artifactIndex.generatedAt ?? "-")}
                />
                <Row
                  label="Source fingerprint"
                  value={
                    typeof artifactIndex.sourceFingerprint === "string"
                      ? artifactIndex.sourceFingerprint
                      : "-"
                  }
                  mono
                />
                <Row
                  label="Types"
                  value={
                    artifactCountsByType.length > 0
                      ? artifactCountsByType
                          .slice(0, 6)
                          .map(
                            ([artifactType, count]) => `${artifactType} (${count})`,
                          )
                          .join(", ")
                      : "-"
                  }
                />
              </div>
            ) : (
              <div className="text-zinc-500">No artifact index recorded yet.</div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-4 grid gap-3 lg:grid-cols-2">
        <div>
          <div className="text-sm font-extrabold text-zinc-700">
            Capability Report
          </div>
          <div className="mt-3 rounded-xl border border-black/10 bg-white p-5 text-sm shadow-sm">
            {effectiveCapabilityReport ? (
              <div className="grid gap-3">
                <Row
                  label="Code file API"
                  value={effectiveCapabilityReport.codeFiles?.readable ? "readable" : "unavailable"}
                />
                <Row
                  label="Code file source"
                  value={`${effectiveCapabilityReport.codeFiles?.contentReadableCount ?? 0}/${effectiveCapabilityReport.codeFiles?.count ?? 0} readable`}
                />
                <Row
                  label="Unreadable files"
                  value={formatCount(unreadableCodeFiles)}
                />
                <Row
                  label="Overrides"
                  value={`${effectiveCapabilityReport.codeFiles?.overrideExportCount ?? 0}`}
                />
                <Row
                  label="CMS access"
                  value={effectiveCapabilityReport.cms?.collectionsReadable ? "readable" : "unavailable"}
                />
                <Row
                  label="Styles access"
                  value={
                    effectiveCapabilityReport.styles?.colorStylesReadable ||
                    effectiveCapabilityReport.styles?.textStylesReadable
                      ? "readable"
                      : "unavailable"
                  }
                />
                <Row
                  label="Permission errors"
                  value={readCapabilityErrors(effectiveCapabilityReport) || "-"}
                />
              </div>
            ) : (
              <div className="text-zinc-500">No capability report captured yet.</div>
            )}
          </div>
        </div>

        <div>
          <div className="text-sm font-extrabold text-zinc-700">
            Export Health
          </div>
          <div className="mt-3 rounded-xl border border-black/10 bg-white p-5 text-sm shadow-sm">
            {sourceEvidence ? (
              <div className="grid gap-3">
                <Row
                  label="Status"
                  value={String(sourceEvidence.status ?? "-")}
                />
                <Row
                  label="Reasons"
                  value={formatSourceEvidenceList(sourceEvidence.reasons)}
                />
                <Row
                  label="Warnings"
                  value={formatSourceEvidenceList(sourceEvidence.warnings)}
                />
                <Row
                  label="Code files"
                  value={`${Number(sourceEvidence.readableCodeFileCount ?? 0)}/${Number(sourceEvidence.codeFileCount ?? 0)} readable`}
                />
                <Row
                  label="Override warnings"
                  value={String(sourceEvidence.unresolvedOverrideCount ?? 0)}
                />
              </div>
            ) : (
              <div className="text-zinc-500">
                No explicit export health summary recorded yet.
              </div>
            )}
            <div className="mt-4 border-t border-black/10 pt-4">
              {fidelityEvidence ? (
                <div className="grid gap-3">
                  <Row
                    label="Fidelity evidence"
                    value={String(fidelityEvidence.mode ?? "-")}
                  />
                  <Row
                    label="Evidence note"
                    value={String(fidelityEvidence.reason ?? "-")}
                  />
                </div>
              ) : (
                <div className="text-zinc-500">
                  No fidelity evidence label recorded yet.
                </div>
              )}
            </div>
          </div>
        </div>

        <div>
          <div className="text-sm font-extrabold text-zinc-700">
            Code Compatibility
          </div>
          <div className="mt-3 rounded-xl border border-black/10 bg-white p-5 text-sm shadow-sm">
            {codeCompatibilityReport ? (
              <div className="grid gap-3">
                <Row
                  label="Files"
                  value={String(codeCompatibilityReport.fileCount ?? "-")}
                />
                <Row
                  label="Portable"
                  value={String(codeCompatibilityReport.summary?.portable ?? 0)}
                />
                <Row
                  label="Adapter"
                  value={String(
                    codeCompatibilityReport.summary?.portableWithAdapter ?? 0,
                  )}
                />
                <Row
                  label="Dependencies"
                  value={String(
                    codeCompatibilityReport.summary?.portableWithDependencies ?? 0,
                  )}
                />
                <Row
                  label="Runtime fallback"
                  value={String(
                    codeCompatibilityReport.summary?.runtimeFallbackRequired ?? 0,
                  )}
                />
                <Row
                  label="Unsupported"
                  value={String(
                    codeCompatibilityReport.summary?.unsupported ?? 0,
                  )}
                />
              </div>
            ) : (
              <div className="text-zinc-500">
                No compatibility report recorded yet.
              </div>
            )}
          </div>
        </div>

        <div>
          <div className="text-sm font-extrabold text-zinc-700">
            Report Breakdown
          </div>
          <div className="mt-3 rounded-xl border border-black/10 bg-white p-5 text-sm shadow-sm">
            <div className="grid gap-3 sm:grid-cols-2">
              {reportBreakdown.map((item) => (
                <div
                  key={item.key}
                  className="rounded-lg border border-black/10 bg-zinc-50 p-3"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-xs font-extrabold uppercase tracking-wide text-zinc-600">
                      {item.label}
                    </div>
                    <div
                      className={[
                        "rounded-full px-2 py-1 text-[11px] font-bold uppercase tracking-wide",
                        item.tone === "good"
                          ? "bg-emerald-100 text-emerald-700"
                          : item.tone === "warn"
                            ? "bg-amber-100 text-amber-700"
                            : "bg-zinc-200 text-zinc-700",
                      ].join(" ")}
                    >
                      {item.value}
                    </div>
                  </div>
                  <div className="mt-2 text-xs text-zinc-600">{item.detail}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 grid gap-3 lg:grid-cols-2">
        <div>
          <div className="text-sm font-extrabold text-zinc-700">
            Before / After
          </div>
          <div className="mt-3 rounded-xl border border-black/10 bg-white p-5 text-sm shadow-sm">
            {beforeAfterSummary.length > 0 ? (
              <div className="grid gap-3">
                {beforeAfterSummary.map((entry) => (
                  <div
                    key={entry.label}
                    className="grid grid-cols-[140px_1fr] gap-3"
                  >
                    <div className="text-xs font-extrabold text-zinc-600">
                      {entry.label}
                    </div>
                    <div className="grid gap-1 text-sm">
                      <div>Current: {entry.current}</div>
                      <div>Parent: {entry.parent}</div>
                      <div>Delta: {entry.delta}</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-zinc-500">
                No parent report available for before/after comparison yet.
              </div>
            )}
          </div>
        </div>

        <div>
          <div className="text-sm font-extrabold text-zinc-700">
            Revision Family
          </div>
          <div className="mt-3 rounded-xl border border-black/10 bg-white p-5 text-sm shadow-sm">
            {revisionFamily.length > 0 ? (
              <div className="grid gap-3">
                {revisionFamily.map((entry) => (
                  <div
                    key={entry.job.id}
                    className={[
                      "rounded-lg border p-3",
                      entry.isCurrent
                        ? "border-zinc-950 bg-zinc-50"
                        : "border-black/10 bg-white",
                    ].join(" ")}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="font-mono text-xs text-zinc-700">
                        {entry.job.id}
                      </div>
                      <StatusPill status={entry.job.status} />
                    </div>
                    <div className="mt-2 grid gap-1 text-xs text-zinc-600">
                      <div>Depth: {entry.depth}</div>
                      <div>
                        Kind: {entry.job.revision?.kind ?? "initial"}
                        {entry.job.revision?.requestedFocus
                          ? ` • ${entry.job.revision.requestedFocus}`
                          : ""}
                      </div>
                      <div>
                        Created: {new Date(entry.job.createdAt).toLocaleString()}
                      </div>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <Link
                        className="inline-flex h-8 items-center justify-center rounded-lg border border-black/10 bg-white px-3 text-xs font-bold text-zinc-950 hover:bg-zinc-50"
                        href={`/jobs/${entry.job.id}`}
                      >
                        Open Job
                      </Link>
                      {entry.job.artifacts?.previewPath ? (
                        <Link
                          className="inline-flex h-8 items-center justify-center rounded-lg border border-black/10 bg-white px-3 text-xs font-bold text-zinc-950 hover:bg-zinc-50"
                          href={`/api/jobs/${entry.job.id}/artifact?type=preview`}
                          target="_blank"
                          rel="noreferrer"
                        >
                          Preview
                        </Link>
                      ) : null}
                      {entry.job.artifacts?.zipPath ? (
                        <Link
                          className="inline-flex h-8 items-center justify-center rounded-lg border border-black/10 bg-white px-3 text-xs font-bold text-zinc-950 hover:bg-zinc-50"
                          href={`/api/jobs/${entry.job.id}/artifact?type=zip`}
                          target="_blank"
                          rel="noreferrer"
                        >
                          ZIP
                        </Link>
                      ) : null}
                      {entry.job.artifacts?.reportPath ? (
                        <Link
                          className="inline-flex h-8 items-center justify-center rounded-lg border border-black/10 bg-white px-3 text-xs font-bold text-zinc-950 hover:bg-zinc-50"
                          href={`/api/jobs/${entry.job.id}/artifact?type=report`}
                          target="_blank"
                          rel="noreferrer"
                        >
                          Report
                        </Link>
                      ) : null}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-zinc-500">
                No related revision jobs were found yet.
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-4 grid gap-3">
        <div className="text-sm font-extrabold text-zinc-700">Route Templates</div>
        <div className="rounded-xl border border-black/10 bg-white p-5 text-sm shadow-sm">
          {routeTemplates.length > 0 ? (
            <div className="grid gap-3">
              {routeTemplates.slice(0, 12).map((template, index) => {
                const record =
                  template && typeof template === "object"
                    ? (template as Record<string, unknown>)
                    : {};
                return (
                  <div
                    key={`${record.templateId ?? "template"}-${index}`}
                    className="rounded-lg border border-black/10 bg-zinc-50 p-3"
                  >
                    <div className="font-mono text-xs text-zinc-700">
                      {String(record.templateId ?? "-")}
                    </div>
                    <div className="mt-1 text-xs text-zinc-500">
                      {String(record.templateKind ?? "template")} • {String(record.routeCount ?? 0)} routes • rep {String(record.representativeRoutePath ?? "-")}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-zinc-500">No route templates recorded.</div>
          )}
        </div>
      </div>

      <div className="mt-4 grid gap-3">
        <div className="text-sm font-extrabold text-zinc-700">
          Responsive Capture Templates
        </div>
        <div className="rounded-xl border border-black/10 bg-white p-5 text-sm shadow-sm">
          {Array.isArray(responsivePlan?.templates) &&
          responsivePlan.templates.length > 0 ? (
            <div className="grid gap-3">
              {responsivePlan.templates
                .slice(0, 12)
                .map((template, index) => {
                  const record =
                    template && typeof template === "object"
                      ? (template as Record<string, unknown>)
                      : {};
                  const routesToCapture = Array.isArray(record.routesToCapture)
                    ? record.routesToCapture
                    : [];
                  const viewports = Array.isArray(record.viewports)
                    ? record.viewports
                    : [];
                  return (
                    <div
                      key={`${record.templateId ?? "responsive-template"}-${index}`}
                      className="rounded-lg border border-black/10 bg-zinc-50 p-3"
                    >
                      <div className="font-mono text-xs text-zinc-700">
                        {String(record.templateId ?? "-")}
                      </div>
                      <div className="mt-1 text-xs text-zinc-500">
                        {String(record.templateKind ?? "template")} •{" "}
                        {String(record.responsiveCapturePolicy ?? "-")} •{" "}
                        {viewports.join(", ") || "-"}
                      </div>
                      <div className="mt-2 text-xs text-zinc-600">
                        Capture {routesToCapture.length} route
                        {routesToCapture.length === 1 ? "" : "s"}:{" "}
                        {routesToCapture.slice(0, 3).join(", ") || "-"}
                      </div>
                    </div>
                  );
                })}
            </div>
          ) : (
            <div className="text-zinc-500">
              No responsive capture template plan recorded.
            </div>
          )}
        </div>
      </div>

      <div className="mt-4 grid gap-3">
        <div className="text-sm font-extrabold text-zinc-700">Artifacts</div>
        <div className="rounded-xl border border-black/10 bg-white p-5 text-sm shadow-sm">
          <div className="grid gap-2">
            <ArtifactRow
              label="Resolved request"
              value={job.artifacts?.resolvedRequestPath}
              pending={!hasResolvedRequest}
            />
            <ArtifactRow
              label="ZIP"
              value={job.artifacts?.zipPath}
              pending={!hasZip}
            />
            <ArtifactRow
              label="Report"
              value={job.artifacts?.reportPath}
              pending={!hasReport}
            />
            <ArtifactRow
              label="Preview"
              value={job.artifacts?.previewPath}
              pending={!hasPreview}
            />
            <ArtifactRow
              label="Status"
              value={job.artifacts?.statusPath}
              pending={!hasStatus}
            />
            <ArtifactRow
              label="Capability report"
              value={job.artifacts?.capabilityReportPath}
              pending={!hasCapabilityReport}
            />
            <ArtifactRow
              label="Compatibility report"
              value={job.artifacts?.codeCompatibilityReportPath}
              pending={!hasCodeCompatibilityReport}
            />
            <ArtifactRow
              label="Before/after"
              value={job.artifacts?.beforeAfterReportPath}
              pending={!hasBeforeAfterReport}
            />
            <ArtifactRow
              label="Revision"
              value={job.artifacts?.revisionManifestPath}
              pending={!hasRevisionManifest}
            />
            <ArtifactRow
              label="Validation"
              value={job.artifacts?.validationPath}
              pending={!hasValidation}
            />
            <ArtifactRow
              label="Invalidation"
              value={job.artifacts?.invalidationPlanPath}
              pending={!hasInvalidationPlan}
            />
            <ArtifactRow
              label="Artifact index"
              value={job.artifacts?.artifactIndexPath}
              pending={!hasArtifactIndex}
            />
            <ArtifactRow
              label="Responsive plan"
              value={job.artifacts?.responsiveRecapturePlanPath}
              pending={!hasResponsivePlan}
            />
          </div>
        </div>
      </div>

      <details className="mt-4">
        <summary className="cursor-pointer text-sm font-bold text-zinc-700">
          Raw Job JSON
        </summary>
        <pre className="mt-3 overflow-auto rounded-[10px] border border-black/10 bg-white p-4 text-xs shadow-[0_10px_30px_rgba(0,0,0,0.06)]">
          {JSON.stringify(job, null, 2)}
        </pre>
      </details>
    </main>
  );
}

async function readJsonIfExists(filePath?: string) {
  if (!filePath) return undefined;
  try {
    return JSON.parse(await fs.readFile(filePath, "utf8")) as unknown;
  } catch {
    return undefined;
  }
}

function readCapabilityReport(pluginCapture: unknown) {
  if (!pluginCapture || typeof pluginCapture !== "object") return undefined;
  const context = (pluginCapture as Record<string, unknown>).context;
  if (!context || typeof context !== "object") return undefined;
  const capabilities = (context as Record<string, unknown>).capabilities;
  if (!capabilities || typeof capabilities !== "object") return undefined;
  const report = (capabilities as Record<string, unknown>).capabilityReport;
  return report && typeof report === "object"
    ? (report as Record<string, any>)
    : undefined;
}

function readCapabilityErrors(report: Record<string, any>) {
  const candidates = [
    report.codeFiles?.error,
    report.cms?.managedCollectionsError,
    report.cms?.collectionsError,
    report.styles?.colorStylesError,
    report.styles?.textStylesError,
    report.styles?.fontsError,
    report.permissions?.syncPermissionError,
  ].filter((entry) => typeof entry === "string" && entry.length > 0);
  return candidates.join(" | ");
}

function createArtifactCountsByType(
  artifactIndex?: Record<string, unknown>,
): Array<[string, number]> {
  const entries = Array.isArray(artifactIndex?.entries)
    ? (artifactIndex.entries as Array<Record<string, unknown>>)
    : [];
  const counts = new Map<string, number>();

  for (const entry of entries) {
    const artifactType =
      typeof entry.artifactType === "string" ? entry.artifactType : "unknown";
    counts.set(artifactType, (counts.get(artifactType) ?? 0) + 1);
  }

  return Array.from(counts.entries()).sort((left, right) => {
    if (right[1] !== left[1]) return right[1] - left[1];
    return left[0].localeCompare(right[0]);
  });
}

function createRevisionLineage(input: {
  jobId: string;
  revisionManifest?: Record<string, unknown>;
  invalidationPlan?: Record<string, unknown>;
  report?: Record<string, unknown>;
}) {
  const revisionManifest = input.revisionManifest;
  const invalidationPlan = input.invalidationPlan;

  return {
    revisionId:
      typeof revisionManifest?.revisionId === "string"
        ? revisionManifest.revisionId
        : typeof input.report?.revisionId === "string"
          ? input.report.revisionId
          : "-",
    parentRevisionId:
      typeof revisionManifest?.parentRevisionId === "string"
        ? revisionManifest.parentRevisionId
        : typeof invalidationPlan?.parentRevisionId === "string"
          ? invalidationPlan.parentRevisionId
          : "-",
    kind:
      typeof input.report?.revisionRequest === "object" &&
      input.report.revisionRequest &&
      typeof (input.report.revisionRequest as Record<string, unknown>).kind ===
        "string"
        ? String((input.report.revisionRequest as Record<string, unknown>).kind)
        : typeof invalidationPlan?.kind === "string"
          ? String(invalidationPlan.kind)
          : "initial",
    focus:
      typeof invalidationPlan?.requestedFocus === "string"
        ? String(invalidationPlan.requestedFocus)
        : typeof revisionManifest?.revisionRequest === "object" &&
            revisionManifest.revisionRequest &&
            typeof (
              revisionManifest.revisionRequest as Record<string, unknown>
            ).requestedFocus === "string"
          ? String(
              (
                revisionManifest.revisionRequest as Record<string, unknown>
              ).requestedFocus,
            )
          : "-",
    sourceFingerprint:
      typeof revisionManifest?.sourceFingerprint === "string"
        ? revisionManifest.sourceFingerprint
        : "-",
    pluginFingerprint:
      typeof revisionManifest?.pluginFingerprint === "string"
        ? revisionManifest.pluginFingerprint
        : "-",
    artifactGraphHash:
      typeof revisionManifest?.artifactGraphHash === "string"
        ? revisionManifest.artifactGraphHash
        : "-",
  };
}

function formatCount(value?: number) {
  return typeof value === "number" ? String(value) : "-";
}

function formatSourceEvidenceList(value: unknown) {
  if (!Array.isArray(value) || value.length === 0) return "-";
  return value
    .filter((entry): entry is string => typeof entry === "string" && entry.length > 0)
    .map(humanizeSourceEvidenceReason)
    .join(", ");
}

function humanizeSourceEvidenceReason(value: string) {
  if (value === "code-file-api-unavailable") {
    return "Code File API unavailable";
  }
  if (value === "code-file-source-unreadable") {
    return "Code File source unreadable";
  }
  if (value === "override-assignment-unresolved") {
    return "Override assignments unresolved";
  }
  return value;
}

function labelForImprovementFocus(value: string) {
  if (value === "responsiveness") return "Improve responsiveness";
  if (value === "components") return "Improve components";
  if (value === "revalidate") return "Revalidate only";
  return "Improve both";
}

function Row({
  label,
  value,
  mono,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="grid grid-cols-[160px_1fr] items-baseline gap-3">
      <div className="text-xs font-extrabold text-zinc-600">{label}</div>
      <div
        className={mono ? "break-all font-mono text-sm" : "break-all text-sm"}
      >
        {value}
      </div>
    </div>
  );
}

function ArtifactRow({
  label,
  value,
  pending,
}: {
  label: string;
  value?: string;
  pending: boolean;
}) {
  return (
    <div className="grid grid-cols-[110px_1fr] items-start gap-3">
      <div className="text-xs font-extrabold text-zinc-600">{label}</div>
      <div className="min-w-0 text-sm">
        {pending ? (
          <span className="text-zinc-500">pending</span>
        ) : (
          <code className="break-all">{value}</code>
        )}
      </div>
    </div>
  );
}

function StatusPill({ status }: { status: string }) {
  const style =
    status === "completed"
      ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
      : status === "failed"
        ? "bg-red-50 text-red-700 ring-red-200"
        : status === "running"
          ? "bg-amber-50 text-amber-800 ring-amber-200"
          : "bg-zinc-50 text-zinc-700 ring-zinc-200";

  return (
    <span
      className={[
        "inline-flex h-6 items-center rounded-full px-2 text-[11px] font-bold ring-1",
        style,
      ].join(" ")}
    >
      {status}
    </span>
  );
}
