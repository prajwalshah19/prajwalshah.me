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
  comingSoon?: boolean;
}

export type ArticleSummary = Pick<
  Article,
  '_id' | 'title' | 'slug' | 'excerpt' | 'date' | 'comingSoon'
>;

export const getArticleSummaries = async (): Promise<ArticleSummary[]> => {
  const query = `*[_type == "article" && defined(slug.current)] | order(date desc, _id asc) {
    _id, title, slug, excerpt, date, comingSoon
  }`;
  const articles = await client.fetch<ArticleSummary[]>(query);
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
      comingSoon,
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
      comingSoon,
      content
    }`;
  const article = await client.fetch<Article | null>(query, { slug });
  return article;
};
