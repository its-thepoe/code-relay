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
      <div className="flex items-baseline justify-between gap-4">
        <h1 className="text-3xl font-black tracking-tight">Job</h1>
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

      <div className="mt-4 rounded-[10px] border border-black/10 bg-white shadow-[0_10px_30px_rgba(0,0,0,0.06)]">
        <div className="grid gap-2 p-4">
          <Row label="ID" value={job.id} mono />
          <Row label="Status" value={job.status} />
          <Row label="Source URL" value={job.sourceUrl} />
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

      <div className="mt-4 grid gap-3">
        <div className="text-sm font-extrabold text-zinc-700">Artifacts</div>
        <div className="rounded-[10px] border border-black/10 bg-white p-4 text-sm shadow-[0_10px_30px_rgba(0,0,0,0.06)]">
          <div>
            ZIP:{" "}
            {hasZip ? (
              <code className="break-all">{job.artifacts!.zipPath}</code>
            ) : (
              <span className="text-zinc-500">pending</span>
            )}
          </div>
          <div>
            Report:{" "}
            {hasReport ? (
              <code className="break-all">{job.artifacts!.reportPath}</code>
            ) : (
              <span className="text-zinc-500">pending</span>
            )}
          </div>
          <div>
            Preview:{" "}
            {hasPreview ? (
              <code className="break-all">{job.artifacts!.previewPath}</code>
            ) : (
              <span className="text-zinc-500">pending</span>
            )}
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            {hasPreview ? (
              <a
                className="inline-flex h-[42px] items-center rounded-[10px] border border-black/15 bg-white px-3 text-sm font-bold text-zinc-950 hover:bg-zinc-50"
                href={`/api/jobs/${job.id}/artifact?type=preview`}
                target="_blank"
                rel="noreferrer"
              >
                Open Preview
              </a>
            ) : null}
            {hasZip ? (
              <a
                className="inline-flex h-[42px] items-center rounded-[10px] border border-black/15 bg-zinc-950 px-3 text-sm font-extrabold text-white hover:bg-zinc-900"
                href={`/api/jobs/${job.id}/artifact?type=zip`}
                download
                target="_blank"
                rel="noreferrer"
              >
                Download ZIP
              </a>
            ) : null}
            {hasReport ? (
              <a
                className="inline-flex h-[42px] items-center rounded-[10px] border border-black/15 bg-white px-3 text-sm font-bold text-zinc-950 hover:bg-zinc-50"
                href={`/api/jobs/${job.id}/artifact?type=report`}
                target="_blank"
                rel="noreferrer"
              >
                Open Report JSON
              </a>
            ) : null}
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
