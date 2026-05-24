import Link from "next/link";
import { readAllJobs } from "../../lib/jobs-store";

export const dynamic = "force-dynamic";

export default async function JobsPage() {
  const jobs = await readAllJobs();

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
        <h1 style={{ margin: 0, fontSize: 24 }}>Jobs</h1>
        <Link href="/">Home</Link>
      </div>

      <CreateJobForm />

      <div style={{ marginTop: 18, borderTop: "1px solid #eee" }}>
        {jobs.length === 0 ? (
          <p style={{ color: "#666", marginTop: 16 }}>No jobs yet.</p>
        ) : (
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {jobs.map((job) => (
              <li
                key={job.id}
                style={{ padding: "14px 0", borderBottom: "1px solid #eee" }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 12,
                    flexWrap: "wrap",
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 600 }}>
                      {job.title ?? job.sourceUrl}
                    </div>
                    <div style={{ color: "#555", marginTop: 4, fontSize: 13 }}>
                      <span style={{ marginRight: 10 }}>
                        Status: {job.status}
                      </span>
                      <span>
                        Created: {new Date(job.createdAt).toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <div
                    style={{ display: "flex", gap: 12, alignItems: "center" }}
                  >
                    <Link href={`/jobs/${job.id}`}>Open</Link>
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
      style={{
        marginTop: 16,
        padding: 16,
        border: "1px solid #eee",
        borderRadius: 8,
        display: "grid",
        gap: 10,
      }}
    >
      <label style={{ display: "grid", gap: 6 }}>
        <div style={{ fontSize: 13, fontWeight: 600 }}>
          Source URL (published page)
        </div>
        <input
          name="sourceUrl"
          placeholder="https://talktoaugust.com/"
          required
          style={{
            height: 40,
            padding: "0 12px",
            border: "1px solid #ddd",
            borderRadius: 8,
          }}
        />
      </label>

      <label style={{ display: "grid", gap: 6 }}>
        <div style={{ fontSize: 13, fontWeight: 600 }}>Selector (optional)</div>
        <input
          name="selector"
          placeholder="section[data-framer-name='Hero']"
          style={{
            height: 40,
            padding: "0 12px",
            border: "1px solid #ddd",
            borderRadius: 8,
          }}
        />
      </label>

      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        <button
          type="submit"
          style={{
            height: 40,
            padding: "0 14px",
            borderRadius: 8,
            border: "1px solid #111",
            background: "#111",
            color: "#fff",
            cursor: "pointer",
          }}
        >
          Create Job
        </button>
        <div style={{ fontSize: 13, color: "#666", alignSelf: "center" }}>
          Run worker with <code>npm run dev:worker</code>
        </div>
      </div>
    </form>
  );
}
