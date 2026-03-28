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

export const getArticleBySlug = async (slug: string): Promise<Article | null> => {
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
