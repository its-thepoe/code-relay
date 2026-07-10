# Plan 003: Detect and report full-site plugin capture truncation instead of silently exporting partial trees

**Implementation status: DONE**

RCA outcome: the historical 3,000-node cap described below is not present at the
current implementation. Full-site exports intentionally send no selected plugin
nodes and use published-runtime route capture. The completed fix adds an explicit
diagnostics contract and a completion gate so a legacy or future truncated payload
cannot be accepted silently.

> **Executor instructions**: Follow this plan step by step. Run every verification command and confirm the expected result before moving to the next step. If anything in "STOP conditions" occurs, stop and report. When done, update the status row for this plan in `plans/README.md`.
>
> **Drift check (run first)**: `git diff --stat 2948374..HEAD -- apps/plugin/src/App.tsx packages/exporter-core/src/ir.ts packages/exporter-core/src/local-export.ts packages/exporter-core/src/exporter-regression.test.ts packages/shared/src/types.ts`
> If any in-scope file changed since this plan was written, compare the "Current state" excerpts against the live code before proceeding; on mismatch, stop and report.

## Status

- **Priority**: P1
- **Effort**: M
- **Risk**: MED
- **Depends on**: `plans/001-export-acceptance-gate.md`
- **Category**: bug, tests
- **Planned at**: commit `2948374`, 2026-06-14

## Why this matters

The historical failing full-site job had exactly `3000` selected nodes, which matched
an older cap. A partial tree can never preserve full-site layout correctly. The
current runtime-first path no longer reproduces that cap, but it previously had no
typed propagation or completion guard for a truncation marker. The exporter now
reports and enforces that invariant.

## Current state

- `apps/plugin/src/App.tsx` captures full-site roots from page roots plus component roots.
- The old `captureSelectionMetadata` cap is absent at current HEAD; its chunk size is progress batching, not a node limit.
- Full-site exports intentionally set `selectedNodes` to an empty array and capture published routes at required viewports.
- Captured nodes carry useful metadata like `rootId`, `rootKind`, `parentId`, `path`, `childIds`, and `styles`.
- The Framer plugin skill confirms canvas reads like `framer.getNodesWithType`, `framer.getCanvasRoot`, `framer.getSelection`, and `framer.getChildren` are normal plugin SDK APIs. Do not replace them with Framer code-component APIs.

Current root collection:

```ts
// apps/plugin/src/App.tsx:1569
async function readFullSiteRoots(
  knownComponents: ComponentNode[],
): Promise<FullSiteRoots> {
  const [webPages, designPages, canvasRoot] = await Promise.all([
    framer.getNodesWithType("WebPageNode").catch(() => []),
    framer.getNodesWithType("DesignPageNode").catch(() => []),
    framer.getCanvasRoot().catch(() => null),
  ]);
  ...
  const roots = [...pageRoots, ...componentRoots].filter(Boolean);
```

Current cap:

```ts
// apps/plugin/src/App.tsx:1687
const totalMaxNodes = 3000;
const maxNodesPerRoot = Math.max(
  24,
  Math.min(260, Math.floor(totalMaxNodes / Math.max(1, selection.length))),
);
```

Current RCA evidence from persisted job:

```json
{
  "selectedNodes": 3000,
  "exportMode": "full-site",
  "warning": "2994 selected nodes had low confidence runtime matches."
}
```

## Commands you will need

| Purpose | Command | Expected on success |
| --- | --- | --- |
| Typecheck | `npm run typecheck` | exit 0, no TypeScript errors |
| Exporter tests | `npm run test:exporter` | exit 0, all tests pass |
| Build | `npm run build` | exit 0 |

## Scope

**In scope**:

- `apps/plugin/src/App.tsx`
- `packages/shared/src/types.ts`
- `packages/exporter-core/src/ir.ts`
- `packages/exporter-core/src/local-export.ts`
- `packages/exporter-core/src/exporter-regression.test.ts`

**Out of scope**:

- Do not try to perfectly export every full-site node in this plan.
- Do not increase the cap blindly as the only fix.
- Do not remove component/CMS export.
- Do not add persistent storage for massive raw captures.

## Git workflow

```bash
git switch -c codex/003-diagnose-capture-truncation
```

## Steps

### Step 1: Add capture diagnostics to plugin payload context

In `apps/plugin/src/App.tsx`, attach explicit diagnostics to the plugin context. The
current uncapped/runtime-first path reports `truncated: false`; the contract is also
accepted by the exporter for older or future bounded capture implementations.

Required diagnostics:

- `totalMaxNodes` and `maxNodesPerRoot` are optional because the current path has no cap.
- `capturedNodeCount`
- `truncated`: boolean
- `truncatedRootIds`
- per-root summary: `rootId`, `rootName`, `rootKind`, `capturedCount`, `stoppedBecause`

Do not drop existing selected node shape. Add diagnostics under `pluginCapture.context.captureDiagnostics` or a similarly explicit context key.

**Verify**: `npm run typecheck` -> exit 0.

### Step 2: Make truncation visible in IR warnings

In `packages/exporter-core/src/ir.ts`, read the capture diagnostics and add an `ExportWarning` when `truncated === true`.

Warning requirements:

- `type`: use a specific value such as `"capture_truncated"`.
- `severity`: use `"error"` if current types allow it; otherwise `"warning"` plus report/worker handling in Step 3.
- Message must include captured count and cap, but not dump raw node payloads.

If `ExportWarning` type does not include `"error"`, update `packages/shared/src/types.ts` only if it is consistent with existing report consumers.

**Verify**: `npm run typecheck` -> exit 0.

### Step 3: Block full-site completion when page capture is truncated

In `packages/exporter-core/src/local-export.ts`, before selecting/copying the best attempt, inspect IR warnings/diagnostics.

Required behavior:

- If `exportMode === "full-site"` and capture diagnostics say page roots were truncated, fail the export with a clear message.
- If only component catalog capture was truncated but page roots were complete, allow export but include a warning.
- The failure message should tell the user to export a selection/page first or reduce scope.

This should work with Plan 001: a blocked truncation should fail before acceptance validation.

**Verify**: `npm run typecheck` -> exit 0.

### Step 4: Add tests for truncation behavior

In `packages/exporter-core/src/exporter-regression.test.ts`, add tests for:

- Full-site capture diagnostics with page truncation produces a blocking failure or error-level report.
- Component-only truncation produces a warning but does not block page export.
- Non-truncated captures behave as before.

Use synthetic plugin payloads; do not require live Framer.

**Verify**: `npm run test:exporter` -> exit 0.

## Test plan

- Add synthetic regression tests in `packages/exporter-core/src/exporter-regression.test.ts`.
- Run `npm run typecheck`.
- Run `npm run test:exporter`.
- If possible, manually inspect a new full-site job detail page and confirm truncation is visible.

## Done criteria

- [x] Plugin payload contains explicit capture diagnostics.
- [x] Exact cap hits are not silent.
- [x] Full-site page truncation prevents a successful completed ZIP.
- [x] Report/message explains why export was blocked.
- [x] `npm run typecheck` exits 0.
- [x] `npm run test:exporter` exits 0.
- [x] `plans/README.md` row for Plan 003 is updated.

## STOP conditions

- Framer plugin APIs do not expose enough information to know whether a root was truncated.
- The existing shared warning type cannot safely represent blocking errors without touching many unrelated files.
- The fix would require storing far larger plugin payloads in job JSON.

## Maintenance notes

Future work can replace caps with streaming or staged capture. Until then, this diagnostic is a safety rail: users should never download a "successful" full-site export when the source capture was known partial.
