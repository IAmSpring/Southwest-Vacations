import { test, expect } from '@playwright/test';

test.describe('Login Functionality', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the login page using hash router format
    await page.goto('http://localhost:5173/#/login');
  });

  test('should display login form with correct elements', async ({ page }) => {
    // Verify login form elements
    await expect(page.locator('text=Login to Your Account')).toBeVisible();
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Login', exact: true }).first()).toBeVisible();

    // Verify the Southwest Vacations branding - using more specific selector
    await expect(page.getByText('Southwest Vacations', { exact: true })).toBeVisible();

    // Check for the login information text
    await expect(page.getByText('Login Required')).toBeVisible();
    await expect(page.getByText('Please login to continue with your booking')).toBeVisible();
  });

  test('should verify quick login options are present', async ({ page }) => {
    // Verify quick login options
    await expect(page.getByRole('button', { name: 'Test User Login' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Admin Login' })).toBeVisible();
  });

  test('should have email and password fields', async ({ page }) => {
    // Verify fields exist and are initially empty
    expect(await page.inputValue('input[type="email"]')).toBe('');
    expect(await page.inputValue('input[type="password"]')).toBe('');
  });

  test('should show login credentials in the note section', async ({ page }) => {
    // Check for the test credentials note section
    await expect(page.locator('text=Test Account')).toBeVisible();
    await expect(page.locator('text=Email: test@example.com')).toBeVisible();
    await expect(page.locator('text=Password: Password123')).toBeVisible();
  });

  test('should have interactive form controls', async ({ page }) => {
    // Fill in credentials
    await page.fill('input[type="email"]', 'test@example.com');
    await page.fill('input[type="password"]', 'Password123');

    // Verify fields have the correct values
    expect(await page.inputValue('input[type="email"]')).toBe('test@example.com');
    expect(await page.inputValue('input[type="password"]')).toBe('Password123');

    // Clear fields
    await page.fill('input[type="email"]', '');
    await page.fill('input[type="password"]', '');

    // Verify fields are cleared
    expect(await page.inputValue('input[type="email"]')).toBe('');
    expect(await page.inputValue('input[type="password"]')).toBe('');
  });

  test('should have login button with correct state', async ({ page }) => {
    // Button should be enabled initially
    const loginButton = page.getByRole('button', { name: 'Login', exact: true }).first();
    await expect(loginButton).toBeEnabled();

    // Fill in form
    await page.fill('input[type="email"]', 'test@example.com');
    await page.fill('input[type="password"]', 'Password123');

    // Button should still be enabled
    await expect(loginButton).toBeEnabled();
  });
});
