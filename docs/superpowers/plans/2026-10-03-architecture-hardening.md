# Architecture Hardening Implementation Plan

Execution status: the scoped hardening was integrated in `35b48f7`. This original checklist is retained as historical planning, not a current task tracker. See `2026-10-03-architecture-audit-followthrough.md` and `2026-10-04-remaining-frontend-audit.md` for completed follow-through and explicit validation limits. The newer scope deliberately hardens the previously excluded draft-project script while preserving its seed content.

> **For agentic workers:** Use subagent-driven-development or executing-plans. Preserve unrelated local edits and never execute CMS mutations against the live dataset.

**Goal:** Fix the four approved audit findings with local regression tests and reproducible checks.

**Architecture:** Keep React/Vite and Sanity. Add a small shared request hook and service normalization, local route error containment, guarded CMS mutation plans, and tracked non-secret Studio configuration.

**Tech Stack:** TypeScript, React, Vite, Sanity, Vitest with React Testing Library/jsdom, Node test runner for CMS pure helpers.

---

### Task 1: Frontend contract and lifecycle (parallel worker)

Files: `app/src/services/{projectData,articleData,textData,boardData}.ts`, `app/src/pages/{Home,ProjectDetail,BoardDetail,Board,ArticleDetail}.tsx`, `app/src/components/{ContentPage,ErrorBoundary,CollectionList}.tsx`, new request helper and component/service tests, `app/package.json`, `app/yarn.lock`, test configuration.

- [ ] Add Vitest, React Testing Library, and jsdom development dependencies using the existing Yarn lockfile.
- [ ] Write tests for `tags: null`, missing project body, request rejection vs null/empty result, and reversed completion of requests A/B. Confirm expected failures.
- [ ] Normalize project data at the fetch boundary. Preserve optionality in raw types and nullable single-document query results.
- [ ] Implement keyed request state. A changed key must synchronously hide previous data; effect cleanup must prevent stale results after key change/unmount. Share this logic across affected pages without adding runtime dependencies.
- [ ] Wrap page content, not persistent navigation, in a route-resettable error boundary. Verify navigation remains after a render throw and route change recovers.
- [ ] Run `yarn test`, `yarn lint`, and `yarn build` in `app`. Report test-first evidence and changed files. Coordinator commits.

### Task 2: CMS mutation safety and identity (parallel worker)

Files: `cms/scripts/{backfill-board-slugs,update-draft-writeups,mock-board-images,delete-board-item,wipe-board-items,curate-portfolio-20260915}.ts`, new shared migration/slug helpers and `cms/tests/*.test.ts`.

- [ ] Write pure tests before implementation: title collisions including diacritics, draft/published logical identity, existing slug preservation, ambiguous deletion rejection, missing apply/backup, revision conflict, atomic commit construction.
- [ ] Plan changes from complete raw snapshots; preserve current writeup strings and image input lists.
- [ ] Default scripts to dry-run, print target project/dataset and planned documents, require `--apply --backup=<path>` before mutations, create backups exclusively, and guard mutations with expected revisions. Use one document transaction per batch.
- [ ] Generate collision-aware Board slugs deterministically across draft/published pairs. Reject already ambiguous existing slugs instead of silently repairing URLs. Reject ambiguous logical targets for delete-by-slug.
- [ ] Normalize draft/published IDs in curation keep/delete classification. Do not mutate the live dataset to validate.
- [ ] Run `node --experimental-strip-types --test tests/*.test.ts` in `cms` and a no-emit TypeScript check. Coordinator owns package/config/docs and commits.

### Task 3: CMS reproducibility and CI (coordinator)

Files: `cms/{sanity.config.ts,sanity.cli.ts,.gitignore,.env.example,README.md,package.json,tsconfig.json}`, `app/.env.example`, `.github/workflows/deploy.yaml`, root `README.md`.

- [ ] Track existing non-secret Studio/CLI wiring with consistent `SANITY_STUDIO_PROJECT_ID` / `SANITY_STUDIO_DATASET` overrides and preserve project/dataset defaults. Never commit tokens.
- [ ] Document clean-checkout installation, build/typecheck/test commands, environment values, and guarded migration usage.
- [ ] Add CMS typecheck/test scripts compatible with Node 22 and use the shared test files from task 2.
- [ ] Validate both packages on pull requests and main pushes before deployment, use frozen lockfiles, and ensure only a validated main push deploys.
- [ ] Run local app and Studio builds with offline-safe IDs and no content queries. Verify tracked configuration no longer depends on ignored local files.

### Task 4: Integration review and commits

- [ ] Review all diffs and run all tests, app lint, both TypeScript checks/builds, and `git diff --check`.
- [ ] Confirm the original `cms/schemaTypes/article.ts` and unrelated `draft-github-projects.ts` remain untouched. Review in-scope script edits against scratch backups to preserve content.
- [ ] Request independent review for requirements and destructive-edge cases. Fix reported defects and rerun checks.
- [ ] Commit only design, fixes, tests, and configuration. Leave unrelated pre-existing edits unstaged.
- [ ] Report commit IDs and validation, explicitly noting no live migration/deployment occurred.
