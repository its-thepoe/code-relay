import Link from "next/link";

export default function Page() {
  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8">
      <div className="flex items-baseline justify-between gap-4">
        <h1 className="text-4xl font-black tracking-tight">Coderelay</h1>
        <div className="text-sm text-zinc-600">
          <Link
            className="underline underline-offset-4 hover:text-zinc-900"
            href="/jobs"
          >
            Jobs
          </Link>
        </div>
      </div>

      <div className="mt-4 rounded-[10px] border border-black/10 bg-white shadow-[0_10px_30px_rgba(0,0,0,0.06)]">
        <div className="p-4 text-sm leading-6 text-zinc-700">
          Local MVP-B dashboard. Create an export job, then the worker will pick
          it up and write artifacts to disk.
        </div>
      </div>
    </main>
  );
}
