# Architecture hardening

Approved direction: the user requested fixes to the four findings in the architecture audit on 2026-10-03.

## Scope and approach

Keep the existing React/Vite and Sanity architecture. Prefer small shared helpers over a framework migration or a new runtime state-management dependency. The alternatives are scattered null checks and per-script patches (insufficient protection), or replacing routing/data infrastructure (unnecessary scope).

1. CMS maintenance: dry-run by default, explicit apply and backup, expected revision checks, and atomic document mutations. Build collision-aware Board slug plans across draft/published pairs. Reject ambiguous single-item deletes. Preserve existing writeup text and script intent.
2. Frontend: normalize optional CMS values at the service boundary, represent nullable query results honestly, and keep route failures from removing navigation. Share keyed async request state with stale-response protection and distinct loading, failure, empty, and not-found UI.
3. Reproducibility: version non-secret CMS configuration, document environment setup, and validate both packages in CI. Keep credentials untracked. Preserve the current project/dataset defaults unless environment variables override them.
4. Regression tests: actual component tests for the optional-tags crash and request ordering/error states; pure mutation-plan tests for safeguards and identity. All tests must avoid live CMS reads/writes.

## Non-goals and safety

No live content mutation, deployment, unrelated visual redesign, or automatic change to existing slugs. Preserve the modified article schema and unrelated draft-project script. New tests may add development dependencies but no new runtime state-management library. Existing untracked scripts in scope may be hardened, retaining their content.

## Acceptance

Missing project tags cannot crash a route. Navigation survives a route render failure. Old requests cannot render under a new key, and outages are not reported as empty/missing content. Maintenance scripts require deliberate apply and backup, use revision checks, and reject ambiguous targets. CMS builds from tracked config. Both packages have executable CI checks. Final report distinguishes local validation from unperformed live mutations/deployment.