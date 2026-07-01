import fs from "node:fs/promises";
import Link from "next/link";
import { notFound } from "next/navigation";
import { readJob } from "../../../lib/jobs-store";
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

  const hasZip = Boolean(job.artifacts?.zipPath);
  const hasReport = Boolean(job.artifacts?.reportPath);
  const hasPreview = Boolean(job.artifacts?.previewPath);
  const hasRevisionManifest = Boolean(job.artifacts?.revisionManifestPath);
  const hasValidation = Boolean(job.artifacts?.validationPath);
  const hasInvalidationPlan = Boolean(job.artifacts?.invalidationPlanPath);
  const hasArtifactIndex = Boolean(job.artifacts?.artifactIndexPath);
  const isPending = job.status === "queued" || job.status === "running";
  const refreshSignature = `${job.id}:${job.status}:${job.updatedAt}`;
  const report =
    (await readJsonIfExists(job.artifacts?.reportPath)) as
      | Record<string, unknown>
      | undefined;
  const revisionManifest =
    (await readJsonIfExists(job.artifacts?.revisionManifestPath)) as
      | Record<string, unknown>
      | undefined;
  const validation =
    (await readJsonIfExists(job.artifacts?.validationPath)) as
      | Record<string, unknown>
      | undefined;
  const invalidationPlan =
    (await readJsonIfExists(job.artifacts?.invalidationPlanPath)) as
      | Record<string, unknown>
      | undefined;
  const artifactIndex =
    (await readJsonIfExists(job.artifacts?.artifactIndexPath)) as
      | Record<string, unknown>
      | undefined;
  const capabilityReport = readCapabilityReport(job.pluginCapture);
  const routeTemplates = Array.isArray(report?.routeTemplates)
    ? report.routeTemplates
    : [];
  const generatedValidation =
    validation && typeof validation === "object"
      ? validation
      : report?.generatedValidation && typeof report.generatedValidation === "object"
        ? (report.generatedValidation as Record<string, unknown>)
        : undefined;
  const validationRoutes = Array.isArray(generatedValidation?.routes)
    ? generatedValidation.routes
    : [];
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
          </div>

          <div className="mt-4 rounded-lg border border-black/10 bg-zinc-50 p-3 text-xs text-zinc-700">
            {hasZip || hasReport || hasPreview ? (
              <span>
                Export completed. Artifacts are ready.
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
              <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
                {(
                  [
                    ["responsiveness", "Improve responsiveness"],
                    ["components", "Improve components"],
                    ["both", "Improve both"],
                    ["revalidate", "Revalidate only"],
                  ] as const
                ).map(([value, label]) => (
                  <button
                    key={value}
                    type="submit"
                    name="requestedFocus"
                    value={value}
                    className="inline-flex h-10 items-center justify-center rounded-lg border border-black/10 bg-white px-3 text-sm font-bold text-zinc-950 hover:bg-zinc-50"
                  >
                    {label}
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
              label="Manifest"
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
            Artifact Index
          </div>
          <div className="mt-3 rounded-xl border border-black/10 bg-white p-5 text-sm shadow-sm">
            {artifactIndex ? (
              <div className="grid gap-3">
                <Row
                  label="Files"
                  value={String(artifactIndex.fileCount ?? "-")}
                />
                <Row
                  label="Generated"
                  value={String(artifactIndex.generatedAt ?? "-")}
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
            {capabilityReport ? (
              <div className="grid gap-3">
                <Row
                  label="Code file API"
                  value={capabilityReport.codeFiles?.readable ? "readable" : "unavailable"}
                />
                <Row
                  label="Code file source"
                  value={`${capabilityReport.codeFiles?.contentReadableCount ?? 0}/${capabilityReport.codeFiles?.count ?? 0} readable`}
                />
                <Row
                  label="Overrides"
                  value={`${capabilityReport.codeFiles?.overrideExportCount ?? 0}`}
                />
                <Row
                  label="CMS access"
                  value={capabilityReport.cms?.collectionsReadable ? "readable" : "unavailable"}
                />
                <Row
                  label="Styles access"
                  value={
                    capabilityReport.styles?.colorStylesReadable ||
                    capabilityReport.styles?.textStylesReadable
                      ? "readable"
                      : "unavailable"
                  }
                />
                <Row
                  label="Permission errors"
                  value={readCapabilityErrors(capabilityReport) || "-"}
                />
              </div>
            ) : (
              <div className="text-zinc-500">No capability report captured yet.</div>
            )}
          </div>
        </div>

        <div>
          <div className="text-sm font-extrabold text-zinc-700">
            Export Summary
          </div>
          <div className="mt-3 rounded-xl border border-black/10 bg-white p-5 text-sm shadow-sm">
            <div className="grid gap-3">
              <Row
                label="Best overall"
                value={
                  typeof (report?.visualFidelity as any)?.overall === "number"
                    ? `${Math.round((report?.visualFidelity as any).overall)}`
                    : "-"
                }
              />
              <Row
                label="Rendered routes"
                value={`${validationRoutes.length}`}
              />
              <Row
                label="Elements rendered"
                value={
                  typeof generatedValidation?.renderedElementCount === "number"
                    ? String(generatedValidation.renderedElementCount)
                    : "-"
                }
              />
              <Row
                label="Templates"
                value={`${routeTemplates.length}`}
              />
              <Row
                label="Build status"
                value={
                  typeof generatedValidation?.status === "string"
                    ? generatedValidation.status
                    : "-"
                }
              />
            </div>
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
        <div className="text-sm font-extrabold text-zinc-700">Artifacts</div>
        <div className="rounded-xl border border-black/10 bg-white p-5 text-sm shadow-sm">
          <div className="grid gap-2">
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
