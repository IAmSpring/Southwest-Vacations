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
}

// Get all test screenshots, grouped by test suite
router.get('/api/test-screenshots', (req, res) => {
  try {
    const screenshotsDir = path.join(process.cwd(), 'cypress/screenshots');

    // Check if the directory exists
    if (!fs.existsSync(screenshotsDir)) {
      return res.status(200).json({ screenshots: {} });
    }

    // Read all test suite directories
    const testSuites = fs
      .readdirSync(screenshotsDir)
      .filter(item => fs.statSync(path.join(screenshotsDir, item)).isDirectory());

    const allScreenshots: Record<string, TestScreenshot[]> = {};

    // Process each test suite
    testSuites.forEach(testSuite => {
      const testSuitePath = path.join(screenshotsDir, testSuite);
      const testSuiteKey = testSuite.replace('.cy.ts', '');

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
            path: `/api/test-screenshots/${testSuite}/${encodeURIComponent(filename)}`,
            testName: testName,
            timestamp: stats.mtime.toISOString(),
          };
        });

      if (screenshots.length > 0) {
        allScreenshots[testSuiteKey] = screenshots;
      }
    });

    res.status(200).json({ screenshots: allScreenshots });
  } catch (error) {
    console.error('Error getting screenshots:', error);
    res.status(500).json({ error: 'Failed to get test screenshots' });
  }
});

// Get a specific screenshot image
router.get('/api/test-screenshots/:suite/:filename', (req, res) => {
  try {
    const { suite, filename } = req.params;
    const imagePath = path.join(
      process.cwd(),
      'cypress/screenshots',
      suite,
      decodeURIComponent(filename)
    );

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
