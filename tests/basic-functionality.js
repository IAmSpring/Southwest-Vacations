// Basic functionality test
import { chromium } from '@playwright/test';

(async () => {
  console.log('Testing basic functionality of Southwest Vacations app...');
  
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  try {
    // Load the homepage
    console.log('Loading homepage...');
    await page.goto('http://localhost:5173/');
    await page.waitForTimeout(2000);
    
    // Check if the title is correct
    const title = await page.title();
    console.log(`Page title: ${title}`);
    if (title.includes('Southwest Vacations')) {
      console.log('✅ Title check passed');
    } else {
      console.log('❌ Title check failed');
    }
    
    // Look for the main content
    const hasMainContent = await page.isVisible('text=Southwest Vacations');
    console.log(`Main content visible: ${hasMainContent}`);
    if (hasMainContent) {
      console.log('✅ Main content check passed');
    } else {
      console.log('❌ Main content check failed');
    }
    
    // Try to navigate to the login page
    console.log('Navigating to login page...');
    await page.click('text=Login');
    await page.waitForTimeout(2000);
    
    const currentUrl = page.url();
    console.log(`Current URL: ${currentUrl}`);
    if (currentUrl.includes('login')) {
      console.log('✅ Login navigation check passed');
    } else {
      console.log('❌ Login navigation check failed');
    }
    
    // Check if login form is visible
    const hasLoginForm = await page.isVisible('#email') && await page.isVisible('#password');
    console.log(`Login form visible: ${hasLoginForm}`);
    if (hasLoginForm) {
      console.log('✅ Login form check passed');
    } else {
      console.log('❌ Login form check failed');
    }
    
    // Try to log in
    console.log('Attempting to log in...');
    await page.fill('#email', 'test@example.com');
    await page.fill('#password', 'Password123');
    await page.click('button:has-text("Login")');
    await page.waitForTimeout(2000);
    
    // Check if login was successful (look for token in localStorage)
    const token = await page.evaluate(() => localStorage.getItem('token'));
    console.log(`Login token: ${token ? 'Present' : 'Not found'}`);
    if (token) {
      console.log('✅ Login check passed');
    } else {
      console.log('❌ Login check failed');
    }
    
    // Navigate to home page
    console.log('Navigating back to home page...');
    await page.goto('http://localhost:5173/');
    await page.waitForTimeout(2000);
    
    // Check if we can see the trips
    console.log('Checking for trip content...');
    const hasTrips = await page.isVisible('text=Book a Trip');
    console.log(`Trips navigation visible: ${hasTrips}`);
    if (hasTrips) {
      console.log('✅ Trips navigation check passed');
    } else {
      console.log('❌ Trips navigation check failed');
    }
    
    console.log('Basic functionality test completed!');
  } catch (error) {
    console.error('❌ Test failed with error:', error);
  } finally {
    // Close browser
    await browser.close();
  }
})(); 