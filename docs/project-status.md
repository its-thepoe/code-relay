# Project Status

Source plan: `docs/framer_to_code_implementation_plan.md`

Legend:

- 🟢 Done
- 🟡 In progress
- 🔴 Blocked / not started

## Overall Phase Status

| Status | Phase                                     | Notes                                                                                                                                                                |
| ------ | ----------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 🟡     | MVP-A local export engine                 | CLI, Playwright capture, IR, matching, codegen, visual compare, reruns, reports, and ZIP output exist. Needs broader fixture proof and unsupported-pattern tracking. |
| 🟡     | MVP-B productized worker + plugin capture | Local file-backed dashboard, API, worker, and Framer plugin exist. Supabase, R2, migrations, and real persistent job history are not implemented.                    |
| 🟡     | MVP-C fidelity hardening                  | Categorized scores and specific rerun reasons exist. Actual repair strategies and regression tests are not complete.                                                 |
| 🔴     | Private alpha                             | No tester flow, invite access, or alpha tracking yet.                                                                                                                |
| 🟡     | Page export                               | Current exporter supports page mode and section splitting, but page export beta criteria are not fully implemented.                                                  |
| 🔴     | Motion/CMS/GitHub/CLI enhancements        | Basic CLI exists, but post-MVP motion, CMS, GitHub export, and full CLI sync are not implemented.                                                                    |

## MVP-A Local Export Engine

| Status | Step                                                                  | Notes                                                                                                   |
| ------ | --------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| 🟡     | Create 5-10 sample Framer sections                                    | Only one fixture is present: `fixtures/sample-framer-section.html`.                                     |
| 🟢     | Build Playwright crawler script                                       | `packages/exporter-core/src/capture.ts` launches Playwright and loads source pages.                     |
| 🟢     | Capture desktop/mobile screenshots                                    | Desktop and mobile viewport captures exist.                                                             |
| 🟢     | Extract DOM/computed styles                                           | Runtime node extraction collects DOM paths, text, rects, attributes, and computed styles.               |
| 🟢     | Build runtime capture IR                                              | `RuntimeCapture` and `ExportIR` types exist in `packages/shared/src/types.ts`.                          |
| 🟢     | Simulate plugin capture with fixture metadata                         | `createSimulatedPluginCapture()` builds lightweight selected-node data from runtime nodes.              |
| 🟢     | Add node-to-DOM matching                                              | `packages/matcher/src/match.ts` scores text, bounds, asset, hierarchy, type, and tree context.          |
| 🟡     | Generate portable React + CSS                                         | Codegen writes a Next.js App Router project with TSX and CSS Modules, but output is still heuristic.    |
| 🟢     | Render generated output locally                                       | `preview.html` is generated and rendered by Playwright for comparison.                                  |
| 🟢     | Compare screenshots by category                                       | Fidelity scores include desktop, mobile, layout, typography, color, assets, motion, and node match.     |
| 🟡     | Add bounded rerun loop for low-fidelity attempts                      | Attempt loop exists with bounded strategies, but strategies do not yet perform deep corrective repairs. |
| 🟢     | Package a local ZIP                                                   | `zipDirectory()` is used by the local export pipeline.                                                  |
| 🟢     | Record fidelity scores, attempts, node-match confidence, and failures | `export-report.json` includes attempts, visual fidelity, node matching, sections, assets, and warnings. |

### MVP-A Exit Criteria

| Status | Criteria                                                | Notes                                                                |
| ------ | ------------------------------------------------------- | -------------------------------------------------------------------- |
| 🔴     | 7/10 simple sections can generate usable code           | Not enough fixtures or recorded runs in repo.                        |
| 🟢     | Generated output runs locally                           | Exported output includes Next.js project files and run instructions. |
| 🟢     | Visual diff report works                                | Pixelmatch-based comparison and JSON report exist.                   |
| 🟢     | Node-to-DOM matching produces useful confidence scores  | Confidence scoring and low-confidence warnings exist.                |
| 🟡     | Low-fidelity output can be rerun with a second strategy | Reruns exist, but strategy-specific repair is limited.               |
| 🔴     | Clear list of unsupported patterns                      | No maintained unsupported-pattern list found.                        |

## MVP-B Core Worker and Supabase Job System

| Status | Step                           | Notes                                                                                          |
| ------ | ------------------------------ | ---------------------------------------------------------------------------------------------- |
| 🔴     | Set up Supabase project        | No Supabase config or linked project found.                                                    |
| 🔴     | Add database migrations        | No `infra/supabase/migrations` files found.                                                    |
| 🔴     | Add RLS policies               | No migration or policy files found.                                                            |
| 🟢     | Build job creation endpoint    | `apps/web/app/api/jobs/route.ts` creates local JSON-backed jobs.                               |
| 🟢     | Build worker polling           | `apps/worker/src/index.ts` polls local job files.                                              |
| 🟡     | Implement job locking          | Local worker marks queued jobs as running, but there is no database lock or `skip locked` RPC. |
| 🟢     | Add job status updates         | Local jobs move through queued, running, completed, and failed.                                |
| 🟢     | Add plugin capture storage     | API stores `pluginCapture` in local job JSON.                                                  |
| 🔴     | Add node match records         | Node matches exist in reports, but are not stored as persistent job records.                   |
| 🟡     | Add export attempt records     | Attempts are recorded in export reports, not in a database table.                              |
| 🟡     | Add bounded auto-rerun support | Local attempt loop exists. No persisted attempt history.                                       |
| 🟢     | Add best-attempt selection     | Highest overall fidelity attempt is selected.                                                  |
| 🟢     | Add failure handling           | Worker marks local job failed with an error message.                                           |
| 🟡     | Add local temp cleanup         | Export work directories are kept under `.coderelay`; no final cleanup pass is implemented.     |
| 🔴     | Add R2 upload                  | No R2/S3 upload code found.                                                                    |
| 🟡     | Add signed URL generation      | Local artifact download endpoint exists, but no R2 signed URLs.                                |

### MVP-B Exit Criteria

| Status | Criteria                                           | Notes                                                                |
| ------ | -------------------------------------------------- | -------------------------------------------------------------------- |
| 🔴     | Job can be created in Supabase                     | Local JSON jobs only.                                                |
| 🟡     | Worker can process job                             | Local worker processes local jobs, not Supabase jobs.                |
| 🔴     | ZIP/report upload to R2                            | Not implemented.                                                     |
| 🟢     | Job status updates correctly                       | Implemented for local file-backed jobs.                              |
| 🔴     | Attempt history and best attempt are stored        | Best attempt is in report only, not persisted in Supabase.           |
| 🟡     | Plugin capture and node match summaries are stored | Plugin capture is stored locally; node match summary is report-only. |
| 🔴     | Temp files are deleted                             | No cleanup after completed local jobs.                               |

## MVP-C Fidelity Hardening

| Status | Step                                                                             | Notes                                                                    |
| ------ | -------------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| 🟢     | Add categorized fidelity scoring                                                 | Category fields exist in `FidelityScores`.                               |
| 🟡     | Add typography repair strategy                                                   | Strategy name exists; actual repair behavior is limited.                 |
| 🟡     | Add spacing/layout repair strategy                                               | Strategy name and rerun reason exist; actual repair behavior is limited. |
| 🔴     | Add mobile breakpoint repair strategy                                            | Mobile score exists, but no dedicated breakpoint repair strategy found.  |
| 🔴     | Add asset/object-fit repair strategy                                             | Asset score exists, but no dedicated asset repair strategy found.        |
| 🟢     | Add low-confidence node match warnings                                           | `node_match_low_confidence` and section confidence warnings exist.       |
| 🔴     | Add fixture regression tests for common section patterns                         | No test suite or fixture set found.                                      |
| 🔴     | Add adapter packaging notes for Vite, Next.js, Remix, Astro, and Laravel/Inertia | No adapter notes found.                                                  |

### MVP-C Exit Criteria

| Status | Criteria                                                                     | Notes                                                                     |
| ------ | ---------------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| 🟢     | Reports show layout, typography, color, asset, motion, and node-match scores | Report uses `bestAttempt.fidelity`.                                       |
| 🟢     | Rerun reasons are specific, not generic                                      | Rerun reason names mismatch categories.                                   |
| 🟡     | Supported fixture exports improve between attempt 1 and best attempt         | Attempts run, but improvement is not guaranteed by concrete repair logic. |
| 🟡     | Users can understand what changed between attempts                           | Reports show strategy and reason, but not detailed change diffs.          |

## Framer Plugin MVP

| Status | Step                                                                    | Notes                                                                                 |
| ------ | ----------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| 🟢     | Set up Framer plugin project with `npm create framer-plugin@latest`     | `apps/plugin` has Vite, React, `framer-plugin`, and plugin tooling.                   |
| 🟢     | Configure `framer.json` with `modes: ["canvas"]`                        | Present in `apps/plugin/framer.json`.                                                 |
| 🟢     | Import `framer-plugin/framer.css`                                       | Present in `apps/plugin/src/main.tsx`.                                                |
| 🟢     | Build plugin UI with `framer.showUI()` in `useLayoutEffect`             | Present in `apps/plugin/src/App.tsx`.                                                 |
| 🔴     | Add connect-account flow                                                | No auth/connect flow found.                                                           |
| 🔴     | Store only short-lived session references/preferences in `localStorage` | No session/localStorage flow found.                                                   |
| 🟢     | Detect selection with `framer.getSelection()`                           | Present in `useSelection()`.                                                          |
| 🟢     | Subscribe to selection updates with `framer.subscribeToSelection()`     | Present in `useSelection()`.                                                          |
| 🟡     | Capture lightweight selected-node metadata                              | Captures id, name, and type only. Text, bounds, and richer metadata are not captured. |
| 🟢     | Validate selection                                                      | Requires selected nodes before creating a job.                                        |
| 🟡     | Add export settings                                                     | API base URL and source URL exist; asset/output/fidelity settings are not present.    |
| 🟢     | Create export job from plugin                                           | Plugin posts to `/api/jobs`.                                                          |
| 🟢     | Open dashboard job page                                                 | Plugin tries `framer.openURL(jobUrl)` and falls back to notification.                 |
| 🟢     | Handle `FramerPluginClosedError` silently                               | Present in catch block.                                                               |
| 🟢     | Handle other errors with `framer.notify()`                              | Present in catch block.                                                               |

### Framer Plugin Exit Criteria

| Status | Criteria                                               | Notes                                                                           |
| ------ | ------------------------------------------------------ | ------------------------------------------------------------------------------- |
| 🟢     | User can open plugin                                   | Plugin app exists and calls `showUI()`.                                         |
| 🔴     | User can authenticate                                  | No authentication flow.                                                         |
| 🟢     | User can select a section/component                    | Selection detection and live updates exist.                                     |
| 🟡     | Plugin payload includes lightweight selection metadata | Basic metadata only.                                                            |
| 🟢     | User can create an export job                          | Job creation call exists.                                                       |
| 🟡     | User can download output from dashboard                | Local dashboard can download ZIP after local worker completes; no auth/R2 flow. |

## Web Dashboard

| Status | Step                                  | Notes                                                                                    |
| ------ | ------------------------------------- | ---------------------------------------------------------------------------------------- |
| 🔴     | Build Supabase auth                   | Not implemented.                                                                         |
| 🟢     | Build dashboard list                  | `apps/web/app/jobs/page.tsx` lists local jobs.                                           |
| 🟢     | Build job detail page                 | `apps/web/app/jobs/[id]/page.tsx` exists.                                                |
| 🟡     | Show status, warnings, fidelity score | Status is shown. Warnings and fidelity are in report JSON, not surfaced as dashboard UI. |
| 🟢     | Add download button                   | ZIP/report/preview artifact links exist for completed jobs.                              |
| 🔴     | Add expired state                     | Not implemented.                                                                         |
| 🟢     | Add failed state                      | Error field is shown when present.                                                       |
| 🔴     | Add retry button                      | Not implemented.                                                                         |

### Web Dashboard Exit Criteria

| Status | Criteria                        | Notes                                                  |
| ------ | ------------------------------- | ------------------------------------------------------ |
| 🔴     | User can log in                 | No auth.                                               |
| 🟡     | User can see own jobs           | User can see local jobs; no per-user ownership.        |
| 🟢     | User can download completed ZIP | Local artifact endpoint serves ZIPs.                   |
| 🔴     | Expired/failed states are clear | Failed error is visible, but expired state is missing. |

## Exported Project Requirements

| Status | Requirement           | Notes                                                                          |
| ------ | --------------------- | ------------------------------------------------------------------------------ |
| 🟢     | `README.md`           | Generated by local export.                                                     |
| 🟢     | `AGENT_BRIEF.md`      | Generated by local export.                                                     |
| 🟢     | `export-report.json`  | Generated by local export.                                                     |
| 🟢     | `package.json`        | Generated in exported project.                                                 |
| 🟢     | Source files          | Generated under app/components.                                                |
| 🟢     | Styles                | CSS Modules are generated.                                                     |
| 🟡     | Assets or asset links | Linked image assets are preserved; portable asset download is not implemented. |

## Testing Plan

| Status | Step                                        | Notes                                    |
| ------ | ------------------------------------------- | ---------------------------------------- |
| 🔴     | Unit tests for layout inference helpers     | No test files found.                     |
| 🔴     | Unit tests for CSS generation               | No test files found.                     |
| 🔴     | Unit tests for JSX generation               | No test files found.                     |
| 🔴     | Unit tests for report generation            | No test files found.                     |
| 🔴     | Unit tests for R2 key generation            | No R2 implementation or tests found.     |
| 🔴     | Unit tests for job status utilities         | No test files found.                     |
| 🔴     | Integration test for create export job      | No test files found.                     |
| 🔴     | Integration test for worker claims job      | No test files found.                     |
| 🔴     | Integration test for worker marks completed | No test files found.                     |
| 🔴     | Integration test for failed job handling    | No test files found.                     |
| 🔴     | Integration test for signed URL generation  | No test files found.                     |
| 🔴     | Visual fixture tests                        | No automated visual fixture suite found. |
| 🔴     | Manual QA checklist records                 | No recorded QA checklist found.          |

## Infrastructure Setup Checklist

### Supabase

| Status | Step                                    | Notes              |
| ------ | --------------------------------------- | ------------------ |
| 🔴     | Create project                          | Not found in repo. |
| 🔴     | Add migrations                          | Not found in repo. |
| 🔴     | Enable RLS                              | Not found in repo. |
| 🔴     | Add auth provider                       | Not found in repo. |
| 🔴     | Add service role key to worker only     | Not found in repo. |
| 🔴     | Add database functions for job claiming | Not found in repo. |

### R2

| Status | Step                        | Notes                           |
| ------ | --------------------------- | ------------------------------- |
| 🔴     | Create private bucket       | Not represented in repo.        |
| 🔴     | Create access keys          | Not represented in repo.        |
| 🔴     | Add lifecycle rules         | Not found in repo.              |
| 🔴     | Implement signed URLs       | Local file serving exists only. |
| 🔴     | Test upload/download/delete | Not found in repo.              |

### Worker VPS

| Status | Step                            | Notes                                         |
| ------ | ------------------------------- | --------------------------------------------- |
| 🔴     | Provision small VPS             | Not represented in repo.                      |
| 🔴     | Install Node.js                 | Not represented in repo.                      |
| 🔴     | Install Playwright browsers     | Dependency exists, deployment setup does not. |
| 🔴     | Configure environment variables | No deployment env template found.             |
| 🔴     | Run worker via PM2/systemd      | Not found.                                    |
| 🔴     | Set up logs                     | Console logs only.                            |
| 🔴     | Add disk cleanup cron           | Not found.                                    |
| 🔴     | Add basic monitoring            | Not found.                                    |

### Web App

| Status | Step                         | Notes                                                        |
| ------ | ---------------------------- | ------------------------------------------------------------ |
| 🔴     | Deploy Next.js app           | Not represented in repo.                                     |
| 🔴     | Connect Supabase             | Not implemented.                                             |
| 🔴     | Add auth                     | Not implemented.                                             |
| 🟢     | Add dashboard                | Local jobs dashboard exists.                                 |
| 🟢     | Add job detail page          | Local job detail page exists.                                |
| 🟡     | Add signed download endpoint | Local artifact endpoint exists; R2 signed download does not. |

### Plugin

| Status | Step                                                            | Notes                                              |
| ------ | --------------------------------------------------------------- | -------------------------------------------------- |
| 🟢     | Create plugin project with `npm create framer-plugin@latest`    | Present under `apps/plugin`.                       |
| 🟢     | Add `framer.json` with `modes: ["canvas"]`                      | Present.                                           |
| 🟢     | Import `framer-plugin/framer.css`                               | Present.                                           |
| 🟢     | Call `framer.showUI()` in `useLayoutEffect`                     | Present.                                           |
| 🟢     | Build UI                                                        | MVP UI exists.                                     |
| 🔴     | Add auth connect flow                                           | Not implemented.                                   |
| 🟢     | Add selection detection with `framer.getSelection()`            | Present.                                           |
| 🟢     | Add live selection updates with `framer.subscribeToSelection()` | Present.                                           |
| 🟡     | Capture lightweight selected-node metadata                      | Basic metadata exists; richer bounds/text missing. |
| 🟢     | Add export job creation                                         | Present.                                           |
| 🔴     | Test in Framer                                                  | No recorded Framer test evidence.                  |

## Cost Control Implementation Checklist

| Status | Step                                    | Notes                                                                           |
| ------ | --------------------------------------- | ------------------------------------------------------------------------------- |
| 🟡     | Keep screenshots local only             | Current screenshots are local, but debug retention cleanup is missing.          |
| 🔴     | Delete temp folders after each job      | Not implemented.                                                                |
| 🔴     | Add job timeout                         | Not implemented.                                                                |
| 🔴     | Add max asset size                      | Not implemented.                                                                |
| 🔴     | Add max ZIP size                        | Not implemented.                                                                |
| 🟢     | Add max viewport count                  | Capture is limited to desktop and mobile.                                       |
| 🔴     | Add free-tier export limit              | Not implemented.                                                                |
| 🟢     | Use linked asset mode for free users    | Current exporter links assets only; no user plan logic.                         |
| 🔴     | Add R2 lifecycle rules                  | Not implemented.                                                                |
| 🔴     | Add scheduled cleanup for expired files | Not implemented.                                                                |
| 🟡     | Store only metadata in Supabase         | No Supabase yet; local jobs store metadata and artifact paths.                  |
| 🟡     | Add worker concurrency limit            | Local worker processes one job at a time; no configurable `WORKER_CONCURRENCY`. |

## Suggested Sprint Plan

| Status | Sprint                         | Notes                                                                               |
| ------ | ------------------------------ | ----------------------------------------------------------------------------------- |
| 🟡     | Sprint 1: Feasibility          | Core prototype pieces exist, but fixture coverage and proof targets are incomplete. |
| 🟡     | Sprint 2: Backend Pipeline     | Local backend pipeline exists; Supabase/R2 production pipeline is not done.         |
| 🟡     | Sprint 3: Dashboard            | Local dashboard exists; auth, ownership, retry, expiry, and report UI need work.    |
| 🟡     | Sprint 4: Plugin               | Plugin can create jobs from selection; auth/session/settings need work.             |
| 🟡     | Sprint 4.5: Fidelity Hardening | Scoring/warnings exist; repair strategies/tests need work.                          |
| 🔴     | Sprint 5: Alpha Hardening      | Not started.                                                                        |

## Engineering Milestones

| Status | Milestone | Output                                                     | Notes                                                             |
| ------ | --------- | ---------------------------------------------------------- | ----------------------------------------------------------------- |
| 🟡     | M0        | CLI prototype                                              | `npm run export:test` exists; broader fixture proof still needed. |
| 🟢     | M1        | Runtime capture + simulated plugin capture + node matching | Implemented locally.                                              |
| 🟡     | M2        | Supabase + worker + export attempts                        | Local worker/attempts exist; Supabase missing.                    |
| 🔴     | M3        | R2 upload/download/delete                                  | Not implemented.                                                  |
| 🟡     | M4        | Auth + job detail + download + rerun                       | Job detail/download exist; auth and rerun missing.                |
| 🟡     | M5        | Start exports from Framer with canvas selection capture    | Plugin can start local jobs; auth and richer capture missing.     |
| 🟡     | M6        | Categorized reports + diff-driven reruns                   | Categorized reports exist; real repair reruns are limited.        |
| 🔴     | M7        | 20-50 testers                                              | Not started.                                                      |
| 🟡     | M8        | One-page exports                                           | Page mode exists, but page beta criteria are incomplete.          |
| 🔴     | M9        | Credits/subscriptions                                      | Not started.                                                      |
