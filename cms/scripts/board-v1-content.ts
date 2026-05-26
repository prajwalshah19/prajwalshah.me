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
  /** Used as document _id suffix; must be unique across CONTENT. */
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

export const LAUNCH_DATE = '2026-05-26'

export const CONTENT: BoardItemInput[] = [
  // Filled in across Tasks 2–6.
]
