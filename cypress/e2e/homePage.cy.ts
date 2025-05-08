describe('Home Page', () => {
  beforeEach(() => {
    // Visit the homepage before each test
    cy.visit('/');
  });

  it('displays the hero section correctly', () => {
    // Check for hero section text content
    cy.contains('Travel Made').should('be.visible');
    cy.contains('Simple').should('be.visible');
    cy.contains('Explore breathtaking destinations with the Southwest Vacations experience').should('be.visible');
    
    // Check for call-to-action buttons
    cy.contains('Find Your Adventure').should('be.visible');
    cy.contains('View All Destinations').should('be.visible');
  });

  it('shows popular destinations section', () => {
    cy.contains('Popular Destinations').should('be.visible');
    
    // Check for category buttons
    cy.contains('button', 'All').should('be.visible');
    cy.contains('button', 'Beach').should('be.visible');
    cy.contains('button', 'City').should('be.visible');
    cy.contains('button', 'Mountain').should('be.visible');
  });

  it('displays the Southwest Advantage section', () => {
    // Scroll to the section to ensure it's visible
    cy.contains('The Southwest Advantage').scrollIntoView();
    cy.contains('The Southwest Advantage').should('be.visible');
    
    // Check for the three advantage cards
    cy.contains('No Bag Fees').should('be.visible');
    cy.contains('No Change Fees').should('be.visible');
    cy.contains('Southwest Hospitality').should('be.visible');
  });

  it('navigates to About page when clicking "Why Choose Southwest" button', () => {
    // Scroll to the button to ensure it's visible
    cy.contains('Why Choose Southwest').scrollIntoView();
    
    // Click the button
    cy.contains('Why Choose Southwest').click();
    
    // Check that we've navigated to the About page
    cy.url().should('include', '/about');
    
    // Verify the About page content is displayed
    cy.contains('Why Choose Southwest Vacations').should('be.visible');
    cy.contains('Our Commitment to You').should('be.visible');
  });

  it('displays the newsletter signup section', () => {
    // Scroll to the newsletter section
    cy.contains('Sign Up For Deals').scrollIntoView();
    
    // Check for the input field and button
    cy.get('input[type="email"]').should('be.visible');
    cy.contains('button', 'Subscribe').should('be.visible');
  });
}); 