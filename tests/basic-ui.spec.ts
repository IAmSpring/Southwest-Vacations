import { test, expect } from '@playwright/test';

test.describe('Basic UI Functionality', () => {
  test('should display login page with all UI elements', async ({ page }) => {
    // Navigate to the login page using hash router format
    await page.goto('http://localhost:5173/#/login');

    // Verify login form elements
    await expect(page.locator('text=Login to Your Account')).toBeVisible();
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Login', exact: true }).first()).toBeVisible();

    // Verify Southwest Vacations branding
    await expect(page.getByText('Southwest Vacations', { exact: true })).toBeVisible();

    // Verify quick login options
    await expect(page.getByRole('button', { name: 'Test User Login' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Admin Login' })).toBeVisible();
  });

  test('should have interactive form fields', async ({ page }) => {
    // Navigate to the login page using hash router format
    await page.goto('http://localhost:5173/#/login');

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

  test('should have proper tab navigation', async ({ page }) => {
    // Navigate to the login page using hash router format
    await page.goto('http://localhost:5173/#/login');

    // Focus on email field
    await page.focus('input[type="email"]');

    // Press Tab to move to password field
    await page.keyboard.press('Tab');

    // Check if password field is focused
    const focusedElement = await page.evaluate(() => document.activeElement.getAttribute('type'));
    expect(focusedElement).toBe('password');

    // Press Tab again to move to Login button
    await page.keyboard.press('Tab');

    // Check if Login button is focused
    const buttonFocused = await page.evaluate(() =>
      document.activeElement.textContent.includes('Login')
    );
    expect(buttonFocused).toBeTruthy();
  });

  test('should have responsive design', async ({ page }) => {
    // Navigate to the login page using hash router format
    await page.goto('http://localhost:5173/#/login');

    // Test desktop size
    await page.setViewportSize({ width: 1280, height: 800 });
    await expect(page.locator('text=Login to Your Account')).toBeVisible();

    // Test tablet size
    await page.setViewportSize({ width: 768, height: 1024 });
    await expect(page.locator('text=Login to Your Account')).toBeVisible();

    // Test mobile size
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.locator('text=Login to Your Account')).toBeVisible();

    // All sizes should show the login form
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
  });
});
