// date-flow-test.js
// Simple test runner for date selection flow

(function() {
  console.log('🧪 Starting date selection flow test');
  
  // Store test results
  const testResults = {
    tripDetailsLoaded: false,
    datesDisplayed: false,
    dateSelectionWorks: false,
    selectedDateInBookingSummary: false,
    bookNowButtonHasDate: false,
    navigatedToBookingPage: false,
    dateDisplayedInBookingForm: false,
    dateInputPrefilled: false,
    bookingFormSubmitted: false,
    overallSuccess: false
  };
  
  // Function to display test results
  function showResults() {
    const resultsDiv = document.createElement('div');
    resultsDiv.style.position = 'fixed';
    resultsDiv.style.top = '10px';
    resultsDiv.style.right = '10px';
    resultsDiv.style.width = '350px';
    resultsDiv.style.padding = '15px';
    resultsDiv.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
    resultsDiv.style.border = '1px solid #ccc';
    resultsDiv.style.borderRadius = '5px';
    resultsDiv.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
    resultsDiv.style.zIndex = '9999';
    resultsDiv.style.maxHeight = '80vh';
    resultsDiv.style.overflowY = 'auto';
    
    let html = '<h3 style="margin-top:0;color:#304CB2;font-size:16px">Date Selection Flow Test</h3>';
    html += '<ul style="padding-left:20px;margin:10px 0">';
    
    for (const [test, passed] of Object.entries(testResults)) {
      const icon = passed ? '✅' : '❌';
      const label = test.replace(/([A-Z])/g, ' $1').toLowerCase();
      html += `<li style="margin-bottom:5px"><span style="color:${passed ? 'green' : 'red'}">${icon}</span> ${label}</li>`;
    }
    
    html += '</ul>';
    
    const overall = testResults.overallSuccess;
    html += `<div style="margin-top:10px;padding:10px;background-color:${overall ? '#e6f7e6' : '#fce8e8'};border-radius:4px;text-align:center;font-weight:bold;color:${overall ? 'green' : 'red'}">
      ${overall ? 'All Tests Passed!' : 'Some Tests Failed'}
    </div>`;
    
    html += '<div style="margin-top:15px;font-size:12px;text-align:center">Click this box to hide</div>';
    
    resultsDiv.innerHTML = html;
    document.body.appendChild(resultsDiv);
    
    resultsDiv.addEventListener('click', () => {
      resultsDiv.style.display = 'none';
    });
  }
  
  // Function to run tests on trip details page
  function testTripDetailsPage() {
    console.log('Testing trip details page...');
    
    // Verify page loaded
    setTimeout(() => {
      const titleEl = document.querySelector('h1');
      if (titleEl && titleEl.textContent.includes('Orlando, Florida')) {
        console.log('✅ Trip details page loaded');
        testResults.tripDetailsLoaded = true;
        
        // Check for dates section
        const datesSectionEl = Array.from(document.querySelectorAll('h2')).find(el => 
          el.textContent.includes('Available Dates')
        );
        
        if (datesSectionEl) {
          console.log('✅ Dates section found');
          testResults.datesDisplayed = true;
          
          // Find date options
          const dateElements = document.querySelectorAll('[data-testid^="date-option-"]');
          if (dateElements.length > 0) {
            console.log(`Found ${dateElements.length} date options`);
            
            // Check if first date is selected by default
            const firstDateSelected = dateElements[0].getAttribute('aria-selected') === 'true';
            if (firstDateSelected) {
              console.log('✅ First date selected by default');
              
              // Click on the second date
              if (dateElements.length > 1) {
                console.log('Clicking second date option...');
                dateElements[1].click();
                
                // Verify selection changed
                setTimeout(() => {
                  const secondDateSelected = dateElements[1].getAttribute('aria-selected') === 'true';
                  if (secondDateSelected) {
                    console.log('✅ Date selection changed successfully');
                    testResults.dateSelectionWorks = true;
                    
                    // Check booking summary
                    const summaryEls = document.querySelectorAll('.text-gray-600');
                    let dateInSummary = false;
                    summaryEls.forEach(el => {
                      if (el.textContent.trim() === 'Selected date') {
                        dateInSummary = true;
                      }
                    });
                    
                    if (dateInSummary) {
                      console.log('✅ Selected date appears in booking summary');
                      testResults.selectedDateInBookingSummary = true;
                      
                      // Check Book Now button
                      const bookButton = Array.from(document.querySelectorAll('a')).find(a => 
                        a.textContent.trim().includes('Book Now')
                      );
                      
                      if (bookButton) {
                        const href = bookButton.getAttribute('href');
                        if (href && href.includes('date=')) {
                          console.log('✅ Book Now button includes date parameter');
                          testResults.bookNowButtonHasDate = true;
                          
                          // Store the selected date for later verification
                          window.selectedDate = dateElements[1].textContent.trim();
                          console.log('Selected date:', window.selectedDate);
                          
                          // Click Book Now to navigate to booking page
                          console.log('Navigating to booking page...');
                          window.location.href = href;
                          
                          // Booking page will be tested by a separate function
                          testResults.navigatedToBookingPage = true;
                        } else {
                          console.log('❌ Book Now button does not include date parameter');
                        }
                      } else {
                        console.log('❌ Book Now button not found');
                      }
                    } else {
                      console.log('❌ Selected date not found in booking summary');
                    }
                  } else {
                    console.log('❌ Failed to change date selection');
                  }
                }, 500);
              } else {
                console.log('❌ Not enough date options to test selection change');
              }
            } else {
              console.log('❌ First date not selected by default');
            }
          } else {
            console.log('❌ No date options found');
          }
        } else {
          console.log('❌ Dates section not found');
        }
      } else {
        console.log('❌ Trip details page not loaded correctly');
      }
    }, 1000);
  }
  
  // Function to test booking page
  function testBookingPage() {
    console.log('Testing booking page...');
    
    setTimeout(() => {
      // Check if selected date is displayed in the booking form
      const dateInfo = document.body.textContent.includes(window.selectedDate);
      if (dateInfo) {
        console.log('✅ Selected date is visible in booking form');
        testResults.dateDisplayedInBookingForm = true;
        
        // Check if departure date field is pre-filled
        const dateInput = document.querySelector('[data-testid="departure-date-input"]');
        if (dateInput && dateInput.value) {
          console.log('✅ Date input is pre-filled with:', dateInput.value);
          testResults.dateInputPrefilled = true;
          
          // Fill out booking form
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
            
            console.log('✅ Successfully filled booking form');
            testResults.bookingFormSubmitted = true;
            
            // Mark overall test as successful
            testResults.overallSuccess = true;
            
            // Show final test results
            showResults();
          } else {
            console.log('❌ Could not find all required form fields');
            showResults();
          }
        } else {
          console.log('❌ Date input not found or not pre-filled');
          showResults();
        }
      } else {
        console.log('❌ Selected date not displayed in booking form');
        showResults();
      }
    }, 1500);
  }
  
  // Determine which page we're on and run appropriate tests
  function runTests() {
    if (window.location.pathname.includes('/trip/')) {
      testTripDetailsPage();
    } else if (window.location.pathname.includes('/book')) {
      testBookingPage();
    } else {
      console.log('Navigating to trip details page...');
      window.location.href = '/trip/trip1';
    }
  }
  
  // Run tests
  if (document.readyState === 'complete') {
    runTests();
  } else {
    window.addEventListener('load', runTests);
  }
})(); 