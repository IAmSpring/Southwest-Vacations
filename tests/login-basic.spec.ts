import { test, expect } from '@playwright/test';

test.describe('Southwest Vacations Login Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Clear storage before each test
    await page.goto('/');
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });
  });

  test('should login with credentials', async ({ page }) => {
    // Navigate to homepage
    await page.goto('/');

    // Go to login page - being specific about which Login link to click
    await page.getByRole('link', { name: 'Login', exact: true }).click();

    // Check we're on the login page
    await expect(page).toHaveURL(/.*login/);

    // Fill in login form
    await page.fill('#email', 'test@example.com');
    await page.fill('#password', 'Password123');

    // Submit form - be more specific about which button to use
    await page.locator('form button:has-text("Login")').click();

    // Wait for localStorage token
    await page.waitForFunction(() => localStorage.getItem('token') !== null);

    // Go back to home page
    await page.goto('/');

    // Verify login was successful by checking for navigation elements
    await expect(page.locator('a', { hasText: 'Book a Trip' })).toBeVisible();
  });

  test('should login with Test User button', async ({ page }) => {
    // Go directly to login page
    await page.goto('/#/login');

    // Use test user button - be more specific
    await page.locator('button:has-text("Test User Login")').click();

    // Wait for localStorage token
    await page.waitForFunction(() => localStorage.getItem('token') !== null);

    // Go to home page
    await page.goto('/');

    // Verify we're logged in by checking for navigation element
    await expect(page.locator('a', { hasText: 'Book a Trip' })).toBeVisible();
  });
});
