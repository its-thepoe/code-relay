# framer-published-url-benchmark-suite

Published Framer URLs used to compare export fidelity, route coverage, asset completeness, editability, and report quality across exporters.

| Fixture | Tool | Diff % avg | Routes | Assets | Editable files | Reports | Evidence | Report quality |
| --- | --- | ---: | ---: | ---: | ---: | ---: | --- | --- |
| Cohesion home | coderelay | 2.41 | 1 | 42 | 25 | 14 | screenshot-backed | rich |
| Cohesion home | ditto | failed | 0 | 0 | 0 | 0 | failed | failed |
| Artifact home | coderelay | 10.23 | 1 | 26 | 25 | 14 | screenshot-backed | rich |
| Artifact home | ditto | failed | 0 | 0 | 0 | 0 | failed | failed |
| Senri portfolio | coderelay | 23.21 | 1 | 31 | 25 | 14 | screenshot-backed | rich |
| Senri portfolio | ditto | failed | 0 | 0 | 0 | 0 | failed | failed |

## Summary

Coderelay runs: 3
Ditto runs: 3
Passed runs: 3, failed runs: 3

### Failures

- cohesion-home / ditto: spawn npm ENOENT
- artifact-home / ditto: spawn npm ENOENT
- senri-portfolio / ditto: spawn npm ENOENT

Observation: lower diff percentages are better. On the sample run we captured manually, ditto.site was ahead on raw screenshot diff, while Coderelay was ahead on report richness and explicit evidence labeling.
