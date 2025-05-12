import { test, expect } from '@playwright/test';

test.describe('Employee Training Certification Process', () => {
  test('should navigate to the login page correctly', async ({ page }) => {
    await page.goto('http://localhost:5173/#/login');
    await expect(page.locator('text=Login to Your Account')).toBeVisible();
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
  });

  test.describe('Training module tests', () => {
    test.beforeEach(async ({ page }) => {
      // Mock authentication
      await page.goto('http://localhost:5173/#/login');
      
      await page.evaluate(() => {
        localStorage.setItem('auth_token', 'test-token');
        localStorage.setItem('user', JSON.stringify({
          id: 1, 
          email: 'test@example.com',
          name: 'Test User',
          role: 'admin' // Setting as admin to test all features
        }));
      });
      
      // Navigate to training portal
      await page.goto('http://localhost:5173/#/training');
    });
    
    test('should display available training modules', async ({ page }) => {
      // Verify page title
      await expect(page.locator('h1')).toContainText('Employee Training Portal');
      
      // Check for presence of module list
      await expect(page.locator('.module-list')).toBeVisible();
      
      // Verify that all expected modules are displayed
      await expect(page.locator('[data-testid="training-module-module-1"]')).toBeVisible();
      await expect(page.locator('[data-testid="training-module-module-2"]')).toBeVisible();
      await expect(page.locator('[data-testid="training-module-module-3"]')).toBeVisible();
      await expect(page.locator('[data-testid="training-module-module-4"]')).toBeVisible();
      await expect(page.locator('[data-testid="training-module-module-5"]')).toBeVisible();
      
      // Check content of first module
      await expect(page.locator('[data-testid="training-module-module-1"]')).toContainText('Customer Service Basics');
      await expect(page.locator('[data-testid="training-module-module-1"]')).toContainText('Learn the fundamentals');
      
      // Check that progress is displayed correctly for completed module
      await expect(page.locator('[data-testid="training-module-module-1"]')).toContainText('100% Complete');
      await expect(page.locator('[data-testid="training-module-module-1"]')).toContainText('Completed');
      
      // Check that in-progress module shows correct status
      await expect(page.locator('[data-testid="training-module-module-2"]')).toContainText('60% Complete');
      await expect(page.locator('[data-testid="training-module-module-2"]')).toContainText('In Progress');
    });

    test('should allow completing a training module', async ({ page }) => {
      // Start a module that hasn't been started yet
      await page.click('[data-testid="start-module-module-3"]');
      
      // Verify we're now in the module content view
      await expect(page.locator('h2')).toContainText('Travel Package Upselling');
      
      // Click the "Mark as Complete" button
      await page.click('[data-testid="complete-module-module-3"]');
      
      // Verify we're back to the module list
      await expect(page.locator('.module-list')).toBeVisible();
      
      // Check that the module now shows as completed
      await expect(page.locator('[data-testid="training-module-module-3"]')).toContainText('100% Complete');
      await expect(page.locator('[data-testid="training-module-module-3"]')).toContainText('Certified on');
    });

    test('should track certification status', async ({ page }) => {
      // Check initial certification status for module 1
      await expect(page.locator('[data-testid="training-module-module-1"]')).toContainText('Certified on');
      
      // Start a module that hasn't been started yet
      await page.click('[data-testid="start-module-module-4"]');
      
      // Complete the module
      await page.click('[data-testid="complete-module-module-4"]');
      
      // Verify certification date is displayed
      const today = new Date().toISOString().split('T')[0];
      await expect(page.locator('[data-testid="training-module-module-4"]')).toContainText('Certified on');
      
      // Check module 2 which is in progress
      await page.click('[data-testid="continue-module-module-2"]');
      
      // Complete the module
      await page.click('[data-testid="complete-module-module-2"]');
      
      // Verify it now shows as certified
      await expect(page.locator('[data-testid="training-module-module-2"]')).toContainText('Certified on');
    });

    test('should allow assigning training to employees', async ({ page }) => {
      // Check for admin controls
      await expect(page.locator('.admin-controls')).toBeVisible();
      
      // Click on assign training button
      await page.click('[data-testid="assign-training-btn"]');
      
      // Verify assignment modal is displayed
      await expect(page.locator('text=Assign Training Modules')).toBeVisible();
      
      // Select some employees and modules
      await page.check('[data-testid="employee-checkbox-1"]');
      await page.check('[data-testid="employee-checkbox-2"]');
      await page.check('[data-testid="module-checkbox-module-1"]');
      await page.check('[data-testid="module-checkbox-module-2"]');
      
      // Click assign button
      await page.click('[data-testid="confirm-assign-btn"]');
      
      // Ensure modal is closed after assignment
      await expect(page.locator('text=Assign Training Modules')).not.toBeVisible();
    });

    test('should generate certification report', async ({ page }) => {
      // Intercept and mock the alert function to avoid blocking the test
      page.on('dialog', async dialog => {
        expect(dialog.message()).toContain('Certification report generated');
        await dialog.accept();
      });
      
      // Click on generate report button
      await page.click('[data-testid="generate-report-btn"]');
      
      // No additional verification needed as we're testing the alert behavior
    });
    
    // Test for course study page navigation
    test('should navigate to course study page', async ({ page }) => {
      // First navigate to training portal
      await page.goto('http://localhost:5173/#/training');
      
      // Continue an in-progress module
      await page.click('[data-testid="continue-module-module-2"]');
      
      // Go through each section of the module
      await expect(page.locator('[data-testid="next-section-btn"]')).toBeVisible();
      await page.click('[data-testid="next-section-btn"]');
      
      // Go to next section
      await expect(page.locator('[data-testid="next-section-btn"]')).toBeVisible();
      await page.click('[data-testid="next-section-btn"]');
      
      // Go to next section (assessment)
      await expect(page.locator('[data-testid="next-section-btn"]')).toBeVisible();
      await page.click('[data-testid="next-section-btn"]');
      
      // Complete the assessment
      await expect(page.locator('[data-testid="complete-assessment-btn"]')).toBeVisible();
      
      // Handle alert for completion
      page.on('dialog', async dialog => {
        expect(dialog.message()).toContain('Congratulations');
        await dialog.accept();
      });
      
      await page.click('[data-testid="complete-assessment-btn"]');
      
      // Navigate back to training portal and verify module is completed
      await page.click('text=Back to Training Portal');
      await expect(page.locator('[data-testid="training-module-module-2"]')).toContainText('Certified on');
    });
  });
});
