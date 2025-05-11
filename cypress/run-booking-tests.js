// Script to run the full booking end-to-end tests
import cypress from 'cypress';

console.log('Running Southwest Vacations Booking End-to-End Tests...');

cypress.run({
  spec: './cypress/e2e/booking-end-to-end.cy.ts',
  browser: 'chrome',
  headed: true, // Set to true to see the browser during test execution
  video: true
})
  .then((results) => {
    if (results.totalFailed === 0) {
      console.log('✅ All tests passed successfully!');
      console.log(`Total tests: ${results.totalTests}`);
      console.log(`Total duration: ${results.totalDuration}ms`);
    } else {
      console.error(`❌ ${results.totalFailed} test(s) failed`);
      process.exit(1);
    }
  })
  .catch((err) => {
    console.error('Error running tests:', err);
    process.exit(1);
  }); 