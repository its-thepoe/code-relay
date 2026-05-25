# PRD: Framer-to-Code Handoff Tool

## 1. Product Summary

### Working Name

**Coderelay**

### One-line Description

A Framer-to-code handoff tool that exports Framer pages, sections, and components into clean, editable React code that developers and AI coding agents can continue working with in any React project type.

### Core Value Proposition

> **A static export gives you a copy. We give you a codebase.**

The product is not positioned as a cheap Framer-to-HTML mirror or self-hosting hack. It is a developer handoff tool for users who want to continue building outside Framer without losing the design details they created in Framer.

### Primary Product Promise

> Export Framer designs into clean React code with styles, assets, motion details, and a fidelity report included.

### Product Form

The product should exist as a hybrid system:

1. **Framer Plugin**  
   Used for in-context capture, authentication, project/page/selection handoff, and export initiation.

2. **Standalone Web App**  
   Used for account management, job status, billing, export history, fidelity reports, and downloads.

3. **Worker Server**  
   Used for heavy processing: Playwright crawling, screenshot comparison, layout extraction, code generation, packaging, and cleanup.

4. **Temporary Storage Layer**  
   Cloudflare R2 for short-lived ZIP files, report JSON files, and optional debug artefacts.

5. **Optional CLI Later**  
   Used by developers to pull exports directly into local projects.

---

## 2. Product Thesis

Framer is excellent for visually designing and launching websites quickly, but users who later need code ownership, app integration, or developer workflows face a painful gap.

Most current solutions focus on static mirroring:

```text
Paste Framer URL → download HTML/CSS/JS → host somewhere else
```

That is useful, but it does not solve the deeper handoff problem.

The deeper problem is:

```text
I designed this carefully in Framer.
Now I need clean, editable code that preserves the craft and can be continued by a developer or coding agent.
```

This product should own the category of **Framer-to-code handoff**, not generic no-code export.

The highest-fidelity approach is a **hybrid export pipeline**:

```text
Framer plugin canvas selection data
+ published-site runtime/DOM capture
+ screenshot comparison
+ bounded rerun loop
= best-attempt portable React export
```

The plugin should capture design intent where the Framer Plugin SDK allows it. The worker should use the published site to verify how Framer actually renders the design. Screenshot comparison should judge whether the generated React output is close enough.

The plugin must treat canvas selection and component-catalog selection as two
separate capture sources. A component chosen from an in-plugin list should be
read directly from Framer by id and included in the export payload; it should not
depend on that component also becoming the current canvas selection. Empty
selection failures should be based on failed metadata capture, not only on
`framer.getSelection()` returning no nodes.

---

## 3. Problem Statement

Designers, founders, agencies, and product teams build polished websites in Framer with careful details such as:

- responsive layouts
- typography systems
- section animations
- scroll effects
- reusable components
- visual hierarchy
- hover states
- media assets
- CMS-powered content
- custom embeds or scripts

When they need to move to code, they usually have three poor options:

1. **Manual rebuild**  
   Accurate but slow, expensive, and prone to losing design details.

2. **Static scrape/export**  
   Fast but often difficult to maintain, refactor, or integrate into a real product codebase.

3. **Stay locked in Framer**  
   Convenient but limits code ownership, app integration, custom engineering workflows, and AI-agent continuation.

Users need a reliable way to convert Framer work into maintainable code without starting from scratch.

---

## 4. Jobs to Be Done

### Primary Job

When I have built a site, page, section, or component in Framer and now need to continue in code, I want to export it into clean React code that can fit Vite, Next.js, Remix, Astro, Laravel/Inertia, or another React-based project so that I can hand it to a developer or AI coding agent without rebuilding everything from scratch.

### Designer Job

When I create polished Framer designs with motion, spacing, responsive behaviour, and visual details, I want those details preserved during code handoff so that my work does not become a flat or inaccurate rebuild.

### Founder Job

When I validate quickly in Framer and later need to integrate the site into a product/app codebase, I want a fast export path so that I can continue building without paying for a full manual rebuild.

### Agency Job

When I build Framer sites for clients, I want to offer developer-ready code handoff as a premium deliverable so that I can increase project value and reduce handoff friction.

### Developer Job

When I receive a Framer-built design, I want structured, understandable code instead of a messy static scrape so that I can edit, refactor, integrate, and extend it.

### AI-Agent Continuation Job

When I export a Framer design, I want the output to be structured enough for Cursor, Claude Code, Windsurf, Codex, or another coding agent to understand and modify effectively.

---

## 5. Target Users

### 5.1 Framer Designers

#### Profile

Designers who use Framer to build marketing pages, landing pages, portfolios, campaign pages, and client websites.

#### Needs

- Preserve visual polish.
- Avoid manual rebuilds.
- Hand off to developers.
- Keep animations and responsive design intact.
- Continue in code without becoming a full engineer.

#### Pain

- Static HTML exports are not truly maintainable.
- Developer rebuilds often lose design detail.
- They have no objective way to prove fidelity after handoff.

---

### 5.2 Founders and Indie Builders

#### Profile

People who launch fast in Framer, then later want to integrate the site into their product codebase or continue building with AI coding tools.

#### Needs

- Fast output.
- Low-cost conversion.
- Code they can use in Cursor/Claude/Windsurf.
- Clear warning report.
- Minimal setup.

#### Pain

- They do not want to pay for full front-end rebuilds.
- They do not want a static copy they cannot meaningfully edit.
- They want ownership and portability.

---

### 5.3 Agencies and Freelancers

#### Profile

Framer specialists, web studios, brand designers, and freelancers building client websites.

#### Needs

- Client-ready code export.
- Reliable handoff report.
- Ability to charge more for code handoff.
- Repeatable export process.
- Potential GitHub handoff later.

#### Pain

- Clients eventually ask for code ownership.
- Manual developer handoff slows projects.
- Static ZIPs may look unprofessional.
- Agencies need confidence before delivering to clients.

---

### 5.4 Front-end Developers

#### Profile

Developers receiving Framer designs from designers or clients.

#### Needs

- Clean React component structure that can be copied into different React project types.
- Understandable components.
- Styles that can be edited.
- Asset folder organisation.
- Notes on unsupported behaviour.

#### Pain

- Rebuilding is repetitive.
- Scraped HTML is hard to integrate.
- Animation behaviour is unclear.
- Design intent gets lost.

---

## 6. Product Goals

### 6.1 User Goals

1. Export Framer designs into code.
2. Preserve layout, responsive behaviour, and visual polish.
3. Preserve basic and progressively advanced motion behaviour.
4. Receive a downloadable codebase.
5. Understand export limitations through a fidelity report.
6. Continue work in external developer/AI tools.
7. Avoid starting from scratch.

### 6.2 Business Goals

1. Build a monetisable SaaS around Framer-to-code handoff.
2. Avoid competing only on cheap static HTML exports.
3. Serve a premium workflow for designers, founders, agencies, and developers.
4. Start lean with minimal infrastructure and storage costs.
5. Keep platform risk manageable by owning the standalone web app and backend.
6. Expand from section export to page export to full-site export.

### 6.3 Technical Goals

1. Use Supabase for authentication, metadata, job status, and billing state.
2. Use Cloudflare R2 for temporary export artefacts only.
3. Use a worker server/VPS for Playwright and code generation.
4. Avoid long-running heavy tasks in Supabase Edge Functions.
5. Keep screenshots local during processing by default.
6. Generate clean, typed, editable React code with adapters for common React project types.
7. Include a developer/agent handoff brief in every export.
8. Provide objective fidelity reporting.

---

## 7. Non-Goals

This product will not try to do everything.

### Not in MVP

- Internal vibe-coding/chat interface.
- Prompt-based editing inside the tool.
- Unbounded AI repair loop.
- Full-site export.
- CMS migration.
- GitHub pull request export.
- CLI.
- Full Framer editor replacement.
- E-commerce checkout migration.
- Auth/membership migration.
- Search migration.
- Advanced form backend migration.
- Long-term storage of screenshots or debug artefacts.

### Not the Product Position

The product should not be positioned as:

- a Framer clone
- a Framer bypass tool
- a generic no-code exporter
- a cheap static mirror tool
- a self-hosting hack

---

## 8. Positioning

### Primary Positioning

> **The Framer export tool for people who want to keep building.**

### Supporting Copy

Export your Framer pages and sections into clean React code, with assets, styles, motion details, and a fidelity report included.

### Core Differentiator

Static export tools give users a working copy. This product gives users a workable codebase.

### Positioning Pillars

1. **Maintainable output**  
   Code should be understandable, editable, and structured.

2. **Design fidelity**  
   The export should preserve visual details and report what changed.

3. **Developer handoff**  
   Output should be easy for a developer or AI coding agent to continue.

4. **React-native and portable**  
   Prioritise clean React components that can be used inside common React project types over plain HTML mirroring.

5. **Transparent limitations**  
   Unsupported behaviours should be flagged, not hidden.

---

## 9. Product Principles

### 9.1 Codebase Over Copy

The goal is not to create a frozen visual duplicate. The goal is to generate code that can be used as a starting point for continued development.

### 9.2 Preserve Craft Where Possible

Typography, spacing, layout, hierarchy, assets, and motion details matter. The product should not flatten design quality.

### 9.3 Be Honest About Fidelity

Do not pretend every export is perfect. Show a report with what matched, what was approximated, and what needs review.

### 9.4 Use The Richest Source Of Truth

Do not rely on browser DOM scraping alone when plugin-side canvas context is available. Coderelay should combine:

- Framer plugin selection data for design intent.
- Published-site DOM/computed styles for rendered truth.
- Screenshot comparison for objective output validation.
- Attempt history for transparent iteration.

### 9.5 Keep Infrastructure Lean

Storage should be temporary by default. Screenshots should not become permanent artefacts. Compute should be controlled through job limits.

### 9.6 Make Output Agent-Ready

Even without an internal AI editor, the exported project should include enough structure, naming, and instructions for external AI coding agents to work effectively.

### 9.7 Avoid Platform-Hostile Positioning

Position as handoff, portability, and developer workflow — not as Framer replacement or circumvention.

---

## 10. Product Scope Overview

The product will be developed in phases.

### MVP Scope

The MVP focuses on exporting **one selected Framer section/component** into portable React code with CSS Modules, assets, and a basic fidelity report.

### Post-MVP Scope

Post-MVP expands into page export, better motion preservation, CMS export, full-site export, GitHub integration, CLI, team accounts, and agency workflows.

### 10.1 Scope Summary Matrix

| Area               | MVP                                                       | Post-MVP                                                      | Out of Scope                                |
| ------------------ | --------------------------------------------------------- | ------------------------------------------------------------- | ------------------------------------------- |
| Export unit        | One selected section/component                            | Full page, full site                                          | Arbitrary third-party site cloning          |
| Output             | Portable React + CSS Modules                              | Next.js/Vite/Remix/Astro adapters, Tailwind option, GitHub PR | Static HTML-only as primary product         |
| Motion             | Basic appear/hover                                        | Scroll effects, stagger, parallax                             | Perfect animation parity for all cases      |
| CMS                | No                                                        | Framer CMS snapshot to local typed data                       | Real-time CMS sync to every CMS provider    |
| Storage            | Temporary ZIP/report                                      | Longer paid retention                                         | Permanent archive by default                |
| Iteration          | Bounded rerun loop + attempt history + categorized repair | Smarter repair strategies and manual review tools             | Open-ended internal vibe-coding/chat editor |
| Billing            | Manual/free beta                                          | Credits/subscriptions                                         | Usage-free unlimited heavy exports          |
| Developer workflow | ZIP download                                              | GitHub + CLI                                                  | Full deployment platform                    |
| Platform           | Framer only                                               | Framer-first, maybe other tools much later                    | Multi-no-code exporter from day one         |

### 10.2 MVP Priority Matrix

#### MVP-A: Local Export Engine

| Feature                     | Description                                                                            | Priority |
| --------------------------- | -------------------------------------------------------------------------------------- | -------: |
| CLI export command          | Export from a published Framer URL locally                                             |       P0 |
| Playwright capture          | Capture original desktop/mobile screenshots                                            |       P0 |
| DOM/style extraction        | Extract layout, text, assets, and computed styles                                      |       P0 |
| Runtime capture IR          | Normalize published-site DOM, computed styles, assets, and screenshots                 |       P0 |
| Intermediate representation | Convert raw capture into reusable export IR                                            |       P0 |
| Simulated plugin capture    | Use fixture metadata until real plugin capture is available                            |       P0 |
| Node-to-DOM matching        | Match design-side metadata to runtime DOM with confidence scores                       |       P0 |
| Portable React output       | Generate `.tsx` component and CSS Module                                               |       P0 |
| Local preview               | Render generated output locally                                                        |       P0 |
| Categorized screenshot diff | Compare original and generated output by layout, typography, color, assets, and mobile |       P0 |
| Bounded rerun loop          | Retry generation with another strategy when fidelity is low                            |       P0 |
| Local ZIP                   | Package runnable output                                                                |       P0 |
| Report JSON                 | Include fidelity, warnings, attempts, and failure reasons                              |       P0 |

#### MVP-B: Productized Section Export

| Feature                | Description                                                               | Priority |
| ---------------------- | ------------------------------------------------------------------------- | -------: |
| Supabase job system    | Create, claim, process, and complete export jobs                          |       P0 |
| Export attempts        | Store attempt history and best attempt per job                            |       P0 |
| Plugin capture storage | Store lightweight selected-node payload on export jobs                    |       P0 |
| Node match records     | Store match confidence and reasons for debugging/reporting                |       P0 |
| R2 upload              | Upload ZIP/report temporarily                                             |       P0 |
| Web dashboard          | Show jobs, attempts, status, report, and downloads                        |       P0 |
| Manual rerun           | Allow user-triggered rerun with adjusted settings                         |       P0 |
| Framer plugin shell    | Start section export from inside Framer using `framer-plugin` canvas mode |       P0 |

#### MVP-C: Fidelity Hardening

| Feature                      | Description                                                        | Priority |
| ---------------------------- | ------------------------------------------------------------------ | -------: |
| Categorized fidelity scores  | Score layout, typography, color, assets, motion, and node matching |       P0 |
| Diff-driven rerun strategies | Pick rerun strategy based on mismatch category                     |       P0 |
| Typography repair            | Adjust font size, weight, line-height, and letter spacing          |       P0 |
| Layout repair                | Adjust grid/flex choice, gap, padding, and alignment               |       P0 |
| Mobile repair                | Add or tune breakpoint overrides                                   |       P0 |
| Asset repair                 | Tune object-fit, object-position, size, and asset mode             |       P1 |
| Fixture regression set       | Test common Framer section patterns repeatedly                     |       P0 |

### 10.3 MVP Feature Priority

#### Must Have

| Feature                     | Description                                                                   | Priority |
| --------------------------- | ----------------------------------------------------------------------------- | -------: |
| Framer plugin shell         | Opens inside Framer and provides export UI                                    |       P0 |
| Plugin SDK setup            | Use `framer-plugin`, Vite, `vite-plugin-framer`, and `modes: ["canvas"]`      |       P0 |
| User authentication         | Connect plugin to web app account                                             |       P0 |
| Selection detection         | Detect selected section/component                                             |       P0 |
| Selection metadata capture  | Capture selected node IDs, names, types, text, bounds, and available metadata |       P0 |
| Export job creation         | Create job in Supabase                                                        |       P0 |
| Job dashboard               | Show queued/running/completed/failed states                                   |       P0 |
| Worker processing           | Poll job and process export                                                   |       P0 |
| Local screenshot capture    | Capture original/generated screenshots locally                                |       P0 |
| React component generation  | Generate editable `.tsx` component                                            |       P0 |
| CSS Module generation       | Generate editable styles                                                      |       P0 |
| Asset handling              | Link or download assets depending on mode                                     |       P0 |
| ZIP packaging               | Package generated output                                                      |       P0 |
| R2 upload                   | Upload ZIP/report temporarily                                                 |       P0 |
| Download link               | Signed URL from dashboard                                                     |       P0 |
| Basic fidelity report       | Desktop/mobile visual match and warnings                                      |       P0 |
| Categorized fidelity report | Show which mismatch category caused reruns                                    |       P0 |
| Node match report           | Show match confidence and unmatched nodes                                     |       P0 |
| Attempt history             | Show rerun count, strategy, score, and warnings                               |       P0 |
| Best attempt download       | Download the best completed attempt by default                                |       P0 |
| README                      | Explain how to run output                                                     |       P0 |
| AGENT_BRIEF                 | Explain how external coding agents should work with output                    |       P0 |
| Auto-expiry                 | Delete exports after retention period                                         |       P0 |
| Error messaging             | Human-readable failed job errors                                              |       P0 |

#### Should Have

| Feature                  | Description                                                 | Priority |
| ------------------------ | ----------------------------------------------------------- | -------: |
| Linked asset mode        | Use remote asset references for cheaper/free exports        |       P1 |
| Portable asset mode      | Bundle assets in ZIP for paid/beta users                    |       P1 |
| Basic hover preservation | Preserve simple hover CSS where detectable                  |       P1 |
| Basic appear animation   | Map simple reveal to Motion/CSS                             |       P1 |
| Responsive CSS           | Generate basic media queries                                |       P1 |
| Export expiry display    | Show when ZIP expires                                       |       P1 |
| Retry failed job         | Allow user to retry failed export                           |       P1 |
| Rerun low-fidelity job   | Allow user to rerun completed exports below target fidelity |       P1 |
| Manual delete export     | Let user delete export before expiry                        |       P1 |

#### Could Have

| Feature                      | Description                                               | Priority |
| ---------------------------- | --------------------------------------------------------- | -------: |
| Debug screenshots on failure | Temporarily upload debug screenshots only for failed jobs |       P2 |
| Simple usage limits          | Limit exports per user manually                           |       P2 |
| Invite codes                 | Private alpha access control                              |       P2 |
| Basic billing waitlist       | Capture willingness to pay                                |       P2 |
| Export naming controls       | Let user name component before export                     |       P2 |

#### Won't Have In MVP

| Feature                  | Reason                                                              |
| ------------------------ | ------------------------------------------------------------------- |
| Full-page export         | Too broad for first version                                         |
| Full-site export         | Requires routing, shared components, dedupe                         |
| CMS export               | Better after page export works                                      |
| GitHub export            | Useful but not needed to prove core value                           |
| CLI                      | Developer convenience after product is validated                    |
| Internal AI editing      | Outside value prop; users use their own agents                      |
| Unbounded AI repair loop | Adds cost/complexity; MVP uses bounded deterministic reruns instead |
| Advanced scroll motion   | Hard; support later                                                 |
| Forms backend            | Export visual form only, warn about logic                           |
| Auth/membership          | Not suitable for MVP                                                |
| E-commerce checkout      | High-risk and platform-specific                                     |
| Permanent storage        | Cost risk and not needed                                            |

### 10.4 Support Matrix

#### MVP Supported

| Item                       | Support Level                         |
| -------------------------- | ------------------------------------- |
| Text                       | Full                                  |
| Images                     | Full/partial depending on asset mode  |
| Basic layout               | Full for simple sections              |
| Typography                 | Partial/full depending on font access |
| Colours                    | Full                                  |
| Spacing                    | Partial/full                          |
| Border radius              | Full                                  |
| Shadows                    | Partial/full                          |
| Basic responsive behaviour | Partial                               |
| Basic hover                | Partial                               |
| Basic appear animation     | Partial                               |
| Forms                      | Visual only, logic warning            |
| Custom embeds              | Visual/placeholder, warning           |

#### Post-MVP Supported

| Item             | Target Phase |
| ---------------- | ------------ |
| Full page export | Phase 2      |
| Advanced motion  | Phase 3      |
| CMS export       | Phase 4      |
| Full-site export | Phase 5      |
| GitHub export    | Phase 6      |
| CLI              | Phase 7      |
| Team workspaces  | Phase 8      |

#### Out Of Scope Indefinitely Or Long-Term

| Item                                       | Reason                       |
| ------------------------------------------ | ---------------------------- |
| Cloning arbitrary sites user does not own  | Legal/ethical risk           |
| Replacing Framer editor                    | Not the product              |
| Perfect parity for all animation timelines | Technically unrealistic      |
| Migrating payment checkout logic           | High-risk, provider-specific |
| Migrating auth/member systems              | Security and complexity      |
| Universal no-code platform export          | Dilutes focus                |
| Internal AI coding workspace               | Outside core value prop      |

---

## 11. MVP Scope

## 11.1 MVP Name

**Section Export MVP**

## 11.2 MVP Objective

Allow a user to select one Framer section/component and export it into a developer-ready React component with CSS Modules, assets, README, agent brief, and basic fidelity report.

## 11.3 MVP User Story

As a Framer user, I want to select a section in Framer and export it into React code so that I can continue building it with a developer or AI coding agent.

## 11.4 MVP Delivery Split

### MVP-A: Local Export Engine

MVP-A proves the export engine before the SaaS surface exists.

Included:

- CLI command that accepts a published Framer URL and optional section selector hints.
- Playwright capture for desktop and mobile.
- DOM/computed-style extraction.
- Intermediate representation.
- React component and CSS Module generation.
- Local preview project.
- Screenshot comparison.
- Fidelity report.
- ZIP packaging.
- Manual rerun support for low-fidelity attempts.

Success criteria:

- 7/10 simple Framer sections export into usable React.
- Generated output runs locally.
- Report explains mismatches and unsupported features.
- Reruns can improve output without starting from scratch.

### MVP-B: Productized Section Export

MVP-B wraps the proven export engine with account, dashboard, worker, storage, and plugin flows.

Included:

- Supabase auth and job system.
- Worker-based export processing.
- R2 ZIP/report upload.
- Web dashboard.
- Framer plugin shell using `framer-plugin` in `canvas` mode.
- Selection-based job creation using `framer.getSelection()` and `framer.subscribeToSelection()`.
- Plugin-side capture of selected node IDs, names, types, bounds, text, and available metadata.
- Node-to-DOM matching between plugin selection data and published-site runtime capture.
- Retry/rerun controls.
- Export attempt history.
- Downloadable best attempt.

### MVP-C: Fidelity Hardening

MVP-C improves export quality after MVP-A proves the engine and MVP-B proves the product loop.

Included:

- Categorized fidelity scoring for layout, typography, color, assets, responsive behavior, and motion.
- Diff-driven rerun strategies.
- Better node-to-DOM matching confidence.
- Adapter packaging for common React project types.
- Fixture-based regression tests for common Framer section patterns.

## 11.5 MVP Included Features

### Framer Plugin

- User can open plugin inside Framer.
- User can authenticate with the standalone web app.
- Plugin can detect selected section/component.
- Plugin can list known project components where the SDK allows it and export
  selected component ids directly.
- Plugin can validate whether selection is exportable.
- Plugin can capture selection context from canvas mode or component ids without storing large payloads in Framer `pluginData`.
- Plugin can create an export job.
- Plugin can link user to the web dashboard.

### Web App

- User can sign up/log in.
- User can view export jobs.
- User can see job status.
- User can see completed export details.
- User can download ZIP.
- User can see expiry date.
- User can see basic fidelity score and warnings.
- User can see export attempts and choose the best completed attempt.
- User can rerun an export when fidelity is below target or warnings are fixable.

### Backend/Supabase

- Store users.
- Store projects.
- Store export jobs.
- Store export warnings.
- Store export file keys.
- Enforce user-level access.

### Worker

- Poll queued jobs.
- Lock and process job.
- Render original selection/page context.
- Capture screenshots locally.
- Combine plugin-side selection metadata with browser-side DOM/runtime capture.
- Match Framer nodes to DOM elements using text, bounds, assets, hierarchy, and style confidence.
- Extract relevant layout/style data.
- Generate React component.
- Generate CSS Module.
- Run one or more bounded improvement attempts when output is below fidelity target.
- Download or link assets.
- Render generated output locally.
- Compare generated output to original.
- Generate report JSON.
- Create ZIP.
- Upload ZIP and report to R2.
- Delete local temporary files.

### Exported Output

- React component.
- CSS Module.
- Assets folder where applicable.
- `package.json`.
- Preview app/page.
- `README.md`.
- `AGENT_BRIEF.md`.
- `export-report.json`.
- Adapter notes for Vite, Next.js, Remix, Astro, and other React project types.

### Storage

- ZIP stored temporarily.
- Report JSON stored temporarily.
- Screenshots kept local only by default.
- Debug screenshots uploaded only on failure or explicit debug mode.
- Lifecycle deletion rules applied.

---

## 11.6 MVP Iteration and Rerun Loop

Not every export will hit 98% visual match on the first attempt. Coderelay should treat export quality as an iterative pipeline, not a single-shot conversion.

### MVP Loop Types

1. **Automatic bounded rerun**
   The worker may rerun generation when the first attempt is below the target fidelity score or has fixable warnings.

2. **Manual user rerun**
   The dashboard lets the user rerun with changed settings, such as asset mode, layout strictness, or viewport target.

3. **Attempt history**
   Each job keeps attempts so users and support can compare what changed.

4. **Best attempt selection**
   The dashboard marks the highest-quality completed attempt as the recommended download, but the user can inspect older attempts.

5. **Diff-driven repair**
   Reruns should respond to the mismatch category: typography, spacing, assets, layout, mobile, or decorative details.

### MVP Constraints

- Maximum 2 automatic attempts for free/beta users.
- Maximum 3 automatic attempts for paid users later.
- No open-ended agent loop in MVP.
- Each attempt records its strategy, warnings, score, and generated ZIP/report keys.
- Reruns must respect timeout, ZIP size, and worker concurrency limits.

### Example Attempt Strategies

```text
attempt 1: semantic layout first
attempt 2: stricter spacing and typography correction
attempt 3: fallback absolute-positioned decorative layer for hard visual details
```

The product should optimize for the best handoff output, not pretend the first generated version is always final.

## 11.7 MVP Excluded Features

- Page export.
- Full-site export.
- CMS export.
- GitHub export.
- CLI.
- Team workspaces.
- Billing automation.
- Unbounded AI repair loop.
- Internal vibe-coding interface.
- Advanced scroll animations.
- Complex form logic.
- Auth/membership migration.
- E-commerce migration.
- Long-term export archive.

---

## 11.8 MVP Acceptance Criteria

The MVP is ready for private alpha when:

1. A user can connect their account from the Framer plugin.
2. A user can select a Framer section/component.
3. A user can start an export job.
4. The job appears in the dashboard.
5. A worker processes the job successfully.
6. The output ZIP contains a runnable React component project.
7. The generated code is formatted and understandable.
8. The export includes README, AGENT_BRIEF, and report JSON.
9. The user can download the ZIP.
10. The ZIP expires automatically based on retention policy.
11. Screenshots are not permanently stored by default.
12. Failed jobs show readable errors.
13. At least 20 real Framer sections can be tested.
14. At least 70% of tested simple sections export successfully during alpha.
15. Average visual match for supported simple sections reaches at least 90%.
16. Low-fidelity jobs can be rerun from the dashboard.
17. Export reports show attempt count, best attempt, and why reruns happened.

---

## 12. Post-MVP Scope

Post-MVP development should proceed in deliberate stages.

---

## 12.1 Phase 2: Page Export

### Goal

Export one complete Framer page into a portable React page with adapters for Vite, Next.js, Remix, Astro, and similar React project types.

### Included

- Page-level export.
- Multiple sections per page.
- Route generation.
- Page metadata.
- Shared assets.
- Desktop and mobile fidelity checks.
- Better section naming.
- Basic navigation/footer handling.

### Excluded

- Multi-page site crawling.
- CMS dynamic routes.
- Advanced component deduplication.

### Success Criteria

- User can export a full landing page.
- Output runs locally.
- Page has reasonable component/section structure.
- Average visual match above 90–92% for supported pages.

---

## 12.2 Phase 3: Motion Fidelity

### Goal

Improve preservation of Framer motion and interactions.

### Included

- Hover state capture.
- In-view animation mapping.
- Basic stagger animation mapping.
- Basic scroll-trigger mapping.
- Motion for React output.
- Motion warnings in report.
- Reduced-motion support.

### Excluded

- Perfect reconstruction of every scroll choreography.
- Complex timeline editor.
- Internal AI repair.

### Success Criteria

- Common appear animations are preserved.
- Basic hover interactions are preserved.
- Unsupported motion is clearly flagged.
- Animation mismatch warnings are understandable.

---

## 12.3 Phase 4: CMS Export

### Goal

Export simple Framer CMS content into local structured data and dynamic routes.

### Included

- CMS collection reading where available.
- JSON/TypeScript data export.
- Dynamic route generation.
- Blog/article template export.
- Slug handling.
- Local asset mapping.

### Excluded

- Full external CMS migration to Sanity/Contentful/etc.
- Complex CMS filtering/search.
- Real-time CMS sync.

### Success Criteria

- Simple Framer blogs can export into Next.js dynamic routes.
- CMS content is represented in typed local files.
- Missing/unsupported CMS features are flagged.

---

## 12.4 Phase 5: Full-Site Export

### Goal

Export small Framer websites into structured portable React projects.

### Included

- Multi-page crawling.
- Shared layout.
- Shared nav/footer detection.
- Reused component detection.
- Sitemap route mapping.
- Asset deduplication.
- Site-level export report.

### Excluded

- Large enterprise-scale site migration.
- Auth-gated pages.
- Framer-native checkout logic.
- Advanced search/localisation.

### Success Criteria

- Small marketing sites can export end-to-end.
- Shared components are not duplicated excessively.
- Generated app structure is usable by a developer.

---

## 12.5 Phase 6: GitHub Export

### Goal

Allow users to push exports to GitHub.

### Included

- GitHub App integration.
- Create new repo.
- Push export to repo.
- Open pull request into existing repo.
- PR summary with fidelity report.
- Export manifest.

### Excluded

- Automated deployment management.
- CI/CD hosting support beyond generated instructions.

### Success Criteria

- Users can send export directly to GitHub.
- PR includes useful report and file summary.
- Agencies can hand off to clients through GitHub.

---

## 12.6 Phase 7: CLI

### Goal

Give developers a terminal workflow.

### Included

- `npx coderelay login`
- `npx coderelay pull <jobId>`
- `npx coderelay preview`
- `npx coderelay sync` later
- Local config file.

### Excluded

- Local-only Framer extraction.
- Full offline mode.

### Success Criteria

- Developer can pull an export locally without using dashboard download.
- CLI can initialise and preview generated output.

---

## 12.7 Phase 8: Agency and Team Workflows

### Goal

Support higher-value users.

### Included

- Workspaces.
- Team seats.
- Client projects.
- Branded reports.
- Export history.
- Longer retention.
- Usage dashboard.
- Bulk export credits.

### Excluded

- White-glove migration service automation.
- Marketplace for Framer exports.

### Success Criteria

- Agencies can manage multiple projects and clients.
- Agency tier has clear willingness to pay.

---

## 13. User Flows

## 13.1 First-Time Export Flow

1. User opens Framer plugin.
2. Plugin asks user to connect account.
3. User signs up/logs in through web app.
4. User returns to plugin.
5. Plugin shows connected state.
6. User selects a section/component in Framer.
7. Plugin validates selection.
8. User chooses export settings.
9. User clicks “Export to React”.
10. Plugin creates export job.
11. Web app opens job detail page.
12. Job status shows queued/running.
13. Worker processes export.
14. Export completes.
15. User sees fidelity score and warnings.
16. User downloads ZIP.
17. User opens project locally or gives it to developer/agent.

---

## 13.2 Returning User Flow

1. User opens plugin.
2. Plugin recognises session.
3. User selects section/page.
4. User starts export.
5. User monitors status from plugin or dashboard.
6. User downloads completed output.

---

## 13.3 Failed Export Flow

1. User starts export.
2. Worker fails due to timeout, unsupported selection, inaccessible URL, or asset issue.
3. Dashboard shows failed state.
4. Error explains what happened.
5. User can retry or adjust selection.
6. Debug artefacts are stored temporarily only when needed.

---

## 14. Export Output Specification

### MVP Output Folder

```text
exported-section/
  src/
    components/
      ExportedSection.tsx
      ExportedSection.module.css
    assets/
      image-1.png
      image-2.svg
  public/
  package.json
  README.md
  AGENT_BRIEF.md
  export-report.json
  vite.config.ts
  tsconfig.json
```

### Future Next.js Page Output

```text
exported-site/
  app/
    layout.tsx
    page.tsx
    pricing/page.tsx
  components/
    Navbar.tsx
    Hero.tsx
    FeatureGrid.tsx
    Footer.tsx
  styles/
    globals.css
    tokens.css
  public/
    assets/
  cms/
    data.ts
    types.ts
  export-report.json
  framer-map.json
  AGENT_BRIEF.md
  README.md
  package.json
```

---

## 15. README Requirements

Every export must include a `README.md`.

The README should include:

1. Export summary.
2. What was exported.
3. How to install.
4. How to run locally.
5. File structure.
6. Asset mode.
7. Known warnings.
8. Fidelity score.
9. Notes for developers.

Example:

```md
# Exported Framer Section

This project was generated from a Framer section.

## Run locally

npm install
npm run dev

## Important files

- src/components/ExportedSection.tsx
- src/components/ExportedSection.module.css
- export-report.json
- AGENT_BRIEF.md

## Notes

Some animations may have been approximated. Review export-report.json for details.
```

---

## 16. Agent Brief Requirements

Every export must include `AGENT_BRIEF.md`.

Purpose: help users hand the output to external coding agents.

Example:

```md
# Agent Brief

This code was exported from a Framer design. Preserve visual fidelity unless instructed otherwise.

## Main files

- Component: src/components/ExportedSection.tsx
- Styles: src/components/ExportedSection.module.css
- Report: export-report.json

## Guidance

- Keep spacing, typography, and responsive behaviour close to the original.
- Review warnings in export-report.json before refactoring.
- Reconnect forms, analytics, or embeds manually if needed.
- Prefer improving structure without changing the visual output.
```

---

## 17. Fidelity Report Specification

### MVP Report

```json
{
  "jobId": "uuid",
  "exportType": "component",
  "sourceUrl": "https://example.framer.website",
  "createdAt": "2026-05-23T12:00:00Z",
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
  "nodeMatching": {
    "matched": 24,
    "unmatched": 3,
    "averageConfidence": 0.89
  },
  "assets": {
    "downloaded": 8,
    "linked": 2,
    "failed": 0
  },
  "warnings": [
    {
      "type": "animation_approximated",
      "severity": "warning",
      "message": "A scroll animation was approximated as a basic appear animation."
    }
  ],
  "expiry": {
    "zipExpiresAt": "2026-05-24T12:00:00Z"
  }
}
```

### Warning Types

```text
unsupported_animation
animation_approximated
missing_asset
large_asset_linked
custom_code_detected
third_party_embed_detected
form_detected
font_not_bundled
layout_approximated
responsive_mismatch
low_fidelity_score
node_match_low_confidence
plugin_selection_incomplete
unsupported_cms
unsupported_auth
unsupported_checkout
```

---

## 18. Technical Architecture

### Lean Architecture

```text
Framer Plugin
  ↓
Plugin selection capture
  ↓
Next.js Web App
  ↓
Supabase Auth + Postgres
  ↓
export_jobs table
  ↓
VPS Worker polling jobs
  ↓
Playwright runtime capture + node-to-DOM matching + codegen + categorized diffing
  ↓
Cloudflare R2 temporary storage
  ↓
Dashboard download
```

### Recommended Stack

#### Plugin

- React
- TypeScript
- `framer-plugin`
- Vite + `vite-plugin-framer`
- `framer.json` with `modes: ["canvas"]`
- `import "framer-plugin/framer.css"`

#### Web App

- Next.js
- TypeScript
- Tailwind/shadcn optional
- Supabase client

#### Backend

- Supabase Auth
- Supabase Postgres
- Supabase Row Level Security
- Supabase Edge Functions only for lightweight API actions if needed

#### Worker

- Node.js
- TypeScript
- Playwright
- Prettier
- pixelmatch or resemble.js
- archiver/yazl for ZIP creation
- Sharp optional for image processing

#### Storage

- Cloudflare R2
- Private bucket
- Signed URLs
- Lifecycle rules

#### Payments Later

- Stripe, Lemon Squeezy, or Paddle

---

## 19. Data Model

### `profiles`

```sql
id uuid primary key references auth.users(id),
email text,
full_name text,
created_at timestamptz default now()
```

### `projects`

```sql
id uuid primary key default gen_random_uuid(),
user_id uuid not null references profiles(id),
name text not null,
source_type text default 'framer',
source_project_id text,
source_url text,
created_at timestamptz default now()
```

### `export_jobs`

```sql
id uuid primary key default gen_random_uuid(),
user_id uuid not null references profiles(id),
project_id uuid references projects(id),
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
```

### `export_attempts`

```sql
id uuid primary key default gen_random_uuid(),
job_id uuid not null references export_jobs(id),
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
completed_at timestamptz
```

### `node_matches`

```sql
id uuid primary key default gen_random_uuid(),
job_id uuid not null references export_jobs(id),
attempt_id uuid references export_attempts(id),
framer_node_id text,
dom_path text,
confidence numeric not null,
match_reasons text[] default '{}',
created_at timestamptz default now()
```

### `export_warnings`

```sql
id uuid primary key default gen_random_uuid(),
job_id uuid not null references export_jobs(id),
type text not null,
message text not null,
severity text default 'warning',
created_at timestamptz default now()
```

### `export_files`

```sql
id uuid primary key default gen_random_uuid(),
job_id uuid not null references export_jobs(id),
file_type text not null,
r2_key text not null,
size_bytes bigint,
expires_at timestamptz,
created_at timestamptz default now()
```

---

## 20. Job State Model

### Job Statuses

```text
queued
running
completed
failed
expired
cancelled
```

### Lifecycle

```text
queued → running → completed → expired
queued → running → failed
queued → cancelled
```

### Worker Locking Logic

1. Worker asks Supabase for oldest queued job.
2. Worker atomically marks job as running.
3. Worker processes job.
4. On success, worker uploads ZIP/report and marks job completed.
5. On failure, worker marks job failed with readable error.
6. Cleanup process marks expired jobs and deletes R2 artefacts.

---

## 21. Storage Policy

Storage must be intentionally temporary.

### Default Behaviour

- Original screenshots: local only, deleted after job.
- Generated screenshots: local only, deleted after job.
- Diff screenshots: local only, deleted after job.
- ZIP: uploaded to R2 temporarily.
- Report JSON: uploaded to R2 temporarily.
- Debug files: uploaded only on failure or paid debug mode.

### R2 Bucket

```text
framer-exports
```

### Object Prefixes

```text
jobs/{jobId}/exports/output.zip
jobs/{jobId}/reports/report.json
jobs/{jobId}/debug/original.png
jobs/{jobId}/debug/generated.png
jobs/{jobId}/debug/diff.png
```

### Retention Defaults

| Artefact          |             Free |             Paid |           Agency |
| ----------------- | ---------------: | ---------------: | ---------------: |
| ZIP               |         24 hours |           7 days |          30 days |
| Report JSON       |        7–30 days |          30 days |          90 days |
| Debug screenshots |       Not stored |           3 days |           7 days |
| Local temp files  | Immediate delete | Immediate delete | Immediate delete |

---

## 22. Cost Control Requirements

### Storage Cost Controls

- Use R2, not Supabase Storage, for large artefacts.
- Do not upload screenshots by default.
- Store only ZIP and report JSON by default.
- Use lifecycle rules.
- Limit ZIP size by plan.
- Offer linked asset mode for free users.
- Delete expired exports automatically.

### Compute Cost Controls

- Limit viewport count in MVP.
- Limit export size.
- Limit retries.
- Enforce job timeout.
- Queue jobs instead of running unlimited parallel jobs.
- Start with one worker VPS.
- Add priority queue only after paid usage.

### API Cost Controls

- No internal AI editing.
- No unbounded AI repair loop in MVP.
- No external model dependency required for v1.

---

## 23. Monetisation

### Pricing Philosophy

Charge for time saved and handoff quality, not for storage.

### Free Tier

Purpose: acquisition and proof.

Limits:

- Limited section exports.
- Linked asset mode only.
- ZIP expires after 24 hours.
- Basic fidelity report.
- Max ZIP size.
- No debug screenshots.

### Creator Tier

Target: designers and indie builders.

Possible pricing:

```text
$19–$39/month
```

Includes:

- More section exports.
- Portable asset mode.
- Longer ZIP retention.
- Page export when available.
- Better report.

### Pro Tier

Target: founders, developers, frequent users.

Possible pricing:

```text
$79–$149/month
```

Includes:

- Higher export limits.
- Page export.
- CMS export later.
- Debug artefacts.
- Priority processing.
- Larger ZIPs.

### Agency Tier

Target: agencies/freelancers.

Possible pricing:

```text
$249–$599/month
```

Includes:

- Team seats.
- Multiple client projects.
- Branded reports.
- Longer retention.
- Higher limits.
- GitHub export later.

### One-Time Credits

Alternative/addition:

- 5 export credits.
- 20 export credits.
- One page export.
- One full-site export later.

This may be better for low-frequency users than subscriptions.

---

## 24. Success Metrics

### Activation Metrics

- Plugin installs.
- Account connections.
- Export jobs started.
- Export jobs completed.
- ZIP downloads.

### Product Quality Metrics

- Export success rate.
- Average fidelity score.
- Failed job rate.
- Average job processing time.
- Warning frequency by type.
- Average ZIP size.

### Business Metrics

- Free-to-paid conversion.
- Export credits purchased.
- Monthly recurring revenue.
- Agency plan signups.
- Retention.
- Repeat exports per user.

### Cost Metrics

- Cost per export.
- Worker time per export.
- Average storage per export.
- R2 operations per export.
- Failed job cost.
- Expired file cleanup success rate.

### North Star Metric

**Successful developer-ready exports downloaded.**

Definition:

A successful developer-ready export is one where:

1. Job completes.
2. ZIP is downloaded.
3. Code runs locally.
4. Fidelity score is acceptable or warnings are acknowledged.

---

## 25. Risks and Mitigations

| Risk                                     | Impact | Mitigation                                                                |
| ---------------------------------------- | -----: | ------------------------------------------------------------------------- |
| Framer plugin review rejection           |   High | Keep standalone SaaS as core, position as handoff, avoid hostile language |
| Layout extraction is poor                |   High | Start with selected sections, use visual diff, limit supported layouts    |
| Generated code is messy                  |   High | Prioritise React/CSS structure over perfect static mirroring              |
| Storage bill grows                       | Medium | Temporary storage, lifecycle deletion, screenshots local only             |
| Worker compute gets expensive            | Medium | Queue limits, job timeouts, paid usage, one VPS first                     |
| Competitors undercut static export price | Medium | Avoid competing as static exporter; own developer handoff                 |
| Animation fidelity is hard               |   High | Support simple motion first, report approximations honestly               |
| Users expect perfect export              |   High | Set expectations through report and supported feature matrix              |

---

## 26. Open Questions

1. Should MVP output Vite or Next.js by default?
2. How much Framer selection data can reliably be accessed through the plugin?
3. Should the MVP require a published URL for visual comparison?
4. Should free users only get linked asset mode?
5. What visual fidelity threshold should count as successful?
6. Should the product launch invite-only first?
7. Should credits or subscriptions come first?
8. Should the plugin be public marketplace or private beta initially?
9. How should unsupported custom code be represented in generated output?
10. Should the first wedge be designers or agencies?

---

## 27. Recommended MVP Definition

The first version should be:

> A Framer plugin and web dashboard that lets a user export one selected Framer section/component into React + CSS Modules, download a temporary ZIP, and view a basic fidelity report.

This version is focused enough to build lean, differentiated enough to avoid static export commoditisation, and useful enough to test willingness to pay.
