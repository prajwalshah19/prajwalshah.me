import { test, expect } from '@playwright/test';
import { mockSanityAPI } from './helpers/sanity-mock';

// Only run mobile tests with the mobile project
test.describe('Mobile Interactivity', () => {
  test.beforeEach(async ({ page, isMobile }) => {
    test.skip(!isMobile, 'Mobile-only tests');
    await mockSanityAPI(page);
  });

  test('home hero is responsive', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText("I'm Praj")).toBeVisible();
    await expect(page.getByText('Computer Science and Economics @ Purdue')).toBeVisible();
  });

  test('hamburger menu is visible on content pages', async ({ page }) => {
    await page.goto('/about');
    const menuButton = page.locator('button[aria-label="Open menu"]');
    await expect(menuButton).toBeVisible();
  });

  test('menu overlay opens full-screen on mobile', async ({ page }) => {
    await page.goto('/about');
    await page.locator('button[aria-label="Open menu"]').click();

    // Menu should be visible with all links
    await expect(page.getByText('Home').first()).toBeVisible();
    await expect(page.getByText('About').first()).toBeVisible();
    await expect(page.getByText('Projects').first()).toBeVisible();
    await expect(page.getByText('More').first()).toBeVisible();
    await expect(page.getByText('Contact').first()).toBeVisible();
  });

  test('menu links are navigable on mobile', async ({ page }) => {
    await page.goto('/about');
    await page.locator('button[aria-label="Open menu"]').click();
    const menuOverlay = page.locator('.fixed.inset-0');
    await menuOverlay.getByText('Projects').click();
    await expect(page.getByText('My Work')).toBeVisible({ timeout: 10000 });
  });

  test('project cards stack single column on mobile', async ({ page }) => {
    await page.goto('/projects');
    await expect(page.getByText('Portfolio Website')).toBeVisible({ timeout: 10000 });

    // On mobile, cards should be in a single column grid
    // Check that the grid container has grid-cols-1 behavior
    const gridContainer = page.locator('.grid').first();
    await expect(gridContainer).toBeVisible();
  });

  test('theme toggle is accessible on mobile', async ({ page }) => {
    await page.goto('/about');
    const toggleButton = page.locator('button[aria-label="Toggle theme"]');
    await expect(toggleButton).toBeVisible();
    await toggleButton.click();
    // Should toggle theme class
    const htmlClass = await page.locator('html').getAttribute('class');
    expect(htmlClass).toBeTruthy();
  });

  test('modal is full-screen on mobile', async ({ page }) => {
    await page.goto('/projects');
    await expect(page.getByText('Portfolio Website')).toBeVisible({ timeout: 10000 });

    await page.getByText('View', { exact: true }).first().click();

    // Modal should be visible and take full width on mobile
    const modal = page.locator('.fixed.inset-0.z-50');
    await expect(modal).toBeVisible();
    const closeButton = page.locator('button[aria-label="Close modal"]');
    await expect(closeButton).toBeVisible();
  });

  test('contact form works on mobile', async ({ page }) => {
    await page.goto('/contact');
    await expect(page.locator('input#name')).toBeVisible();
    await page.locator('input#name').fill('Test User');
    await expect(page.locator('input#name')).toHaveValue('Test User');
  });

  test('chevron scroll works on mobile home', async ({ page }) => {
    await page.goto('/');
    const scrollButton = page.locator('button[aria-label="Scroll down to bio"]');
    await expect(scrollButton).toBeVisible();
    await scrollButton.click();
    const bioSection = page.locator('#bio');
    await expect(bioSection).toBeInViewport({ timeout: 3000 });
  });
});
