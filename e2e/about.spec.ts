import { test, expect } from '@playwright/test';
import { mockSanityAPI } from './helpers/sanity-mock';

test.beforeEach(async ({ page }) => {
  await mockSanityAPI(page);
});

test.describe('About Page', () => {
  test('page loads with content wrapper', async ({ page }) => {
    await page.goto('/about');
    // Menu button should be visible (ContentPage wrapper)
    const menuButton = page.locator('button[aria-label="Open menu"], button[aria-label="Close menu"]');
    await expect(menuButton).toBeVisible();
  });

  test('about text content is visible', async ({ page }) => {
    await page.goto('/about');
    await expect(page.getByText('A bit about me...')).toBeVisible();
    // Wait for Sanity content to load
    await expect(page.getByText(/passionate about technology/i)).toBeVisible({ timeout: 10000 });
  });

  test('experience timeline section is visible', async ({ page }) => {
    await page.goto('/about');
    await expect(page.getByText('My Journey')).toBeVisible({ timeout: 10000 });
  });

  test('timeline entries show position, company, and date range', async ({ page }) => {
    await page.goto('/about');
    // Wait for experience data to load
    await expect(page.getByText('Software Engineering Intern')).toBeVisible({ timeout: 10000 });
    await expect(page.getByText('Tech Corp')).toBeVisible();
    await expect(page.getByText('Jun 2024 - Aug 2024')).toBeVisible();
    await expect(page.getByText('San Francisco, CA')).toBeVisible();
  });

  test('timeline shows multiple entries', async ({ page }) => {
    await page.goto('/about');
    await expect(page.getByText('Software Engineering Intern')).toBeVisible({ timeout: 10000 });
    await expect(page.getByText('Data Science Intern')).toBeVisible();
    await expect(page.getByText('Frontend Developer')).toBeVisible();
  });

  test('MiniSocialLinks are visible', async ({ page }) => {
    await page.goto('/about');
    // MiniSocialLinks should show github and linkedin
    await expect(page.getByText('github').first()).toBeVisible({ timeout: 10000 });
    await expect(page.getByText('linkedin').first()).toBeVisible();
  });

  test('experience callout button is visible', async ({ page }) => {
    await page.goto('/about');
    await expect(page.getByText('My experience')).toBeVisible({ timeout: 10000 });
  });

  test('experience callout scrolls to experience section', async ({ page }) => {
    await page.goto('/about');
    const callout = page.getByText('My experience');
    await expect(callout).toBeVisible({ timeout: 10000 });
    await callout.click();
    // Experience section should be in viewport
    const expSection = page.locator('#experience');
    await expect(expSection).toBeInViewport({ timeout: 3000 });
  });

  test('menu hamburger opens and closes overlay', async ({ page }) => {
    await page.goto('/about');
    const menuButton = page.locator('button[aria-label="Open menu"]');
    await expect(menuButton).toBeVisible();
    await menuButton.click();

    // Menu overlay should appear with links
    await expect(page.getByText('Home').first()).toBeVisible();
    await expect(page.getByText('Projects').first()).toBeVisible();

    // Close menu
    const closeButton = page.locator('button[aria-label="Close menu"]');
    await closeButton.click();
  });

  test('menu links navigate to correct pages', async ({ page }) => {
    await page.goto('/about');
    const menuButton = page.locator('button[aria-label="Open menu"]');
    await menuButton.click();

    // Click Projects link in the menu overlay
    const menuOverlay = page.locator('.fixed.inset-0');
    await menuOverlay.getByText('Projects').click();

    // Should navigate to projects page
    await expect(page.getByText('My Work')).toBeVisible({ timeout: 10000 });
  });

  test('footer is visible with navigation links', async ({ page }) => {
    await page.goto('/about');
    const footer = page.locator('footer');
    await expect(footer).toBeVisible();
    await expect(footer.getByText('Home')).toBeVisible();
    await expect(footer.getByText(/Prajwal Shah/)).toBeVisible();
  });
});
