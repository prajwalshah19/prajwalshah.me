# Architecture Audit Follow-through Implementation Plan

> **For agentic workers:** Use subagent-driven-development for scoped CMS work and coordinator-owned configuration, followed by independent review.

**Goal:** Close the critical deletion, reproducibility, CI and creation-identity findings without live CMS access.

**Architecture:** Extend existing pure planning helpers and guarded migration execution. Preserve React/Vite/Sanity and all pre-existing content. Keep scripts separate from pure helpers so tests cannot invoke live clients.

**Tech Stack:** TypeScript, Node test runner, Sanity, React, Vitest, GitHub Actions, Yarn Classic.

## Task 1: CMS plans and regression tests

Implemented files: `cms/scripts/curate-portfolio-20260915.ts`, `cms/scripts/draft-github-projects.ts`, `cms/scripts/lib/boardIdentity.ts`, `cms/scripts/lib/migration.ts`, `cms/tests/creation-review.test.ts`. Existing helpers were extended instead of adding parallel planning modules.

- [x] Write failing tests proving a new document reusing an allowed slug cannot be deleted, changed revisions invalidate review, and draft/published variants need separate approval. Include wrong target, malformed/duplicate/missing entries, retained IDs, and unexpected deletion targets.
- [x] Implement a pure manifest validator for `{target: 'project/dataset', documents: [{_id, _rev}]}`. Match exact current candidate IDs/revisions before authorizing deletion. Never infer approval from slug.
- [x] Curation dry-run prints candidate IDs/revisions for deliberate review. Apply requires `--review=<file>` in addition to existing `--apply --backup=<file> --target=<project/dataset>`. No review or stale review aborts before uploads/mutations.
- [x] Write failing creation tests for a same-type/same-slug document with a different logical ID, existing drafts, wrong fixed-ID types, and same ID with a changed slug. Add the minimal pure ownership check and call it for all planned curation and project creations before mutation callbacks.
- [x] Convert draft project seeding to a raw snapshot, pure full plan, withMigration guard and one document transaction. Preserve seed fields/text verbatim. Test dry-run makes zero writes and failures abort before mutation.
- [x] Run `node --experimental-strip-types --test cms/tests/*.test.ts`. No live clients in tests. Report red/green evidence and exact review CLI behavior. Coordinator handles commits.

## Task 2: Reproducibility and deploy gates

Files: `cms/{sanity.config.ts,sanity.cli.ts,.gitignore,.env.example,README.md,package.json,tsconfig.json}`, `app/.env.example`, root `README.md`, `.github/workflows/deploy.yaml`.

- [x] Confirm existing CMS no-emit check fails with TS5097, then set `allowImportingTsExtensions: true` and `noEmit: true`. Add `typecheck: tsc --noEmit` and `test: node --experimental-strip-types --test tests/*.test.ts`.
- [x] Track non-secret Studio and CLI wiring. Both use `process.env.SANITY_STUDIO_PROJECT_ID || 'kp6s20e6'` and `process.env.SANITY_STUDIO_DATASET || 'production'`. Preserve schema/plugin registration. Document private credentials remain out of source.
- [x] Add environment examples and setup commands. Document Node 22.22+ and Yarn 1.22.22, frozen installs, all validation commands, and manifest review restrictions.
- [x] Replace push-only deploy job with PR/main validation and a dependent main-only deploy job. Run frontend test/lint/build and CMS test/typecheck/build. Build frontend using public IDs or repository-variable overrides, upload its build artifact, then deploy that artifact only after validation. Keep GH_PAGES_TOKEN confined to deploy.
- [x] Validate frontend/CMS using installed dependencies and builds. Test frozen installs in a scratch checkout if possible. Do not change machine-wide Node installation if broken.

## Task 3: Integration and commit

- [x] Review requirements first, then independent code-quality/safety review. Resolve all actionable findings and rerun affected tests.
- [x] Run all tests, frontend lint/build, CMS typecheck/build, and `git diff --check`. Confirm workflow dependency and event gates and tracked non-secret configs.
- [x] Compare article schema and source content against scratch baseline. Stage only scoped implementation and necessary existing hardening dependencies, leave unrelated article-schema modifications unstaged.
- [x] Commit scoped changes without pushing. Report actual checks, commit IDs, deferred low-priority audit observations, and unperformed production actions.
