import { client } from './sanity';
import { PortableTextContent } from '../types/portableText';

export interface Experience {
  _id: string;
  dateRange: string;
  date: string;
  company: string;
  position: string;
  description: PortableTextContent;
  location?: string;
}

export const getExperiences = async (): Promise<Experience[]> => {
  const query = `*[_type == "experience"] | order(date desc){
      _id,
      dateRange,
      company,
      position,
      date,
      description,
      location
    }`;
  return await client.fetch(query);
};
