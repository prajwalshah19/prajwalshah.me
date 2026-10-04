// src/services/textData.ts
import { client } from './sanity';
import { PortableTextContent } from '../types/portableText';

export interface RichText {
  _id: string;
  label: string;
  content?: PortableTextContent | null;
}

export interface PlainText {
  _id: string;
  label: string;
  content?: string | null;
}

// Specific functions for each occurrence
export const getBioText = async (): Promise<RichText | null> => {
  const query = `*[_type == "richText" && label == "bio"][0]{
      _id,
      label,
      content
    }`;
  return client.fetch(query);
};

export const getAboutText = async (): Promise<RichText | null> => {
  const query = `*[_type == "richText" && label == "about"][0]{
      _id,
      label,
      content
    }`;
  return client.fetch(query);
};

export const getExperienceText = async (): Promise<RichText | null> => {
  const query = `*[_type == "richText" && label == "experience"][0]{
      _id,
      label,
      content
    }`;
  return client.fetch(query);
};

export const getContactText = async (): Promise<RichText | null> => {
  const query = `*[_type == "richText" && label == "more"][0]{
      _id,
      label,
      content
    }`;
  return client.fetch(query);
};

export const getGithubLink = async (): Promise<PlainText | null> => {
  const query = `*[_type == "plainText" && label == "githubLink"][0]{
      _id,
      label,
      content
    }`;
  return client.fetch(query);
};

export const getLinkedinLink = async (): Promise<PlainText | null> => {
  const query = `*[_type == "plainText" && label == "linkedinLink"][0]{
      _id,
      label,
      content
    }`;
  return client.fetch(query);
};
