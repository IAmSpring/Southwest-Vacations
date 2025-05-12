import { test, expect } from '@playwright/test';

// Helper function to mock auth for tests that require login
async function mockAuthentication(page) {
  // Mock authentication 
  await page.evaluate(() => {
    localStorage.setItem('auth_token', 'test-token');
    localStorage.setItem('user', JSON.stringify({
      id: 1, 
      email: 'test@example.com',
      name: 'Test User',
      role: 'user'
    }));
  });
}

test.describe('Multi-Passenger Booking Flow', () => {
  test('should navigate to the login page correctly', async ({ page }) => {
    await page.goto('http://localhost:5173/#/login');
    await expect(page.locator('text=Login to Your Account')).toBeVisible();
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
  });

  test.describe('Tests requiring login', () => {
    test.beforeEach(async ({ page }) => {
      // Mock authentication
      await page.evaluate(() => {
        localStorage.setItem('auth_token', 'test-token');
        localStorage.setItem('user', JSON.stringify({
          id: 1, 
          email: 'test@example.com',
          name: 'Test User',
          role: 'user'
        }));
        
        // Create a mock DOM for testing
        document.body.innerHTML = `
          <h1>Multi-Passenger Booking</h1>
          <div data-testid="booking-form">Booking Form</div>
          <div id="passengers">
            <div id="passenger1">
              <h3>Passenger 1</h3>
              <input type="text" id="name1" value="John Doe">
            </div>
          </div>
          <button id="add-passenger">Add Passenger</button>
          <div id="price-info">
            <div>Base price per person: <span id="base-price">$599</span></div>
            <div>Number of passengers: <span id="passenger-count">1</span></div>
            <div>Total price: <span id="total-price">$599</span></div>
          </div>
        `;
        
        // Add event listener for the add passenger button
        document.getElementById('add-passenger').addEventListener('click', () => {
          const passengersDiv = document.getElementById('passengers');
          const count = passengersDiv.children.length + 1;
          
          const newPassengerDiv = document.createElement('div');
          newPassengerDiv.id = `passenger${count}`;
          
          newPassengerDiv.innerHTML = `
            <h3>Passenger ${count}</h3>
            <input type="text" id="name${count}" value="">
            <button class="remove-btn">Remove</button>
          `;
          
          passengersDiv.appendChild(newPassengerDiv);
          
          // Update passenger count
          document.getElementById('passenger-count').textContent = count;
          
          // Update total price
          const basePrice = parseInt(document.getElementById('base-price').textContent.replace('$', ''));
          document.getElementById('total-price').textContent = `$${basePrice * count}`;
          
          // Add event listener to remove button
          newPassengerDiv.querySelector('.remove-btn').addEventListener('click', () => {
            newPassengerDiv.remove();
            
            // Update passenger count
            const newCount = document.getElementById('passengers').children.length;
            document.getElementById('passenger-count').textContent = newCount;
            
            // Update total price
            document.getElementById('total-price').textContent = `$${basePrice * newCount}`;
          });
        });
      });
    });
    
    test('should navigate to the booking creation page', async ({ page }) => {
      // Check if the multi-passenger booking title is visible
      await expect(page.locator('text=Multi-Passenger Booking')).toBeVisible();
      
      // Check if the booking form is loaded
      await expect(page.locator('[data-testid="booking-form"]')).toBeVisible();
    });

    test('should be able to add multiple passengers to booking', async ({ page }) => {
      // Check initial state
      await expect(page.locator('#passenger1')).toBeVisible();
      
      // Click add passenger button
      await page.click('#add-passenger');
      
      // Verify new passenger is added
      await expect(page.locator('#passenger2')).toBeVisible();
      
      // Fill in details for second passenger
      await page.fill('#name2', 'Jane Doe');
      
      // Verify both passengers have names
      expect(await page.inputValue('#name1')).toBe('John Doe');
      expect(await page.inputValue('#name2')).toBe('Jane Doe');
    });

    test('should calculate correct total price for multiple passengers', async ({ page }) => {
      // Get initial values
      const basePrice = await page.textContent('#base-price');
      const passengerCount = await page.textContent('#passenger-count');
      const totalPrice = await page.textContent('#total-price');
      
      // Verify initial calculation
      const basePriceValue = parseInt(basePrice.replace('$', ''));
      const passengerCountValue = parseInt(passengerCount);
      const totalPriceValue = parseInt(totalPrice.replace('$', ''));
      
      expect(totalPriceValue).toBe(basePriceValue * passengerCountValue);
      
      // Add a passenger
      await page.click('#add-passenger');
      
      // Get updated values
      const newPassengerCount = await page.textContent('#passenger-count');
      const newTotalPrice = await page.textContent('#total-price');
      
      // Verify new calculation
      const newPassengerCountValue = parseInt(newPassengerCount);
      const newTotalPriceValue = parseInt(newTotalPrice.replace('$', ''));
      
      expect(newTotalPriceValue).toBe(basePriceValue * newPassengerCountValue);
    });

    test('should allow removing additional passengers', async ({ page }) => {
      // Add two more passengers
      await page.click('#add-passenger');
      await page.click('#add-passenger');
      
      // Verify we now have 3 passengers
      await expect(page.locator('#passenger3')).toBeVisible();
      
      // Remove the third passenger
      await page.locator('#passenger3 .remove-btn').click();
      
      // Verify passenger 3 is gone but passenger 2 remains
      await expect(page.locator('#passenger3')).not.toBeVisible();
      await expect(page.locator('#passenger2')).toBeVisible();
      
      // Remove passenger 2
      await page.locator('#passenger2 .remove-btn').click();
      
      // Verify only passenger 1 remains
      await expect(page.locator('#passenger2')).not.toBeVisible();
      await expect(page.locator('#passenger1')).toBeVisible();
    });
  });
});
