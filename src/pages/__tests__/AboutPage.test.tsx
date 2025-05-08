import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import AboutPage from '../AboutPage';

describe('AboutPage', () => {
  test('renders the hero section with correct title', () => {
    render(
      <Router>
        <AboutPage />
      </Router>
    );

    // Check for the main heading
    expect(screen.getByText('Why Choose Southwest Vacations')).toBeInTheDocument();
    
    // Check for subheading content
    expect(
      screen.getByText(/Experience the Southwest difference with our award-winning service/i)
    ).toBeInTheDocument();
  });

  test('renders the commitment section', () => {
    render(
      <Router>
        <AboutPage />
      </Router>
    );

    expect(screen.getByText('Our Commitment to You')).toBeInTheDocument();
    expect(screen.getByText('Our Mission')).toBeInTheDocument();
    expect(screen.getByText('Our Vision')).toBeInTheDocument();
  });

  test('renders the benefits section', () => {
    render(
      <Router>
        <AboutPage />
      </Router>
    );

    expect(screen.getByText('Southwest Vacations Benefits')).toBeInTheDocument();
    expect(screen.getByText('Bags Fly Free®')).toBeInTheDocument();
    expect(screen.getByText('No Change Fees')).toBeInTheDocument();
    expect(screen.getByText('Legendary Customer Service')).toBeInTheDocument();
  });

  test('renders the Southwest Experience section', () => {
    render(
      <Router>
        <AboutPage />
      </Router>
    );

    expect(screen.getByText('The Southwest Experience')).toBeInTheDocument();
    expect(screen.getByText('A Tradition of Excellence')).toBeInTheDocument();
    expect(screen.getByText('Book Your Southwest Experience')).toBeInTheDocument();
  });

  test('renders the Rapid Rewards section', () => {
    render(
      <Router>
        <AboutPage />
      </Router>
    );

    expect(screen.getByText('Earn Rapid Rewards® Points')).toBeInTheDocument();
    expect(screen.getByText('Rewards That Take You Further')).toBeInTheDocument();
    expect(screen.getByText('Join Rapid Rewards')).toBeInTheDocument();
  });

  test('renders the CTA section with action buttons', () => {
    render(
      <Router>
        <AboutPage />
      </Router>
    );

    expect(screen.getByText('Ready to Experience Southwest Vacations?')).toBeInTheDocument();
    expect(screen.getByText('Browse Destinations')).toBeInTheDocument();
    expect(screen.getByText('Book Now')).toBeInTheDocument();
  });
}); 