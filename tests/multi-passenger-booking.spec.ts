import { test, expect } from '@playwright/test';

test.describe('Multi-Passenger Booking Flow', () => {
  test('should navigate to the login page correctly', async ({ page }) => {
    await page.goto('http://localhost:5173/login');
    await expect(page.locator('text=Login to Your Account')).toBeVisible();
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
  });

  test.describe('Tests requiring login', () => {
    test.skip();
    test('should navigate to the booking creation page', async ({ page }) => {});
    test('should be able to add multiple passengers to booking', async ({ page }) => {});
    test('should calculate correct total price for multiple passengers', async ({ page }) => {});
    test('should allow removing additional passengers', async ({ page }) => {});
  });
});
