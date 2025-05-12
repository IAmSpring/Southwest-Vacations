// Playwright test runner for Southwest Vacations booking tests
const { chromium } = require('playwright');
const { testBookingProcess } = require('./booking-test.js');

/**
 * Main function to run the booking test
 */
async function runTest() {
  console.log('Starting Southwest Vacations booking test runner');
  let browser = null;
  
  try {
    // Launch browser
    console.log('Launching browser...');
    browser = await chromium.launch({ 
      headless: false,
      slowMo: 100 // Slow down actions by 100ms for better visibility
    });
    
    // Create new page
    const context = await browser.newContext();
    const page = await context.newPage();
    
    // Run the booking test
    console.log('Starting booking test process...');
    const testResult = await testBookingProcess(page);
    
    // Report results
    if (testResult) {
      console.log('🎉 TEST PASSED: Booking process completed successfully');
    } else {
      console.log('❌ TEST FAILED: Booking process did not complete successfully');
      process.exit(1);
    }
  } catch (error) {
    console.error('❌ Test runner error:', error);
    process.exit(1);
  } finally {
    // Close browser
    if (browser) {
      await browser.close();
      console.log('Browser closed');
    }
  }
}

// Run the test
runTest().catch(err => {
  console.error('Unhandled error in test runner:', err);
  process.exit(1);
}); 