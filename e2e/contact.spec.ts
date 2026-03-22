import { test, expect } from '@playwright/test';
import { mockSanityAPI } from './helpers/sanity-mock';

test.beforeEach(async ({ page }) => {
  await mockSanityAPI(page);
});

test.describe('Contact Page', () => {
  test('page loads with heading', async ({ page }) => {
    await page.goto('/contact');
    await expect(page.getByText('Lets talk')).toBeVisible();
  });

  test('contact text from Sanity is visible', async ({ page }) => {
    await page.goto('/contact');
    await expect(page.getByText(/reach out to me/i)).toBeVisible({ timeout: 10000 });
  });

  test('contact form fields are visible', async ({ page }) => {
    await page.goto('/contact');
    await expect(page.locator('input#name')).toBeVisible();
    await expect(page.locator('input#email')).toBeVisible();
    await expect(page.locator('input#subject')).toBeVisible();
    await expect(page.locator('textarea#message')).toBeVisible();
  });

  test('contact form has labels', async ({ page }) => {
    await page.goto('/contact');
    await expect(page.locator('label[for="name"]')).toBeVisible();
    await expect(page.locator('label[for="email"]')).toBeVisible();
    await expect(page.locator('label[for="subject"]')).toBeVisible();
    await expect(page.locator('label[for="message"]')).toBeVisible();
  });

  test('contact form submit button is visible', async ({ page }) => {
    await page.goto('/contact');
    await expect(page.getByRole('button', { name: 'Send' })).toBeVisible();
  });

  test('contact form can be filled out', async ({ page }) => {
    await page.goto('/contact');
    await page.locator('input#name').fill('John Doe');
    await page.locator('input#email').fill('john@example.com');
    await page.locator('input#subject').fill('Hello');
    await page.locator('textarea#message').fill('This is a test message.');

    await expect(page.locator('input#name')).toHaveValue('John Doe');
    await expect(page.locator('input#email')).toHaveValue('john@example.com');
  });

  test('MiniSocialLinks are visible', async ({ page }) => {
    await page.goto('/contact');
    await expect(page.getByText('github').first()).toBeVisible({ timeout: 10000 });
    await expect(page.getByText('linkedin').first()).toBeVisible();
  });

  test('Prajwal Shah name is shown on desktop', async ({ page, isMobile }) => {
    test.skip(!!isMobile, 'Name hidden on mobile');
    await page.goto('/contact');
    // The h2 with "Prajwal Shah" is hidden on mobile (hidden lg:block)
    await expect(page.locator('h2', { hasText: 'Prajwal Shah' })).toBeVisible();
  });
});
