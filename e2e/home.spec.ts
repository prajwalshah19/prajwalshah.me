import { test, expect } from '@playwright/test';
import { mockSanityAPI } from './helpers/sanity-mock';

test.beforeEach(async ({ page }) => {
  await mockSanityAPI(page);
});

test.describe('Home Page', () => {
  test('loads with correct title', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Prajwal Shah/);
  });

  test('hero section is visible with name', async ({ page }) => {
    await page.goto('/');
    const hero = page.locator('section').first();
    await expect(hero).toBeVisible();
    await expect(page.getByText("Hi,")).toBeVisible();
    await expect(page.getByText("I'm Praj")).toBeVisible();
  });

  test('hero subtitle with education is visible', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText('Computer Science and Economics @ Purdue')).toBeVisible();
  });

  test('social links are visible on desktop', async ({ page, isMobile }) => {
    test.skip(!!isMobile, 'Social links hidden on mobile');
    await page.goto('/');
    // Wait for Sanity data to load
    await expect(page.getByText('github')).toBeVisible({ timeout: 10000 });
    await expect(page.getByText('linkedin')).toBeVisible();
  });

  test('social links have correct hrefs', async ({ page, isMobile }) => {
    test.skip(!!isMobile, 'Social links hidden on mobile');
    await page.goto('/');
    await expect(page.getByText('github')).toBeVisible({ timeout: 10000 });
    const githubLink = page.locator('a', { hasText: 'github' });
    await expect(githubLink).toHaveAttribute('href', /github\.com/);
    const linkedinLink = page.locator('a', { hasText: 'linkedin' });
    await expect(linkedinLink).toHaveAttribute('href', /linkedin\.com/);
  });

  test('chevron scroll button is visible and scrolls to bio', async ({ page }) => {
    await page.goto('/');
    const scrollButton = page.locator('button[aria-label="Scroll down to bio"]');
    await expect(scrollButton).toBeVisible();
    await scrollButton.click();
    // Bio section should come into view
    const bioSection = page.locator('#bio');
    await expect(bioSection).toBeInViewport({ timeout: 3000 });
  });

  test('bio section has content from Sanity', async ({ page }) => {
    await page.goto('/');
    const bioSection = page.locator('#bio');
    await expect(bioSection).toBeVisible();
    await expect(bioSection.getByText('Bio')).toBeVisible();
    // Check that Sanity content loaded
    await expect(page.getByText(/computer science and economics/i)).toBeVisible({ timeout: 10000 });
  });

  test('FeaturedNav links are visible', async ({ page }) => {
    await page.goto('/');
    // Scroll to bio section where FeaturedNav lives
    await page.locator('#bio').scrollIntoViewIfNeeded();
    await expect(page.getByText('Featured')).toBeVisible();
  });

  test('GotoNav links are visible and navigable', async ({ page }) => {
    await page.goto('/');
    await page.locator('#bio').scrollIntoViewIfNeeded();
    await expect(page.getByText('Goto')).toBeVisible();
    // Check navigation links exist
    const gotoSection = page.locator('text=Goto').locator('..');
    await expect(gotoSection.getByText('About')).toBeVisible();
    await expect(gotoSection.getByText('Projects')).toBeVisible();
    await expect(gotoSection.getByText('More')).toBeVisible();
    await expect(gotoSection.getByText('Contact')).toBeVisible();
  });

  test('theme toggle switches between dark and light mode', async ({ page }) => {
    await page.goto('/');
    const toggleButton = page.locator('button[aria-label="Toggle theme"]');
    await expect(toggleButton).toBeVisible();

    // Get initial theme
    const initialClass = await page.locator('html').getAttribute('class');
    await toggleButton.click();

    // Theme should change
    const newClass = await page.locator('html').getAttribute('class');
    expect(newClass).not.toBe(initialClass);
  });

  test('theme persists across page reload', async ({ page }) => {
    await page.goto('/');
    const toggleButton = page.locator('button[aria-label="Toggle theme"]');

    // Set to dark mode
    const htmlClass = await page.locator('html').getAttribute('class');
    if (!htmlClass?.includes('dark')) {
      await toggleButton.click();
    }
    await expect(page.locator('html')).toHaveClass(/dark/);

    // Reload and check persistence
    await page.reload();
    await mockSanityAPI(page);
    const themeAfterReload = await page.evaluate(() => localStorage.getItem('theme'));
    expect(themeAfterReload).toBe('dark');
  });
});
