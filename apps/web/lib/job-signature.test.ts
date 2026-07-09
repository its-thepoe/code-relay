import assert from "node:assert/strict";
import test from "node:test";
import {
  buildJobSignature,
  buildSingleJobSignature,
} from "./job-signature.js";

test("buildSingleJobSignature is stable for unchanged job state", () => {
  const job = {
    id: "job_123",
    status: "running",
    progress: {
      stage: "Capturing",
      routePath: "/blog/first-post",
      failed: 0,
    },
    artifacts: {
      exportDir: "/tmp/export",
      reportPath: "/tmp/report.json",
      previewPath: "/tmp/preview.html",
      revisionManifestPath: "/tmp/revision-manifest.json",
    },
    errorMessage: "",
    updatedAt: "2026-07-02T10:00:00.000Z",
  };

  const first = buildSingleJobSignature(job);
  const second = buildJobSignature({
    ...job,
    updatedAt: "2026-07-02T10:00:01.000Z",
  });

  assert.equal(first, second);
});

test("buildJobSignature includes revision-critical artifact availability", () => {
  const base = {
    id: "job_456",
    status: "completed",
    artifacts: {
      exportDir: "/tmp/export",
      reportPath: "/tmp/report.json",
    },
  };

  const withoutArtifactIndex = buildJobSignature(base);
  const withArtifactIndex = buildJobSignature({
    ...base,
    artifacts: {
      ...base.artifacts,
      artifactIndexPath: "/tmp/artifact-index.json",
    },
  });

  assert.notEqual(withoutArtifactIndex, withArtifactIndex);
});
