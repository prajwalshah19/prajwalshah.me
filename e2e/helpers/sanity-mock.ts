import { Page } from '@playwright/test';
import {
  mockBioText,
  mockAboutText,
  mockExperienceText,
  mockContactText,
  mockGithubLink,
  mockLinkedinLink,
  mockExperiences,
  mockProjects,
  mockArticles,
} from '../fixtures/sanity-data';

/**
 * Intercepts all Sanity API requests and returns mock data based on the GROQ query.
 */
export async function mockSanityAPI(page: Page) {
  await page.route('**/api.sanity.io/**', async (route) => {
    const url = route.request().url();
    const decodedUrl = decodeURIComponent(url);

    let responseData: unknown = null;

    // Match based on query content in the URL
    if (decodedUrl.includes('_type == "project"') || decodedUrl.includes('%22project%22')) {
      responseData = { result: mockProjects };
    } else if (decodedUrl.includes('_type == "article"') || decodedUrl.includes('%22article%22')) {
      responseData = { result: mockArticles };
    } else if (decodedUrl.includes('_type == "experience"') || decodedUrl.includes('%22experience%22')) {
      responseData = { result: mockExperiences };
    } else if (decodedUrl.includes('label == "bio"') || decodedUrl.includes('%22bio%22')) {
      responseData = { result: mockBioText };
    } else if (decodedUrl.includes('label == "about"') || decodedUrl.includes('%22about%22')) {
      responseData = { result: mockAboutText };
    } else if (decodedUrl.includes('label == "experience"') || decodedUrl.includes('%22experience%22')) {
      // If it's fetching the experience text (not the experience list)
      if (decodedUrl.includes('richText') || decodedUrl.includes('plainText')) {
        responseData = { result: mockExperienceText };
      } else {
        responseData = { result: mockExperiences };
      }
    } else if (decodedUrl.includes('label == "more"') || decodedUrl.includes('%22more%22')) {
      responseData = { result: mockContactText };
    } else if (decodedUrl.includes('githubLink') || decodedUrl.includes('label == "githubLink"')) {
      responseData = { result: mockGithubLink };
    } else if (decodedUrl.includes('linkedinLink') || decodedUrl.includes('label == "linkedinLink"')) {
      responseData = { result: mockLinkedinLink };
    } else {
      // Default: return empty result
      responseData = { result: null };
    }

    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(responseData),
    });
  });
}
