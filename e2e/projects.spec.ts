import { test, expect } from '@playwright/test';
import { mockSanityAPI } from './helpers/sanity-mock';

test.beforeEach(async ({ page }) => {
  await mockSanityAPI(page);
});

test.describe('Projects Page', () => {
  test('page loads with "My Work" heading', async ({ page }) => {
    await page.goto('/projects');
    await expect(page.getByText('My Work')).toBeVisible();
  });

  test('project cards are rendered (up to 4 per page)', async ({ page }) => {
    await page.goto('/projects');
    // Wait for projects to load from mock Sanity
    await expect(page.getByText('Portfolio Website')).toBeVisible({ timeout: 10000 });
    // Should show first 4 projects
    await expect(page.getByText('ML Pipeline')).toBeVisible();
    await expect(page.getByText('Task Manager App')).toBeVisible();
    await expect(page.getByText('E-Commerce Platform')).toBeVisible();
    // 5th project should NOT be visible on page 1
    await expect(page.getByText('Chat Application')).not.toBeVisible();
  });

  test('project cards show name, dates, and description', async ({ page }) => {
    await page.goto('/projects');
    await expect(page.getByText('Portfolio Website')).toBeVisible({ timeout: 10000 });
    await expect(page.getByText('Jan 2024 - Present')).toBeVisible();
    await expect(page.getByText(/personal portfolio website/i)).toBeVisible();
  });

  test('project cards display tag badges', async ({ page }) => {
    await page.goto('/projects');
    await expect(page.getByText('Portfolio Website')).toBeVisible({ timeout: 10000 });
    await expect(page.getByText('React').first()).toBeVisible();
    await expect(page.getByText('Tailwind')).toBeVisible();
    await expect(page.getByText('TypeScript').first()).toBeVisible();
  });

  test('View button opens MarkdownModal', async ({ page }) => {
    await page.goto('/projects');
    await expect(page.getByText('Portfolio Website')).toBeVisible({ timeout: 10000 });

    // Click the first View button
    const viewButtons = page.getByText('View', { exact: true });
    await viewButtons.first().click();

    // Modal should appear with markdown content
    await expect(page.getByText('Portfolio Website').nth(1)).toBeVisible();
    await expect(page.getByText(/Responsive design/i)).toBeVisible();
  });

  test('modal close button works', async ({ page }) => {
    await page.goto('/projects');
    await expect(page.getByText('Portfolio Website')).toBeVisible({ timeout: 10000 });

    // Open modal
    await page.getByText('View', { exact: true }).first().click();
    await expect(page.locator('button[aria-label="Close modal"]')).toBeVisible();

    // Close modal
    await page.locator('button[aria-label="Close modal"]').click();
    // Modal content should no longer be visible
    await expect(page.locator('.fixed.inset-0.z-50')).not.toBeVisible();
  });

  test('pagination shows correct page indicator', async ({ page }) => {
    await page.goto('/projects');
    await expect(page.getByText('Portfolio Website')).toBeVisible({ timeout: 10000 });
    await expect(page.getByText(/Page 1 of \d+/)).toBeVisible();
  });

  test('prev button is disabled on first page', async ({ page }) => {
    await page.goto('/projects');
    await expect(page.getByText('Portfolio Website')).toBeVisible({ timeout: 10000 });
    const prevButton = page.getByText('Prev');
    await expect(prevButton).toBeVisible();
    await expect(prevButton).toBeDisabled();
  });

  test('next button navigates to page 2', async ({ page }) => {
    await page.goto('/projects');
    await expect(page.getByText('Portfolio Website')).toBeVisible({ timeout: 10000 });

    const nextButton = page.getByText('Next');
    await nextButton.click();

    // Page 2 should show remaining projects
    await expect(page.getByText('Chat Application')).toBeVisible({ timeout: 5000 });
    await expect(page.getByText(/Page 2/)).toBeVisible();
  });

  test('prev button works from page 2', async ({ page }) => {
    await page.goto('/projects');
    await expect(page.getByText('Portfolio Website')).toBeVisible({ timeout: 10000 });

    // Go to page 2
    await page.getByText('Next').click();
    await expect(page.getByText(/Page 2/)).toBeVisible();

    // Go back to page 1
    await page.getByText('Prev').click();
    await expect(page.getByText(/Page 1/)).toBeVisible();
    await expect(page.getByText('Portfolio Website')).toBeVisible();
  });
});
