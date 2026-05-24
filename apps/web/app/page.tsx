import Link from "next/link";

export default function Page() {
  return (
    <main style={{ padding: 24, maxWidth: 980, margin: "0 auto" }}>
      <h1 style={{ margin: 0, fontSize: 28 }}>Coderelay</h1>
      <p style={{ marginTop: 12, color: "#444", lineHeight: 1.5 }}>
        Local MVP-B dashboard. Create an export job, then the worker will pick
        it up and write artifacts to disk.
      </p>
      <div
        style={{ display: "flex", gap: 12, marginTop: 18, flexWrap: "wrap" }}
      >
        <Link href="/jobs">Jobs</Link>
      </div>
    </main>
  );
}
