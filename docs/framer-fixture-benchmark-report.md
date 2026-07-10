# Framer Fixture Benchmark Report

Date: 2026-07-09

## Status

Preliminary. The benchmark suite is in place and the first verified runs are useful, but the full 10-fixture comparison did not finish inside this turn.

## What We Have

- Benchmark suite manifest: `benchmarks/framer-fixtures/manifest.json`
- Suite size: 18 published Framer URLs
- Tooling:
  - Coderelay export runner: `npm run export:test`
  - ditto.site clone runner: local checkout under `/tmp/ditto.site`
  - Screenshot comparison: desktop, laptop, tablet, mobile
- Benchmark script: `scripts/benchmark-framer-fixtures.ts`

## Verified Runs

### Smoke fixture

Fixture: `simplefolio-home`

Verified result from the earlier smoke benchmark:

| Tool | Diff % avg | Routes | Assets | Editable files | Reports | Evidence | Report quality |
| --- | ---: | ---: | ---: | ---: | ---: | --- | --- |
| Coderelay | 10.29 | 1 | 13 | 25 | 11 | screenshot-backed | rich |
| ditto.site | 6.43 | 1 | 89 | 39 | 0 | none | none |

Viewport diffs from that same smoke run:

| Viewport | Coderelay | ditto.site |
| --- | ---: | ---: |
| desktop | 7.92% | 5.63% |
| laptop | 8.54% | 4.91% |
| tablet | 12.28% | 5.05% |
| mobile | 12.42% | 10.13% |

### Current benchmark failure

Fixture: `cohesion-home`

Coderelay completed capture and generation, then failed responsive validation:

> Generated export responsive validation failed for route `/` at `tablet`. `horizontalOverflow=true`, `fullWidthRoot=true`, `innerWidth=768`, `rootWidth=768`, `scrollWidth=1417`

That is a real fidelity failure, not just a tooling hiccup.

## Readout

- Coderelay is ahead on reporting richness, explicit evidence labeling, and provenance.
- Coderelay is not yet proven better than ditto.site on raw screenshot fidelity.
- On the smoke sample, ditto.site was closer on screenshots.
- On the current high-complexity Framer fixture, Coderelay still hits a tablet overflow validation failure.

## Conclusion

No, we cannot honestly confirm yet that Coderelay exports sites at better quality and fidelity than ditto.site.

What we can confirm right now:

- Coderelay’s report layer is better structured.
- Coderelay records screenshot-backed vs heuristic fidelity.
- Coderelay has more useful artifact provenance.
- Coderelay still needs responsive fidelity work before it can claim a win on raw export quality.

## Next Fixes

- Fix the tablet overflow case in published-runtime full-site exports.
- Re-run the 10-fixture benchmark once that passes.
- Compare screenshot diffs, route coverage, asset completeness, editability, and report quality on the full set.

