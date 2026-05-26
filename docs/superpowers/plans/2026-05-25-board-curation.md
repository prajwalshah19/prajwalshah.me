# /board curation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace mock content on `/board` with a real, curated v1 set (15 tiles, ideas-only) collected through a structured interview with Prajwal, then ship via a one-off Sanity seed script.

**Architecture:** This plan is mostly content collection, not engineering. Phase 1 is 5 sequential interview tasks, one per content type (book / idea / quote / article / song). Each interview task appends entries to a single content manifest file. Phase 2 is the engineering tail: a one-off Sanity seed script that wipes existing `boardItem` documents and inserts the manifest, then local verification, then a PR.

**Tech Stack:** Sanity CMS (`@sanity/cli` `getCliClient`), TypeScript, existing schema at `cms/schemaTypes/boardItem.ts`, existing tile rendering at `app/src/components/BoardTile.tsx`.

**Reference spec:** `docs/superpowers/specs/2026-05-25-board-curation-design.md`

---

## Pre-flight: read before starting

- Read the spec end-to-end: `docs/superpowers/specs/2026-05-25-board-curation-design.md`
- Read the schema: `cms/schemaTypes/boardItem.ts` (canonical source for field names + validation)
- Read existing scripts for the Sanity client pattern: `cms/scripts/backfill-board-slugs.ts`, `cms/scripts/mock-board-images.ts`
- Read the tile renderer to understand which fields show up where: `app/src/components/BoardTile.tsx`

## Pre-flight: branch setup

Prajwal's repo currently has a pile of uncommitted board-feature work on `main` (per `git status` at the start of this work). That work also has not been pushed. This plan's output should land in a single PR alongside that work, **never** pushed directly to `main`.

- [ ] **Step 1: Confirm branch and working tree state with Prajwal.** Show him `git status` and `git branch --show-current`. Confirm whether to:
  - (a) Cut a feature branch from current `main` HEAD that carries both the in-progress board feature work AND the curation work, or
  - (b) Stash/separate the board-feature work and put curation on its own branch.

  Default recommendation: **(a)** — the board feature and its first real content belong together in one PR. The spec is already committed on `main` and is fine to stay there.

- [ ] **Step 2: Create the branch.** Example for option (a):

  ```bash
  git switch -c board-v1-content
  ```

  Do NOT push yet. All Phase 1 commits land on this branch.

## File map

| Path | Created/Modified | Purpose |
|------|------------------|---------|
| `cms/scripts/board-v1-content.ts` | Create | Pure data: array of v1 board items. Hand-edited as interview rounds complete. |
| `cms/scripts/seed-board-v1.ts` | Create | One-off Sanity import: wipe existing `boardItem` docs, insert v1 content from the manifest. |
| `cms/scripts/mock-board-images.ts` | Delete | Old mock seeder. Removed after v1 is live so nobody re-runs it. |

No app code or schema changes. The split between manifest (`board-v1-content.ts`) and importer (`seed-board-v1.ts`) keeps content reviewable as a flat list and lets the importer be tested independently.

---

## Phase 1 — Content interviews

Each task in this phase follows the same structure:

1. Read the spec's caption frame for this type.
2. Ask Prajwal for items, **one type at a time**, **never propose all-time classics** — ask what he's currently engaged with.
3. For each item, draft 2–3 caption options anchored to the idea, in his voice, in-the-moment phrasing.
4. Wait for him to pick / edit / reject.
5. Append the final item entries to `cms/scripts/board-v1-content.ts`.
6. Commit (no push).

Caption discipline (from spec, repeated here so each task is self-contained):
- **Book** → what it taught me
- **Idea/blurb** → the idea itself, in my voice
- **Quote** → why it stuck
- **Article** → why I'd send it to a friend
- **Song** → why it's on rotation

Order is intentional: books first (already started), ideas + quotes next (highest-signal anchors, lowest privacy risk), articles + songs last (discovery-driven, easier to drop in ad-hoc).

---

### Task 1: Create the empty content manifest

**Files:**
- Create: `cms/scripts/board-v1-content.ts`

- [ ] **Step 1: Write the manifest with shared types and an empty `CONTENT` array.**

```typescript
// cms/scripts/board-v1-content.ts
// Hand-edited as interview rounds complete. Consumed by seed-board-v1.ts.

export type BoardType =
  | 'photo'
  | 'book'
  | 'quote'
  | 'song'
  | 'place'
  | 'blurb'
  | 'link'
  | 'other'

export interface BoardItemInput {
  /** Used as document _id (prefix avoids collisions with auto-generated ids). */
  key: string
  title: string
  type: BoardType
  creator?: string
  caption?: string
  link?: string
  /** ISO date (YYYY-MM-DD). v1 launch date for all items. */
  date: string
  featured?: boolean
}

export const LAUNCH_DATE = '2026-05-25'

export const CONTENT: BoardItemInput[] = [
  // Filled in across Tasks 2–6.
]
```

- [ ] **Step 2: Commit.**

```bash
git add cms/scripts/board-v1-content.ts
git commit -m "scaffold board v1 content manifest"
```

---

### Task 2: Books interview (3 items)

**Files:**
- Modify: `cms/scripts/board-v1-content.ts` (append to `CONTENT`)

Books already named (from brainstorming): **Meditations** (Marcus Aurelius), **Thinking Fast and Slow** (Daniel Kahneman), **The Signal and the Noise** (Nate Silver). Draft caption options already proposed; finalize them.

- [ ] **Step 1: Confirm the 3 titles are still current.** Ask Prajwal: "Still these three, or swap any?" Capture changes.

- [ ] **Step 2: For each book, present 2–3 caption options anchored to "what it taught me."** Already drafted for the original three — re-present and ask him to pick / edit / reject for each.

- [ ] **Step 3: Append 3 book entries to `CONTENT` in `cms/scripts/board-v1-content.ts`.**

Use slugs derived from titles (e.g. `meditations`, `thinking-fast-and-slow`, `the-signal-and-the-noise`). Format:

```typescript
{
  key: 'book-meditations',
  title: 'Meditations',
  type: 'book',
  creator: 'Marcus Aurelius',
  caption: '<finalized line>',
  date: LAUNCH_DATE,
},
```

- [ ] **Step 4: Sanity check the entries.** Read the file back. Confirm 3 book items, each has a `caption`, no `link`, no `featured: true`.

- [ ] **Step 5: Commit.**

```bash
git add cms/scripts/board-v1-content.ts
git commit -m "add 3 books to board v1 content"
```

---

### Task 3: Ideas interview (3 items)

**Files:**
- Modify: `cms/scripts/board-v1-content.ts`

Type `blurb`. Caption frame: the idea itself, in his voice. These are the highest-signal idea-anchors — short claims he's currently chewing on. Schema field used: `title` is the idea (one line), `caption` is an optional one-line elaboration.

- [ ] **Step 1: Ask Prajwal for 3 ideas he's currently sitting with.** Frame: "an idea you've found yourself saying, defending, or coming back to in the last few weeks." Privacy check on each: nothing that reveals workplace project specifics, friends, or coordinates.

- [ ] **Step 2: For each idea, draft 2–3 phrasings.** The `title` should be the punchy one-line claim. Offer alternatives for tightness/clarity. The `caption` (optional) is a one-line "why this matters" or example. Let him pick.

- [ ] **Step 3: Append 3 blurb entries to `CONTENT`.** Use slug-friendly keys like `idea-<short-handle>`.

```typescript
{
  key: 'idea-<handle>',
  title: '<one-line idea>',
  type: 'blurb',
  caption: '<optional one-line elaboration, or omit>',
  date: LAUNCH_DATE,
},
```

- [ ] **Step 4: Privacy re-read.** Scan all 3 idea entries — would any of them reveal something Prajwal doesn't want public? Surface concerns; remove or rephrase if any.

- [ ] **Step 5: Commit.**

```bash
git add cms/scripts/board-v1-content.ts
git commit -m "add 3 ideas to board v1 content"
```

---

### Task 4: Quotes interview (3 items)

**Files:**
- Modify: `cms/scripts/board-v1-content.ts`

Type `quote`. Caption frame: why it stuck. Schema: `title` is the quote text, `creator` is the attribution, `caption` is his short note on why it landed.

- [ ] **Step 1: Ask Prajwal for 3 quotes he's currently sitting with.** Frame: "a line you've recently sent to someone, or repeated to yourself, or that's been on a sticky note." Privacy check: source must be a public figure or text, not a friend / colleague / family member.

- [ ] **Step 2: Confirm attribution for each.** If he's unsure of attribution, look it up (web search ok for confirming author/source of a public quote). Never invent an attribution.

- [ ] **Step 3: Draft 2–3 "why it stuck" caption options per quote.** Anchored to what the quote *does* for him in the present, not abstract analysis.

- [ ] **Step 4: Append 3 quote entries to `CONTENT`.**

```typescript
{
  key: 'quote-<short-handle>',
  title: '<the quote, no surrounding quote marks — the tile adds them>',
  type: 'quote',
  creator: '<attribution>',
  caption: '<why it stuck, in his voice>',
  date: LAUNCH_DATE,
},
```

Note: `BoardTile.tsx:111` already wraps the title in `"…"`, so don't double-wrap in the data.

- [ ] **Step 5: Commit.**

```bash
git add cms/scripts/board-v1-content.ts
git commit -m "add 3 quotes to board v1 content"
```

---

### Task 5: Articles interview (3 items)

**Files:**
- Modify: `cms/scripts/board-v1-content.ts`

Type `link`. Caption frame: why he'd send it to a friend. Required field: `link` (URL).

- [ ] **Step 1: Ask Prajwal for 3 articles/essays he's read recently and wants to point at.** Privacy check: the URL itself is public; if the URL leaks anything personal (a private doc, a workspace-internal link), drop it.

- [ ] **Step 2: For each, capture `title`, `creator` (author), and `link`.** Confirm the URL works (open in browser or curl head check). If the article has a clean canonical URL, prefer that over a tracking-laden share link.

- [ ] **Step 3: Draft 2–3 caption options per article anchored to "why I'd send this to a friend."** Conversational, not summary. ("It changed how I think about X" beats "An essay on X.")

- [ ] **Step 4: Append 3 link entries to `CONTENT`.**

```typescript
{
  key: 'article-<short-handle>',
  title: '<article title>',
  type: 'link',
  creator: '<author>',
  caption: '<why send it to a friend>',
  link: '<canonical url>',
  date: LAUNCH_DATE,
},
```

- [ ] **Step 5: Commit.**

```bash
git add cms/scripts/board-v1-content.ts
git commit -m "add 3 articles to board v1 content"
```

---

### Task 6: Songs interview (3 items)

**Files:**
- Modify: `cms/scripts/board-v1-content.ts`

Type `song`. Caption frame: why it's on rotation. Schema: `title` is the song name, `creator` is the artist, `caption` is the rotation reason.

- [ ] **Step 1: Ask Prajwal for 3 songs on rotation right now.** Frame: "songs you've actually replayed in the last 2–3 weeks, not desert-island picks."

- [ ] **Step 2: For each, capture `title` and `creator` (artist).** Optionally a `link` to a Spotify/YouTube/Apple Music URL — but only if Prajwal wants visitors to be able to listen. Default: no link.

- [ ] **Step 3: Draft 2–3 "why it's on rotation" captions per song.** What the song *does* in the moment — drive, focus, evening wind-down, etc. Avoid music-critic vocabulary unless that's his voice.

- [ ] **Step 4: Append 3 song entries to `CONTENT`.**

```typescript
{
  key: 'song-<short-handle>',
  title: '<song title>',
  type: 'song',
  creator: '<artist>',
  caption: '<why on rotation>',
  date: LAUNCH_DATE,
  // link: '<optional streaming url>',
},
```

- [ ] **Step 5: Verify the full manifest.** Read `cms/scripts/board-v1-content.ts` end-to-end. Confirm: exactly 15 entries, 3 per type, every entry has a `caption`, no entry has `featured: true`, all `key`s are unique.

- [ ] **Step 6: Commit.**

```bash
git add cms/scripts/board-v1-content.ts
git commit -m "add 3 songs to board v1 content; manifest complete"
```

---

## Phase 2 — Publish

### Task 7: Write the seed script

**Files:**
- Create: `cms/scripts/seed-board-v1.ts`

The seed script does two things in sequence: (a) deletes all existing `boardItem` documents (the mocks), then (b) creates new documents from `CONTENT`. Both steps gated by a `--apply` flag — running without `--apply` is a dry run that prints what would happen.

- [ ] **Step 1: Write the seed script.**

```typescript
// cms/scripts/seed-board-v1.ts
// One-off importer: wipes existing boardItem documents, then inserts v1 content
// from cms/scripts/board-v1-content.ts.
//
// Dry run (default):  sanity exec scripts/seed-board-v1.ts
// Apply:              sanity exec scripts/seed-board-v1.ts --apply
import {getCliClient} from 'sanity/cli'
import {CONTENT, type BoardItemInput} from './board-v1-content'

function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 96)
}

function toDoc(item: BoardItemInput) {
  return {
    _id: `boardItem.${item.key}`,
    _type: 'boardItem',
    title: item.title,
    slug: {_type: 'slug', current: slugify(item.title)},
    type: item.type,
    ...(item.creator ? {creator: item.creator} : {}),
    ...(item.caption ? {caption: item.caption} : {}),
    ...(item.link ? {link: item.link} : {}),
    date: item.date,
    featured: item.featured ?? false,
  }
}

async function main() {
  const apply = process.argv.includes('--apply')
  const client = getCliClient()

  const existing: {_id: string; title: string}[] = await client.fetch(
    `*[_type == "boardItem"]{_id, title}`,
  )

  console.log(`Existing boardItem docs: ${existing.length}`)
  for (const e of existing) console.log(`  will delete: ${e._id}  (${e.title})`)

  const docs = CONTENT.map(toDoc)
  console.log(`\nNew boardItem docs to create: ${docs.length}`)
  for (const d of docs) console.log(`  will create: ${d._id}  (${d.title})`)

  if (!apply) {
    console.log('\nDry run — re-run with --apply to execute.')
    return
  }

  for (const e of existing) {
    await client.delete(e._id)
    console.log(`✗ deleted ${e._id}`)
  }

  for (const d of docs) {
    await client.createOrReplace(d)
    console.log(`✓ created ${d._id}`)
  }

  console.log('\nDone.')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
```

- [ ] **Step 2: Commit.**

```bash
git add cms/scripts/seed-board-v1.ts
git commit -m "add board v1 seed script (dry-run by default)"
```

---

### Task 8: Dry run the seed script

**Files:** none modified.

- [ ] **Step 1: Confirm the target Sanity dataset with Prajwal before running anything.** Run:

  ```bash
  cd cms && cat sanity.cli.ts sanity.config.ts 2>/dev/null | grep -E 'dataset|projectId'
  ```

  Whatever dataset is configured is the one this script will write to. If there's a `development` dataset, prefer pointing at it first by overriding (`SANITY_STUDIO_DATASET=development`). If Prajwal only has `production`, that's where the seed runs — flag this explicitly because it modifies the live dataset.

- [ ] **Step 2: Run the dry run from the `cms/` directory.**

```bash
cd cms && yarn sanity exec scripts/seed-board-v1.ts
```

Expected output:
- A list of existing `boardItem` docs that *would* be deleted (likely ~9 from the mock seed plus anything else hand-added).
- A list of 15 new `boardItem` docs that *would* be created.
- Final line: `Dry run — re-run with --apply to execute.`

- [ ] **Step 3: Show the dry-run output to Prajwal.** Confirm the deletion list matches expectations and the create list is the 15 items he agreed to. **DO NOT proceed to apply without explicit confirmation.**

---

### Task 9: Apply the seed

**Files:** none modified (Sanity dataset only).

- [ ] **Step 1: After explicit Prajwal confirmation, apply.**

```bash
cd cms && yarn sanity exec scripts/seed-board-v1.ts --apply
```

Expected: one `✗ deleted` line per existing doc, then one `✓ created` line per new doc, then `Done.`

- [ ] **Step 2: Verify in Sanity.** Quick re-query from the script itself or via the Studio (`yarn dev` in `cms/` and open the Board Item list). Expected: exactly 15 documents, no mocks.

---

### Task 10: Local verification of `/board` and `/board/:slug`

**Files:** none modified.

- [ ] **Step 1: Run the app locally.**

```bash
cd app && yarn dev
```

- [ ] **Step 2: Open `/board` in a browser.** Verify:
  - 15 tiles render
  - Each tile shows its caption
  - Quote tiles are wrapped in `"…"` exactly once (not double-wrapped)
  - Article tiles show an "Open" affordance and open in a new tab when clicked
  - No tile is broken (missing fields → empty render is acceptable, but no React errors in console)

- [ ] **Step 3: Spot-check 2–3 detail pages by clicking through any tile that has long-form content (none expected in v1, but verify the route still works for the slug).** Visit one slug directly, e.g. `/board/meditations`, and confirm the detail page renders with title, type, creator, date.

- [ ] **Step 4: Privacy re-read of the rendered page.** Read the full board as a stranger would. Surface anything that feels too personal or revealing. If anything fails the check, fix the manifest, re-run the seed, re-verify.

---

### Task 11: Remove the old mock script

**Files:**
- Delete: `cms/scripts/mock-board-images.ts`

The script is now both unused and dangerous (re-running it would re-add mock items and re-attach Picsum images to slugs that no longer match v1 content).

- [ ] **Step 1: Delete the file.**

```bash
git rm cms/scripts/mock-board-images.ts
```

- [ ] **Step 2: Confirm `backfill-board-slugs.ts` is still kept.** It's idempotent and harmless; leave it as a utility for future hand-added items that forget a slug.

- [ ] **Step 3: Commit.**

```bash
git commit -m "remove mock-board-images.ts; v1 content is live"
```

---

### Task 12: Open the PR (do not merge)

**Files:** none modified.

- [ ] **Step 1: Push the branch created in pre-flight.**

```bash
git push -u origin board-v1-content
```

(Replace `board-v1-content` if a different name was chosen in pre-flight.)

- [ ] **Step 2: Open a PR with `gh pr create` against `main`.** Title: `add /board v1 curated content`. Body should:
  - Link the spec (`docs/superpowers/specs/2026-05-25-board-curation-design.md`)
  - List the 15 items grouped by type (titles only — do not include full captions in the PR body if they feel personal; the curated content is meant for the rendered page, not the PR history)
  - Note that the Sanity dataset has already been updated (the seed script ran)
  - Include the test plan: open `/board`, spot-check tiles, privacy re-read

- [ ] **Step 3: STOP.** Per the spec and Prajwal's instruction: **do not merge to main.** Wait for Prajwal to eyeball the rendered page (deployed preview or local) and approve.

---

## Self-review checklist (for the executor)

After Task 6 (manifest complete) and before Task 7 (seed script), pause and re-read the spec's "Hard constraints" section. Walk the full manifest against it:

- **Privacy:** Does any entry leak location, schedule, social graph, workplace specifics, or family/friend names?
- **Currency:** Is every entry something Prajwal is on *now*, not an all-time pick?
- **Idea anchor:** Does every entry have a caption that articulates the *idea*? Books that just list the book, quotes without a "why," songs that read like a music-review tagline — all fail the anchor test.

If anything fails, fix the manifest before proceeding to Phase 2.

After Task 10 (local verification), do the same privacy re-read as a stranger reading the page cold.
