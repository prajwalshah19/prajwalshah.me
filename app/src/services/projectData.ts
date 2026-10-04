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

type ProjectDocument = Omit<Project, 'tags' | 'content'> & {
  tags?: unknown;
  content?: string | null;
};

function normalizeProject(project: ProjectDocument): Project {
  return {
    ...project,
    tags: Array.isArray(project.tags)
      ? project.tags.filter((tag): tag is string => typeof tag === 'string')
      : [],
    content: typeof project.content === 'string' ? project.content : '',
  };
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
  const projects = await client.fetch<ProjectDocument[]>(query);
  return projects.map(normalizeProject);
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
  const project = await client.fetch<ProjectDocument | null>(query, { slug });
  return project ? normalizeProject(project) : null;
};
