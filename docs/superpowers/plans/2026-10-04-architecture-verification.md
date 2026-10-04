# Architecture fix verification

Verified October 4, 2026. Critical changes are in `35b48f7`; this record accompanies the remaining frontend follow-through commit.

## Observed checks

| Area | Evidence | Boundary not exercised |
| --- | --- | --- |
| CMS deletion review and creation identity | 19 passing pure-helper/guard tests. Initial review/identity tests failed before implementation. Independent script review approved manifest/backup/target wiring and preflight order. | Live script entrypoints and remote Sanity transaction behavior were not executed. |
| Reproducible configuration | Both packages installed from frozen lockfiles in scratch directories. Exact staged source built with isolated Node 22.22.2, without local `.env` or ignored Studio configuration. Public config is tracked and credentials remain ignored. | No production deployment or machine-wide Node changes. |
| Deployment gates | YAML structure checks confirmed PR/main triggers, both packages' check commands, no validation secrets, dependent main-only deployment, and matching artifact names. Independent configuration review approved. | GitHub-hosted workflow execution and branch-protection settings were not changed or tested. |
| Existing frontend lifecycle hardening | 16 component/hook tests cover nullable data, request races, errors, and navigation surviving render failures. | CMS responses are mocked. |
| Markdown fragment navigation | 13 tests use the actual HashRouter and rendered Markdown. They cover formatted/duplicate headings, encoded/malformed/direct/repeated fragments, modified/external clicks, GFM footnotes and backlinks. Initial 11 failures and later footnote failure were observed before fixes. | `scrollIntoView` is stubbed. Actual browser pixel positioning was not measured. |
| Responsive Board images and list payloads | 11 tests cover raster width ladders, source-size caps, aspect-ratio attributes, invalid references, alphanumeric asset IDs, non-transformable formats, list projections, and full detail content. Initial 8 failures and later SVG failure were observed before fixes. A deliberate inline `content,tags` query mutation caused the strengthened project test to fail, then passed after restoration. | No production bandwidth benchmark or live GROQ/CDN execution. Collection cardinality remains unpaginated. |

## Final local result

The exact staged code passed **40 frontend tests and 19 CMS tests**, frontend lint, frontend typecheck/build, CMS typecheck/build, and diff whitespace checks on Node 22.22.2. The full staged snapshot excluded the unrelated local article-schema modification. Independent frontend review approved after correcting footnote scrolling and formatting-dependent payload assertions.

## Preservation and operational limits

- Project seed text was compared byte-for-byte with the initial backup and preserved.
- `cms/schemaTypes/article.ts` was compared with the initial backup, left unchanged, and excluded from commits.
- No push, live CMS read/mutation, asset upload, or deployment was performed for verification.
- Slug-owner checks remain snapshot checks rather than a cross-writer uniqueness constraint. Asset uploads are not part of the document transaction. These limits are documented in `cms/README.md`.
- Non-blocking existing dependency peer/version warnings and the Vite SWC deprecation warning remain. Checks exit successfully.

These results support local integration confidence, not a claim that production behavior or hosted CI has already been validated.
