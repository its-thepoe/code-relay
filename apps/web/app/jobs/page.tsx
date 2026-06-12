import Link from "next/link";
import { readAllJobs } from "../../lib/jobs-store";

export const dynamic = "force-dynamic";

export default async function JobsPage() {
  const jobs = await readAllJobs();

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8">
      <div className="flex items-baseline justify-between gap-4">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
            Jobs
          </div>
          <h1 className="mt-1 text-3xl font-black tracking-tight text-zinc-950">
            Exports
          </h1>
        </div>
        <div className="text-sm text-zinc-600">
          <Link
            className="underline underline-offset-4 hover:text-zinc-900"
            href="/"
          >
            Home
          </Link>
        </div>
      </div>

      <CreateJobForm />

      <div className="mt-6">
        {jobs.length === 0 ? (
          <div className="rounded-xl border border-black/10 bg-white p-5 text-sm text-zinc-700 shadow-sm">
            <div className="text-base font-extrabold text-zinc-950">
              No jobs yet
            </div>
            <div className="mt-1 text-sm text-zinc-600">
              Create a job above, or start one from the Framer plugin.
            </div>
            <div className="mt-4 rounded-lg border border-black/10 bg-zinc-50 p-3 text-xs text-zinc-700">
              Worker command:{" "}
              <span className="font-mono">npm run dev:worker</span>
            </div>
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl border border-black/10 bg-white shadow-sm">
            <div className="grid grid-cols-[1fr_auto] gap-4 border-b border-black/10 bg-zinc-50 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-zinc-500">
              <div>Job</div>
              <div>Action</div>
            </div>
            {jobs.map((job) => (
              <div
                key={job.id}
                className="grid grid-cols-[1fr_auto] items-start gap-4 px-4 py-4 hover:bg-zinc-50"
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="min-w-0 truncate text-sm font-extrabold text-zinc-950">
                      {job.title ?? job.sourceUrl ?? "Untitled job"}
                    </div>
                    <StatusPill status={job.status} />
                  </div>
                  <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-zinc-600">
                    <div className="font-mono">{job.id}</div>
                    <div>
                      Created: {new Date(job.createdAt).toLocaleString()}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    className="inline-flex h-10 items-center rounded-lg border border-black/10 bg-white px-3 text-sm font-bold text-zinc-950 hover:bg-zinc-50"
                    href={`/jobs/${job.id}`}
                  >
                    Open
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

function CreateJobForm() {
  return (
    <form
      action="/api/jobs"
      method="post"
      className="mt-6 rounded-xl border border-black/10 bg-white shadow-sm"
    >
      <div className="grid gap-3 p-4">
        <label style={{ display: "grid", gap: 6 }}>
          <div className="text-xs font-extrabold text-zinc-600">
            Source URL (published page)
          </div>
          <input
            name="sourceUrl"
            placeholder="https://talktoaugust.com/"
            required
            className="h-10 w-full rounded-lg border border-black/10 bg-white px-3 text-sm outline-none focus:border-black/30 focus:ring-2 focus:ring-zinc-950/10"
          />
        </label>

        <label style={{ display: "grid", gap: 6 }}>
          <div className="text-xs font-extrabold text-zinc-600">
            Selector (optional)
          </div>
          <input
            name="selector"
            placeholder="section[data-framer-name='Hero']"
            className="h-10 w-full rounded-lg border border-black/10 bg-white px-3 text-sm outline-none focus:border-black/30 focus:ring-2 focus:ring-zinc-950/10"
          />
        </label>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="submit"
            className="inline-flex h-10 items-center rounded-lg bg-zinc-950 px-4 text-sm font-extrabold text-white hover:bg-zinc-900"
          >
            Create Job
          </button>
          <div className="text-sm text-zinc-600">
            Run worker with <code>npm run dev:worker</code>
          </div>
        </div>
      </div>
    </form>
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
