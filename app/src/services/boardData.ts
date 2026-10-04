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

export type BoardItemSummary = Omit<BoardItem, 'markdown'> & { hasDetail: boolean };

const BOARD_ITEM_FIELDS = `
  _id,
  title,
  slug,
  type,
  "imageAssetRef": image.asset._ref,
  creator,
  caption,
  body,
  link,
  date,
  featured`;

export const getBoardItems = async (): Promise<BoardItemSummary[]> => {
  const query = `*[_type == "boardItem"] | order(featured desc, date desc, _id asc) {
    ${BOARD_ITEM_FIELDS},
    "hasDetail": coalesce(length(markdown) > 0 || count(body) > 0, false)
  }`;
  return await client.fetch(query);
};

export const getBoardItemBySlug = async (
  slug: string
): Promise<BoardItem | null> => {
  const query = `*[_type == "boardItem" && slug.current == $slug][0] {
    ${BOARD_ITEM_FIELDS},
    markdown
  }`;
  return await client.fetch(query, { slug });
};

const projectId =
  (import.meta.env.VITE_SANITY_PROJECT_ID as string | undefined) || '';
const dataset =
  (import.meta.env.VITE_SANITY_DATASET as string | undefined) || '';

function imageAssetFromRef(ref: string | undefined) {
  if (!ref) return null;
  const match = ref.match(/^image-([a-zA-Z0-9]+)-(\d+)x(\d+)-(\w+)$/);
  if (!match) return null;
  const [, id, rawWidth, rawHeight, ext] = match;
  const width = Number(rawWidth);
  const height = Number(rawHeight);
  if (!Number.isSafeInteger(width) || !Number.isSafeInteger(height) || width <= 0 || height <= 0) return null;
  return {
    width, height,
    transformable: ['jpg', 'jpeg', 'pjpg', 'png', 'webp', 'tif', 'tiff', 'avif', 'gif'].includes(ext.toLowerCase()),
    url: `https://cdn.sanity.io/images/${projectId}/${dataset}/${id}-${rawWidth}x${rawHeight}.${ext}`,
  };
}

/** Request a bounded raster image rather than the original upload. */
export function imageUrlFromRef(ref: string | undefined, width = 640): string | null {
  const asset = imageAssetFromRef(ref);
  if (!asset || !Number.isSafeInteger(width) || width <= 0) return null;
  if (!asset.transformable) return asset.url;
  return `${asset.url}?w=${Math.min(width, asset.width)}&fit=max&auto=format&q=80`;
}

export function responsiveImageFromRef(ref: string | undefined, detail = false) {
  const asset = imageAssetFromRef(ref);
  if (!asset) return null;
  if (!asset.transformable) return { src: asset.url, width: asset.width, height: asset.height };
  const widths = [...new Set((detail ? [640, 960, 1280, 1920] : [320, 640, 960, 1280])
    .map((width) => Math.min(width, asset.width)))];
  return {
    src: imageUrlFromRef(ref, detail ? 1280 : 640)!,
    srcSet: widths.map((width) => `${imageUrlFromRef(ref, width)} ${width}w`).join(', '),
    sizes: detail
      ? '(min-width: 672px) 624px, calc(100vw - 48px)'
      : '(min-width: 640px) 280px, calc(100vw - 74px)',
    width: asset.width,
    height: asset.height,
  };
}
