import { test, expect } from '@playwright/test';
import { mockSanityAPI } from './helpers/sanity-mock';

test.beforeEach(async ({ page }) => {
  await mockSanityAPI(page);
});

test.describe('Cross-page Navigation', () => {
  test('navigate from Home to About via GotoNav', async ({ page }) => {
    await page.goto('/');
    await page.locator('#bio').scrollIntoViewIfNeeded();
    // Find the GotoNav section and click About
    const gotoSection = page.locator('text=Goto').locator('..');
    await gotoSection.getByText('About').click();
    await expect(page.getByText('A bit about me...')).toBeVisible({ timeout: 10000 });
  });

  test('navigate from About to Projects via menu', async ({ page }) => {
    await page.goto('/about');
    await page.locator('button[aria-label="Open menu"]').click();
    const menuOverlay = page.locator('.fixed.inset-0');
    await menuOverlay.getByText('Projects').click();
    await expect(page.getByText('My Work')).toBeVisible({ timeout: 10000 });
  });

  test('navigate from Projects to More via menu', async ({ page }) => {
    await page.goto('/projects');
    await page.locator('button[aria-label="Open menu"]').click();
    const menuOverlay = page.locator('.fixed.inset-0');
    await menuOverlay.getByText('More').click();
    await expect(page.getByText('My thoughts')).toBeVisible({ timeout: 10000 });
  });

  test('navigate from More to Contact via menu', async ({ page }) => {
    await page.goto('/more');
    await page.locator('button[aria-label="Open menu"]').click();
    const menuOverlay = page.locator('.fixed.inset-0');
    await menuOverlay.getByText('Contact').click();
    await expect(page.getByText('Lets talk')).toBeVisible({ timeout: 10000 });
  });

  test('navigate from Contact to Home via menu', async ({ page }) => {
    await page.goto('/contact');
    await page.locator('button[aria-label="Open menu"]').click();
    const menuOverlay = page.locator('.fixed.inset-0');
    await menuOverlay.getByText('Home').click();
    await expect(page.getByText("I'm Praj")).toBeVisible({ timeout: 10000 });
  });

  test('footer links navigate correctly', async ({ page }) => {
    await page.goto('/about');
    const footer = page.locator('footer');
    await footer.scrollIntoViewIfNeeded();
    await footer.getByText('Projects').click();
    await expect(page.getByText('My Work')).toBeVisible({ timeout: 10000 });
  });

  test('all menu links work from projects page', async ({ page }) => {
    await page.goto('/projects');

    // Test each menu link
    for (const { label, expectedText } of [
      { label: 'Home', expectedText: "I'm Praj" },
      { label: 'About', expectedText: 'A bit about me...' },
      { label: 'More', expectedText: 'My thoughts' },
      { label: 'Contact', expectedText: 'Lets talk' },
    ]) {
      await page.locator('button[aria-label="Open menu"]').click();
      const menuOverlay = page.locator('.fixed.inset-0');
      await menuOverlay.getByText(label).click();
      await expect(page.getByText(expectedText)).toBeVisible({ timeout: 10000 });

      // Navigate back to projects if not Home (Home doesn't have menu)
      if (label !== 'Home') {
        await page.goto('/projects');
      } else {
        await page.goto('/projects');
      }
    }
  });
});
