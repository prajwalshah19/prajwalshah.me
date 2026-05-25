# /board curation — design

**Status:** draft, pending user review
**Date:** 2026-05-25
**Owner:** Prajwal

## Problem

The `/board` page exists in the codebase but is filled with mock content seeded by `cms/scripts/mock-board-images.ts` (Stoner, Pyramid Song, Tokyo in October, Patrick Collison's site, Are.na, etc., with Picsum random images). It cannot ship to main in this state. We need a real, intentional first version curated by Prajwal.

Scope: content + curation rules. **No code or schema changes.** The schema (`cms/schemaTypes/boardItem.ts`), tile rendering (`app/src/components/BoardTile.tsx`), and detail page (`app/src/pages/BoardDetail.tsx`) all stay as-is.

## North star

> A public, privacy-respecting collection of ideas that matter to me right now. Each tile is a thing (book / song / article / quote) anchored by the *idea* it carries. Built to (a) find kindred spirits and (b) be honest enough that future-me isn't embarrassed.

Two purposes, both must hold:
1. **Conversation starter.** A stranger who reads it either recognizes themselves or correctly concludes they don't. The page filters, it doesn't pander.
2. **Self-archive for future-Prajwal.** Things he'd be sad to forget he was into. Gut check on every pick: *would future-me be embarrassed by this?*

Not a diary. Not a CV. Not an all-time canon.

## Hard constraints

- **Privacy-first.** Prajwal is privacy-centric and the page is public:
  - No personally identifying info (home, workplace, friends, family).
  - No tile leaks location, schedule, or social graph.
  - Photo and place types are excluded from v1 (see split below).
- **Currency.** Items reflect what he is on *now*, not all-time. Schema already orders `featured desc, date desc`, so new items pin to top.
- **Idea anchor.** Every tile carries an idea. A book is on the board because of what it taught him, not because he read it. If the idea can't be written in one line, the tile doesn't earn its slot.

## Split (Option A — ideas-only)

15 tiles total, no photos, no places.

| Type | Count | Caption frame |
|------|-------|--------------|
| Book | 3 | what it taught me |
| Article (link) | 3 | why I'd send it to a friend |
| Idea (blurb) | 3 | the idea itself, in my voice |
| Quote | 3 | why it stuck |
| Song | 3 | why it's on rotation |

Counts are a v1 target, not a hard rule — if a category runs short, leave it short rather than padding.

Option B (ideas-first + 1 abstract photo + 1 place-as-idea) was considered and rejected for v1: every photo/place tile would re-litigate the privacy line, and the ideas-only frame is cleaner. Photos/places can be re-introduced later under stricter caption rules if Prajwal wants.

## Content slots — known so far

- **Books (3/3):** Meditations · Thinking Fast and Slow · The Signal and the Noise. Captions: draft options proposed, awaiting Prajwal's picks.
- **Articles (0/3):** TBD
- **Ideas/blurbs (0/3):** TBD
- **Quotes (0/3):** TBD
- **Songs (0/3):** TBD

## Workflow for filling content

One type at a time, in this order: books → ideas → quotes → articles → songs.

Books first because they're already started. Ideas + quotes next because they're the highest-signal idea-anchors and the lowest privacy risk. Articles + songs last because they're discovery-driven and easier to add ad-hoc.

For each item Prajwal supplies, I will:
1. Confirm `title`, `creator` (author/artist/source), `link` (for articles), and `date`.
2. Draft 2–3 caption options in his voice, anchored to the idea, in-the-moment phrasing (not evergreen marketing copy).
3. Wait for him to pick / edit / reject.

All items get `featured: false` for v1 — pinning is reserved for genuinely "front of mind" items, not the launch set.

## Publishing path

Once the 15 items are agreed:
1. Write a Sanity import script under `cms/scripts/` that creates the boardItem documents. Mirror the structure of `cms/scripts/backfill-board-slugs.ts` / `cms/scripts/mock-board-images.ts`.
2. Delete the existing mock items from Sanity (the script can include a "clear existing boardItem documents" step, gated by a flag).
3. Verify locally on `/board` and on each `/board/:slug` detail page.
4. Remove `cms/scripts/mock-board-images.ts` (no longer needed, and its existence invites accidents).
5. Open a PR. Do not merge to main until Prajwal eyeballs the rendered page.

## Out of scope

- Schema changes (types, fields, validation).
- Tile / detail page rendering changes.
- New scripts for ongoing maintenance (add/remove tooling) — defer until the v1 curation is real and pain points are concrete.
- Photo and place tiles — explicitly deferred.
- Auto-pinning, hide-old logic, archive view — defer until the board has enough items for those problems to be real.

## Open questions

- Final picks for books captions (3 sets of options already drafted).
- Whether `featured` should ever flip to true on launch, or stay all-false until a genuinely "front of mind" item lands later.
