import assert from "node:assert/strict";
import test from "node:test";
import { canServeArtifactWhilePending, resolveJobArtifact, } from "./job-artifacts.js";
const job = {
    id: "job_123",
    status: "running",
    sourceUrl: "https://example.com",
    exportMode: "full-site",
    createdAt: "2026-07-02T10:00:00.000Z",
    updatedAt: "2026-07-02T10:00:00.000Z",
    artifacts: {
        resolvedRequestPath: "/tmp/resolved-request.json",
        statusPath: "/tmp/status.json",
        beforeAfterReportPath: "/tmp/before-after-report.json",
        previewPath: "/tmp/preview.html",
        zipPath: "/tmp/export.zip",
    },
};
test("canServeArtifactWhilePending only blocks zip artifacts", () => {
    assert.equal(canServeArtifactWhilePending("resolved-request"), true);
    assert.equal(canServeArtifactWhilePending("status"), true);
    assert.equal(canServeArtifactWhilePending("preview"), true);
    assert.equal(canServeArtifactWhilePending("zip"), false);
});
test("resolveJobArtifact returns the path, filename, and content type", () => {
    assert.deepEqual(resolveJobArtifact(job, "resolved-request"), {
        path: "/tmp/resolved-request.json",
        filename: "job_123-resolved-request.json",
        contentType: "application/json; charset=utf-8",
    });
    assert.deepEqual(resolveJobArtifact(job, "status"), {
        path: "/tmp/status.json",
        filename: "job_123-status.json",
        contentType: "application/json; charset=utf-8",
    });
    assert.deepEqual(resolveJobArtifact(job, "before-after"), {
        path: "/tmp/before-after-report.json",
        filename: "job_123-before-after-report.json",
        contentType: "application/json; charset=utf-8",
    });
    assert.deepEqual(resolveJobArtifact(job, "preview"), {
        path: "/tmp/preview.html",
        filename: "job_123-preview.html",
        contentType: "text/html; charset=utf-8",
    });
});
