import Link from "next/link";
import { readAllJobs } from "../../lib/jobs-store";

export const dynamic = "force-dynamic";

export default async function JobsPage() {
  const jobs = await readAllJobs();

  return (
    <main className="container">
      <div className="topbar">
        <h1 className="title">Jobs</h1>
        <div className="nav">
          <Link href="/">Home</Link>
        </div>
      </div>

      <CreateJobForm />

      <div style={{ marginTop: 18 }}>
        {jobs.length === 0 ? (
          <div className="panel" style={{ marginTop: 16 }}>
            <div className="panelBody muted">No jobs yet.</div>
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
              <li key={job.id} className="panel">
                <div
                  className="panelBody"
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 12,
                    flexWrap: "wrap",
                  }}
                >
                  <div style={{ minWidth: 260 }}>
                    <div style={{ fontWeight: 800, fontSize: 16 }}>
                      {job.title ?? job.sourceUrl}
                    </div>
                    <div
                      className="muted"
                      style={{ marginTop: 6, fontSize: 13 }}
                    >
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
                      className="btnSecondary"
                      style={{
                        textDecoration: "none",
                        display: "inline-flex",
                        alignItems: "center",
                      }}
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
      className="panel"
      style={{ marginTop: 16 }}
    >
      <div className="panelBody" style={{ display: "grid", gap: 12 }}>
        <label style={{ display: "grid", gap: 6 }}>
          <div className="label">Source URL (published page)</div>
          <input
            name="sourceUrl"
            placeholder="https://talktoaugust.com/"
            required
            className="input"
          />
        </label>

        <label style={{ display: "grid", gap: 6 }}>
          <div className="label">Selector (optional)</div>
          <input
            name="selector"
            placeholder="section[data-framer-name='Hero']"
            className="input"
          />
        </label>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button type="submit" className="btn">
            Create Job
          </button>
          <div style={{ fontSize: 13, alignSelf: "center" }} className="muted">
            Run worker with <code>npm run dev:worker</code>
          </div>
        </div>
      </div>
    </form>
  );
}
