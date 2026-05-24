import Link from "next/link";

export default function Page() {
  return (
    <main className="container">
      <div className="topbar">
        <h1 className="title">Coderelay</h1>
        <div className="nav">
          <Link href="/jobs">Jobs</Link>
        </div>
      </div>

      <div className="panel" style={{ marginTop: 16 }}>
        <div className="panelBody">
          <div className="muted" style={{ lineHeight: 1.6 }}>
            Local MVP-B dashboard. Create an export job, then the worker will
            pick it up and write artifacts to disk.
          </div>
        </div>
      </div>
    </main>
  );
}
