import assert from "node:assert/strict";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { buildImprovementPreviewsForJob } from "./improvement-preview.js";
test("buildImprovementPreviewsForJob summarizes reuse plans from stored revision artifacts", async () => {
    const exportDir = await fs.mkdtemp(path.join(os.tmpdir(), "coderelay-improvement-preview-"));
    await fs.mkdir(path.join(exportDir, "source-artifacts"), {
        recursive: true,
    });
    await fs.writeFile(path.join(exportDir, "source-artifacts", "manifest.json"), JSON.stringify({
        componentFamiliesArtifactId: "source/component-families",
        codeFiles: [
            {
                artifactId: "source/code-file/button",
                metadataArtifactId: "source/code-file/button/metadata",
                sourceArtifactId: "source/code-file/button/source",
                hasContent: true,
                contentHash: "hash-1",
            },
        ],
    }));
    await fs.writeFile(path.join(exportDir, "revision-manifest.json"), JSON.stringify({
        revisionId: "revision_0001",
    }));
    await fs.writeFile(path.join(exportDir, "export-report.json"), JSON.stringify({
        routeTemplateCount: 3,
        componentFamilyCount: 2,
        codeFileCount: 1,
    }));
    await fs.writeFile(path.join(exportDir, "responsive-recapture-plan.json"), JSON.stringify({
        templateCount: 3,
        routeCount: 7,
        targetViewports: ["laptop", "tablet", "mobile"],
        templates: [
            { routesToCapture: ["/", "/pricing"] },
            { routesToCapture: ["/blog/first-post"] },
        ],
    }));
    const job = {
        id: "job_preview",
        status: "completed",
        sourceUrl: "https://example.com",
        exportMode: "full-site",
        createdAt: "2026-07-02T10:00:00.000Z",
        updatedAt: "2026-07-02T10:00:00.000Z",
        artifacts: {
            exportDir,
            reportPath: path.join(exportDir, "export-report.json"),
            revisionManifestPath: path.join(exportDir, "revision-manifest.json"),
            responsiveRecapturePlanPath: path.join(exportDir, "responsive-recapture-plan.json"),
        },
    };
    const previews = await buildImprovementPreviewsForJob(job);
    const responsiveness = previews.find((entry) => entry.requestedFocus === "responsiveness");
    const revalidate = previews.find((entry) => entry.requestedFocus === "revalidate");
    assert.equal(previews.length, 4);
    assert.ok(responsiveness);
    assert.equal(responsiveness?.estimatedTemplates, 3);
    assert.equal(responsiveness?.estimatedRoutes, 3);
    assert.deepEqual(responsiveness?.responsiveViewports, [
        "laptop",
        "tablet",
        "mobile",
    ]);
    assert.ok(responsiveness?.invalidatedArtifacts.includes("runtime/responsive"));
    assert.ok(revalidate);
    assert.equal(revalidate?.estimatedRoutes, 0);
    assert.equal(revalidate?.expectedTime, "~1 min");
    assert.ok(revalidate?.reusedArtifacts.includes("generated/project"));
});
