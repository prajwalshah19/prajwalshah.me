# Portfolio CMS

Sanity Studio, schemas, and maintenance scripts for the portfolio. Use Node 22.22.2 and Yarn Classic 1.22.22, matching CI.

```sh
yarn install --frozen-lockfile
# Only if .env does not already exist:
cp .env.example .env
yarn dev
```

`sanity.config.ts` and `sanity.cli.ts` are tracked and use the same `SANITY_STUDIO_PROJECT_ID` / `SANITY_STUDIO_DATASET` overrides. Defaults preserve the existing public project and production dataset. These are not credentials. Never add tokens to `SANITY_STUDIO_*` variables, source files, or review manifests. Use the CLI's authenticated session when intentionally running maintenance. Automatic Studio updates are disabled so the deployed version matches the tested lockfile.

## Local checks

```sh
yarn test
yarn typecheck
yarn build
```

Tests run pure planners and fake mutations, without live CMS access. Temporary backup fixtures are removed after testing. The build does not execute maintenance scripts.

## Maintenance is plan first, apply second

Mutation scripts default to dry-run, reading a raw snapshot and printing their target and planned document changes. A dry-run requires read access but does not upload assets or write content. For example, from `cms/`:

```sh
yarn sanity exec scripts/backfill-board-slugs.ts --with-user-token
```

After reviewing the plan, an intentional apply requires all of:

```sh
yarn sanity exec scripts/backfill-board-slugs.ts --with-user-token -- \
  --apply --target=kp6s20e6/production --backup=/secure/path/new-backup.json
```

Use your actual target, not blindly the example. Backups must be new paths, are created before mutations with restrictive permissions, and contain content snapshots. Store them outside the repository. Existing files are never overwritten. Patches/deletions check snapshot revisions and document mutations are submitted together. A conflict requires a fresh dry-run and review, not removal of revision guards.

The same apply/backup/target requirements cover `delete-board-item.ts`, `wipe-board-items.ts`, `update-draft-writeups.ts`, `mock-board-images.ts`, and `draft-github-projects.ts`. Keep any script-specific arguments: deletion takes a slug, and image replacement additionally requires `--replace-images`. Project drafting preserves existing logical draft/published records and does not publish drafts.

## Extra review for portfolio curation

`curate-portfolio-20260915.ts` proposes replacing Board content other than its retained pins. A familiar slug is **not** authorization to delete a document. Run a dry-run, inspect the actual content in Studio, and explicitly approve each exact draft/published record and revision in a separate JSON review file:

```json
{
  "target": "kp6s20e6/production",
  "documents": [
    {"_id": "reviewed-document-id", "_rev": "reviewed-current-revision"},
    {"_id": "drafts.reviewed-document-id", "_rev": "reviewed-draft-revision"}
  ]
}
```

The IDs/revisions above are placeholders, not permission to delete anything. Do not generate approval by blindly piping the dry-run output into an apply command. If a proposed deletion is not intended, stop and revise the curation scope. The review must match the complete deletion candidate set: missing, duplicate, unexpected, or stale entries and wrong targets abort the operation. Drafts and published versions require separate entries. An empty candidate set still requires a review with `"documents": []` when applying.

```sh
yarn sanity exec scripts/curate-portfolio-20260915.ts --with-user-token -- \
  --apply --target=kp6s20e6/production \
  --review=/secure/path/review.json \
  --backup=/secure/path/new-backup.json \
  --assets=/path/to/reviewed/images
```

Creation plans check both fixed document identity and slug ownership across draft/published variants before writes. A different document owning the intended slug aborts instead of creating an ambiguous route. These are snapshot checks, not a database uniqueness constraint: avoid concurrent editors/importers creating the same slug while applying, and recheck content afterward. Existing unrelated duplicates are not automatically repaired.

Image uploads cannot be part of the document transaction. A later failure can leave unreferenced assets, but document revision guards and atomic mutations remain in place. Review assets separately rather than automatically deleting them on failure. No live migration or deployment is performed by tests or CI.
