import { test, expect } from '@playwright/test';

test.describe('Southwest Vacations Booking Visual Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to homepage
    await page.goto('http://localhost:5173/');

    // Verify page loaded
    await expect(page.locator('text=Southwest Vacations')).toBeVisible();
  });

  test('complete booking flow with visual verification', async ({ page }) => {
    // Step 1: Login
    await test.step('Login process', async () => {
      // Click login link
      await page.click('text=Login');

      // Wait for login page to load
      await expect(page).toHaveURL(/.*\/login/);

      // Take screenshot of login page
      await page.screenshot({ path: 'test-results/01-login-page.png' });

      // Fill login form
      await page.fill('#email', 'test@example.com');
      await page.fill('#password', 'Password123');

      // Take screenshot of filled form
      await page.screenshot({ path: 'test-results/02-login-form-filled.png' });

      // Submit form
      await page.click('button:has-text("Login")');

      // Verify login succeeded
      await page.waitForTimeout(1000); // Wait for login process

      // Verify token was stored in localStorage
      const token = await page.evaluate(() => localStorage.getItem('token'));
      expect(token).toBeTruthy();
    });

    // Step 2: Navigate to booking page
    await test.step('Navigate to booking page', async () => {
      await page.click('a:has-text("Book a Trip")');
      await expect(page).toHaveURL(/.*\/book/);

      // Take screenshot of booking page
      await page.screenshot({ path: 'test-results/03-booking-page.png' });
    });

    // Step 3: Fill booking form
    await test.step('Fill booking form', async () => {
      // Wait for form to load
      await page.waitForTimeout(2000);

      // Check if round trip radio exists before trying to use it
      const roundTripExists = (await page.$('#round-trip')) !== null;
      if (roundTripExists) {
        // Select round trip
        await page.check('#round-trip');
      }

      // Set dates if the fields exist
      const startDateExists = (await page.$('#startDate')) !== null;
      if (startDateExists) {
        const departureDate = new Date();
        departureDate.setDate(departureDate.getDate() + 7);
        const formattedDepartureDate = departureDate.toISOString().split('T')[0];
        await page.fill('#startDate', formattedDepartureDate);

        // Check for return date field
        const returnDateExists = (await page.$('#returnDate')) !== null;
        if (returnDateExists) {
          const returnDate = new Date();
          returnDate.setDate(returnDate.getDate() + 14);
          const formattedReturnDate = returnDate.toISOString().split('T')[0];
          await page.fill('#returnDate', formattedReturnDate);
        }
      }

      // Check for and fill traveler fields if they exist
      const fields = ['fullName', 'email', 'phone', 'travelers'];
      for (const field of fields) {
        const fieldExists = (await page.$(`input[name="${field}"]`)) !== null;
        if (fieldExists) {
          if (field === 'travelers') {
            // Clear and set travelers to 2
            await page.fill(`input[name="${field}"]`, '');
            await page.fill(`input[name="${field}"]`, '2');
          } else {
            await page.fill(
              `input[name="${field}"]`,
              field === 'email' ? 'test@example.com' : 'Test Traveler'
            );
          }
        }
      }

      // Take screenshot of filled form
      await page.screenshot({ path: 'test-results/04-booking-form-filled.png' });
    });

    // Step 4: Submit booking
    await test.step('Submit booking', async () => {
      // Find button containing text like "Book", "Submit", or "Continue"
      const bookButton = await page.getByRole('button', { name: /Book|Submit|Continue/i });
      await bookButton.click();

      // Wait for navigation away from booking page
      await expect(page).not.toHaveURL(/.*\/book/, { timeout: 10000 });

      // Take screenshot of result page
      await page.screenshot({ path: 'test-results/05-booking-result.png' });

      // Check for words that would indicate success
      const pageContent = await page.textContent('body');
      expect(pageContent.toLowerCase()).toMatch(/confirmation|confirmed|booked|success/);
    });

    // Step 5: View booking in profile
    await test.step('Check booking in profile', async () => {
      // Navigate to profile page by clicking the link
      await page.click('a:has-text("My Profile")');

      // Verify profile page loads
      await expect(page.locator('text=/Profile|Account/i')).toBeVisible();

      // Take screenshot of profile page with bookings
      await page.screenshot({ path: 'test-results/06-profile-with-bookings.png' });

      // Verify bookings section exists
      await expect(page.locator('text=/My Bookings|Bookings|Trips|Itineraries/i')).toBeVisible();
    });
  });

  test('login with test user button shortcut', async ({ page }) => {
    // Step 1: Go to login page
    await page.click('text=Login');
    await expect(page).toHaveURL(/.*\/login/);

    // Take screenshot before clicking test user button
    await page.screenshot({ path: 'test-results/07-before-test-user-login.png' });

    // Click test user login button
    await page.click('button:has-text("Test User Login")');

    // Verify login succeeded
    await page.waitForTimeout(1000); // Wait for login process

    // Take screenshot after login
    await page.screenshot({ path: 'test-results/08-after-test-user-login.png' });

    // Verify token was stored
    const token = await page.evaluate(() => localStorage.getItem('token'));
    expect(token).toBeTruthy();

    // Verify user is logged in by checking for profile link
    await expect(page.locator('a:has-text("My Profile")')).toBeVisible();
  });
});
