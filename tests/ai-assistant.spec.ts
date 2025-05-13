import { test, expect } from '@playwright/test';

// Test credentials
const TEST_USER = {
  email: 'test@example.com',
  password: 'password123',
};

const ADMIN_USER = {
  email: 'admin@example.com',
  password: 'admin123',
};

test.describe('AI Assistant', () => {
  test('should allow users to chat with the AI assistant', async ({ page }) => {
    // Step 1: Login as regular user
    await page.goto('/login');
    await page.fill('input[type="email"]', TEST_USER.email);
    await page.fill('input[type="password"]', TEST_USER.password);
    await page.click('button[type="submit"]');

    // Wait for login to complete and redirect to home
    await page.waitForURL('**/home');

    // Step 2: Verify AI Assistant bubble is visible
    const assistantBubble = page.locator('button[aria-label="Open AI Assistant"]');
    await expect(assistantBubble).toBeVisible();

    // Step 3: Open the AI Assistant
    await assistantBubble.click();

    // Verify the expanded assistant is visible
    await expect(page.locator('div').filter({ hasText: 'AI Assistant' }).first()).toBeVisible();

    // Step 4: Send a test message
    const uniqueId = `test-${Date.now()}`;
    const testMessage = `This is a test message: ${uniqueId}`;

    await page.fill('textarea[placeholder="Type your message..."]', testMessage);
    await page.click('button[type="submit"]');

    // Verify the message appears in the chat
    await expect(page.locator('p').filter({ hasText: testMessage })).toBeVisible();

    // Step 5: Verify AI responds
    await expect(
      page.locator('div').filter({ hasText: /I see this is a test message/i })
    ).toBeVisible({ timeout: 5000 });

    // Step 6: Close the assistant
    await page.click('button[aria-label="Close AI Assistant"]');

    // Verify it's closed and the bubble is visible again
    await expect(assistantBubble).toBeVisible();
  });

  test('should allow admins to view chat history', async ({ page }) => {
    // Step 1: Login as admin
    await page.goto('/login');
    await page.fill('input[type="email"]', ADMIN_USER.email);
    await page.fill('input[type="password"]', ADMIN_USER.password);
    await page.click('button[type="submit"]');

    // Wait for login to complete and redirect to home
    await page.waitForURL('**/home');

    // Step 2: Navigate to admin page
    await page.goto('/admin');

    // Step 3: Click on the AI Chat History tab
    await page.click('button:has-text("AI Chat History")');

    // Verify the chat history component is visible
    await expect(page.locator('h2').filter({ hasText: 'Chat History' })).toBeVisible();

    // Step 4: Verify at least one conversation thread is visible
    await expect(page.locator('li').first()).toBeVisible({ timeout: 5000 });

    // Step 5: Click on a conversation to view details
    await page.locator('li').first().click();

    // Step 6: Verify thread details are displayed
    await expect(page.locator('div.space-y-4')).toBeVisible();

    // Verify there are message bubbles visible
    await expect(page.locator('div:has-text("User")').first()).toBeVisible();
  });
});
