import express from 'express';
import fs from 'fs';
import path from 'path';

const router = express.Router();

interface TestScreenshot {
  id: string;
  name: string;
  path: string;
  testName: string;
  timestamp: string;
  framework: 'cypress' | 'playwright' | 'other';
}

// Get all test screenshots, grouped by test suite
router.get('/api/test-screenshots', (req, res) => {
  try {
    const allScreenshots: Record<string, TestScreenshot[]> = {};

    // Process Cypress screenshots
    const cypressScreenshots = getCypressScreenshots();
    Object.assign(allScreenshots, cypressScreenshots);

    // Process Playwright screenshots
    const playwrightScreenshots = getPlaywrightScreenshots();
    Object.assign(allScreenshots, playwrightScreenshots);

    // TODO: Add support for other frameworks as needed

    res.status(200).json({ screenshots: allScreenshots });
  } catch (error) {
    console.error('Error getting screenshots:', error);
    res.status(500).json({ error: 'Failed to get test screenshots' });
  }
});

// Function to get Cypress screenshots
function getCypressScreenshots(): Record<string, TestScreenshot[]> {
  const allScreenshots: Record<string, TestScreenshot[]> = {};
  const screenshotsDir = path.join(process.cwd(), 'cypress/screenshots');

  // Check if the directory exists
  if (!fs.existsSync(screenshotsDir)) {
    return allScreenshots;
  }

  // Read all test suite directories
  const testSuites = fs
    .readdirSync(screenshotsDir)
    .filter(item => fs.statSync(path.join(screenshotsDir, item)).isDirectory());

  // Process each test suite
  testSuites.forEach(testSuite => {
    const testSuitePath = path.join(screenshotsDir, testSuite);
    const testSuiteKey = `cypress-${testSuite.replace('.cy.ts', '')}`;

    // Read all screenshots in this test suite
    const screenshots = fs
      .readdirSync(testSuitePath)
      .filter(item => item.endsWith('.png'))
      .map((filename, index) => {
        // Parse test name from filename
        const testNameMatch = filename.match(/--\s(.*?)\s\(/);
        const testName = testNameMatch ? testNameMatch[1] : filename;

        // Create a simplified name
        const simpleName = testName.split(' ').slice(0, 4).join(' ');

        // Use file stats for timestamp
        const stats = fs.statSync(path.join(testSuitePath, filename));

        return {
          id: `${testSuiteKey}-${index + 1}`,
          name: simpleName,
          path: `/api/test-screenshots/cypress/${testSuite}/${encodeURIComponent(filename)}`,
          testName: testName,
          timestamp: stats.mtime.toISOString(),
          framework: 'cypress' as const,
        };
      });

    if (screenshots.length > 0) {
      allScreenshots[testSuiteKey] = screenshots;
    }
  });

  return allScreenshots;
}

// Function to get Playwright screenshots
function getPlaywrightScreenshots(): Record<string, TestScreenshot[]> {
  const allScreenshots: Record<string, TestScreenshot[]> = {};
  const screenshotsDir = path.join(process.cwd(), 'test-results');

  // Check if the directory exists
  if (!fs.existsSync(screenshotsDir)) {
    return allScreenshots;
  }

  // Read all test result directories (excluding .playwright-artifacts directories)
  const testSuites = fs
    .readdirSync(screenshotsDir)
    .filter(
      item =>
        fs.statSync(path.join(screenshotsDir, item)).isDirectory() &&
        !item.startsWith('.playwright-artifacts')
    );

  // Process each test suite
  testSuites.forEach(testSuite => {
    const testSuitePath = path.join(screenshotsDir, testSuite);
    // Create a more readable test suite name
    const testSuiteKey = `playwright-${testSuite.split('-').slice(0, 3).join('-')}`;

    // Read all screenshots in this test suite (usually named test-failed-1.png, etc.)
    const screenshots = fs
      .readdirSync(testSuitePath)
      .filter(item => item.endsWith('.png'))
      .map((filename, index) => {
        // Extract test information from directory name
        // Format example: booking-management-Booking-ebc0f-ment-should-cancel-bookings
        const nameParts = testSuite.split('-');
        const testType = nameParts.slice(0, 2).join(' ');
        let testName = '';

        // Try to extract a readable test name from the directory
        if (nameParts.length > 4) {
          // Join the latter parts to make a readable test name
          testName = nameParts.slice(Math.min(4, nameParts.length - 1)).join(' ');
        } else {
          testName = testSuite;
        }

        // Create a simplified name
        const simpleName = `${testType} - ${filename.replace('.png', '')}`;

        // Use file stats for timestamp
        const stats = fs.statSync(path.join(testSuitePath, filename));

        return {
          id: `${testSuiteKey}-${index + 1}`,
          name: simpleName,
          path: `/api/test-screenshots/playwright/${testSuite}/${encodeURIComponent(filename)}`,
          testName: testName,
          timestamp: stats.mtime.toISOString(),
          framework: 'playwright' as const,
        };
      });

    if (screenshots.length > 0) {
      allScreenshots[testSuiteKey] = screenshots;
    }
  });

  return allScreenshots;
}

// Get a specific screenshot image
router.get('/api/test-screenshots/:framework/:suite/:filename', (req, res) => {
  try {
    const { framework, suite, filename } = req.params;
    let imagePath;

    if (framework === 'cypress') {
      imagePath = path.join(
        process.cwd(),
        'cypress/screenshots',
        suite,
        decodeURIComponent(filename)
      );
    } else if (framework === 'playwright') {
      imagePath = path.join(process.cwd(), 'test-results', suite, decodeURIComponent(filename));
    } else {
      return res.status(404).send('Unsupported test framework');
    }

    if (!fs.existsSync(imagePath)) {
      return res.status(404).send('Screenshot not found');
    }

    res.sendFile(imagePath);
  } catch (error) {
    console.error('Error serving screenshot:', error);
    res.status(500).send('Failed to serve screenshot');
  }
});

export default router;
