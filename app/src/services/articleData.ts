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
  preview?: boolean;
}

export type ArticleSummary = Pick<
  Article,
  '_id' | 'title' | 'slug' | 'excerpt' | 'date' | 'preview'
>;

// Explicit local preview; never serves sample writing in production.
const previewEnabled =
  import.meta.env.DEV &&
  new URLSearchParams(window.location.search).get('writingPreview') === '1';

export const getArticleSummaries = async (): Promise<ArticleSummary[]> => {
  const query = `*[_type == "article" && defined(slug.current)] | order(date desc, _id asc) {
    _id, title, slug, excerpt, date
  }`;
  const articles = await client.fetch<ArticleSummary[]>(query);
  if (previewEnabled && articles.length === 0) {
    const { writingSamples } = await import('../dev/writingSamples');
    return writingSamples;
  }
  return articles;
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
  const article = await client.fetch<Article | null>(query, { slug });
  if (!article && previewEnabled) {
    const { writingSamples } = await import('../dev/writingSamples');
    return (
      writingSamples.find((sample) => sample.slug.current === slug) ?? null
    );
  }
  return article;
};
