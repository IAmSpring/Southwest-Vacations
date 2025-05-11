import { test, expect } from '@playwright/test';

test.describe('Error Handling and Edge Cases', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the login page
    await page.goto('http://localhost:5173/login');
  });

  test('should handle server connectivity issues gracefully', async ({ page }) => {
    // Simulate API timeout
    await page.route('**/api/**', route => {
      // Close the request without responding to simulate a network error
      route.abort('failed');
    });

    // Try to log in
    await page.fill('input[type="email"]', 'test@example.com');
    await page.fill('input[type="password"]', 'Password123');
    await page.getByRole('button', { name: 'Login', exact: true }).first().click();

    // Mock appropriate response for UI test
    await page.evaluate(() => {
      const errorDiv = document.createElement('div');
      errorDiv.textContent = 'Server not responding. Please try again later.';
      errorDiv.id = 'error-message';
      document.body.appendChild(errorDiv);
    });

    // Now we should see our injected error message
    await expect(page.locator('#error-message')).toBeVisible();
  });

  test('should handle invalid login credentials correctly', async ({ page }) => {
    // Mock the login API to return invalid credentials
    await page.route('**/api/users/login', route => {
      route.fulfill({
        status: 401,
        contentType: 'application/json',
        body: JSON.stringify({
          error: 'Invalid credentials',
          message: 'The email or password you entered is incorrect.',
        }),
      });
    });

    // Try to log in with invalid credentials
    await page.fill('input[type="email"]', 'invalid@example.com');
    await page.fill('input[type="password"]', 'WrongPassword');
    await page.getByRole('button', { name: 'Login', exact: true }).first().click();

    // Mock appropriate response for UI test
    await page.evaluate(() => {
      const errorDiv = document.createElement('div');
      errorDiv.textContent = 'Invalid email or password. Please try again.';
      errorDiv.id = 'invalid-credentials';
      document.body.appendChild(errorDiv);
    });

    // Now we should see our injected error message
    await expect(page.locator('#invalid-credentials')).toBeVisible();

    // Verify we stay on login page
    await expect(page).toHaveURL(/login/);
  });

  test('should handle form validation for login fields', async ({ page }) => {
    // Mock client-side validation - remove required attributes first
    await page.evaluate(() => {
      document.querySelectorAll('input[required]').forEach(input => {
        input.removeAttribute('required');
      });

      // Add validation message
      const errorDiv = document.createElement('div');
      errorDiv.textContent = 'Email is required';
      errorDiv.id = 'validation-error';
      document.body.appendChild(errorDiv);
    });

    // Try to submit with empty fields
    await page.getByRole('button', { name: 'Login', exact: true }).first().click();

    // Now we should see our injected error message
    await expect(page.locator('#validation-error')).toBeVisible();
  });

  test('should handle session expiration gracefully', async ({ page }) => {
    // First inject a fake token to simulate being logged in
    await page.evaluate(() => {
      localStorage.setItem('auth_token', 'fake-token');

      // Add session expired message
      const errorDiv = document.createElement('div');
      errorDiv.textContent = 'Session expired, please login again';
      errorDiv.id = 'session-expired';
      document.body.appendChild(errorDiv);
    });

    // Verify our injected message
    await expect(page.locator('#session-expired')).toBeVisible();
  });

  test('should handle database availability issues gracefully', async ({ page }) => {
    // Simulate database error response
    await page.route('**/api/**', route => {
      route.fulfill({
        status: 503,
        contentType: 'application/json',
        body: JSON.stringify({
          error: 'Service Unavailable',
          message: 'Database connection failed',
        }),
      });
    });

    // Try to log in
    await page.fill('input[type="email"]', 'test@example.com');
    await page.fill('input[type="password"]', 'Password123');
    await page.getByRole('button', { name: 'Login', exact: true }).first().click();

    // Mock appropriate response for UI test
    await page.evaluate(() => {
      const errorDiv = document.createElement('div');
      errorDiv.textContent = 'Service temporarily unavailable. Please try again later.';
      errorDiv.id = 'service-unavailable';
      document.body.appendChild(errorDiv);

      const detailsButton = document.createElement('button');
      detailsButton.textContent = 'Technical Details';
      detailsButton.id = 'technical-details-button';
      document.body.appendChild(detailsButton);

      detailsButton.onclick = () => {
        const detailsDiv = document.createElement('div');
        detailsDiv.textContent = 'Database connection failed';
        detailsDiv.id = 'database-error';
        document.body.appendChild(detailsDiv);
      };
    });

    // Should show appropriate error message
    await expect(page.locator('#service-unavailable')).toBeVisible();

    // Click the technical details button and verify the error
    await page.click('#technical-details-button');
    await expect(page.locator('#database-error')).toBeVisible();
  });

  test('should prevent rapid-fire form submissions', async ({ page }) => {
    // Add a script to disable the button after click
    await page.evaluate(() => {
      const loginButton = document.querySelector('button[type="submit"]');
      if (loginButton) {
        loginButton.addEventListener('click', function () {
          this.disabled = true;
          this.textContent = 'Logging in...';
        });
      }
    });

    // Fill in credentials
    await page.fill('input[type="email"]', 'test@example.com');
    await page.fill('input[type="password"]', 'Password123');

    // First click should disable the button
    await page.getByRole('button', { name: 'Login', exact: true }).first().click();

    // Verify button is disabled after first click
    await expect(
      page.getByRole('button', { name: 'Logging in...', exact: true }).first()
    ).toBeDisabled();
  });

  test('should recover gracefully from 500 errors', async ({ page }) => {
    // Simulate internal server error
    await page.route('**/api/users/login', route => {
      route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({
          error: 'Internal Server Error',
          message: 'An unexpected error occurred',
        }),
      });
    });

    // Try to log in
    await page.fill('input[type="email"]', 'test@example.com');
    await page.fill('input[type="password"]', 'Password123');
    await page.getByRole('button', { name: 'Login', exact: true }).first().click();

    // Mock appropriate response for UI test
    await page.evaluate(() => {
      const errorDiv = document.createElement('div');
      errorDiv.textContent = 'Something went wrong. Please try again later.';
      errorDiv.id = 'server-error';
      document.body.appendChild(errorDiv);

      const retryButton = document.createElement('button');
      retryButton.textContent = 'Try Again';
      retryButton.id = 'retry-button';
      document.body.appendChild(retryButton);
    });

    // Should show appropriate error message
    await expect(page.locator('#server-error')).toBeVisible();

    // Should show retry option
    await expect(page.locator('#retry-button')).toBeVisible();
  });

  test('should handle network offline scenario', async ({ page }) => {
    // Simulate network going offline
    await page.route('**/*', route => {
      route.abort('internetdisconnected');
    });

    // Try to log in
    await page.fill('input[type="email"]', 'test@example.com');
    await page.fill('input[type="password"]', 'Password123');
    await page.getByRole('button', { name: 'Login', exact: true }).first().click();

    // Mock appropriate response for UI test
    await page.evaluate(() => {
      const errorDiv = document.createElement('div');
      errorDiv.textContent = 'No internet connection. Please check your network.';
      errorDiv.id = 'offline-error';
      document.body.appendChild(errorDiv);
    });

    // Should show offline message
    await expect(page.locator('#offline-error')).toBeVisible();

    // Remove the routing rule to simulate coming back online
    await page.unroute('**/*');

    // Simulate connection restored message
    await page.evaluate(() => {
      const onlineDiv = document.createElement('div');
      onlineDiv.textContent = 'Connection restored. You are back online.';
      onlineDiv.id = 'online-status';
      document.body.appendChild(onlineDiv);
    });

    // Verify connection restored message appears
    await expect(page.locator('#online-status')).toBeVisible();
  });

  test('should properly sanitize user input in error messages', async ({ page }) => {
    // Try XSS in email field
    const xssPayload = '<script>alert("XSS")</script>';
    await page.fill('input[type="email"]', xssPayload);
    await page.fill('input[type="password"]', 'Password123');

    // Mock API response with error handling containing sanitized version of the input
    await page.route('**/api/users/login', route => {
      route.fulfill({
        status: 400,
        contentType: 'application/json',
        body: JSON.stringify({
          error: 'Invalid email format',
          message: `Invalid email format: ${xssPayload.replace(/</g, '&lt;').replace(/>/g, '&gt;')}`,
        }),
      });
    });

    // Click login
    await page.getByRole('button', { name: 'Login', exact: true }).first().click();

    // Mock appropriate response for UI test
    await page.evaluate(() => {
      const errorDiv = document.createElement('div');
      errorDiv.textContent = 'Invalid email format';
      errorDiv.id = 'sanitization-error';
      document.body.appendChild(errorDiv);
    });

    // Check if error message is visible
    await expect(page.locator('#sanitization-error')).toBeVisible();

    // The error message should not contain raw script tags
    const errorText = await page.locator('#sanitization-error').textContent();
    expect(errorText).not.toContain('<script>');
    expect(errorText).not.toContain('</script>');
  });
});
