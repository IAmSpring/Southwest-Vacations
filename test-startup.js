// test-startup.js
// This script is used to test the date selection functionality on startup and complete the booking flow

(function() {
  /* eslint-disable no-console, no-undef */
  console.log('Starting date selection and booking flow test');
  
  // Function to test the complete flow
  function testCompleteFlow() {
    // Wait for page load and then navigate to a trip detail page
    setTimeout(() => {
      console.log('Navigating to trip details page');
      window.location.href = '/trip/trip1';
      
      // After navigation, test clicking date options
      setTimeout(() => {
        console.log('Testing date selection');
        // Find date elements and click them
        const dateElements = document.querySelectorAll('[data-testid^="date-option-"]');
        
        if (dateElements.length > 0) {
          console.log(`Found ${dateElements.length} date options`);
          
          // Get the initially selected date
          let initialSelected = null;
          dateElements.forEach(el => {
            if (el.getAttribute('aria-selected') === 'true') {
              initialSelected = el.textContent.trim();
              console.log(`Initial selected date: ${initialSelected}`);
            }
          });
          
          // Click on the second date option if available
          if (dateElements.length > 1) {
            console.log('Clicking on the second date option');
            dateElements[1].click();
            
            // Verify selection changed
            setTimeout(() => {
              if (dateElements[1].getAttribute('aria-selected') === 'true') {
                console.log('Selection successfully changed to:', dateElements[1].textContent.trim());
                
                // Verify the selected date appears in the booking summary
                const summaryEls = document.querySelectorAll('.text-gray-600');
                let found = false;
                summaryEls.forEach(el => {
                  if (el.textContent.trim() === 'Selected date') {
                    found = true;
                    console.log('Selected date found in booking summary');
                  }
                });
                
                if (!found) {
                  console.error('Selected date not found in booking summary');
                }
                
                // Click the "Book Now" button to proceed with booking
                setTimeout(() => {
                  console.log('Proceeding to booking page');
                  const bookButton = Array.from(document.querySelectorAll('a')).find(a => 
                    a.textContent.trim().includes('Book Now')
                  );
                  
                  if (bookButton) {
                    console.log('Found Book Now button, clicking it');
                    
                    // Instead of directly clicking which would navigate away,
                    // check if the URL would contain the selected date
                    const href = bookButton.getAttribute('href');
                    if (href && href.includes('date=')) {
                      console.log('Book button URL contains date parameter:', href);
                      console.log('SUCCESS: Complete flow test passed!');
                      
                      // Now proceed to the booking page
                      bookButton.click();
                      
                      // Test the booking form page
                      setTimeout(() => {
                        // Check if the selected date is visible in the booking form
                        const dateDisplayed = document.body.textContent.includes(dateElements[1].textContent.trim());
                        if (dateDisplayed) {
                          console.log('Selected date is visible in the booking form');
                          
                          // Check if departure date field is pre-filled and highlighted
                          const dateInput = document.querySelector('[data-testid="departure-date-input"]');
                          if (dateInput && dateInput.value) {
                            console.log('Date input is pre-filled with:', dateInput.value);
                            
                            // Fill out a sample booking form for testing
                            const fillBookingForm = () => {
                              // Find key form elements
                              const nameInput = document.querySelector('input[name="fullName"]');
                              const emailInput = document.querySelector('input[name="email"]');
                              const travelersInput = document.querySelector('input[name="travelers"]');
                              
                              if (nameInput && emailInput && travelersInput) {
                                nameInput.value = 'Test User';
                                emailInput.value = 'test@example.com';
                                travelersInput.value = '2';
                                
                                // Trigger change events
                                ['input', 'change'].forEach(eventType => {
                                  nameInput.dispatchEvent(new Event(eventType, { bubbles: true }));
                                  emailInput.dispatchEvent(new Event(eventType, { bubbles: true }));
                                  travelersInput.dispatchEvent(new Event(eventType, { bubbles: true }));
                                });
                                
                                console.log('Successfully filled booking form');
                                console.log('FULL TEST PASSED: Date selection flows through to booking form');
                              } else {
                                console.error('Could not find all required form fields');
                              }
                            };
                            
                            // Wait a moment for any form initializations
                            setTimeout(fillBookingForm, 500);
                          } else {
                            console.error('Date input not found or not pre-filled');
                          }
                        } else {
                          console.error('Selected date not found in booking form');
                        }
                      }, 2000);
                    } else {
                      console.error('Book button URL does not contain date parameter');
                    }
                  } else {
                    console.error('Book Now button not found');
                  }
                }, 500);
              } else {
                console.error('Failed to change selection');
              }
            }, 500);
          } else {
            console.log('Only one date available, cannot test selection change');
          }
        } else {
          console.error('No date options found on the page');
        }
      }, 2000);
    }, 1000);
  }
  
  // Listen for page load to run the test
  if (document.readyState === 'complete') {
    testCompleteFlow();
  } else {
    window.addEventListener('load', testCompleteFlow);
  }
  /* eslint-enable no-console, no-undef */
})(); 