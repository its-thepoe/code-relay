import Link from "next/link";
import { readAllJobs } from "../../lib/jobs-store";

export const dynamic = "force-dynamic";

export default async function JobsPage() {
  const jobs = await readAllJobs();

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8">
      <div className="flex items-baseline justify-between gap-4">
        <h1 className="text-3xl font-black tracking-tight">Jobs</h1>
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

      <div style={{ marginTop: 18 }}>
        {jobs.length === 0 ? (
          <div className="mt-4 rounded-[10px] border border-black/10 bg-white p-4 text-sm text-zinc-700 shadow-[0_10px_30px_rgba(0,0,0,0.06)]">
            No jobs yet.
          </div>
        ) : (
          <ul
            style={{
              listStyle: "none",
              padding: 0,
              margin: 0,
              display: "grid",
              gap: 10,
            }}
          >
            {jobs.map((job) => (
              <li
                key={job.id}
                className="rounded-[10px] border border-black/10 bg-white shadow-[0_10px_30px_rgba(0,0,0,0.06)]"
              >
                <div className="flex flex-wrap justify-between gap-3 p-4">
                  <div style={{ minWidth: 260 }}>
                    <div className="text-base font-extrabold">
                      {job.title ?? job.sourceUrl}
                    </div>
                    <div className="mt-1 text-sm text-zinc-600">
                      <span style={{ marginRight: 10 }}>
                        Status: {job.status}
                      </span>
                      <span>
                        Created: {new Date(job.createdAt).toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <div
                    style={{ display: "flex", gap: 10, alignItems: "center" }}
                  >
                    <Link
                      className="inline-flex h-[42px] items-center rounded-[10px] border border-black/15 bg-white px-3 text-sm font-bold text-zinc-950 hover:bg-zinc-50"
                      href={`/jobs/${job.id}`}
                    >
                      Open
                    </Link>
                  </div>
                </div>
              </li>
            ))}
          </ul>
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
      className="mt-4 rounded-[10px] border border-black/10 bg-white shadow-[0_10px_30px_rgba(0,0,0,0.06)]"
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
            className="h-[42px] w-full rounded-[10px] border border-black/15 bg-white px-3 text-sm outline-none focus:border-black/30"
          />
        </label>

        <label style={{ display: "grid", gap: 6 }}>
          <div className="text-xs font-extrabold text-zinc-600">
            Selector (optional)
          </div>
          <input
            name="selector"
            placeholder="section[data-framer-name='Hero']"
            className="h-[42px] w-full rounded-[10px] border border-black/15 bg-white px-3 text-sm outline-none focus:border-black/30"
          />
        </label>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button
            type="submit"
            className="h-[42px] rounded-[10px] border border-black/15 bg-zinc-950 px-4 text-sm font-extrabold text-white hover:bg-zinc-900"
          >
            Create Job
          </button>
          <div className="self-center text-sm text-zinc-600">
            Run worker with <code>npm run dev:worker</code>
          </div>
        </div>
      </div>
    </form>
  );
}
