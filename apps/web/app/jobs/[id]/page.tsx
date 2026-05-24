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

  return (
    <main style={{ padding: 24, maxWidth: 1100, margin: "0 auto" }}>
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          justifyContent: "space-between",
          gap: 16,
        }}
      >
        <h1 style={{ margin: 0, fontSize: 22 }}>Job</h1>
        <div style={{ display: "flex", gap: 12 }}>
          <Link href="/jobs">Jobs</Link>
          <Link href="/">Home</Link>
        </div>
      </div>

      <div
        style={{
          marginTop: 14,
          padding: 16,
          border: "1px solid #eee",
          borderRadius: 8,
        }}
      >
        <div style={{ display: "grid", gap: 6 }}>
          <Row label="ID" value={job.id} />
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

      <div style={{ marginTop: 16, display: "grid", gap: 10 }}>
        <div style={{ fontWeight: 700 }}>Artifacts</div>
        <div style={{ display: "grid", gap: 6, color: "#333" }}>
          <div>
            ZIP:{" "}
            {hasZip ? (
              <code>{job.artifacts!.zipPath}</code>
            ) : (
              <span style={{ color: "#777" }}>pending</span>
            )}
          </div>
          <div>
            Report:{" "}
            {hasReport ? (
              <code>{job.artifacts!.reportPath}</code>
            ) : (
              <span style={{ color: "#777" }}>pending</span>
            )}
          </div>
        </div>
      </div>

      <details style={{ marginTop: 16 }}>
        <summary style={{ cursor: "pointer" }}>Raw Job JSON</summary>
        <pre
          style={{
            marginTop: 12,
            padding: 12,
            border: "1px solid #eee",
            borderRadius: 8,
            overflow: "auto",
          }}
        >
          {JSON.stringify(job, null, 2)}
        </pre>
      </details>
    </main>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "160px 1fr",
        gap: 12,
        alignItems: "baseline",
      }}
    >
      <div style={{ color: "#666", fontSize: 13 }}>{label}</div>
      <div
        style={{
          fontFamily: label === "ID" ? "ui-monospace, monospace" : "inherit",
        }}
      >
        {value}
      </div>
    </div>
  );
}
