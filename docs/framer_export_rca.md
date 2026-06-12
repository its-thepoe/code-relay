# Framer Export Styling RCA

## Correction

My earlier conclusion was too broad.

Wrong assumption:

> High-fidelity export requires the published Framer site as the source of truth.

Corrected version:

> Published-site capture is one useful fidelity source, but it is not the only path. React Export-style component export can work without a published site because Framer exposes component module URLs and code-file exports from inside the editor/plugin environment. For unpublished full-site export, we need to use the Framer Plugin SDK node tree and rich traits much more deeply than we currently do.

So the real issue is not simply “Framer project data does not give styling.” The real issue is:

> Our exporter currently reads a shallow subset of the Framer project model, then flattens it into generic sections.

That is why the export looks like content inventory instead of the designed site.

## Confirmed Plugin SDK facts

From the local `framer-plugins` skill and the installed `framer-plugin` package:

- Current npm version checked locally: `framer-plugin@3.10.3`.
- Our plugin uses `framer-plugin` with `"framer-plugin": "^3"`.
- Plugin SDK has canvas/project APIs beyond the quick-reference basics:
  - `framer.getProjectInfo()`
  - `framer.getPublishInfo()`
  - `framer.getSelection()`
  - `framer.getCanvasRoot()`
  - `framer.getNode(nodeId)`
  - `framer.getParent(nodeId)`
  - `framer.getChildren(nodeId)`
  - `framer.getRect(nodeId)`
  - `framer.getNodesWithType(...)`
  - `framer.getColorStyles()`
  - `framer.getTextStyles()`
  - `framer.getFonts()`
  - `framer.getCodeFiles()`
  - `framer.getCodeFile(id)`
  - `framer.subscribeToCodeFiles(...)`

The installed types also show richer node traits than we currently preserve:

- background color
- background image
- background gradient
- opacity
- rotation
- border radius
- border
- overflow
- component info
- control attributes
- typed controls
- position
- pins
- size
- size constraints
- aspect ratio
- text truncation
- image rendering
- z-index
- font
- inline text style
- web page info
- layout
- grid item
- component variant
- breakpoint
- link

So: the SDK is not “just names and rough bounds.” It can expose meaningful design model data. We are not consuming enough of it.

## Confirmed Code Component facts

From the `framer-code-components-overrides` skill:

- Framer canvas code uses the `framer` package, not `framer-plugin`.
- Code Components support `addPropertyControls`.
- Code Overrides do not support `addPropertyControls`.
- Code Components can expose props such as strings, numbers, booleans, images, colors, links, fonts, component instances, arrays, objects, transitions, and more.
- Font controls must be treated as a whole object, not split into individual font fields.

This matters because React Export / Unframer is mostly in this world: exporting reusable Framer code components and their props, not reconstructing arbitrary no-code page layout from a published site.

## How React Export / Unframer likely works

React Export does not need a published site because component export has a different source of truth.

The Plugin SDK exposes component insertion URLs:

- `ComponentNode.insertURL`
- `ComponentInstanceNode.insertURL`
- `CodeFile.exports[]`
- `CodeFileComponentExport.insertURL`

A React Export-style plugin can collect those module URLs from the editor/project, then a CLI like Unframer can download/bundle the component modules and extract prop types from `propertyControls`.

That path is component-module export, not DOM reconstruction.

Important distinction:

```text
React Export / Unframer
  source of truth: Framer component module JS + propertyControls
  needs published site: no
  best for: reusable code components

Published-site capture
  source of truth: rendered DOM + computed CSS
  needs published site: yes
  best for: final visual/runtime validation and public full-site scraping

Plugin SDK node-tree export
  source of truth: editor design model + node traits
  needs published site: no
  best for: unpublished site/page reconstruction, if implemented deeply
```

## Symptom

For `job_40ff0f79689169c5`, preview parity is now fixed:

- the job page preview opens
- the preview matches the ZIP dev output

But visual fidelity is still poor:

- dark surfaces appear
- text appears
- some images appear
- page/component counts appear
- layout, sizing, exact styling, nesting, layering, and responsiveness are still wrong

The export is no longer blank. It is still not a faithful Framer export.

## Evidence (facts)

The job source was:

```json
"sourceUrl": "framer://project/73c03fce0bd10c308f51508273c2d9c79eb3d0ec99f3a0141573b80fff20bb1f"
```

So the worker did not use the published URL for this run.

The report shows weak fidelity:

```json
"overall": 52.95,
"layout": 52.95,
"color": 52.95,
"nodeMatch": 20.91
```

The captured node metadata in this job is thin. Example:

```json
"styles": {
  "opacity": "1",
  "width": "1fr",
  "height": "fit-content"
}
```

But the installed SDK types show many richer traits exist. That means the problem is at least partly our capture/extraction strategy, not necessarily a hard Framer limitation.

## Mechanism

1. The plugin gathers pages/components and traverses nodes.

2. Our capture code reads text, images, rough rects, and a small set of style fields.

3. Many Framer traits are not captured or normalized correctly:
   - layout mode
   - stack/grid direction
   - padding
   - pins/constraints
   - breakpoints
   - variant state
   - typed controls
   - component module URL
   - component instance controls
   - text styles
   - color styles
   - font objects

4. The IR then calls `pickContentNodes()`, which keeps mostly text/image tags and discards many structural frame nodes.

5. Codegen renders generic sections:
   - `SectionHero`
   - `SectionContent`
   - `SectionMediaGrid`

6. That destroys Framer's actual nesting/layering model.

7. The result is visible content with approximated styling.

## Root cause (primary)

The broken invariant is:

> A faithful export must preserve Framer's component/module identity and node layout tree until codegen.

We currently violate that invariant by collapsing Framer's design model into a flat list of content nodes too early.

The primary root cause is not “Framer cannot provide styling.” The primary root cause is that our exporter does not yet model the two different export paths correctly:

- component/module export via `insertURL` + `propertyControls`
- page/layout export via node tree + traits + breakpoints

## What source of truth should be used?

Use a layered source-of-truth model:

### 1. Component module source

Use this when exporting Framer code components or component instances.

Input:

- `ComponentNode.insertURL`
- `ComponentInstanceNode.insertURL`
- `CodeFile.exports[].insertURL`
- `controls`
- `typedControls`
- code file content where available

Output:

- real React component wrappers
- prop types
- variant props
- image/link/color/rich text props
- external package handling
- Unframer-like bundling

This path does not require the site to be published.

### 2. Editor node-tree source

Use this for full-site/page export when the site is not published.

Input:

- `WebPageNode`
- `FrameNode`
- `TextNode`
- `SVGNode`
- `ComponentInstanceNode`
- parent/child tree
- rects
- layout traits
- size traits
- pins/constraints
- breakpoint traits
- background/border/font/style traits
- text styles/color styles/fonts

Output:

- nested React layout that mirrors Framer frames/stacks/grids
- CSS generated from Framer traits
- component instances emitted as module wrappers when `insertURL` exists
- fallback structural nodes only when no module URL exists

This path also does not require the site to be published.

### 3. Published runtime source

Use this when a published URL exists.

Input:

- rendered DOM
- computed CSS
- generated Framer classes
- assets
- fonts
- screenshots
- route HTML

Output:

- fidelity validation
- fallback DOM-to-code export
- better full-site reconstruction when editor metadata is incomplete

This path is excellent for validation but should not be mandatory for React Export-style component export.

## Concrete changes to the product plan

### Replace the current binary assumption

Old:

```text
Published URL = accurate
Plugin metadata = approximate
```

New:

```text
Component module export = accurate for reusable components
Plugin node-tree export = required for unpublished full sites
Published runtime capture = validation/fallback when available
```

### Add explicit export engines

The UI/export job should distinguish:

- `component-module`
- `page-node-tree`
- `published-runtime`
- `hybrid`

Recommended mapping:

```text
Components mode
  -> prefer component-module
  -> fallback to page-node-tree for non-code canvas components

Full-site mode, unpublished
  -> page-node-tree
  -> component-module for any component instances with insertURL

Full-site mode, published
  -> hybrid
  -> plugin node tree for routes/components
  -> runtime capture for computed visual validation
```

### Capture more SDK data immediately

For every node, capture:

- `nodeClass`
- `parentId`
- `childIds`
- `depth`
- `rect`
- `visible`
- `locked`
- `name`
- `componentIdentifier`
- `componentName`
- `insertURL`
- `controls`
- `typedControls`
- `isVariant`
- `isPrimaryVariant`
- `inheritsFromId`
- `gesture`
- `layout`
- `gap`
- `padding`
- `position`
- `top/right/bottom/left/centerX/centerY`
- `width/height/min/max`
- `aspectRatio`
- `zIndex`
- `overflow`
- `backgroundColor`
- `backgroundImage`
- `backgroundGradient`
- `border`
- `borderRadius`
- `font`
- `inlineTextStyle`
- `link`
- `breakpoint`
- `grid item traits`

### Stop flattening structural frames

`pickContentNodes()` should not be the main IR for page/full-site exports.

We need a tree IR:

```ts
type FramerTreeNode = {
  id: string
  type: string
  parentId?: string
  children: FramerTreeNode[]
  rect: Rect
  traits: Record<string, unknown>
  text?: string
  asset?: Asset
  component?: {
    insertURL?: string
    identifier?: string
    name?: string
    controls?: Record<string, unknown>
    typedControls?: Record<string, unknown>
  }
}
```

Then codegen should render the tree, not regroup text into generic sections.

### Add component-module export lane

Implement Unframer-style export for component URLs:

1. Read `framer.getCodeFiles()`.
2. Read each `CodeFile.exports`.
3. Collect `CodeFileComponentExport.insertURL`.
4. Also inspect `ComponentNode.insertURL` and `ComponentInstanceNode.insertURL`.
5. Emit a manifest:

```json
{
  "components": [
    {
      "name": "AboutCard",
      "insertURL": "https://...",
      "source": "code-file-export"
    }
  ]
}
```

6. Feed that manifest to an Unframer-like bundler.

## Updated answer to the user question

> Is it that Framer project data does not give that information and we need to fetch from the published site?

No, not exactly.

For component export, we should not need the published site. We should use component module URLs and property controls like React Export/Unframer.

For full-site export, if the site is unpublished, we need to use the Plugin SDK's actual node tree and rich traits. The SDK appears capable of giving much more than our current capture records. The output is bad because we are under-capturing and flattening.

For highest confidence and final visual validation, a published URL is still valuable. But it should be optional, not required for every path.

## Confidence / falsifiability

Confidence: high that the current implementation is underusing the SDK.

This is confirmed by the installed `framer-plugin` type definitions exposing rich traits, code files, component `insertURL`s, node traversal, publish info, styles, fonts, and controls.

Remaining uncertainty:

- Whether every no-code Framer layout behavior can be reconstructed from public Plugin SDK fields.
- Whether private/internal Framer runtime data is needed for perfect animation/variant parity.
- Whether third-party component dependencies can always be bundled without manual externals.

Fastest validation:

1. Add a debug export manifest that dumps `ComponentNode.insertURL`, `ComponentInstanceNode.insertURL`, `typedControls`, `controls`, and layout traits for the current project.
2. Confirm whether the 48 components in `job_40ff0f79689169c5` have usable `insertURL`s.
3. If yes, implement component-module export first.
4. In parallel, replace full-site IR flattening with tree-preserving node export.

## Next implementation priority

1. `component-module` export lane using `insertURL`.
2. Tree-preserving Framer node IR.
3. Rich trait capture from Plugin SDK v3.
4. Published-site capture as optional validation/fallback.
5. Fidelity tests comparing:
   - module component render
   - node-tree render
   - published-site screenshot when available

## Sources

- Framer Plugin SDK skill: `/Users/MAC/.agents/skills/framer-plugins/SKILL.md`
- Framer Plugin SDK API reference: `/Users/MAC/.agents/skills/framer-plugins/references/api-reference.md`
- Installed SDK types: `apps/plugin/node_modules/framer-plugin/dist/index.d.ts`
- Framer Code Components / Overrides skill: `/Users/MAC/.agents/skills/framer-code-components-overrides/SKILL.md`
- Property controls reference: `/Users/MAC/.agents/skills/framer-code-components-overrides/references/property-controls.md`
- Local job: `.coderelay/jobs/job_40ff0f79689169c5.json`
- Local report: `.coderelay/artifacts/job_40ff0f79689169c5/2026-05-26T16-10-25-869Z/export/export-report.json`
