import { test, expect } from '@playwright/test';

test.describe('Login Functionality', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the login page before each test
    await page.goto('http://localhost:5173/login');
  });

  test('should display login form with correct elements', async ({ page }) => {
    // Check that login form elements are present
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
    // Check the quick login options
    await expect(page.getByRole('button', { name: 'Test User Login' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Admin Login' })).toBeVisible();
  });

  test('should have email and password fields', async ({ page }) => {
    // Check for email and password fields
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
  });

  test('should show login credentials in the note section', async ({ page }) => {
    // Verify that the test credentials are displayed
    await expect(page.locator('text=Note:')).toBeVisible();
    await expect(page.locator('text=Email: test@example.com')).toBeVisible();
    await expect(page.locator('text=Password: Password123')).toBeVisible();
  });

  // This test doesn't require successful API responses
  test('should have interactive form controls', async ({ page }) => {
    // Fill in credentials
    await page.fill('input[type="email"]', 'test@example.com');
    await page.fill('input[type="password"]', 'Password123');

    // Email field should have the entered value
    const emailValue = await page.inputValue('input[type="email"]');
    expect(emailValue).toBe('test@example.com');

    // Password field should have the entered value
    const passwordValue = await page.inputValue('input[type="password"]');
    expect(passwordValue).toBe('Password123');

    // Clear the fields
    await page.fill('input[type="email"]', '');
    await page.fill('input[type="password"]', '');

    // Fields should be empty
    expect(await page.inputValue('input[type="email"]')).toBe('');
    expect(await page.inputValue('input[type="password"]')).toBe('');
  });

  test('should have login button with correct state', async ({ page }) => {
    // Login button should be enabled by default
    const loginButton = page.getByRole('button', { name: 'Login', exact: true }).first();
    await expect(loginButton).toBeEnabled();

    // Login button should be clickable
    await loginButton.click();

    // After clicking, page should still have login form
    // (since we're not testing actual login functionality here)
    await expect(page.locator('text=Login to Your Account')).toBeVisible();
  });
});
