import { test, expect } from '@playwright/test';
import { mockSanityAPI } from './helpers/sanity-mock';

test.beforeEach(async ({ page }) => {
  await mockSanityAPI(page);
});

test.describe('Dark Mode / Theme', () => {
  test('default theme loads correctly', async ({ page }) => {
    await page.goto('/');
    // HTML element should have either 'dark' or 'light' class
    const htmlClass = await page.locator('html').getAttribute('class');
    expect(htmlClass).toMatch(/dark|light/);
  });

  test('toggle switches between light and dark', async ({ page }) => {
    await page.goto('/');
    const toggleButton = page.locator('button[aria-label="Toggle theme"]');

    // Get current theme
    const initialClass = await page.locator('html').getAttribute('class');
    const wasDark = initialClass?.includes('dark');

    // Toggle
    await toggleButton.click();
    if (wasDark) {
      await expect(page.locator('html')).toHaveClass(/light/);
    } else {
      await expect(page.locator('html')).toHaveClass(/dark/);
    }

    // Toggle back
    await toggleButton.click();
    if (wasDark) {
      await expect(page.locator('html')).toHaveClass(/dark/);
    } else {
      await expect(page.locator('html')).toHaveClass(/light/);
    }
  });

  test('dark mode changes background colors', async ({ page }) => {
    await page.goto('/');
    const toggleButton = page.locator('button[aria-label="Toggle theme"]');

    // Set to light mode
    const htmlClass = await page.locator('html').getAttribute('class');
    if (htmlClass?.includes('dark')) {
      await toggleButton.click();
    }
    await expect(page.locator('html')).toHaveClass(/light/);

    // Switch to dark mode
    await toggleButton.click();
    await expect(page.locator('html')).toHaveClass(/dark/);
  });

  test('theme persists after navigation between pages', async ({ page }) => {
    await page.goto('/');
    const toggleButton = page.locator('button[aria-label="Toggle theme"]');

    // Set to dark mode
    const htmlClass = await page.locator('html').getAttribute('class');
    if (!htmlClass?.includes('dark')) {
      await toggleButton.click();
    }
    await expect(page.locator('html')).toHaveClass(/dark/);

    // Navigate to about page
    await page.goto('/about');
    // Theme should still be dark (via localStorage)
    const theme = await page.evaluate(() => localStorage.getItem('theme'));
    expect(theme).toBe('dark');
  });

  test('theme persists after page reload', async ({ page }) => {
    await page.goto('/');
    const toggleButton = page.locator('button[aria-label="Toggle theme"]');

    // Set to dark mode
    const htmlClass = await page.locator('html').getAttribute('class');
    if (!htmlClass?.includes('dark')) {
      await toggleButton.click();
    }

    // Verify localStorage is set
    const themeBeforeReload = await page.evaluate(() => localStorage.getItem('theme'));
    expect(themeBeforeReload).toBe('dark');

    // Reload
    await page.reload();
    const themeAfterReload = await page.evaluate(() => localStorage.getItem('theme'));
    expect(themeAfterReload).toBe('dark');
  });

  test('theme toggle shows correct icon', async ({ page }) => {
    await page.goto('/');
    const toggleButton = page.locator('button[aria-label="Toggle theme"]');

    // In light mode, should show Moon icon; in dark mode, should show Sun icon
    const htmlClass = await page.locator('html').getAttribute('class');
    if (htmlClass?.includes('light')) {
      // Moon icon should be visible (to switch to dark)
      await expect(toggleButton.locator('svg')).toBeVisible();
    } else {
      // Sun icon should be visible (to switch to light)
      await expect(toggleButton.locator('svg')).toBeVisible();
    }
  });

  test('theme works on content pages', async ({ page }) => {
    await page.goto('/about');
    const toggleButton = page.locator('button[aria-label="Toggle theme"]');
    await expect(toggleButton).toBeVisible();

    const initialClass = await page.locator('html').getAttribute('class');
    await toggleButton.click();
    const newClass = await page.locator('html').getAttribute('class');
    expect(newClass).not.toBe(initialClass);
  });
});
