import assert from "node:assert/strict";
import test from "node:test";
import { createCompletedOutcomeCopy, readExportCompletion, readExportHealth, } from "./export-health.js";
test("readExportHealth returns partial when source evidence is partial", () => {
    assert.equal(readExportHealth({
        sourceEvidence: {
            status: "partial",
        },
    }), "partial");
});
test("readExportHealth falls back to unknown when source evidence is absent", () => {
    assert.equal(readExportHealth({}), "unknown");
});
test("readExportCompletion returns verified only when validation and ZIP proof exist", () => {
    assert.equal(readExportCompletion({
        generatedValidation: {
            status: "passed",
            routes: [{ path: "/" }],
            pageErrors: [],
            externalRequests: [],
            failedRequests: [],
            packagedArchive: {
                verified: true,
            },
        },
    }), "verified");
    assert.equal(readExportCompletion({}), "incomplete");
});
test("createCompletedOutcomeCopy returns partial-safe copy for every surface", () => {
    const report = {
        sourceEvidence: {
            status: "partial",
        },
    };
    assert.equal(createCompletedOutcomeCopy({ report, surface: "plugin-card" }), "Export complete with partial source-aware evidence. Review the report before trusting it as a reusable baseline.");
    assert.equal(createCompletedOutcomeCopy({ report, surface: "job-banner" }), "Export completed with partial source-aware evidence. Review warnings before trusting the output as a full-fidelity baseline.");
    assert.equal(createCompletedOutcomeCopy({ report, surface: "worker-log" }), "completed with partial source-aware evidence");
});
test("createCompletedOutcomeCopy returns full-success copy only for verified exports", () => {
    assert.equal(createCompletedOutcomeCopy({
        report: {
            sourceEvidence: { status: "complete" },
            generatedValidation: {
                status: "passed",
                routes: [{ path: "/" }],
                pageErrors: [],
                externalRequests: [],
                failedRequests: [],
                packagedArchive: { verified: true },
            },
        },
        surface: "worker-log",
    }), "completed");
    assert.equal(createCompletedOutcomeCopy({ report: {}, surface: "job-banner" }), "Export finished, but required completion evidence is incomplete. Review validation before using the artifacts.");
});
