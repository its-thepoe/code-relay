 # Implementation Plan: Framer-to-Code Handoff Tool

## 1. Implementation Strategy

The product should be built in layers, starting with the hardest technical proof before investing heavily in product polish.

The implementation order should be:

```text
MVP-A local export engine
  ↓
MVP-B productized worker + plugin capture
  ↓
MVP-C fidelity hardening
  ↓
Private alpha
  ↓
Page export
  ↓
Motion/CMS/GitHub/CLI
```

The biggest technical risk is not authentication or billing. The biggest risk is whether the export pipeline can generate useful, editable code with acceptable fidelity.

So the first sprint should prove export quality locally before building the full SaaS wrapper.

---

## 2. Recommended Stack

### Frontend / Web App

```text
Next.js
TypeScript
Supabase client
Tailwind CSS or shadcn/ui
```

### Framer Plugin

```text
React
TypeScript
framer-plugin
Vite
vite-plugin-framer
```

Scaffold command:

```bash
npm create framer-plugin@latest
```

Required plugin setup:

```ts
import { framer, FramerPluginClosedError } from 'framer-plugin'
import 'framer-plugin/framer.css'
```

`framer.json` should start in canvas mode:

```json
{
  "name": "Coderelay",
  "modes": ["canvas"],
  "icon": "/icon.svg"
}
```

### Backend

```text
Supabase Auth
Supabase Postgres
Supabase Row Level Security
Supabase Edge Functions only for lightweight endpoints if needed
```

### Worker

```text
Node.js
TypeScript
Playwright
Prettier
pixelmatch or resemble.js
archiver/yazl for ZIP creation
Sharp optional
PM2/systemd/Docker for deployment
```

### Storage

```text
Cloudflare R2
Private bucket
Signed URLs
Lifecycle rules
```

### Deployment

Lean v1:

```text
Web app: Vercel, Netlify, or VPS
Worker: small VPS
Database/Auth: Supabase
Storage: Cloudflare R2
```

Given a lean/portable preference, a single VPS can host the worker and potentially the dashboard later. Starting with Vercel for the dashboard is acceptable if speed matters, but avoid coupling the core processing to Vercel functions.

---

## 3. System Architecture

```text
Framer Plugin
  ↓
Plugin canvas selection capture
  ↓
Web App / API
  ↓
Supabase Auth + Postgres
  ↓
export_jobs table
  ↓
Worker process polling jobs
  ↓
Playwright runtime render/extract
  ↓
Node-to-DOM matching
  ↓
Code generation
  ↓
Categorized visual comparison
  ↓
ZIP packaging
  ↓
Cloudflare R2
  ↓
Dashboard download
```

### Key Design Decision

Supabase is the control plane. The worker is the processing plane.

Supabase should handle:

- users
- auth
- projects
- export jobs
- job statuses
- file keys
- report metadata
- billing state later

The worker should handle:

- crawling
- rendering
- screenshots
- node-to-DOM matching
- code generation
- categorized diffing
- ZIP creation
- file cleanup

R2 should handle:

- temporary ZIP files
- temporary report JSON
- optional debug artefacts

---

## 4. Repository Structure

Use a monorepo from the start.

```text
coderelay/
  apps/
    web/
      app/
      components/
      lib/
      package.json
    plugin/
      src/
      package.json
    worker/
      src/
      package.json
  packages/
    exporter-core/
      src/
    codegen/
      src/
    fidelity/
      src/
    matcher/
      src/
    shared/
      src/
  infra/
    supabase/
      migrations/
      seed.sql
    r2/
      lifecycle.md
  docs/
    PRD.md
    IMPLEMENTATION.md
  package.json
  pnpm-workspace.yaml
```

### Package Responsibilities

#### `apps/web`
Dashboard and lightweight API routes.

#### `apps/plugin`
Framer plugin UI and project/selection capture.

#### `apps/worker`
Background worker service.

#### `packages/exporter-core`
Shared export orchestration logic.

#### `packages/codegen`
React/CSS code generation.

#### `packages/fidelity`
Screenshot comparison and report generation.

#### `packages/matcher`
Matching between Framer plugin canvas nodes and rendered DOM nodes.

#### `packages/shared`
Shared types, constants, job status enums.

---

## 5. Environment Variables

### Web App

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
R2_ACCOUNT_ID=
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_BUCKET_NAME=framer-exports
R2_PUBLIC_BASE_URL=
APP_URL=
```

### Worker

```env
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
R2_ENDPOINT=
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_BUCKET_NAME=framer-exports
WORKER_CONCURRENCY=1
JOB_TIMEOUT_SECONDS=300
LOCAL_TMP_DIR=/tmp/coderelay
MAX_AUTO_ATTEMPTS=2
TARGET_FIDELITY_SCORE=0.95
```

### Plugin

```env
PLUGIN_APP_URL=
API_BASE_URL=
```

---

## 6. Database Implementation

## 6.1 Supabase Tables

### `profiles`

```sql
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  created_at timestamptz default now()
);
```

### `projects`

```sql
create table projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  name text not null,
  source_type text default 'framer',
  source_project_id text,
  source_url text,
  created_at timestamptz default now()
);
```

### `export_jobs`

```sql
create table export_jobs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  project_id uuid references projects(id) on delete set null,
  status text not null default 'queued',
  export_type text not null,
  asset_mode text default 'linked',
  output_target text default 'portable-react',
  target_fidelity_score numeric default 0.95,
  max_auto_attempts int default 2,
  best_attempt_id uuid,
  source_url text,
  plugin_capture jsonb,
  framer_payload jsonb,
  node_match_summary jsonb,
  result_zip_key text,
  report_key text,
  fidelity_score numeric,
  warning_count int default 0,
  error_message text,
  created_at timestamptz default now(),
  started_at timestamptz,
  completed_at timestamptz,
  expires_at timestamptz
);
```

### `export_attempts`

```sql
create table export_attempts (
  id uuid primary key default gen_random_uuid(),
  job_id uuid not null references export_jobs(id) on delete cascade,
  attempt_number int not null,
  strategy text not null,
  status text not null default 'running',
  result_zip_key text,
  report_key text,
  fidelity_score numeric,
  desktop_fidelity_score numeric,
  mobile_fidelity_score numeric,
  layout_score numeric,
  typography_score numeric,
  color_score numeric,
  asset_score numeric,
  motion_score numeric,
  node_match_score numeric,
  warning_count int default 0,
  error_message text,
  started_at timestamptz default now(),
  completed_at timestamptz,
  unique (job_id, attempt_number)
);
```

### `node_matches`

```sql
create table node_matches (
  id uuid primary key default gen_random_uuid(),
  job_id uuid not null references export_jobs(id) on delete cascade,
  attempt_id uuid references export_attempts(id) on delete cascade,
  framer_node_id text,
  dom_path text,
  confidence numeric not null,
  match_reasons text[] default '{}',
  created_at timestamptz default now()
);
```

### `export_warnings`

```sql
create table export_warnings (
  id uuid primary key default gen_random_uuid(),
  job_id uuid not null references export_jobs(id) on delete cascade,
  type text not null,
  message text not null,
  severity text default 'warning',
  created_at timestamptz default now()
);
```

### `export_files`

```sql
create table export_files (
  id uuid primary key default gen_random_uuid(),
  job_id uuid not null references export_jobs(id) on delete cascade,
  file_type text not null,
  r2_key text not null,
  size_bytes bigint,
  expires_at timestamptz,
  created_at timestamptz default now()
);
```

---

## 6.2 Row Level Security

Enable RLS on all user-facing tables.

```sql
alter table profiles enable row level security;
alter table projects enable row level security;
alter table export_jobs enable row level security;
alter table export_attempts enable row level security;
alter table node_matches enable row level security;
alter table export_warnings enable row level security;
alter table export_files enable row level security;
```

Example policy for jobs:

```sql
create policy "Users can view own export jobs"
on export_jobs
for select
using (auth.uid() = user_id);

create policy "Users can create own export jobs"
on export_jobs
for insert
with check (auth.uid() = user_id);
```

Workers should use the Supabase service role key and never expose it to the client.

---

## 7. Job Queue Implementation

For v1, use Supabase Postgres as the queue.

### Worker Polling Logic

```text
Every N seconds:
  1. Find oldest queued job.
  2. Attempt to lock it.
  3. If lock succeeds, process.
  4. If no jobs, sleep.
```

### Locking SQL Concept

Use an RPC function for safe locking.

```sql
create or replace function claim_next_export_job()
returns export_jobs
language plpgsql
security definer
as $$
declare
  job export_jobs;
begin
  select * into job
  from export_jobs
  where status = 'queued'
  order by created_at asc
  limit 1
  for update skip locked;

  if not found then
    return null;
  end if;

  update export_jobs
  set status = 'running', started_at = now()
  where id = job.id
  returning * into job;

  return job;
end;
$$;
```

### Job Timeout

If a job remains `running` for too long, mark it failed or queued again.

```text
running for > JOB_TIMEOUT_SECONDS
  → failed: "Export timed out. Please try a smaller section."
```

---

## 8. Worker Pipeline

### Pipeline Steps

```text
1. Claim queued job
2. Create local temp directory
3. Load job payload
4. Resolve source URL/context
5. Render original with Playwright
6. Capture original screenshot locally
7. Extract DOM/computed styles/runtime assets
8. Match plugin canvas nodes to rendered DOM nodes
9. Build intermediate representation from plugin capture + runtime capture + matches
10. Start attempt loop
11. Generate React/CSS output for the current strategy
12. Render generated output locally
13. Capture generated screenshot locally
14. Compare screenshots by category
15. If score is below target and attempts remain, adjust strategy and rerun
16. Generate export report for each attempt
17. Select best attempt
18. Create README and AGENT_BRIEF
19. Create ZIP
20. Upload ZIP and report JSON to R2
21. Update Supabase job with best attempt
22. Delete local temp directory
```

### Worker Pseudocode

```ts
async function processJob(job: ExportJob) {
  const workdir = await createTempJobDir(job.id)

  try {
    const original = await captureOriginal(job, workdir)
    const runtime = await extractRuntimeRenderData(original.page)
    const matches = await matchPluginNodesToDom(job.plugin_capture, runtime.nodes)
    const ir = await buildIntermediateRepresentation({
      pluginCapture: job.plugin_capture,
      runtime,
      matches,
      legacyPayload: job.framer_payload,
    })
    const attempts = await runExportAttempts({
      job,
      ir,
      original,
      workdir,
      targetFidelity: job.target_fidelity_score ?? 0.95,
      maxAttempts: job.max_auto_attempts ?? 2,
    })

    const best = selectBestAttempt(attempts)
    const report = await createReport(job, ir, best.fidelity, attempts, matches)
    const zipPath = await packageExport(best.projectDir, report)

    const zipKey = await uploadToR2(zipPath, `jobs/${job.id}/exports/output.zip`)
    const reportKey = await uploadJsonToR2(report, `jobs/${job.id}/reports/report.json`)

    await markJobCompleted(job.id, {
      bestAttemptId: best.id,
      zipKey,
      reportKey,
      fidelityScore: best.fidelity.overall,
      warningCount: report.warnings.length,
      expiresAt: calculateExpiry(job.userPlan),
    })
  } catch (error) {
    await markJobFailed(job.id, humaniseError(error))
  } finally {
    await deleteDirectory(workdir)
  }
}
```

### Attempt Loop Pseudocode

```ts
async function runExportAttempts(input: ExportAttemptInput) {
  const strategies = [
    'semantic-layout',
    'spacing-typography-correction',
    'visual-fallback-layer',
  ]

  const attempts: ExportAttemptResult[] = []

  for (let index = 0; index < input.maxAttempts; index++) {
    const attempt = await createAttempt(input.job.id, {
      attemptNumber: index + 1,
      strategy: strategies[index] ?? 'semantic-layout',
    })

    const generated = await generateReactProject(input.ir, input.workdir, {
      strategy: attempt.strategy,
      outputTarget: input.job.output_target ?? 'portable-react',
    })

    const preview = await renderGeneratedProject(generated, input.workdir)
    const fidelity = await compareScreenshotsByCategory(
      input.original.screenshots,
      preview.screenshots,
      input.ir
    )
    const warnings = await collectAttemptWarnings(input.ir, generated, fidelity)

    await markAttemptCompleted(attempt.id, { fidelity, warnings })

    attempts.push({ ...attempt, generated, fidelity, warnings })

    if (fidelity.overall >= input.targetFidelity && !hasFixableWarnings(warnings)) {
      break
    }
  }

  return attempts
}
```

### Rerun Rules

- Free/private-alpha exports get up to 2 automatic attempts.
- Paid exports can later get up to 3 automatic attempts.
- Manual dashboard reruns create a new job linked to the original job.
- Reruns should reuse the same source payload but may change settings.
- The best attempt is the highest fidelity attempt that completed successfully.
- The report must explain why each rerun happened.

### Diff-Driven Strategy Selection

```text
typography mismatch → adjust font size, weight, line-height, letter-spacing
layout mismatch → adjust grid/flex choice, gap, padding, alignment
asset mismatch → switch asset mode, object-fit, object-position, dimensions
mobile mismatch → add or tune breakpoint overrides
color mismatch → normalize color tokens and backgrounds
decorative mismatch → add fallback visual layer only for decorative nodes
node match mismatch → lower confidence, warn, and avoid aggressive semantic naming
```

---

## 9. Playwright Capture Implementation

### Viewports for MVP

Use only two viewports to reduce compute:

```text
Desktop: 1440x900
Mobile: 390x844
```

Add tablet later.

### Original Capture

```ts
const browser = await chromium.launch({ headless: true })
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
await page.goto(sourceUrl, { waitUntil: 'networkidle', timeout: 60000 })
await page.screenshot({ path: `${workdir}/original-desktop.png`, fullPage: true })
```

### DOM Extraction

```ts
const nodes = await page.evaluate(() => {
  return Array.from(document.querySelectorAll('*')).map((el) => {
    const rect = el.getBoundingClientRect()
    const styles = window.getComputedStyle(el)

    return {
      tag: el.tagName.toLowerCase(),
      text: el.textContent?.trim().slice(0, 500),
      rect: {
        x: rect.x,
        y: rect.y,
        width: rect.width,
        height: rect.height,
      },
      styles: {
        display: styles.display,
        position: styles.position,
        fontSize: styles.fontSize,
        fontFamily: styles.fontFamily,
        fontWeight: styles.fontWeight,
        lineHeight: styles.lineHeight,
        color: styles.color,
        backgroundColor: styles.backgroundColor,
        borderRadius: styles.borderRadius,
        boxShadow: styles.boxShadow,
        transform: styles.transform,
        opacity: styles.opacity,
      },
    }
  })
})
```

### Selection-Specific Capture

For MVP, there are two options:

#### Option A: Plugin provides selected node context
Use the plugin selection data as the preferred source of design intent.

The plugin runs in `canvas` mode and should use:

```ts
import { framer } from 'framer-plugin'

const selection = await framer.getSelection()
const unsubscribe = framer.subscribeToSelection((nodes) => {
  // Update exportability and preview metadata in the plugin UI.
})
```

Capture only lightweight metadata in the export payload:

```ts
type PluginCanvasCapture = {
  mode: 'canvas'
  selectedNodes: Array<{
    id?: string
    name?: string
    type?: string
    text?: string
    bounds?: {
      x: number
      y: number
      width: number
      height: number
    }
    metadata?: Record<string, unknown>
  }>
  capturedAt: string
}
```

Do not store large selection payloads in Framer `pluginData`. Use `localStorage` only for per-user session references/preferences, and send export payloads directly to the web API.

#### Option B: User provides/publishes a test page and selected section is matched
The worker identifies the selected section in rendered DOM by text, position, or plugin-provided metadata.

Option B is fallback only. It may be less precise, but it keeps MVP-A possible before full plugin metadata is available.

### Node-to-DOM Matching

Match plugin canvas nodes to rendered DOM nodes before generating code.

Use confidence scoring based on:

```text
text content match
bounding box similarity
asset URL similarity
hierarchy/proximity
style similarity
node type compatibility
```

Example:

```ts
type NodeMatch = {
  framerNodeId?: string
  domPath?: string
  confidence: number
  matchReasons: Array<'text' | 'bounds' | 'asset' | 'hierarchy' | 'style' | 'type'>
}
```

Low-confidence matches should create warnings instead of silently producing overconfident code.

---

## 10. Intermediate Representation

Do not generate React directly from raw DOM. Build a neutral representation first.

### Types

```ts
export type ExportIR = {
  jobId: string
  exportType: 'component' | 'page' | 'site'
  source: {
    url?: string
    projectName?: string
  }
  pluginCapture?: PluginCanvasCapture
  runtimeCapture: RuntimeCaptureIR
  nodeMatches: NodeMatch[]
  tokens: DesignTokensIR
  assets: AssetIR[]
  component: ComponentIR
  warnings: ExportWarning[]
}

export type ComponentIR = {
  id: string
  name: string
  semanticType: 'hero' | 'feature' | 'cta' | 'footer' | 'navbar' | 'section' | 'unknown'
  layout: LayoutIR
  children: NodeIR[]
  motion?: MotionIR[]
}
```

### Why IR Matters

The IR allows:

- Multiple output formats later.
- Better debugging.
- Fidelity reports tied to generated code.
- Future GitHub/CLI sync.
- Controlled AI-agent handoff without internal AI editing.

---

## 11. Layout Inference

### MVP Approach

Start simple. Support common section structures:

```text
single column
two-column hero
stacked content
card grid
logo row
CTA block
basic footer/nav block
```

### Heuristics

```text
If children have similar y and different x → flex row.
If children have similar x and increasing y → flex column.
If children repeat with similar dimensions → grid/list.
If section has large text + image side by side → hero/two-column.
If repeated boxes have same structure → card component.
```

### Fallback

If layout inference fails, use a hybrid layout:

```text
relative wrapper + CSS approximations
```

Avoid absolute positioning as default, but allow it as a fallback for complex decorative elements.

---

## 12. Code Generation

### MVP Output

```text
React + TypeScript + CSS Modules
```

### Code Generation Steps

1. Name component.
2. Generate JSX tree.
3. Generate CSS class names.
4. Generate CSS layout rules.
5. Generate responsive media queries.
6. Add asset imports/URLs.
7. Add simple motion/hover where supported.
8. Format with Prettier.

### Example Component

```tsx
import styles from './ExportedSection.module.css'

export function ExportedSection() {
  return (
    <section className={styles.section}>
      <div className={styles.content}>
        <h1 className={styles.heading}>Your heading</h1>
        <p className={styles.body}>Your body text</p>
        <a className={styles.button} href="#">Get started</a>
      </div>
      <div className={styles.visual}>
        <img src="/assets/image-1.png" alt="" />
      </div>
    </section>
  )
}
```

### CSS Example

```css
.section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 48px;
  align-items: center;
  padding: 96px 64px;
}

.heading {
  font-size: clamp(48px, 6vw, 88px);
  line-height: 0.95;
  letter-spacing: -0.04em;
}

@media (max-width: 768px) {
  .section {
    grid-template-columns: 1fr;
    padding: 64px 24px;
  }
}
```

---

## 13. Fidelity Comparison

### MVP Metrics

```text
Desktop visual match
Mobile visual match
Layout score
Typography score
Color score
Asset score
Motion score
Node match confidence
Missing asset count
Warning count
Overall fidelity score
```

### Screenshot Comparison

Use `pixelmatch` or `resemble.js`.

### Storage Rule

Screenshots should be local only by default.

```text
original-desktop.png → local only → delete
preview-desktop.png → local only → delete
diff-desktop.png → local only → delete unless debug upload needed
```

### Report Output

```json
{
  "visualFidelity": {
    "desktop": 96.4,
    "mobile": 92.8,
    "overall": 94.6,
    "layout": 95.1,
    "typography": 91.8,
    "color": 98.2,
    "assets": 96.0,
    "motion": 72.0
  },
  "nodeMatching": {
    "matched": 24,
    "unmatched": 3,
    "averageConfidence": 0.89
  },
  "attempts": [
    {
      "attempt": 1,
      "strategy": "semantic-layout",
      "overall": 88.9,
      "rerunReason": "Typography and mobile spacing mismatches were above threshold."
    },
    {
      "attempt": 2,
      "strategy": "spacing-typography-correction",
      "overall": 94.6,
      "selectedAsBest": true
    }
  ],
  "warnings": [],
  "assets": {
    "downloaded": 8,
    "linked": 2,
    "failed": 0
  }
}
```

---

## 14. R2 Storage Implementation

### Bucket

```text
framer-exports
```

### Object Keys

```text
jobs/{jobId}/exports/output.zip
jobs/{jobId}/reports/report.json
jobs/{jobId}/debug/original.png
jobs/{jobId}/debug/generated.png
jobs/{jobId}/debug/diff.png
```

### Upload ZIP

Use S3-compatible SDK.

```ts
await s3.putObject({
  Bucket: process.env.R2_BUCKET_NAME,
  Key: `jobs/${job.id}/exports/output.zip`,
  Body: fs.createReadStream(zipPath),
  ContentType: 'application/zip',
})
```

### Signed Download URL

Generate signed URLs from web app API.

```ts
const command = new GetObjectCommand({
  Bucket: bucket,
  Key: zipKey,
})

const url = await getSignedUrl(s3, command, { expiresIn: 60 * 10 })
```

### Lifecycle Rules

Set deletion by prefix:

```text
jobs/*/debug/* → delete after 3 days
jobs/*/exports/* → delete after 1–7 days depending on plan
jobs/*/reports/* → delete after 30 days
```

If plan-based lifecycle cannot be handled cleanly with R2 rules alone, run a scheduled cleanup script that deletes expired files based on `export_files.expires_at`.

---

## 15. Framer Plugin Implementation

### Plugin UI

Build with `framer-plugin`, Vite, and `vite-plugin-framer`.

Create the plugin project with:

```bash
npm create framer-plugin@latest
```

Plugin requirements:

- `framer.json` must include `modes: ["canvas"]`.
- Import `framer` from `framer-plugin`.
- Import `framer-plugin/framer.css`.
- Call `framer.showUI()` in `useLayoutEffect` to avoid flicker.
- Use `framer.getSelection()` for initial selection.
- Use `framer.subscribeToSelection()` for live selection updates.
- Use `localStorage` for per-user session references/preferences.
- Avoid large payloads in Framer `pluginData` because it is small and shared.
- Ignore `FramerPluginClosedError` in catch blocks.
- Use `<div role="button">` instead of `<button>` if Framer CSS overrides button styles.

MVP plugin screen:

```text
Connected as: user@email.com

Selection:
Selected: Hero Section
Status: Exportable

Export settings:
[ ] Portable assets
[x] Linked assets

Button: Export to React
```

### Plugin Flow

1. Load plugin.
2. Call `framer.showUI()` from `useLayoutEffect`.
3. Check saved session reference in `localStorage`.
4. If not connected, show connect button.
5. User connects via web auth.
6. Plugin receives short-lived session reference.
7. Detect current selection with `framer.getSelection()`.
8. Subscribe to selection changes with `framer.subscribeToSelection()`.
9. Capture lightweight selected-node metadata.
10. Validate selection.
11. Send export job payload.
12. Open dashboard job URL.

### Payload Shape

```ts
type PluginExportPayload = {
  source: 'framer-plugin'
  project: {
    name?: string
    id?: string
    publishedUrl?: string
  }
  selection: {
    nodeIds: string[]
    label?: string
    type?: 'component' | 'section' | 'unknown'
    nodes?: Array<{
      id?: string
      name?: string
      type?: string
      text?: string
      bounds?: {
        x: number
        y: number
        width: number
        height: number
      }
      metadata?: Record<string, unknown>
    }>
  }
  settings: {
    exportType: 'component'
    styleMode: 'css-modules'
    assetMode: 'linked' | 'portable'
    outputTarget: 'portable-react'
    targetFidelityScore?: number
    maxAutoAttempts?: number
  }
  metadata?: Record<string, unknown>
}
```

### Authentication

Use a web-based login flow.

```text
Plugin → open web login → user logs in → web app creates plugin session → plugin stores short-lived reference
```

Do not store secrets in plugin storage.

---

## 16. Web Dashboard Implementation

### Pages

```text
/login
/dashboard
/dashboard/jobs/[jobId]
/settings
```

### Dashboard List

Columns:

```text
Project
Export type
Status
Fidelity
Created
Expires
Download
```

### Job Detail Page

Sections:

```text
Status card
Export summary
Fidelity score
Warnings
Files
Download ZIP
Expiry notice
Retry button if failed
```

### Empty State

```text
No exports yet.
Open the Framer plugin, select a section, and start your first export.
```

---

## 17. Exported Project Requirements

Every export should include:

```text
README.md
AGENT_BRIEF.md
export-report.json
package.json
source files
styles
assets or asset links
```

### `AGENT_BRIEF.md`

```md
# Agent Brief

This code was exported from a Framer design. Preserve visual fidelity unless instructed otherwise.

## Main files

- Component: src/components/ExportedSection.tsx
- Styles: src/components/ExportedSection.module.css
- Report: export-report.json

## Guidance

- Review export-report.json before making changes.
- Keep spacing, typography, and responsive behaviour close to the original.
- Reconnect forms, analytics, or embeds manually if needed.
- Improve structure without changing visual output unless asked.
```

---

## 18. Testing Plan

### Unit Tests

Test:

- layout inference helpers
- CSS generation
- JSX generation
- report generation
- R2 key generation
- job status utilities

### Integration Tests

Test:

- create export job
- worker claims job
- worker marks completed
- failed job handling
- signed URL generation

### Visual Tests

Test exports against a fixture set:

```text
simple hero
two-column hero
card grid
CTA section
logo strip
footer
testimonial section
pricing cards
```

### Manual QA Checklist

For each exported section:

```text
Does it run locally?
Does it look close to original?
Does it respond on mobile?
Are assets visible?
Is the code understandable?
Does README help?
Does AGENT_BRIEF help?
Are warnings accurate?
```

---

## 19. Development Phases

## Phase 0: MVP-A Local Export Engine

### Duration
1–2 weeks

### Goal
Prove that a Framer-rendered section/page can be captured, represented, generated, rerun, and visually compared before building SaaS infrastructure.

### Tasks

1. Create 5–10 sample Framer sections.
2. Build Playwright crawler script.
3. Capture desktop/mobile screenshots.
4. Extract DOM/computed styles.
5. Build runtime capture IR.
6. Simulate plugin capture with fixture metadata where real plugin data is not available.
7. Add node-to-DOM matching.
8. Manually/heuristically generate portable React + CSS.
9. Render generated output locally.
10. Compare screenshots by category.
11. Add a bounded rerun loop for low-fidelity attempts.
12. Package a local ZIP.
13. Record fidelity scores, attempt strategies, node-match confidence, and failure types.

### Deliverable
CLI prototype:

```bash
pnpm export:test --url https://example.framer.website
```

### Exit Criteria

- 7/10 simple sections can generate usable code.
- Generated output runs locally.
- Visual diff report works.
- Node-to-DOM matching produces useful confidence scores.
- Low-fidelity output can be rerun with a second strategy.
- Clear list of unsupported patterns.

---

## Phase 1: MVP-B Core Worker and Supabase Job System

### Duration
1–2 weeks

### Goal
Turn the local prototype into a backend job pipeline.

### Tasks

1. Set up Supabase project.
2. Add database migrations.
3. Add RLS policies.
4. Build job creation endpoint.
5. Build worker polling.
6. Implement job locking.
7. Add job status updates.
8. Add plugin capture storage.
9. Add node match records.
10. Add export attempt records.
11. Add bounded auto-rerun support.
12. Add best-attempt selection.
13. Add failure handling.
14. Add local temp cleanup.
15. Add R2 upload.
16. Add signed URL generation.

### Exit Criteria

- Job can be created in Supabase.
- Worker can process job.
- ZIP/report upload to R2.
- Job status updates correctly.
- Attempt history and best attempt are stored.
- Plugin capture and node match summaries are stored.
- Temp files are deleted.

---

## Phase 1.5: MVP-C Fidelity Hardening

### Duration
1–2 weeks

### Goal
Improve export quality before private alpha by making reruns respond to actual mismatch categories.

### Tasks

1. Add categorized fidelity scoring.
2. Add typography repair strategy.
3. Add spacing/layout repair strategy.
4. Add mobile breakpoint repair strategy.
5. Add asset/object-fit repair strategy.
6. Add low-confidence node match warnings.
7. Add fixture regression tests for common section patterns.
8. Add adapter packaging notes for Vite, Next.js, Remix, Astro, and Laravel/Inertia.

### Exit Criteria

- Reports show layout, typography, color, asset, motion, and node-match scores.
- Rerun reasons are specific, not generic.
- Supported fixture exports improve between attempt 1 and best attempt.
- Users can understand what changed between attempts.

---

## Phase 2: Web Dashboard

### Duration
1 week

### Goal
Let users see jobs and download exports.

### Tasks

1. Build Supabase auth.
2. Build dashboard list.
3. Build job detail page.
4. Show status, warnings, fidelity score.
5. Add download button.
6. Add expired state.
7. Add failed state.
8. Add retry button.

### Exit Criteria

- User can log in.
- User can see own jobs.
- User can download completed ZIP.
- Expired/failed states are clear.

---

## Phase 3: Framer Plugin MVP

### Duration
1–2 weeks

### Goal
Let users start exports from inside Framer.

### Tasks

1. Set up Framer plugin project with `npm create framer-plugin@latest`.
2. Configure `framer.json` with `modes: ["canvas"]`.
3. Import `framer-plugin/framer.css`.
4. Build plugin UI with `framer.showUI()` called in `useLayoutEffect`.
5. Add connect-account flow.
6. Store only short-lived session references/preferences in `localStorage`.
7. Detect selection with `framer.getSelection()`.
8. Subscribe to selection updates with `framer.subscribeToSelection()`.
9. Capture lightweight selected-node metadata.
10. Validate selection.
11. Add export settings.
12. Create export job from plugin.
13. Open dashboard job page.
14. Handle `FramerPluginClosedError` silently.
15. Handle other errors with `framer.notify()`.

### Exit Criteria

- User can open plugin.
- User can authenticate.
- User can select a section/component.
- Plugin payload includes lightweight selection metadata.
- User can create an export job.
- User can download output from dashboard.

---

## Phase 4: Private Alpha

### Duration
2–4 weeks

### Goal
Test the product with real Framer users.

### Tasks

1. Recruit 20–50 testers.
2. Prepare supported feature matrix.
3. Add invite-only access.
4. Collect export examples.
5. Track failure types.
6. Improve layout inference.
7. Improve code readability.
8. Improve error messages.
9. Add manual support flow.

### Success Criteria

- 100+ exports attempted.
- 70%+ success on supported sections.
- 90%+ average visual match on simple sections.
- Users confirm output is useful for handoff.
- Clear top 10 failure cases identified.

---

## Phase 5: Page Export Beta

### Duration
3–6 weeks

### Goal
Export complete one-page landing pages.

### Tasks

1. Add page-level crawling.
2. Split page into sections.
3. Generate page route.
4. Generate multiple section components.
5. Add page-level fidelity report.
6. Improve asset dedupe.
7. Add SEO metadata extraction.
8. Improve mobile handling.

### Exit Criteria

- User can export one landing page.
- Output runs as Next.js/Vite app.
- Page has readable structure.
- Visual match is acceptable.

---

## Phase 6: Monetisation

### Duration
1–2 weeks

### Goal
Add payment and usage control.

### Tasks

1. Decide pricing model: credits vs subscription.
2. Add billing provider.
3. Add plan/usage tables.
4. Enforce export limits.
5. Add free/paid retention logic.
6. Add billing page.
7. Add upgrade prompts.

### Recommended First Model
Start with credits.

```text
Free: 1–3 test exports
Creator: pay for export credits
Pro/Agency: subscription later
```

### Exit Criteria

- User can pay.
- Paid users get higher limits.
- Free users are cost-controlled.

---

## Phase 7: Post-MVP Enhancements

### Motion Fidelity

- Hover state capture.
- In-view animation mapping.
- Motion for React generation.
- Scroll effect approximation.
- Animation warnings.

### CMS Export

- Collection export.
- JSON/TS data.
- Dynamic routes.
- Blog template.

### GitHub Export

- GitHub App.
- Repo creation.
- PR creation.
- PR report.

### CLI

- `npx coderelay login`
- `npx coderelay pull`
- `npx coderelay preview`

### Agency Features

- Workspaces.
- Team seats.
- Client projects.
- Branded reports.
- Longer retention.

---

## 20. Infrastructure Setup Checklist

### Supabase

- [ ] Create project.
- [ ] Add migrations.
- [ ] Enable RLS.
- [ ] Add auth provider.
- [ ] Add service role key to worker only.
- [ ] Add database functions for job claiming.

### R2

- [ ] Create private bucket.
- [ ] Create access keys.
- [ ] Add lifecycle rules.
- [ ] Implement signed URLs.
- [ ] Test upload/download/delete.

### Worker VPS

- [ ] Provision small VPS.
- [ ] Install Node.js.
- [ ] Install Playwright browsers.
- [ ] Configure environment variables.
- [ ] Run worker via PM2/systemd.
- [ ] Set up logs.
- [ ] Add disk cleanup cron.
- [ ] Add basic monitoring.

### Web App

- [ ] Deploy Next.js app.
- [ ] Connect Supabase.
- [ ] Add auth.
- [ ] Add dashboard.
- [ ] Add job detail page.
- [ ] Add signed download endpoint.

### Plugin

- [ ] Create plugin project with `npm create framer-plugin@latest`.
- [ ] Add `framer.json` with `modes: ["canvas"]`.
- [ ] Import `framer-plugin/framer.css`.
- [ ] Call `framer.showUI()` in `useLayoutEffect`.
- [ ] Build UI.
- [ ] Add auth connect flow.
- [ ] Add selection detection with `framer.getSelection()`.
- [ ] Add live selection updates with `framer.subscribeToSelection()`.
- [ ] Capture lightweight selected-node metadata.
- [ ] Add export job creation.
- [ ] Test in Framer.

---

## 21. Cost Control Implementation Checklist

- [ ] Keep screenshots local only.
- [ ] Delete temp folders after each job.
- [ ] Add job timeout.
- [ ] Add max asset size.
- [ ] Add max ZIP size.
- [ ] Add max viewport count.
- [ ] Add free-tier export limit.
- [ ] Use linked asset mode for free users.
- [ ] Add R2 lifecycle rules.
- [ ] Add scheduled cleanup for expired files.
- [ ] Store only metadata in Supabase.
- [ ] Add worker concurrency limit.

---

## 22. Suggested Sprint Plan

## Sprint 1: Feasibility

### Outcome
Local prototype works on sample Framer pages.

### Tasks

- Playwright capture.
- DOM/style extraction.
- Runtime capture IR.
- Simulated plugin capture fixtures.
- Node-to-DOM matching.
- Basic IR.
- Basic codegen.
- Categorized screenshot diff.
- Bounded rerun loop.
- ZIP output.

---

## Sprint 2: Backend Pipeline

### Outcome
Jobs can be created, processed, and stored.

### Tasks

- Supabase schema.
- Worker polling.
- Plugin capture storage.
- Node match records.
- Export attempts.
- R2 upload.
- Job status updates.
- Report generation.

---

## Sprint 3: Dashboard

### Outcome
Users can see and download exports.

### Tasks

- Auth.
- Dashboard.
- Job details.
- Download links.
- Error/expired states.

---

## Sprint 4: Plugin

### Outcome
Exports can start from Framer.

### Tasks

- Plugin UI.
- Connect account.
- Selection detection with `framer.getSelection()`.
- Live selection updates with `framer.subscribeToSelection()`.
- Lightweight selection metadata capture.
- Job creation.
- Dashboard redirect.

---

## Sprint 4.5: Fidelity Hardening

### Outcome
Exports improve through categorized reruns before private alpha.

### Tasks

- Categorized fidelity scoring.
- Diff-driven rerun strategy selection.
- Typography repair.
- Layout/spacing repair.
- Mobile breakpoint repair.
- Node match confidence warnings.
- Fixture regression tests.

---

## Sprint 5: Alpha Hardening

### Outcome
Private testers can use it.

### Tasks

- Improve layout inference.
- Improve CSS output.
- Improve reports.
- Add invite access.
- Add basic logging.
- Add cleanup jobs.

---

## 23. Engineering Milestones

| Milestone | Description | Output |
|---|---|---|
| M0 | Local crawler/codegen spike | CLI prototype |
| M1 | Hybrid capture engine | Runtime capture + simulated plugin capture + node matching |
| M2 | Job system | Supabase + worker + export attempts |
| M3 | Storage pipeline | R2 upload/download/delete |
| M4 | Dashboard | Auth + job detail + download + rerun |
| M5 | Plugin MVP | Start exports from Framer with canvas selection capture |
| M6 | Fidelity hardening | Categorized reports + diff-driven reruns |
| M7 | Private alpha | 20–50 testers |
| M8 | Page export beta | One-page exports |
| M9 | Paid beta | Credits/subscriptions |

---

## 24. Alpha Testing Plan

### Test Set

Create or collect Framer examples:

```text
simple hero
image hero
two-column hero
feature cards
pricing section
testimonial section
CTA section
logo strip
footer
animated section
```

### Evaluation Criteria

For each export:

```text
Did the export complete?
Did the ZIP run locally?
Did the output visually match?
Was the code editable?
Were warnings accurate?
Would the user hand this to a developer/agent?
```

### Feedback Questions

1. Did this save you time?
2. Was the output understandable?
3. What would you still need to fix manually?
4. Would you pay for this?
5. Would you use it for a client project?
6. Is the fidelity report useful?
7. What export mode would you need next: page, CMS, GitHub, or CLI?

---

## 25. Launch Plan

### Pre-Alpha

- Build local demo.
- Record screen demo.
- Test internally.
- Prepare supported features list.

### Private Alpha

- Invite Framer designers and small agencies.
- Offer free limited exports.
- Manually support broken exports.
- Collect testimonials and output examples.

### Public Beta

- Launch landing page.
- Add payment/credits.
- Publish plugin if appropriate.
- Share demos on X, LinkedIn, Reddit, Indie Hackers, Framer communities.

### Paid Launch

- Position around developer-ready React handoff for any React project type.
- Add page export.
- Add agency pricing.
- Add GitHub export or roadmap commitment.

---

## 26. Product Copy for Launch

### Hero

> Export Framer designs into code your developer can actually use.

### Subheading

Turn Framer sections and pages into clean React code with styles, assets, motion details, and a fidelity report included.

### Differentiator

> Static export tools give you a copy. Coderelay gives you a codebase.

### Use Cases

- Hand off Framer designs to developers.
- Continue Framer projects in Cursor or Claude Code.
- Convert Framer landing pages into app-ready React.
- Deliver code exports to agency clients.
- Preserve design details without rebuilding from scratch.

---

## 27. Final Recommendation

Build the product in this exact order:

1. **Local CLI proof-of-concept**  
   Prove export quality before building SaaS UI.

2. **Worker + Supabase job system**  
   Establish reliable processing.

3. **Dashboard**  
   Let users manage and download exports.

4. **Framer plugin**  
   Add in-context distribution and capture.

5. **Private alpha**  
   Test with designers/agencies.

6. **Page export**  
   Expand from section to real landing pages.

7. **Monetisation**  
   Add credits/subscriptions once users confirm value.

8. **GitHub/CLI/CMS**  
   Build post-MVP features for higher-value users.

The MVP should remain tightly focused:

> Select a Framer section → export clean React code → download ZIP → hand to developer/agent.

Do not dilute the product into a generic static exporter.
