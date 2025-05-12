import { test, expect } from '@playwright/test';

test.describe('Southwest Vacations Booking Visual Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to homepage
    await page.goto('http://localhost:5173/');

    // Verify page loaded
    await expect(page.locator('text=Southwest Vacations')).toBeVisible({ timeout: 10000 });
  });

  test('complete booking flow with visual verification', async ({ page }) => {
    // Step 1: Login
    await test.step('Login process', async () => {
      // Click login link
      await page.click('text=Login');

      // Wait for login page to load
      await page.waitForURL(/.*\/login/, { timeout: 10000 });

      // Wait for login form to be fully loaded
      await page.waitForTimeout(1000);

      // Take screenshot of login page
      await page.screenshot({ path: 'test-results/01-login-page.png' });

      // Fill login form
      await page.fill('#email', 'test@example.com', { timeout: 5000 });
      await page.fill('#password', 'Password123', { timeout: 5000 });

      // Take screenshot of filled form
      await page.screenshot({ path: 'test-results/02-login-form-filled.png' });

      // Submit form
      await page.click('button:has-text("Login")', { force: true });

      // Wait for login process to complete
      await page.waitForTimeout(2000);

      // Verify token was stored in localStorage
      const token = await page.evaluate(() => localStorage.getItem('token'));
      expect(token).toBeTruthy();
    });

    // Step 2: Navigate to booking page
    await test.step('Navigate to booking page', async () => {
      await page.click('a:has-text("Book a Trip")', { force: true });
      await page.waitForURL(/.*\/book/, { timeout: 10000 });

      // Wait for booking page to load fully
      await page.waitForTimeout(2000);

      // Take screenshot of booking page
      await page.screenshot({ path: 'test-results/03-booking-page.png' });
    });

    // Step 3: Fill booking form
    await test.step('Fill booking form', async () => {
      // Wait for form to load
      await page.waitForTimeout(3000);

      // Check if round trip radio exists before trying to use it
      const roundTripExists = (await page.$('#round-trip')) !== null;
      if (roundTripExists) {
        // Select round trip
        await page.check('#round-trip', { force: true });
      }

      // Wait after selection
      await page.waitForTimeout(500);

      // Set dates if the fields exist
      const startDateExists = (await page.$('#startDate')) !== null;
      if (startDateExists) {
        const departureDate = new Date();
        departureDate.setDate(departureDate.getDate() + 7);
        const formattedDepartureDate = departureDate.toISOString().split('T')[0];
        await page.fill('#startDate', formattedDepartureDate, { force: true });

        // Wait after filling
        await page.waitForTimeout(500);

        // Check for return date field
        const returnDateExists = (await page.$('#returnDate')) !== null;
        if (returnDateExists) {
          const returnDate = new Date();
          returnDate.setDate(returnDate.getDate() + 14);
          const formattedReturnDate = returnDate.toISOString().split('T')[0];
          await page.fill('#returnDate', formattedReturnDate, { force: true });

          // Wait after filling
          await page.waitForTimeout(500);
        }
      }

      // Check for and fill traveler fields if they exist
      const fields = ['fullName', 'email', 'phone', 'travelers'];
      for (const field of fields) {
        const fieldExists = (await page.$(`input[name="${field}"]`)) !== null;
        if (fieldExists) {
          if (field === 'travelers') {
            // Clear and set travelers to 2
            await page.fill(`input[name="${field}"]`, '', { force: true });
            await page.fill(`input[name="${field}"]`, '2', { force: true });
          } else {
            await page.fill(
              `input[name="${field}"]`,
              field === 'email' ? 'test@example.com' : 'Test Traveler',
              { force: true }
            );
          }
          // Wait after filling each field
          await page.waitForTimeout(300);
        }
      }

      // Take screenshot of filled form
      await page.screenshot({ path: 'test-results/04-booking-form-filled.png' });
    });

    // Step 4: Submit booking
    await test.step('Submit booking', async () => {
      // Find button containing text like "Book", "Submit", or "Continue"
      try {
        const bookButton = page.getByRole('button', { name: /Book|Submit|Continue/i });
        await bookButton.click({ force: true, timeout: 5000 });
      } catch (e) {
        // Fallback if button not found by role
        await page.click('button:text-matches("Book|Submit|Continue", "i")', { force: true });
      }

      // Wait for navigation away from booking page
      await page.waitForURL(/^(?!.*\/book).*$/, { timeout: 10000 });

      // Wait for page to stabilize
      await page.waitForTimeout(2000);

      // Take screenshot of result page
      await page.screenshot({ path: 'test-results/05-booking-result.png' });

      // Check for words that would indicate success
      const pageContent = await page.textContent('body');
      expect(pageContent.toLowerCase()).toMatch(/confirmation|confirmed|booked|success/);
    });

    // Step 5: View booking in profile
    await test.step('Check booking in profile', async () => {
      // Navigate to profile page by clicking the link
      await page.click('a:has-text("My Profile")', { force: true });

      // Wait for navigation
      await page.waitForURL(/.*\/profile/, { timeout: 10000 });

      // Wait for profile page to load
      await page.waitForTimeout(2000);

      // Verify profile page loads
      await expect(page.locator('text=/Profile|Account/i')).toBeVisible({ timeout: 10000 });

      // Take screenshot of profile page with bookings
      await page.screenshot({ path: 'test-results/06-profile-with-bookings.png' });

      // Verify bookings section exists
      await expect(page.locator('text=/My Bookings|Bookings|Trips|Itineraries/i')).toBeVisible({
        timeout: 10000,
      });
    });
  });

  test('login with test user button shortcut', async ({ page }) => {
    // Step 1: Go to login page
    await page.click('text=Login');
    await page.waitForURL(/.*\/login/, { timeout: 10000 });

    // Wait for login page to load fully
    await page.waitForTimeout(1000);

    // Take screenshot before clicking test user button
    await page.screenshot({ path: 'test-results/07-before-test-user-login.png' });

    // Click test user login button
    await page.click('button:has-text("Test User Login")', { force: true });

    // Verify login succeeded
    await page.waitForTimeout(2000); // Wait for login process

    // Take screenshot after login
    await page.screenshot({ path: 'test-results/08-after-test-user-login.png' });

    // Verify token was stored
    const token = await page.evaluate(() => localStorage.getItem('token'));
    expect(token).toBeTruthy();

    // Verify user is logged in by checking for profile link
    await expect(page.locator('a:has-text("My Profile")')).toBeVisible({ timeout: 10000 });
  });
});
