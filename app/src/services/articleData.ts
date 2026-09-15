import { client } from './sanity';
import { PortableTextContent } from '../types/portableText';

export interface Article {
  _id: string;
  title: string;
  slug: { current: string };
  excerpt: PortableTextContent;
  date: string;
  link: string;
  content: string;
}

export type ArticleSummary = Pick<
  Article,
  '_id' | 'title' | 'slug' | 'excerpt' | 'date'
>;

export const getArticleSummaries = async (
  limit?: number
): Promise<ArticleSummary[]> => {
  const slice = limit === undefined ? '' : '[0...$limit]';
  const query = `*[_type == "article" && defined(slug.current)] | order(date desc, _id asc) ${slice} {
    _id, title, slug, excerpt, date
  }`;
  return client.fetch(query, limit === undefined ? {} : { limit });
};

export const getArticles = async (): Promise<Article[]> => {
  const query = `*[_type == "article"] | order(date desc) {
      _id,
      title,
      slug,
      excerpt,
      date,
      link,
      content
    }`;
  return await client.fetch(query);
};

export const getArticleBySlug = async (
  slug: string
): Promise<Article | null> => {
  const query = `*[_type == "article" && slug.current == $slug][0] {
      _id,
      title,
      slug,
      excerpt,
      date,
      link,
      content
    }`;
  return await client.fetch(query, { slug });
};
