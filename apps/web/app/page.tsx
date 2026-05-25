import Link from "next/link";

export default function Page() {
  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
            Dashboard
          </div>
          <h1 className="mt-1 text-3xl font-black tracking-tight text-zinc-950">
            Coderelay
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-600">
            Create export jobs from the Framer plugin. The local worker picks
            them up and writes artifacts to disk.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            className="inline-flex h-10 items-center rounded-lg bg-zinc-950 px-4 text-sm font-extrabold text-white hover:bg-zinc-900"
            href="/jobs"
          >
            View Jobs
          </Link>
        </div>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-black/10 bg-white p-5 shadow-sm">
          <div className="text-sm font-extrabold text-zinc-950">
            Quick Start
          </div>
          <div className="mt-2 text-sm leading-6 text-zinc-600">
            1. Run the dashboard.
            <br />
            2. Run the worker.
            <br />
            3. Create a job from the plugin or the Jobs page.
          </div>
          <div className="mt-4 grid gap-2 text-sm text-zinc-700">
            <div className="flex items-center justify-between gap-3 rounded-lg bg-zinc-50 px-3 py-2">
              <span className="font-semibold">Dashboard</span>
              <span className="font-mono text-xs">npm run dev:web</span>
            </div>
            <div className="flex items-center justify-between gap-3 rounded-lg bg-zinc-50 px-3 py-2">
              <span className="font-semibold">Worker</span>
              <span className="font-mono text-xs">npm run dev:worker</span>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-black/10 bg-white p-5 shadow-sm">
          <div className="text-sm font-extrabold text-zinc-950">
            Where Files Go
          </div>
          <div className="mt-2 text-sm leading-6 text-zinc-600">
            Jobs live on disk under{" "}
            <span className="rounded bg-zinc-100 px-1 font-mono text-xs text-zinc-800">
              .coderelay/
            </span>
            . Each completed job includes a ZIP, a report JSON, and a preview.
          </div>
          <div className="mt-4 rounded-lg border border-black/10 bg-zinc-50 p-3 text-xs text-zinc-700">
            Tip: if you change code and want a clean slate, delete{" "}
            <span className="font-mono">.coderelay/jobs</span> and{" "}
            <span className="font-mono">.coderelay/artifacts</span>.
          </div>
        </div>
      </div>
    </main>
  );
}
