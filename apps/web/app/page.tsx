import Link from "next/link";

export default function Page() {
  return (
    <main>
      <div className="grid gap-6">
        <div>
          <div className="text-sm font-semibold text-zinc-600">
            Total exports
          </div>
          <div className="mt-2 text-5xl font-black tracking-tight">0</div>
          <div className="mt-1 text-sm text-zinc-600">
            Start by creating a job.
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl bg-white p-5 shadow-[0_10px_30px_rgba(0,0,0,0.06)] ring-1 ring-black/10">
            <div className="text-sm font-extrabold">Create Export</div>
            <div className="mt-2 text-sm leading-6 text-zinc-600">
              Create an export job. The local worker will pick it up and write
              artifacts to disk.
            </div>
            <div className="mt-4">
              <Link
                className="inline-flex h-[42px] items-center rounded-2xl bg-zinc-950 px-4 text-sm font-extrabold text-white hover:bg-zinc-900"
                href="/jobs"
              >
                Go to Jobs
              </Link>
            </div>
          </div>

          <div className="rounded-2xl bg-zinc-100 p-5 ring-1 ring-black/5">
            <div className="text-sm font-extrabold text-zinc-900">
              Local Storage
            </div>
            <div className="mt-2 text-sm leading-6 text-zinc-700">
              Jobs are stored on disk under{" "}
              <span className="font-mono">.coderelay/</span>.
            </div>
            <div className="mt-4 text-sm text-zinc-700">
              Run worker: <span className="font-mono">npm run dev:worker</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
