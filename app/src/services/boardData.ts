import { client } from './sanity';
import { PortableTextContent } from '../types/portableText';

export type BoardType =
  | 'photo'
  | 'book'
  | 'quote'
  | 'song'
  | 'place'
  | 'blurb'
  | 'link'
  | 'other';

export interface BoardItem {
  _id: string;
  title: string;
  slug?: { current: string };
  type: BoardType;
  imageAssetRef?: string;
  creator?: string;
  caption?: string;
  body?: PortableTextContent;
  markdown?: string;
  link?: string;
  date: string;
  featured?: boolean;
}

const BOARD_ITEM_PROJECTION = `{
  _id,
  title,
  slug,
  type,
  "imageAssetRef": image.asset._ref,
  creator,
  caption,
  body,
  markdown,
  link,
  date,
  featured
}`;

export const getBoardItems = async (): Promise<BoardItem[]> => {
  const query = `*[_type == "boardItem"] | order(featured desc, date desc) ${BOARD_ITEM_PROJECTION}`;
  return await client.fetch(query);
};

export const getBoardPreviewItems = async (): Promise<BoardItem[]> => {
  const query = `*[_type == "boardItem"] | order(date desc, _id asc) [0...6] ${BOARD_ITEM_PROJECTION}`;
  return await client.fetch(query);
};

export const getBoardItemBySlug = async (
  slug: string
): Promise<BoardItem | null> => {
  const query = `*[_type == "boardItem" && slug.current == $slug][0] ${BOARD_ITEM_PROJECTION}`;
  return await client.fetch(query, { slug });
};

const projectId =
  (import.meta.env.VITE_SANITY_PROJECT_ID as string | undefined) || '';
const dataset =
  (import.meta.env.VITE_SANITY_DATASET as string | undefined) || '';

/**
 * Convert a Sanity image asset _ref ("image-abc123-1920x1080-jpg") to a CDN URL.
 * Returns null when the ref is missing or unparseable.
 */
export function imageUrlFromRef(ref: string | undefined): string | null {
  if (!ref) return null;
  const match = ref.match(/^image-([a-f0-9]+)-(\d+x\d+)-(\w+)$/);
  if (!match) return null;
  const [, id, dims, ext] = match;
  return `https://cdn.sanity.io/images/${projectId}/${dataset}/${id}-${dims}.${ext}`;
}
