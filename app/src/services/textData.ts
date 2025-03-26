/* eslint-disable @typescript-eslint/no-explicit-any */
// src/services/textData.ts
import { client } from './sanity';

export interface RichText {
  _id: string;
  label: string;
  content: any; // Typically an array of Portable Text blocks
}

export interface PlainText extends Omit<RichText, 'content'> {
  content: string;
}

// A general function to fetch a text document by its label
export const getRichTextByLabel = async <T extends 'richText' | 'plainText'>(
  label: string,
  type: T = 'richText' as T
): Promise<T extends 'richText' ? RichText : PlainText> => {
  const query = `*[_type == $type && label == $label][0]{
      _id,
      label,
      content
    }`;
  return client.fetch(query, { label, type });
};

// Specific functions for each occurrence
export const getBioText = async (): Promise<RichText> => {
  return getRichTextByLabel('bio');
};

export const getAboutText = async (): Promise<RichText> => {
  return getRichTextByLabel('about');
};

export const getExperienceText = async (): Promise<RichText> => {
  return getRichTextByLabel('experience');
};

export const getContactText = async (): Promise<RichText> => {
  return getRichTextByLabel('more');
};

export const getGithubLink = async (): Promise<PlainText> => {
  return getRichTextByLabel('githubLink', 'plainText');
};

export const getLinkedinLink = async (): Promise<PlainText> => {
  return getRichTextByLabel('linkedinLink', 'plainText');
};
