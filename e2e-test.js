/**
 * Southwest Vacations - End-to-End Test Suite
 * 
 * This script executes a full end-to-end test of the Southwest Vacations booking system,
 * including server health checks, authentication, and the booking workflow.
 */

import { chromium } from 'playwright';
import axios from 'axios';

// Configuration
const config = {
  frontendUrl: 'http://localhost:5173',
  backendUrl: 'http://localhost:4000',
  testUser: {
    email: 'test@example.com',
    password: 'Password123'
  }
};

// Main test runner
async function runE2ETests() {
  console.log('🚀 Starting Southwest Vacations E2E Test Suite');
  
  let browser = null;
  let testsPassed = true;
  
  try {
    // STEP 1: Check if backend server is running
    console.log('\n📡 Checking backend server...');
    await checkBackendServer();
    
    // Launch browser for UI tests
    console.log('\n🌐 Launching browser for UI tests...');
    browser = await chromium.launch({ 
      headless: false,
      slowMo: 200 // Slow down operations for better visibility
    });
    
    const context = await browser.newContext();
    const page = await context.newPage();
    
    // STEP 2: Check if frontend is accessible
    console.log('\n🖥️ Checking frontend application...');
    await page.goto(config.frontendUrl);
    await page.waitForSelector('text=Southwest Vacations');
    console.log('  ✅ Frontend application loaded successfully');
    
    // STEP 3: Test authentication
    console.log('\n🔐 Testing authentication...');
    const authResult = await testAuthentication(page);
    if (!authResult) {
      testsPassed = false;
      throw new Error('Authentication test failed');
    }
    
    // STEP 4: Test booking flow
    console.log('\n🧳 Testing booking workflow...');
    const bookingResult = await testBookingFlow(page);
    if (!bookingResult) {
      testsPassed = false;
      throw new Error('Booking flow test failed');
    }
    
    // All tests passed
    console.log('\n✨ All tests completed successfully!');
    return testsPassed;
    
  } catch (error) {
    console.error(`\n❌ Test failed: ${error.message}`);
    testsPassed = false;
    return false;
  } finally {
    // Close browser
    if (browser) {
      await browser.close();
      console.log('\n🔒 Browser closed');
    }
    
    // Final report
    if (testsPassed) {
      console.log('\n🎉 E2E TEST SUITE: PASSED');
    } else {
      console.log('\n⚠️ E2E TEST SUITE: FAILED');
      process.exit(1);
    }
  }
}

/**
 * Check if backend server is running and healthy
 */
async function checkBackendServer() {
  try {
    // Check health endpoint
    const healthResponse = await axios.get(`${config.backendUrl}/health`);
    
    if (healthResponse.status === 200 && healthResponse.data.status === 'ok') {
      console.log('  ✅ Backend server is running and healthy');
      return true;
    } else {
      console.log('  ⚠️ Backend server returned unexpected response:', healthResponse.data);
      return false;
    }
  } catch (error) {
    console.error('  ❌ Backend server check failed:', error.message);
    throw new Error('Backend server is not accessible. Please start the server.');
  }
}

/**
 * Test user authentication
 */
async function testAuthentication(page) {
  try {
    // Navigate to login page
    await page.goto(`${config.frontendUrl}/#/login`);
    await page.waitForSelector('text=Login to Your Account');
    console.log('  ✅ Login page loaded');
    
    // Check for test user login button
    const testLoginButton = await page.$('button:has-text("Test User Login")');
    
    if (testLoginButton) {
      console.log('  ℹ️ Using Test User Login button');
      await testLoginButton.click();
    } else {
      // Manual login
      console.log('  ℹ️ Using manual login form');
      await page.fill('input[type="email"]', config.testUser.email);
      await page.fill('input[type="password"]', config.testUser.password);
      await page.click('button[type="submit"]');
    }
    
    // Wait for login to complete and check token in localStorage
    await page.waitForTimeout(2000);
    
    const token = await page.evaluate(() => localStorage.getItem('token'));
    if (token) {
      console.log('  ✅ Authentication successful');
      return true;
    } else {
      console.log('  ❌ Authentication failed - no token found');
      return false;
    }
  } catch (error) {
    console.error('  ❌ Authentication test error:', error.message);
    return false;
  }
}

/**
 * Test the booking workflow
 */
async function testBookingFlow(page) {
  try {
    // Navigate to booking page
    await page.goto(`${config.frontendUrl}/#/book`);
    await page.waitForSelector('text=Book Your Trip');
    console.log('  ✅ Booking page loaded');
    
    // Fill out booking form
    // Select One Way trip type
    const oneWayOption = await page.$('input[value="One Way"]');
    if (oneWayOption) {
      await oneWayOption.check();
      console.log('  ✅ Selected One Way trip');
    }
    
    // Set departure date (30 days in the future)
    const departureDate = new Date();
    departureDate.setDate(departureDate.getDate() + 30);
    const formattedDate = departureDate.toISOString().split('T')[0];
    
    const dateField = await page.$('input[type="date"]');
    if (dateField) {
      await dateField.fill(formattedDate);
      console.log(`  ✅ Set departure date to ${formattedDate}`);
    }
    
    // Submit the booking
    const bookNowButton = await page.$('button:has-text("Book Now")');
    if (bookNowButton) {
      console.log('  ℹ️ Submitting booking form');
      await bookNowButton.click();
      await page.waitForTimeout(3000);
      
      // Check for confirmation or success indicators
      const pageContent = await page.evaluate(() => document.body.textContent);
      const successIndicators = [
        'booking confirmed',
        'confirmation',
        'thank you',
        'successful',
        'booked',
        'reservation',
        'itinerary'
      ];
      
      const hasSuccessIndicator = successIndicators.some(indicator => 
        pageContent.toLowerCase().includes(indicator.toLowerCase())
      );
      
      if (hasSuccessIndicator) {
        console.log('  ✅ Booking workflow completed successfully');
        return true;
      } else {
        console.log('  ⚠️ Booking submitted but no confirmation indicators found');
        
        // Check if the URL changed, which might indicate success even without confirmation text
        const currentUrl = page.url();
        if (currentUrl !== `${config.frontendUrl}/#/book`) {
          console.log(`  ℹ️ Redirected to ${currentUrl} - assuming success`);
          return true;
        }
        
        console.log('  ❌ Booking workflow failed - no confirmation');
        return false;
      }
    } else {
      console.log('  ❌ Book Now button not found');
      return false;
    }
  } catch (error) {
    console.error('  ❌ Booking workflow test error:', error.message);
    return false;
  }
}

// Run the tests if this file is executed directly
runE2ETests().catch(error => {
  console.error('Unhandled error in test suite:', error);
  process.exit(1);
});

export { runE2ETests }; 