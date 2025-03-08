import { client } from "./sanity";

/* eslint-disable @typescript-eslint/no-explicit-any */
export interface Experience {
    _id: string;
    dateRange: string;
    date: string;
    company: string;
    position: string;
    description: any;
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