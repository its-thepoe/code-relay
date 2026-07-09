import assert from "node:assert/strict";
import test from "node:test";
import { buildBeforeAfterSummary, collectRevisionFamily, } from "./revision-insights.js";
function createJob(id, overrides = {}) {
    return {
        id,
        status: "completed",
        sourceUrl: "https://example.com",
        exportMode: "full-site",
        createdAt: `2026-07-0${id.slice(-1)}T10:00:00.000Z`,
        updatedAt: `2026-07-0${id.slice(-1)}T10:00:00.000Z`,
        ...overrides,
    };
}
test("collectRevisionFamily groups root, siblings, and descendants in lineage order", () => {
    const root = createJob("job_1");
    const childA = createJob("job_2", {
        revision: {
            kind: "improvement",
            parentJobId: root.id,
            requestedFocus: "responsiveness",
        },
    });
    const childB = createJob("job_3", {
        revision: {
            kind: "improvement",
            parentJobId: root.id,
            requestedFocus: "components",
        },
    });
    const grandChild = createJob("job_4", {
        revision: {
            kind: "improvement",
            parentJobId: childA.id,
            requestedFocus: "both",
        },
    });
    const unrelated = createJob("job_5", {
        sourceUrl: "https://other.example.com",
    });
    const family = collectRevisionFamily([grandChild, unrelated, childB, root, childA], grandChild.id);
    assert.deepEqual(family.map((entry) => [entry.job.id, entry.depth, entry.isCurrent]), [
        [root.id, 0, false],
        [childA.id, 1, false],
        [childB.id, 1, false],
        [grandChild.id, 2, true],
    ]);
});
test("buildBeforeAfterSummary reports current, parent, and delta values", () => {
    const summary = buildBeforeAfterSummary({
        visualFidelity: { overall: 87.4 },
        routeTemplateCount: 12,
        componentFamilyCount: 3,
        generatedValidation: {
            renderedElementCount: 410,
            routes: [{}, {}, {}],
        },
    }, {
        visualFidelity: { overall: 81.2 },
        routeTemplateCount: 10,
        componentFamilyCount: 2,
        generatedValidation: {
            renderedElementCount: 398,
            routes: [{}, {}],
        },
    });
    assert.deepEqual(summary, [
        {
            label: "Overall fidelity",
            current: "87",
            parent: "81",
            delta: "+6",
        },
        {
            label: "Rendered routes",
            current: "3",
            parent: "2",
            delta: "+1",
        },
        {
            label: "Rendered elements",
            current: "410",
            parent: "398",
            delta: "+12",
        },
        {
            label: "Route templates",
            current: "12",
            parent: "10",
            delta: "+2",
        },
        {
            label: "Component families",
            current: "3",
            parent: "2",
            delta: "+1",
        },
    ]);
});
