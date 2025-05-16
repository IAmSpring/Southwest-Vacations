#!/usr/bin/env node

/**
 * Simple fallback script for generating placeholder images
 * 
 * This script creates basic HTML-based images when the canvas package is not available.
 * Used as a fallback for GitHub Pages deployment.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current file directory with ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const OUTPUT_DIR = path.join(__dirname, '../public/images/fallback');

// Ensure the output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  console.log(`Created directory: ${OUTPUT_DIR}`);
}

// Southwest Vacations brand colors
const BRAND_COLORS = {
  blue: '#304CB2',  // Primary blue
  gold: '#FFBF27',  // Accent gold
};

// Trip data with styling
const trips = [
  { id: 'trip1', destination: 'Maui, Hawaii', type: 'beach', price: 1499.99 },
  { id: 'trip2', destination: 'Cancun, Mexico', type: 'beach', price: 1250.00 },
  { id: 'trip3', destination: 'New York City', type: 'city', price: 1300.00 },
  { id: 'trip4', destination: 'Rome, Italy', type: 'europe', price: 1850.00 },
  { id: 'trip5', destination: 'Tokyo, Japan', type: 'asia', price: 1799.99 },
  { id: 'trip6', destination: 'Paris, France', type: 'europe', price: 1650.00 },
  { id: 'trip7', destination: 'Sydney, Australia', type: 'beach', price: 2200.00 },
  { id: 'trip8', destination: 'Banff, Canada', type: 'mountain', price: 1600.00 },
  { id: 'trip9', destination: 'Santorini, Greece', type: 'beach', price: 1950.00 }
];

// Hotel data
const hotels = [
  { id: 'hotel-hawaii-1', name: 'Oceanfront Resort', location: 'Waikiki Beach' },
  { id: 'hotel-hawaii-2', name: 'Sunset Villas', location: 'Maui' },
  { id: 'hotel-mexico', name: 'Cancun Paradise', location: 'Cancun' },
  { id: 'hotel-nyc', name: 'Manhattan Suites', location: 'New York' }
];

// Car rental data
const cars = [
  { id: 'car-economy', name: 'Toyota Corolla', type: 'Economy' },
  { id: 'car-suv', name: 'Toyota RAV4', type: 'SUV' },
  { id: 'car-luxury', name: 'Mercedes C-Class', type: 'Luxury' }
];

// Region-specific styling
const regionStyles = {
  beach: { bg: '#e0f7fa', text: '#006064', emoji: '🏖️' },
  city: { bg: '#e8eaf6', text: '#1a237e', emoji: '🏙️' },
  mountain: { bg: '#e8f5e9', text: '#1b5e20', emoji: '🏔️' },
  europe: { bg: '#ede7f6', text: '#4527a0', emoji: '🏛️' },
  asia: { bg: '#fff3e0', text: '#e65100', emoji: '🏮' },
  usa: { bg: '#e3f2fd', text: '#0d47a1', emoji: '🗽' },
  default: { bg: '#f5f5f5', text: '#212121', emoji: '✈️' }
};

/**
 * Generate a HTML-based destination image
 */
function generateDestinationHtml(trip) {
  const { id, destination, type, price } = trip;
  const style = regionStyles[type] || regionStyles.default;
  
  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${destination} - Southwest Vacations</title>
  <style>
    body, html {
      margin: 0;
      padding: 0;
      width: 640px;
      height: 360px;
      overflow: hidden;
      font-family: Arial, sans-serif;
    }
    .container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100%;
      background-color: ${style.bg};
      color: ${style.text};
      position: relative;
    }
    .logo {
      position: absolute;
      top: 20px;
      right: 20px;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .logo-circle {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background-color: ${BRAND_COLORS.blue};
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .logo-inner {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background-color: ${BRAND_COLORS.gold};
    }
    .emoji {
      position: absolute;
      top: 20px;
      left: 20px;
      font-size: 40px;
    }
    .destination {
      font-size: 40px;
      font-weight: bold;
      text-align: center;
      margin-bottom: 20px;
      max-width: 80%;
    }
    .price {
      position: absolute;
      top: 20px;
      right: 100px;
      background-color: ${BRAND_COLORS.gold};
      color: ${BRAND_COLORS.blue};
      padding: 8px 16px;
      font-weight: bold;
      border-radius: 4px;
      font-size: 24px;
    }
    .sw-text {
      font-size: 18px;
      color: white;
      text-align: center;
      position: absolute;
      bottom: 20px;
      width: 100%;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="emoji">${style.emoji}</div>
    <div class="logo">
      <div class="logo-circle">
        <div class="logo-inner"></div>
      </div>
    </div>
    <div class="price">$${price.toFixed(0)}</div>
    <div class="destination">${destination}</div>
    <div class="sw-text">Southwest Vacations</div>
  </div>
</body>
</html>`;

  const outputPath = path.join(OUTPUT_DIR, `${id}.html`);
  fs.writeFileSync(outputPath, html);
  console.log(`Created HTML placeholder for: ${outputPath}`);
}

/**
 * Generate a HTML-based hotel image
 */
function generateHotelHtml(hotel) {
  const { id, name, location } = hotel;
  
  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${name} - ${location}</title>
  <style>
    body, html {
      margin: 0;
      padding: 0;
      width: 600px;
      height: 400px;
      overflow: hidden;
      font-family: Arial, sans-serif;
    }
    .container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100%;
      background-color: #fce4ec;
      color: #880e4f;
      position: relative;
    }
    .logo {
      position: absolute;
      top: 20px;
      right: 20px;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .logo-circle {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background-color: ${BRAND_COLORS.blue};
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .logo-inner {
      width: 25px;
      height: 25px;
      border-radius: 50%;
      background-color: ${BRAND_COLORS.gold};
    }
    .emoji {
      position: absolute;
      top: 20px;
      left: 20px;
      font-size: 40px;
    }
    .hotel-name {
      font-size: 40px;
      font-weight: bold;
      text-align: center;
      margin-bottom: 10px;
      max-width: 80%;
    }
    .hotel-location {
      font-size: 24px;
      text-align: center;
    }
    .building {
      width: 200px;
      height: 150px;
      background-color: #90a4ae;
      position: absolute;
      bottom: 70px;
      box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    }
    .window {
      width: 20px;
      height: 20px;
      background-color: #e3f2fd;
      position: absolute;
    }
    .partner-badge {
      position: absolute;
      top: 20px;
      left: 80px;
      background-color: ${BRAND_COLORS.gold};
      color: white;
      padding: 8px;
      border-radius: 50%;
      font-size: 12px;
      font-weight: bold;
      width: 60px;
      height: 60px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="emoji">🏨</div>
    <div class="logo">
      <div class="logo-circle">
        <div class="logo-inner"></div>
      </div>
    </div>
    <div class="partner-badge">PREFERRED PARTNER</div>
    
    <div class="hotel-name">${name}</div>
    <div class="hotel-location">${location}</div>
    
    <div class="building">
      <div class="window" style="top: 20px; left: 20px;"></div>
      <div class="window" style="top: 20px; left: 50px;"></div>
      <div class="window" style="top: 20px; left: 80px;"></div>
      <div class="window" style="top: 20px; left: 110px;"></div>
      <div class="window" style="top: 20px; left: 140px;"></div>
      <div class="window" style="top: 50px; left: 20px;"></div>
      <div class="window" style="top: 50px; left: 50px;"></div>
      <div class="window" style="top: 50px; left: 80px;"></div>
      <div class="window" style="top: 50px; left: 110px;"></div>
      <div class="window" style="top: 50px; left: 140px;"></div>
      <div class="window" style="top: 80px; left: 20px;"></div>
      <div class="window" style="top: 80px; left: 50px;"></div>
      <div class="window" style="top: 80px; left: 80px;"></div>
      <div class="window" style="top: 80px; left: 110px;"></div>
      <div class="window" style="top: 80px; left: 140px;"></div>
    </div>
  </div>
</body>
</html>`;

  const outputPath = path.join(OUTPUT_DIR, `${id}.html`);
  fs.writeFileSync(outputPath, html);
  console.log(`Created HTML placeholder for: ${outputPath}`);
}

/**
 * Generate a HTML-based car image
 */
function generateCarHtml(car) {
  const { id, name, type } = car;
  
  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${name} - ${type}</title>
  <style>
    body, html {
      margin: 0;
      padding: 0;
      width: 500px;
      height: 300px;
      overflow: hidden;
      font-family: Arial, sans-serif;
    }
    .container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100%;
      background-color: #e8f5e9;
      color: #1b5e20;
      position: relative;
    }
    .logo {
      position: absolute;
      top: 20px;
      right: 20px;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .logo-circle {
      width: 30px;
      height: 30px;
      border-radius: 50%;
      background-color: ${BRAND_COLORS.blue};
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .logo-inner {
      width: 18px;
      height: 18px;
      border-radius: 50%;
      background-color: ${BRAND_COLORS.gold};
    }
    .emoji {
      font-size: 60px;
      margin-bottom: 20px;
    }
    .car-name {
      font-size: 30px;
      font-weight: bold;
      text-align: center;
      margin-bottom: 10px;
      max-width: 80%;
    }
    .car-type {
      font-size: 18px;
      text-align: center;
      background-color: ${BRAND_COLORS.blue};
      color: white;
      padding: 4px 12px;
      border-radius: 4px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="logo">
      <div class="logo-circle">
        <div class="logo-inner"></div>
      </div>
    </div>
    
    <div class="emoji">🚗</div>
    <div class="car-name">${name}</div>
    <div class="car-type">${type}</div>
  </div>
</body>
</html>`;

  const outputPath = path.join(OUTPUT_DIR, `${id}.html`);
  fs.writeFileSync(outputPath, html);
  console.log(`Created HTML placeholder for: ${outputPath}`);
}

/**
 * Generate all HTML placeholder images
 */
function generateAllPlaceholders() {
  console.log('Generating HTML placeholders for images...');
  
  // Generate destinations
  trips.forEach(trip => {
    generateDestinationHtml(trip);
  });
  
  // Generate hotels
  hotels.forEach(hotel => {
    generateHotelHtml(hotel);
  });
  
  // Generate cars
  cars.forEach(car => {
    generateCarHtml(car);
  });
  
  console.log('All HTML placeholders generated successfully!');
  console.log(`Output directory: ${OUTPUT_DIR}`);
  console.log('To convert these to images, you can use browser automation or screenshot tools.');
}

// Run the script
generateAllPlaceholders(); 