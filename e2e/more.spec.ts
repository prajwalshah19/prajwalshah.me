import { test, expect } from '@playwright/test';
import { mockSanityAPI } from './helpers/sanity-mock';

test.beforeEach(async ({ page }) => {
  await mockSanityAPI(page);
});

test.describe('More/Thoughts Page', () => {
  test('page loads with heading', async ({ page }) => {
    await page.goto('/more');
    await expect(page.getByText('My thoughts')).toBeVisible();
  });

  test('article cards are rendered (up to 4 per page)', async ({ page }) => {
    await page.goto('/more');
    await expect(page.getByText('Getting Started with React')).toBeVisible({ timeout: 10000 });
    await expect(page.getByText('Understanding TypeScript')).toBeVisible();
    await expect(page.getByText('The Future of AI')).toBeVisible();
    await expect(page.getByText('Web Performance Tips')).toBeVisible();
    // 5th article should NOT be visible on page 1
    await expect(page.getByText('Learning Rust')).not.toBeVisible();
  });

  test('article cards show title, date, and excerpt', async ({ page }) => {
    await page.goto('/more');
    await expect(page.getByText('Getting Started with React')).toBeVisible({ timeout: 10000 });
    await expect(page.getByText('2024-03-01')).toBeVisible();
    await expect(page.getByText(/comprehensive guide/i)).toBeVisible();
  });

  test('Read More button opens MarkdownModal', async ({ page }) => {
    await page.goto('/more');
    await expect(page.getByText('Getting Started with React')).toBeVisible({ timeout: 10000 });

    // Click the first Read More button
    await page.getByText('Read More').first().click();

    // Modal should appear with markdown content
    await expect(page.getByText(/powerful library/i)).toBeVisible();
  });

  test('modal displays markdown content and can be closed', async ({ page }) => {
    await page.goto('/more');
    await expect(page.getByText('Getting Started with React')).toBeVisible({ timeout: 10000 });

    await page.getByText('Read More').first().click();
    await expect(page.locator('button[aria-label="Close modal"]')).toBeVisible();

    await page.locator('button[aria-label="Close modal"]').click();
    await expect(page.locator('.fixed.inset-0.z-50')).not.toBeVisible();
  });

  test('pagination works', async ({ page }) => {
    await page.goto('/more');
    await expect(page.getByText('Getting Started with React')).toBeVisible({ timeout: 10000 });

    // Page 1
    await expect(page.getByText(/Page 1 of \d+/)).toBeVisible();
    await expect(page.getByText('Prev')).toBeDisabled();

    // Go to page 2
    await page.getByText('Next').click();
    await expect(page.getByText('Learning Rust')).toBeVisible({ timeout: 5000 });
    await expect(page.getByText(/Page 2/)).toBeVisible();

    // Go back
    await page.getByText('Prev').click();
    await expect(page.getByText('Getting Started with React')).toBeVisible();
  });
});
