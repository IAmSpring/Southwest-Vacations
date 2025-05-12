// Southwest Vacations Booking Process Test
// This script provides an automated test for the booking flow

/**
 * Tests the end-to-end booking process for Southwest Vacations
 */
async function testBookingProcess(page) {
  console.log('Starting Southwest Vacations booking test');
  
  try {
    // 1. Navigate to homepage
    await page.goto('http://localhost:5173/');
    console.log('✅ Loaded homepage');
    
    // 2. Verify user is logged in
    const isLoggedIn = await page.evaluate(() => {
      return !!localStorage.getItem('token');
    });
    
    if (!isLoggedIn) {
      console.log('❌ User not logged in. Logging in first...');
      await loginUser(page);
    } else {
      console.log('✅ User already logged in');
    }
    
    // 3. Navigate to booking page
    await page.click('a[href="#/book"]');
    await page.waitForTimeout(1000);
    console.log('✅ Navigated to booking page');
    
    // 4. Fill booking form
    // Select One Way trip
    await page.check('input[value="One Way"]');
    
    // Set departure date (30 days from now)
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 30);
    const formattedDate = futureDate.toISOString().split('T')[0];
    
    await page.fill('input[type="date"]', formattedDate);
    console.log(`✅ Set departure date to ${formattedDate}`);
    
    // 5. Submit booking
    await page.click('button:has-text("Book Now")');
    await page.waitForTimeout(3000);
    console.log('✅ Submitted booking form');
    
    // 6. Verify booking was successful
    const currentUrl = page.url();
    console.log(`Current URL after booking: ${currentUrl}`);
    
    // Look for confirmation page or confirmation elements
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
    
    if (hasSuccessIndicator || currentUrl.includes('confirmation')) {
      console.log('✅ PASS: Booking was successful');
      return true;
    } else {
      console.log('❌ FAIL: Booking confirmation not detected');
      return false;
    }
    
  } catch (error) {
    console.error('❌ Test failed with error:', error);
    return false;
  }
}

/**
 * Helper function to log in a test user
 */
async function loginUser(page) {
  try {
    // Navigate to login page
    await page.goto('http://localhost:5173/#/login');
    await page.waitForTimeout(1000);
    
    // Use quick login button for test user
    const testLoginButton = await page.$('button:has-text("Test User Login")');
    if (testLoginButton) {
      await testLoginButton.click();
    } else {
      // Manual login
      await page.fill('input[type="email"]', 'test@example.com');
      await page.fill('input[type="password"]', 'Password123');
      await page.click('button[type="submit"]');
    }
    
    await page.waitForTimeout(2000);
    
    // Verify login was successful
    const isLoggedIn = await page.evaluate(() => {
      return !!localStorage.getItem('token');
    });
    
    if (isLoggedIn) {
      console.log('✅ Login successful');
      return true;
    } else {
      console.log('❌ Login failed');
      return false;
    }
  } catch (error) {
    console.error('❌ Login failed with error:', error);
    return false;
  }
}

// For use with Playwright
module.exports = { testBookingProcess, loginUser };

// For manual execution in browser
if (typeof window !== 'undefined') {
  window.runBookingTest = async () => {
    const result = await testBookingProcess(window);
    console.log('Test completed with result:', result);
    return result;
  };
} 