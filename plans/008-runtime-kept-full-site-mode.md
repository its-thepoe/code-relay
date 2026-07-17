# Plan 008: Pivot full-site export to a runtime-kept, agent-first handoff

> **Executor instructions**: Read this plan fully before editing. Implement the product direction in small, testable slices. Preserve existing selection/components behavior unless a step explicitly says otherwise. When done, update this plan's row in `plans/README.md`.
>
> **Drift check (run first)**: `git diff --stat HEAD -- packages/codegen/src/next-project.ts packages/exporter-core/src/local-export.ts packages/exporter-core/src/exporter-regression.test.ts packages/exporter-core/src/local-export.integration.test.ts plans/README.md`
> If full-site code generation or export report contracts have already been reworked, stop and reconcile this plan before making more changes.

## Status

- **Implementation status**: DONE
- **Priority**: P1
- **Effort**: L
- **Risk**: MED
- **Depends on**: `plans/001-export-acceptance-gate.md`, `plans/003-diagnose-capture-truncation.md`, `plans/004-separate-fidelity-evidence-levels.md`, `plans/007-block-incomplete-full-site-capture.md`
- **Category**: architecture, export, fidelity
- **Planned at**: 2026-07-11

## Why this matters

Full-site export currently tries to produce a reconstructed React project and then decorate it with diagnostic previews. That leaves us in an awkward middle state: the output is not faithful enough to beat a runtime mirror, yet it also is not simple enough to justify the fidelity loss. Our downstream editor is an agent, not a human expecting hand-polished source.

For full-site exports, the product should optimize for:

- fidelity,
- route completeness,
- asset completeness,
- deterministic local ownership,
- clear manifests for the next agent.

The runtime-kept path is the right default for that job.

## Product decision

Treat `full-site` as a **runtime-kept, agent-first** export mode by default.

That means:

- keep the Framer-generated runtime assumptions that are already captured in published output;
- keep the generated project structured and patchable for agents;
- remove debug chrome from the exported site surface;
- emit explicit handoff metadata describing what was preserved and what still needs care.

Selection/components exports remain the place for cleaner reconstructed React.

## Scope

**In scope**:

- `plans/README.md`
- `packages/codegen/src/next-project.ts`
- `packages/exporter-core/src/local-export.ts`
- `packages/exporter-core/src/exporter-regression.test.ts`
- `packages/exporter-core/src/local-export.integration.test.ts`

**Out of scope for this plan's first implementation**:

- Do not rename every UI/API surface to a new public export mode string yet.
- Do not replace the current Vite project output with a zero-build static mirror in one jump.
- Do not claim total removal of remote asset/runtime leaks unless verification proves it.
- Do not degrade selection/components exports to match full-site compromises.

## Commands you will need

| Purpose | Command | Expected on success |
| --- | --- | --- |
| Typecheck | `npm run typecheck` | exit 0 |
| Exporter tests | `npm run test:exporter` | exit 0 |
| Focused regression | `node --test dist-test/packages/exporter-core/src/exporter-regression.test.js` | exit 0 after build/test compile step if needed |

## Steps

### Step 1: Make generated full-site apps runtime-kept instead of preview-shell driven

In `packages/codegen/src/next-project.ts`, change the generated full-site `src/App.tsx` so it behaves like a real exported site shell, not a diagnostics viewer.

Required behavior:

- keep route interception, preloading, redirect handling, and route error boundaries;
- remove the Coderelay top bar, route metadata chrome, page count badge, and appended code-file preview block from the live full-site app;
- keep diagnostics in `preview.html` and report artifacts, not in the exported app surface.

**Verify**:

- full-site regression test reads generated `src/App.tsx` and confirms it does not render `FramerCodeFileList` or `previewTopbar`;
- selection/components preview app behavior remains unchanged.

### Step 2: Emit runtime-kept handoff manifests for agents

Extend generated full-site project artifacts with explicit handoff metadata that an agent can consume without guessing intent.

Add at least:

- a runtime strategy manifest with source URL, capture mode, export engine, route count, and whether Framer style CSS was preserved;
- an agent handoff manifest that points to route, asset, CMS, code-file, and report artifacts.

Do not invent a second divergent source of truth for route or asset data; reference existing manifests where possible.

**Verify**:

- integration test confirms the new manifest files exist in full-site exports;
- manifest content identifies full-site strategy as runtime-kept.

### Step 3: Update README and AGENT_BRIEF for the new contract

In `packages/exporter-core/src/local-export.ts`, update `createReadme` and `createAgentBrief` so full-site exports describe themselves accurately.

Required behavior:

- state that full-site exports are runtime-kept and intended for agent-first follow-on work;
- stop describing full-site output as if it were primarily a clean reconstructed component project;
- point the next editor to the report, route manifest, asset manifest, runtime manifest, and CMS/code-file manifests.

Keep selection/components wording compatible with the older reconstructed-react story.

### Step 4: Record strategy in `export-report.json`

Extend the report JSON so full-site exports explicitly declare the runtime-kept strategy and intended editor.

Add fields for:

- export strategy,
- runtime-kept boolean,
- intended editor (`agent-first`),
- key handoff artifact paths.

Do not break existing consumers that rely on current top-level fields.

### Step 5: Keep the acceptance bar honest

Do not relax existing full-site capture or fidelity gates to make the new strategy pass.

This plan is successful only if:

- generated full-site exports stop leaking diagnostics into the site surface;
- the output is more faithful and more patchable for an agent;
- the metadata clearly tells the next agent what they are picking up.

## Test plan

- Update/exporter regression coverage for generated full-site `App.tsx` without diagnostic chrome.
- Full-site integration test checks new runtime strategy manifest and agent handoff manifest exist.
- `npm run typecheck`
- `npm run test:exporter`

## Done criteria

- [x] `plans/README.md` contains Plan 008 and marks it `IN PROGRESS` or `DONE` accurately.
- [x] Generated full-site `src/App.tsx` no longer renders preview chrome or Framer code-file diagnostics.
- [x] Full-site exports emit runtime-kept strategy metadata for the next agent.
- [x] `README.md`, `AGENT_BRIEF.md`, and `export-report.json` describe full-site output as runtime-kept and agent-first.
- [x] Exporter tests and typecheck pass.

## STOP conditions

- A current web/plugin consumer depends on the full-site preview chrome being present in `src/App.tsx`. If so, stop and move that dependency to `preview.html` or a report artifact first.
- Any new manifest duplicates route or asset truth and starts drifting from existing manifests. Stop and collapse it into references instead.
