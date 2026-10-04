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

## Production-build browser follow-up

On October 4, the real `app` production build was served using `yarn preview` on loopback. HTTP returned 200. Installed Chrome rendered the actual homepage with external DNS deliberately blocked, without mocked response payloads or substituted components. Its captured DOM contained the Projects, Writing, and Board navigation links and three explicit failure alerts for about, social links, and experience. This verifies actual bundle loading, lazy homepage imports, and readable network-failure output while retaining navigation. It does not prove navigation clicks or successful CMS-backed rendering.

The isolated headless Chrome process produced the homepage DOM but failed to exit, logging macOS display-link/allocator errors. The multi-route run was cancelled before subsequent routes ran. The browser bridge was unavailable. Evidence remains in the task scratch `architecture-20261003/browser/_.html` and `_.log`. No browser extension was installed and no user browser profile was used.

### Requirement-to-acceptance mapping

| Requirement / changed public output | Concrete observed evidence | Remaining acceptance constraint |
| --- | --- | --- |
| Reviewed deletion IDs/revisions, exact target and backup | CMS guard tests reject stale/missing/extra/duplicate/wrong-target manifests and unsafe apply arguments; local backup behavior exercised | Actual deletion requires a disposable authenticated dataset and reviewed content. Production mutation was deliberately not used as a test. |
| Collision-safe creation and dry-run seed workflow | Creation planner tests reject incompatible identities and existing slug owners, preserving seed text; entrypoint wiring reviewed | CLI entrypoints fetch remote data before guards. No remote snapshot or transaction was exercised, so no end-to-end safety claim. |
| Reproducible app and Studio packaging | Exact staged source, clean frozen installs, actual app and Studio builds succeeded under Node 22.22.2; built app served HTTP 200 and rendered in Chrome | Studio authentication and deployed environment remain untested. |
| CI-gated artifact deployment | Workflow structural assertions passed for check commands, dependency gate, branch condition and artifact names | Hosted runner and deployment require a push and external credentials, neither performed. |
| Request failures remain visible without losing navigation | Actual built homepage in Chrome rendered three failure alerts and header links under network failure | Click recovery and successful remote responses not exercised in browser. Request races and nullable responses are covered by component tests only. |
| Fragment, duplicate-heading, footnote and backlink navigation | Actual router/Markdown component tests passed, including red/green footnote regression | Physical scrolling and actual published Markdown remain unverified. Browser run stopped before a content route. |
| Responsive images, format fallback and intrinsic dimensions | Media component tests cover width caps, responsive attributes, invalid IDs and original SVG fallback, with red/green evidence | Real image CDN responses, decoded dimensions and transfer savings remain unmeasured. |
| Lean lists with complete details | Projection tests distinguish summary/detail outputs; deliberate inline content/tags regression was detected | Live GROQ responses and payload-size comparison remain unverified. Pagination intentionally unchanged. |

The real browser check adds acceptance evidence for packaging and network-failure rendering only. It does not convert the synthetic tests into full end-to-end validation. Remaining production boundaries are explicitly blocked or unexercised, not passed.

## Preservation and operational limits

- Project seed text was compared byte-for-byte with the initial backup and preserved.
- `cms/schemaTypes/article.ts` was compared with the initial backup, left unchanged, and excluded from commits.
- No push, live CMS read/mutation, asset upload, or deployment was performed for verification.
- Slug-owner checks remain snapshot checks rather than a cross-writer uniqueness constraint. Asset uploads are not part of the document transaction. These limits are documented in `cms/README.md`.
- Non-blocking existing dependency peer/version warnings and the Vite SWC deprecation warning remain. Checks exit successfully.

These results support local integration confidence, not a claim that production behavior or hosted CI has already been validated.
