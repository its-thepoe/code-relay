import Link from "next/link";
import { notFound } from "next/navigation";
import { readJob } from "../../../lib/jobs-store";

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

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8">
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
            <Row label="Selector" value={job.selector ?? "-"} />
            <Row
              label="Created"
              value={new Date(job.createdAt).toLocaleString()}
            />
            <Row
              label="Updated"
              value={new Date(job.updatedAt).toLocaleString()}
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
            <Link
              className="inline-flex h-10 items-center justify-center rounded-lg bg-zinc-950 px-3 text-sm font-extrabold text-white hover:bg-zinc-900"
              href={`/api/jobs/${job.id}/artifact?type=zip`}
              download
              target="_blank"
              rel="noreferrer"
              aria-disabled={!hasZip}
            >
              Download ZIP
            </Link>
            <Link
              className="inline-flex h-10 items-center justify-center rounded-lg border border-black/10 bg-white px-3 text-sm font-bold text-zinc-950 hover:bg-zinc-50"
              href={`/api/jobs/${job.id}/artifact?type=report`}
              target="_blank"
              rel="noreferrer"
              aria-disabled={!hasReport}
            >
              Open Report JSON
            </Link>
          </div>

          <div className="mt-4 rounded-lg border border-black/10 bg-zinc-50 p-3 text-xs text-zinc-700">
            {hasZip || hasReport || hasPreview ? (
              <span>
                Artifacts are ready when the worker completes the job.
              </span>
            ) : (
              <span>
                Artifacts are still pending. Make sure the worker is running.
              </span>
            )}
          </div>
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
