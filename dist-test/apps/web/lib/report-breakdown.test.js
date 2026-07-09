import assert from "node:assert/strict";
import test from "node:test";
import { createReportBreakdown } from "./report-breakdown.js";
test("createReportBreakdown produces the required report buckets", () => {
    const breakdown = createReportBreakdown({
        report: {
            visualFidelity: {
                desktop: 91,
                laptop: 82,
                tablet: 78,
                mobile: 66,
                motion: 74,
            },
            motionExtraction: {
                runtimeNodesWithMotion: 10,
                exportNodesWithMotion: 8,
            },
            assets: {
                linked: 12,
                downloaded: 3,
                failed: 0,
            },
            cmsCollectionCount: 2,
            cmsCollections: [{ itemCount: 4 }, { itemCount: 7 }],
        },
        validation: {
            status: "passed",
            generatedFileCount: 14,
            routes: [
                { routePath: "/", renderedElementCount: 12 },
                { routePath: "/about", renderedElementCount: 8 },
            ],
        },
        codeCompatibilityReport: {
            fileCount: 5,
            summary: {
                portable: 3,
                runtimeFallbackRequired: 1,
                unsupported: 0,
            },
        },
    });
    assert.deepEqual(breakdown.map((item) => item.key), [
        "build-validity",
        "route-validity",
        "desktop-fidelity",
        "visual-evidence",
        "responsive-fidelity",
        "interaction-fidelity",
        "code-component-portability",
        "cms-completeness",
        "asset-portability",
    ]);
    assert.equal(breakdown[0]?.tone, "good");
    assert.equal(breakdown.find((item) => item.key === "responsive-fidelity")?.value, "75");
    assert.equal(breakdown[5]?.detail, "8/10 motion-capable nodes exported");
    assert.equal(breakdown[7]?.detail, "11 items captured");
});
test("createReportBreakdown prefers interaction contract coverage when available", () => {
    const breakdown = createReportBreakdown({
        report: {
            visualFidelity: {
                motion: 81,
            },
            motionExtraction: {
                runtimeNodesWithMotion: 5,
                exportNodesWithMotion: 3,
            },
        },
        validation: {
            status: "passed",
            generatedFileCount: 10,
            routes: [{ routePath: "/", renderedElementCount: 10 }],
            interactionContracts: [
                { status: "passed", familyId: "Button" },
                { status: "passed", familyId: "Accordion" },
            ],
        },
    });
    const interaction = breakdown.find((item) => item.key === "interaction-fidelity");
    assert.equal(interaction?.tone, "good");
    assert.equal(interaction?.detail, "2/2 interaction contracts passed");
});
test("createReportBreakdown surfaces route and asset problems", () => {
    const breakdown = createReportBreakdown({
        report: {
            visualFidelity: {
                desktop: 22,
                motion: 15,
            },
            assets: {
                linked: 0,
                downloaded: 1,
                failed: 3,
            },
        },
        validation: {
            status: "failed",
            routes: [
                { routePath: "/", renderedElementCount: 0 },
                { routePath: "/contact", renderedElementCount: 4 },
            ],
            interactionContracts: [
                { status: "failed", familyId: "Menu" },
                { status: "passed", familyId: "Button" },
            ],
        },
        codeCompatibilityReport: {
            fileCount: 2,
            summary: {
                portable: 0,
                runtimeFallbackRequired: 1,
                unsupported: 1,
            },
        },
    });
    const routeValidity = breakdown.find((item) => item.key === "route-validity");
    const assetPortability = breakdown.find((item) => item.key === "asset-portability");
    const portability = breakdown.find((item) => item.key === "code-component-portability");
    assert.equal(routeValidity?.tone, "warn");
    assert.equal(routeValidity?.detail, "1 route(s) rendered empty");
    assert.equal(assetPortability?.tone, "warn");
    assert.equal(portability?.detail, "1 runtime fallback, 1 unsupported");
    assert.equal(breakdown.find((item) => item.key === "interaction-fidelity")?.detail, "1/2 interaction contracts passed");
});
