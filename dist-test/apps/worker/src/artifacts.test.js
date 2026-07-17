import assert from "node:assert/strict";
import path from "node:path";
import test from "node:test";
import { createPredictedArtifacts } from "./artifacts.js";
test("createPredictedArtifacts maps revision-stage artifacts into the job export dir", () => {
    const outDir = "/tmp/coderelay/job_123";
    const artifacts = createPredictedArtifacts(outDir);
    assert.deepEqual(artifacts, {
        exportDir: outDir,
        reportPath: path.join(outDir, "export-report.json"),
        resolvedRequestPath: path.join(outDir, "resolved-request.json"),
        statusPath: path.join(outDir, "status.json"),
        captureProgressPath: path.join(outDir, "capture-progress.json"),
        capabilityReportPath: path.join(outDir, "capability-report.json"),
        codeCompatibilityReportPath: path.join(outDir, "code-compatibility-report.json"),
        beforeAfterReportPath: path.join(outDir, "before-after-report.json"),
        parentInfoPath: path.join(outDir, "parent.json"),
        revisionManifestPath: path.join(outDir, "revision-manifest.json"),
        validationPath: path.join(outDir, "generated-validation.json"),
        invalidationPlanPath: path.join(outDir, "invalidation-plan.json"),
        artifactIndexPath: path.join(outDir, "artifact-index.json"),
        responsiveRecapturePlanPath: path.join(outDir, "responsive-recapture-plan.json"),
    });
});
