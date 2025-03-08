/* eslint-disable @typescript-eslint/no-explicit-any */

import { client } from "./sanity";

export interface Article {
    _id: string;
    title: string;
    excerpt: any;
    date: string;
    link: string;
  }
  
  export const getArticles = async (): Promise<Article[]> => {
    const query = `*[_type == "article"] | order(date desc) {
      _id,
      title,
      excerpt,
      date,
      link
    }`;
    return await client.fetch(query);
  };