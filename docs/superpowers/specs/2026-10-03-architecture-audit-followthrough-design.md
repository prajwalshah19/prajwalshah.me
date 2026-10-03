# Architecture audit follow-through

Approved on October 3, 2026 when the user requested implementation of the audit findings. This supplements the existing architecture-hardening design and plan. Keep React/Vite/Sanity and the existing request lifecycle fixes. No framework migration or live CMS mutations/deployment.

## Design

1. Destructive curation must use an explicit reviewed manifest containing project/dataset and exact document IDs/revisions, not mutable slugs. A dry run may show candidate IDs/revisions but does not authorize deletion. Applying must fail closed for missing, stale, duplicate, unexpected, or wrongly targeted review entries. Existing backup, exact target acknowledgement, and transaction revision guards remain mandatory. Draft and published records are reviewed separately.
2. Creation plans check slug ownership across draft/published logical identities before writes. Existing desired records are preserved. Conflicting slug owners or incompatible fixed IDs abort the whole plan. Project draft creation uses the same plan/apply/backup/target workflow and one transaction, preserving all seed content.
3. Track non-secret Sanity Studio and CLI configuration using the same environment overrides and existing public defaults. Keep tokens ignored. Enable no-emit TypeScript validation of .ts imports and add executable tests/typecheck scripts.
4. CI runs immutable installs, frontend tests/lint/build and CMS tests/typecheck/build on PRs and main pushes. Only a successful main-push validation may deploy the built frontend artifact. PR checks must not require secrets. Document setup, review manifest and safe migration use.

## Alternatives and trade-offs

Recommended: small pure planning helpers plus the existing migration wrapper. Ad-hoc checks in every script leave inconsistent safety behavior. Replacing CMS/routing infrastructure adds scope without solving the immediate defects. Reviewed revision manifests require re-review after editorial changes, deliberately trading convenience for deletion safety. Slug checks are snapshot checks, not a global uniqueness constraint against unrelated concurrent writers, and that limitation must be explicit.

## Acceptance

- A copied slug never authorizes deleting a different document, and a changed revision invalidates review.
- Slug collisions fail before asset uploads or mutations.
- Draft script invocation without --apply makes no writes.
- CMS configuration is tracked, credentials are not, and both packages have green local validation.
- Deployment depends on validation and does not run on pull requests.
- Preserve unrelated article-schema edits and all existing writeup/seed content. Existing in-scope hardening may be integrated after review and validation.

## Scope boundaries

The lower-priority Markdown-anchor and image/list performance observations are deferred rather than mixed into the critical safety/reproducibility work. No actual deletion review manifest will be fabricated or obtained from the live dataset during implementation.
