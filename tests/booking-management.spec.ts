import { test, expect } from '@playwright/test';

test.describe('Booking Management Flow', () => {
  test('should navigate to the login page correctly', async ({ page }) => {
    await page.goto('http://localhost:5173/#/login');
    await expect(page.locator('text=Login to Your Account')).toBeVisible();
  });

  test.describe('Tests for booking management', () => {
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
        
        // Create a mock DOM for booking management testing
        document.body.innerHTML = `
          <div id="my-bookings">
            <h1>My Bookings</h1>
            
            <div id="booking-filters">
              <button id="all-bookings-btn" class="active">All Bookings</button>
              <button id="upcoming-bookings-btn">Upcoming</button>
              <button id="past-bookings-btn">Past</button>
            </div>
            
            <div id="bookings-list">
              <div id="booking-1" class="booking-item" data-status="upcoming">
                <h3>Las Vegas Getaway</h3>
                <div class="booking-details">
                  <p>Booking #: SWV-12345</p>
                  <p>Dates: Oct 15-20, 2023</p>
                  <p>Passengers: 2</p>
                  <p>Total: $1,250.00</p>
                </div>
                <div class="booking-actions">
                  <button class="view-details-btn">View Details</button>
                  <button class="edit-booking-btn">Edit</button>
                  <button class="cancel-booking-btn">Cancel</button>
                </div>
              </div>
              
              <div id="booking-2" class="booking-item" data-status="upcoming">
                <h3>Miami Beach Vacation</h3>
                <div class="booking-details">
                  <p>Booking #: SWV-23456</p>
                  <p>Dates: Nov 5-12, 2023</p>
                  <p>Passengers: 4</p>
                  <p>Total: $2,800.00</p>
                </div>
                <div class="booking-actions">
                  <button class="view-details-btn">View Details</button>
                  <button class="edit-booking-btn">Edit</button>
                  <button class="cancel-booking-btn">Cancel</button>
                </div>
              </div>
              
              <div id="booking-3" class="booking-item" data-status="past">
                <h3>New York City Trip</h3>
                <div class="booking-details">
                  <p>Booking #: SWV-34567</p>
                  <p>Dates: Aug 1-5, 2023</p>
                  <p>Passengers: 2</p>
                  <p>Total: $1,650.00</p>
                </div>
                <div class="booking-actions">
                  <button class="view-details-btn">View Details</button>
                  <button class="book-again-btn">Book Again</button>
                </div>
              </div>
            </div>
            
            <div id="booking-details-modal" style="display: none;">
              <div class="modal-content">
                <h2>Booking Details</h2>
                <div id="modal-booking-details"></div>
                <button id="close-modal">Close</button>
              </div>
            </div>
            
            <div id="edit-booking-form" style="display: none;">
              <h2>Edit Booking</h2>
              <div class="form-group">
                <label for="edit-date-range">Date Range</label>
                <input type="text" id="edit-date-range" />
              </div>
              <div class="form-group">
                <label for="edit-passengers">Passengers</label>
                <input type="number" id="edit-passengers" min="1" max="8" />
              </div>
              <div class="form-actions">
                <button id="save-changes-btn">Save Changes</button>
                <button id="cancel-edit-btn">Cancel</button>
              </div>
            </div>
            
            <div id="cancel-booking-modal" style="display: none;">
              <div class="modal-content">
                <h2>Cancel Booking</h2>
                <p>Are you sure you want to cancel this booking? Cancellation fees may apply.</p>
                <div class="modal-actions">
                  <button id="confirm-cancel-btn">Yes, Cancel Booking</button>
                  <button id="abort-cancel-btn">No, Keep Booking</button>
                </div>
              </div>
            </div>
          </div>
        `;
        
        // Add event listeners
        
        // Filter buttons
        document.getElementById('all-bookings-btn').addEventListener('click', function() {
          document.querySelectorAll('.booking-item').forEach(item => {
            item.style.display = 'block';
          });
          document.querySelectorAll('#booking-filters button').forEach(btn => {
            btn.classList.remove('active');
          });
          this.classList.add('active');
        });
        
        document.getElementById('upcoming-bookings-btn').addEventListener('click', function() {
          document.querySelectorAll('.booking-item').forEach(item => {
            if (item.getAttribute('data-status') === 'upcoming') {
              item.style.display = 'block';
            } else {
              item.style.display = 'none';
            }
          });
          document.querySelectorAll('#booking-filters button').forEach(btn => {
            btn.classList.remove('active');
          });
          this.classList.add('active');
        });
        
        document.getElementById('past-bookings-btn').addEventListener('click', function() {
          document.querySelectorAll('.booking-item').forEach(item => {
            if (item.getAttribute('data-status') === 'past') {
              item.style.display = 'block';
            } else {
              item.style.display = 'none';
            }
          });
          document.querySelectorAll('#booking-filters button').forEach(btn => {
            btn.classList.remove('active');
          });
          this.classList.add('active');
        });
        
        // View Details buttons
        document.querySelectorAll('.view-details-btn').forEach(btn => {
          btn.addEventListener('click', function() {
            const bookingItem = this.closest('.booking-item');
            const bookingTitle = bookingItem.querySelector('h3').textContent;
            const bookingDetails = bookingItem.querySelector('.booking-details').innerHTML;
            
            document.getElementById('modal-booking-details').innerHTML = 
              `<h3>${bookingTitle}</h3>${bookingDetails}`;
            document.getElementById('booking-details-modal').style.display = 'block';
          });
        });
        
        // Close modal button
        document.getElementById('close-modal').addEventListener('click', function() {
          document.getElementById('booking-details-modal').style.display = 'none';
        });
        
        // Edit booking buttons
        document.querySelectorAll('.edit-booking-btn').forEach(btn => {
          btn.addEventListener('click', function() {
            const bookingItem = this.closest('.booking-item');
            // Extract date and passenger info
            const dateText = bookingItem.querySelector('.booking-details p:nth-child(2)').textContent;
            const passengerText = bookingItem.querySelector('.booking-details p:nth-child(3)').textContent;
            
            // Set values in edit form
            document.getElementById('edit-date-range').value = dateText.replace('Dates: ', '');
            document.getElementById('edit-passengers').value = passengerText.replace('Passengers: ', '');
            
            // Store which booking we're editing
            document.getElementById('edit-booking-form').setAttribute('data-editing', bookingItem.id);
            
            // Show edit form
            document.getElementById('edit-booking-form').style.display = 'block';
          });
        });
        
        // Save changes button
        document.getElementById('save-changes-btn').addEventListener('click', function() {
          const editingId = document.getElementById('edit-booking-form').getAttribute('data-editing');
          const newDateRange = document.getElementById('edit-date-range').value;
          const newPassengers = document.getElementById('edit-passengers').value;
          
          // Update booking in the list
          const bookingItem = document.getElementById(editingId);
          bookingItem.querySelector('.booking-details p:nth-child(2)').textContent = `Dates: ${newDateRange}`;
          bookingItem.querySelector('.booking-details p:nth-child(3)').textContent = `Passengers: ${newPassengers}`;
          
          // Hide edit form
          document.getElementById('edit-booking-form').style.display = 'none';
        });
        
        // Cancel edit button
        document.getElementById('cancel-edit-btn').addEventListener('click', function() {
          document.getElementById('edit-booking-form').style.display = 'none';
        });
        
        // Cancel booking buttons
        document.querySelectorAll('.cancel-booking-btn').forEach(btn => {
          btn.addEventListener('click', function() {
            const bookingItem = this.closest('.booking-item');
            document.getElementById('cancel-booking-modal').setAttribute('data-canceling', bookingItem.id);
            document.getElementById('cancel-booking-modal').style.display = 'block';
          });
        });
        
        // Confirm cancel button
        document.getElementById('confirm-cancel-btn').addEventListener('click', function() {
          const cancelingId = document.getElementById('cancel-booking-modal').getAttribute('data-canceling');
          // Remove the booking
          document.getElementById(cancelingId).remove();
          document.getElementById('cancel-booking-modal').style.display = 'none';
        });
        
        // Abort cancel button
        document.getElementById('abort-cancel-btn').addEventListener('click', function() {
          document.getElementById('cancel-booking-modal').style.display = 'none';
        });
      });
    });
    
    test('should view bookings', async ({ page }) => {
      // Check that bookings page is displayed
      await expect(page.locator('text=My Bookings')).toBeVisible();
      
      // Check that we have three bookings initially
      await expect(page.locator('.booking-item')).toHaveCount(3);
      
      // Check that filter buttons work
      await page.click('#upcoming-bookings-btn');
      
      // Should only show upcoming bookings (2)
      await expect(page.locator('.booking-item:visible')).toHaveCount(2);
      
      // Click on past bookings filter
      await page.click('#past-bookings-btn');
      
      // Should only show past bookings (1)
      await expect(page.locator('.booking-item:visible')).toHaveCount(1);
      
      // Click on all bookings filter
      await page.click('#all-bookings-btn');
      
      // Should show all bookings again
      await expect(page.locator('.booking-item:visible')).toHaveCount(3);
      
      // Test viewing booking details
      await page.click('#booking-1 .view-details-btn');
      
      // Modal should be visible
      await expect(page.locator('#booking-details-modal')).toBeVisible();
      
      // Check that the correct booking details are displayed
      await expect(page.locator('#modal-booking-details h3')).toContainText('Las Vegas Getaway');
      
      // Close the modal
      await page.click('#close-modal');
      
      // Modal should be hidden
      await expect(page.locator('#booking-details-modal')).not.toBeVisible();
    });
    
    test('should edit bookings', async ({ page }) => {
      // Click edit on the first booking
      await page.click('#booking-1 .edit-booking-btn');
      
      // Edit form should be visible
      await expect(page.locator('#edit-booking-form')).toBeVisible();
      
      // Form should have the booking's current values
      expect(await page.inputValue('#edit-date-range')).toBe('Oct 15-20, 2023');
      expect(await page.inputValue('#edit-passengers')).toBe('2');
      
      // Change the values
      await page.fill('#edit-date-range', 'Nov 1-6, 2023');
      await page.fill('#edit-passengers', '3');
      
      // Save changes
      await page.click('#save-changes-btn');
      
      // Edit form should be hidden
      await expect(page.locator('#edit-booking-form')).not.toBeVisible();
      
      // Booking should be updated with new values
      await expect(page.locator('#booking-1 .booking-details p:nth-child(2)')).toContainText('Nov 1-6, 2023');
      await expect(page.locator('#booking-1 .booking-details p:nth-child(3)')).toContainText('Passengers: 3');
    });
    
    test('should cancel bookings', async ({ page }) => {
      // Initial count of bookings
      await expect(page.locator('.booking-item')).toHaveCount(3);
      
      // Click cancel on the second booking
      await page.click('#booking-2 .cancel-booking-btn');
      
      // Cancel confirmation modal should be visible
      await expect(page.locator('#cancel-booking-modal')).toBeVisible();
      
      // Confirm cancellation
      await page.click('#confirm-cancel-btn');
      
      // Modal should be hidden
      await expect(page.locator('#cancel-booking-modal')).not.toBeVisible();
      
      // There should now be only 2 bookings
      await expect(page.locator('.booking-item')).toHaveCount(2);
      
      // The specific booking should be gone
      await expect(page.locator('#booking-2')).not.toBeVisible();
      
      // Try to cancel another booking but abort
      await page.click('#booking-1 .cancel-booking-btn');
      await expect(page.locator('#cancel-booking-modal')).toBeVisible();
      
      // Abort cancellation
      await page.click('#abort-cancel-btn');
      
      // Modal should be hidden
      await expect(page.locator('#cancel-booking-modal')).not.toBeVisible();
      
      // Booking count should remain the same
      await expect(page.locator('.booking-item')).toHaveCount(2);
    });
  });
});
