import { client } from './sanity';
import { PortableTextContent } from '../types/portableText';

export interface Project {
  _id: string;
  name: string;
  slug: { current: string };
  link: string;
  description: PortableTextContent;
  dates: string;
  date: string;
  tags: string[];
  content: string;
}

export const getProjects = async (): Promise<Project[]> => {
  const query = `*[_type == "project"] | order(date desc) {
      _id,
      name,
      slug,
      link,
      description,
      dates,
      date,
      tags,
      content
    }`;
  return await client.fetch(query);
};

export const getProjectBySlug = async (slug: string): Promise<Project | null> => {
  const query = `*[_type == "project" && slug.current == $slug][0] {
      _id,
      name,
      slug,
      link,
      description,
      dates,
      date,
      tags,
      content
    }`;
  return await client.fetch(query, { slug });
};
