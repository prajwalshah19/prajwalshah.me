/* eslint-disable @typescript-eslint/no-explicit-any */
import { client } from './sanity';

export interface Project {
  _id: string;
  name: string;
  link: string;
  description: any; // Typically, this would be an array of Portable Text blocks
  dates: string;
  date: string;
  tags: string[];
  content: string;
}

export const getProjects = async (): Promise<Project[]> => {
  const query = `*[_type == "project"] | order(date desc) {
      _id,
      name,
      link,
      description,
      dates,
      date,
      tags,
      content
    }`;
  return await client.fetch(query);
};
