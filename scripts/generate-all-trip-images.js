#!/usr/bin/env node

/**
 * Comprehensive image generation script for Southwest Vacations
 * 
 * This script generates all types of images needed for the application:
 * - Destination/trip images
 * - Hotel images
 * - Car rental images
 * 
 * Used for GitHub Pages deployment where real images aren't available.
 */

const fs = require('fs');
const path = require('path');
const { createCanvas } = require('canvas');

// Configuration
const BASE_DIR = path.join(__dirname, '../public/images');
const DIRS = {
  destinations: path.join(BASE_DIR, 'destinations'),
  hotels: path.join(BASE_DIR, 'hotels'),
  cars: path.join(BASE_DIR, 'cars'),
};

// Theme colors
const SOUTHWEST_COLORS = {
  blue: '#304CB2',
  gold: '#FFBF27',
};

// Destination types with styling
const DESTINATION_TYPES = {
  beach: { bg: '#e0f7fa', text: '#006064' },
  city: { bg: '#e8eaf6', text: '#1a237e' }, 
  mountain: { bg: '#e8f5e9', text: '#1b5e20' },
  europe: { bg: '#ede7f6', text: '#4527a0' },
  asia: { bg: '#fff3e0', text: '#e65100' },
  usa: { bg: '#e3f2fd', text: '#0d47a1' },
  default: { bg: '#f5f5f5', text: '#212121' }
};

// Hotel types with styling
const HOTEL_TYPES = {
  luxury: { bg: '#fce4ec', text: '#880e4f' },
  resort: { bg: '#e0f2f1', text: '#004d40' },
  budget: { bg: '#f3e5f5', text: '#4a148c' },
  default: { bg: '#e8eaf6', text: '#1a237e' },
};

// Car types with styling
const CAR_TYPES = {
  economy: { bg: '#e8f5e9', text: '#1b5e20' },
  midsize: { bg: '#e3f2fd', text: '#0d47a1' },
  suv: { bg: '#fff3e0', text: '#e65100' },
  luxury: { bg: '#fce4ec', text: '#880e4f' },
  default: { bg: '#f5f5f5', text: '#212121' },
};

// Data for image generation
const destinations = [
  { id: 'hawaii', name: 'Hawaii', type: 'beach' },
  { id: 'mexico', name: 'Cancun, Mexico', type: 'beach' },
  { id: 'nyc', name: 'New York City', type: 'city' },
  { id: 'italy', name: 'Rome, Italy', type: 'europe' },
  { id: 'japan', name: 'Tokyo, Japan', type: 'asia' },
  { id: 'canada', name: 'Banff, Canada', type: 'mountain' },
  { id: 'australia', name: 'Sydney, Australia', type: 'beach' },
  { id: 'europe', name: 'Paris, France', type: 'europe' },
  { id: 'asia', name: 'Singapore', type: 'asia' },
  { id: 'santorini', name: 'Santorini, Greece', type: 'beach' }
];

const hotels = [
  { id: 'hotel-hawaii-1', name: 'Oceanfront Resort', location: 'Waikiki Beach', type: 'luxury' },
  { id: 'hotel-hawaii-2', name: 'Sunset Villas', location: 'Maui', type: 'resort' },
  { id: 'hotel-mexico', name: 'Cancun Paradise', location: 'Cancun', type: 'resort' },
  { id: 'hotel-nyc', name: 'Manhattan Suites', location: 'New York', type: 'luxury' },
  { id: 'hotel-rome', name: 'Roma Central', location: 'Rome', type: 'default' },
  { id: 'hotel-tokyo', name: 'Tokyo Skyline', location: 'Tokyo', type: 'luxury' },
  { id: 'hotel-banff', name: 'Mountain Lodge', location: 'Banff', type: 'resort' },
  { id: 'hotel-sydney', name: 'Harbor View', location: 'Sydney', type: 'luxury' },
  { id: 'hotel-paris', name: 'Parisian Elegance', location: 'Paris', type: 'luxury' },
  { id: 'hotel-singapore', name: 'Marina Gardens', location: 'Singapore', type: 'luxury' },
  { id: 'hotel-santorini', name: 'Aegean Blue', location: 'Santorini', type: 'resort' }
];

const cars = [
  { id: 'car-prius', name: 'Toyota Prius', type: 'economy', location: 'All Locations' },
  { id: 'car-corolla', name: 'Toyota Corolla', type: 'economy', location: 'All Locations' },
  { id: 'car-camry', name: 'Toyota Camry', type: 'midsize', location: 'Major Cities' },
  { id: 'car-mustang', name: 'Ford Mustang', type: 'luxury', location: 'Select Locations' },
  { id: 'car-jeep', name: 'Jeep Wrangler', type: 'suv', location: 'Mountain Destinations' },
  { id: 'car-suv', name: 'Toyota RAV4', type: 'suv', location: 'All Locations' },
  { id: 'car-convertible', name: 'BMW Convertible', type: 'luxury', location: 'Beach Destinations' },
  { id: 'car-minivan', name: 'Chrysler Pacifica', type: 'midsize', location: 'Family Destinations' },
  { id: 'car-tesla', name: 'Tesla Model 3', type: 'luxury', location: 'Premium Locations' },
  { id: 'car-fiat', name: 'Fiat 500', type: 'economy', location: 'European Destinations' }
];

// Ensure all directories exist
Object.values(DIRS).forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`Created directory: ${dir}`);
  }
});

/**
 * Generate a destination/trip image
 */
async function generateDestinationImage(destination) {
  const { id, name, type } = destination;
  const colors = DESTINATION_TYPES[type] || DESTINATION_TYPES.default;
  
  const width = 800;
  const height = 400;
  
  // Create canvas
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');
  
  // Draw background
  ctx.fillStyle = colors.bg;
  ctx.fillRect(0, 0, width, height);
  
  // Add decorative element based on type
  switch (type) {
    case 'beach':
      drawBeachElements(ctx, width, height);
      break;
    case 'city':
      drawCityElements(ctx, width, height);
      break;
    case 'mountain':
      drawMountainElements(ctx, width, height);
      break;
    case 'europe':
      drawEuropeElements(ctx, width, height);
      break;
    case 'asia':
      drawAsiaElements(ctx, width, height);
      break;
    default:
      drawDefaultElements(ctx, width, height);
  }
  
  // Draw Southwest Airlines logo-like decoration
  drawSouthwestLogo(ctx, width - 70, 70);
  
  // Draw destination text
  ctx.font = 'bold 40px Arial';
  ctx.fillStyle = colors.text;
  ctx.textAlign = 'center';
  ctx.fillText(name, width / 2, height / 2);
  
  // Draw Southwest Vacations text
  ctx.font = '20px Arial';
  ctx.fillText('Southwest Vacations', width / 2, height / 2 + 40);
  
  // Save the image
  const outputPath = path.join(DIRS.destinations, `${id}.jpg`);
  const out = fs.createWriteStream(outputPath);
  const stream = canvas.createJPEGStream({ quality: 0.95 });
  
  return new Promise((resolve, reject) => {
    stream.pipe(out);
    out.on('finish', () => {
      console.log(`Created destination image: ${outputPath}`);
      resolve(outputPath);
    });
    out.on('error', reject);
  });
}

/**
 * Generate a hotel image
 */
async function generateHotelImage(hotel) {
  const { id, name, location, type } = hotel;
  const colors = HOTEL_TYPES[type] || HOTEL_TYPES.default;
  
  const width = 600;
  const height = 400;
  
  // Create canvas
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');
  
  // Draw background
  ctx.fillStyle = colors.bg;
  ctx.fillRect(0, 0, width, height);
  
  // Draw hotel building
  drawHotelBuilding(ctx, width, height, type);
  
  // Draw Southwest logo
  drawSouthwestLogo(ctx, width - 50, 40, 0.7);
  
  // Draw hotel name
  ctx.font = 'bold 30px Arial';
  ctx.fillStyle = colors.text;
  ctx.textAlign = 'center';
  ctx.fillText(name, width / 2, height - 80);
  
  // Draw location
  ctx.font = '20px Arial';
  ctx.fillText(location, width / 2, height - 50);
  
  // Draw "Preferred Partner" badge
  ctx.fillStyle = SOUTHWEST_COLORS.gold;
  ctx.beginPath();
  ctx.arc(50, 50, 30, 0, Math.PI * 2);
  ctx.fill();
  
  ctx.fillStyle = '#fff';
  ctx.font = 'bold 12px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('PREFERRED', 50, 45);
  ctx.fillText('PARTNER', 50, 60);
  
  // Save the image
  const outputPath = path.join(DIRS.hotels, `${id}.jpg`);
  const out = fs.createWriteStream(outputPath);
  const stream = canvas.createJPEGStream({ quality: 0.95 });
  
  return new Promise((resolve, reject) => {
    stream.pipe(out);
    out.on('finish', () => {
      console.log(`Created hotel image: ${outputPath}`);
      resolve(outputPath);
    });
    out.on('error', reject);
  });
}

/**
 * Generate a car rental image
 */
async function generateCarImage(car) {
  const { id, name, type, location } = car;
  const colors = CAR_TYPES[type] || CAR_TYPES.default;
  
  const width = 500;
  const height = 300;
  
  // Create canvas
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');
  
  // Draw background
  ctx.fillStyle = colors.bg;
  ctx.fillRect(0, 0, width, height);
  
  // Draw car silhouette based on type
  drawCarSilhouette(ctx, width, height, type);
  
  // Draw Southwest logo
  drawSouthwestLogo(ctx, width - 40, 30, 0.5);
  
  // Draw car name
  ctx.font = 'bold 24px Arial';
  ctx.fillStyle = colors.text;
  ctx.textAlign = 'center';
  ctx.fillText(name, width / 2, height - 60);
  
  // Draw type badge
  ctx.fillStyle = SOUTHWEST_COLORS.blue;
  drawRoundedRect(ctx, width / 2 - 40, height - 50, 80, 25, 12);
  ctx.fill();
  
  ctx.fillStyle = '#fff';
  ctx.font = 'bold 14px Arial';
  ctx.textAlign = 'center';
  ctx.fillText(type.toUpperCase(), width / 2, height - 32);
  
  // Draw location text
  ctx.font = '14px Arial';
  ctx.fillStyle = colors.text;
  ctx.fillText(`Available: ${location}`, width / 2, height - 10);
  
  // Save the image
  const outputPath = path.join(DIRS.cars, `${id}.jpg`);
  const out = fs.createWriteStream(outputPath);
  const stream = canvas.createJPEGStream({ quality: 0.95 });
  
  return new Promise((resolve, reject) => {
    stream.pipe(out);
    out.on('finish', () => {
      console.log(`Created car image: ${outputPath}`);
      resolve(outputPath);
    });
    out.on('error', reject);
  });
}

// Helper function to draw the Southwest logo
function drawSouthwestLogo(ctx, x, y, scale = 1) {
  const radius1 = 30 * scale;
  const radius2 = 18 * scale;
  
  // Outer circle
  ctx.fillStyle = SOUTHWEST_COLORS.blue;
  ctx.beginPath();
  ctx.arc(x, y, radius1, 0, Math.PI * 2);
  ctx.fill();
  
  // Inner circle
  ctx.fillStyle = SOUTHWEST_COLORS.gold;
  ctx.beginPath();
  ctx.arc(x, y, radius2, 0, Math.PI * 2);
  ctx.fill();
}

// Helper drawing functions for destination types
function drawBeachElements(ctx, width, height) {
  // Draw sea
  ctx.fillStyle = '#81d4fa';
  ctx.fillRect(0, height / 2, width, height / 2);
  
  // Draw sun
  ctx.fillStyle = '#ffb300';
  ctx.beginPath();
  ctx.arc(width - 100, 100, 50, 0, Math.PI * 2);
  ctx.fill();
  
  // Draw palm tree
  ctx.fillStyle = '#5d4037';
  ctx.fillRect(100, height / 2 - 150, 20, 150);
  
  ctx.fillStyle = '#66bb6a';
  ctx.beginPath();
  ctx.ellipse(110, height / 2 - 160, 60, 30, 0, 0, Math.PI * 2);
  ctx.fill();
}

function drawCityElements(ctx, width, height) {
  // Draw skyline
  ctx.fillStyle = '#546e7a';
  
  // Buildings
  for (let i = 0; i < 8; i++) {
    const buildingWidth = 40 + Math.random() * 60;
    const buildingHeight = 80 + Math.random() * 150;
    const x = i * 100 + 50;
    
    if (x < width - buildingWidth) {
      ctx.fillRect(x, height / 2 - buildingHeight, buildingWidth, buildingHeight);
      
      // Windows
      ctx.fillStyle = '#ffeb3b';
      for (let wx = x + 10; wx < x + buildingWidth - 10; wx += 15) {
        for (let wy = height / 2 - buildingHeight + 20; wy < height / 2 - 20; wy += 30) {
          ctx.fillRect(wx, wy, 8, 15);
        }
      }
      ctx.fillStyle = '#546e7a';
    }
  }
}

function drawMountainElements(ctx, width, height) {
  // Draw mountains
  for (let i = 0; i < 3; i++) {
    const peakX = width * (0.2 + i * 0.3);
    const peakY = height / 2 - 100 - Math.random() * 100;
    const mountainWidth = 200 + Math.random() * 100;
    
    // Mountain
    ctx.fillStyle = `rgba(97, 125, 138, ${0.7 + i * 0.1})`;
    ctx.beginPath();
    ctx.moveTo(peakX - mountainWidth / 2, height / 2);
    ctx.lineTo(peakX, peakY);
    ctx.lineTo(peakX + mountainWidth / 2, height / 2);
    ctx.fill();
    
    // Snow cap
    ctx.fillStyle = '#eceff1';
    ctx.beginPath();
    ctx.moveTo(peakX - 30, peakY + 30);
    ctx.lineTo(peakX, peakY);
    ctx.lineTo(peakX + 30, peakY + 30);
    ctx.fill();
  }
}

function drawEuropeElements(ctx, width, height) {
  // Draw European landmark (simple Eiffel Tower)
  ctx.strokeStyle = '#424242';
  ctx.lineWidth = 3;
  
  // Base
  ctx.beginPath();
  ctx.moveTo(width / 2 - 50, height / 2);
  ctx.lineTo(width / 2 + 50, height / 2);
  ctx.stroke();
  
  // Legs
  ctx.beginPath();
  ctx.moveTo(width / 2 - 50, height / 2);
  ctx.lineTo(width / 2 - 10, height / 2 - 150);
  ctx.stroke();
  
  ctx.beginPath();
  ctx.moveTo(width / 2 + 50, height / 2);
  ctx.lineTo(width / 2 + 10, height / 2 - 150);
  ctx.stroke();
  
  // Top part
  ctx.beginPath();
  ctx.moveTo(width / 2 - 10, height / 2 - 150);
  ctx.lineTo(width / 2 + 10, height / 2 - 150);
  ctx.stroke();
  
  ctx.beginPath();
  ctx.moveTo(width / 2, height / 2 - 150);
  ctx.lineTo(width / 2, height / 2 - 200);
  ctx.stroke();
}

function drawAsiaElements(ctx, width, height) {
  // Draw Asian landmark (simple pagoda)
  ctx.fillStyle = '#d32f2f';
  
  // Base
  ctx.fillRect(width / 2 - 40, height / 2 - 20, 80, 20);
  
  // Middle section
  ctx.fillRect(width / 2 - 30, height / 2 - 50, 60, 30);
  
  // Top section
  ctx.fillRect(width / 2 - 20, height / 2 - 80, 40, 30);
  
  // Roof
  ctx.beginPath();
  ctx.moveTo(width / 2 - 30, height / 2 - 80);
  ctx.lineTo(width / 2, height / 2 - 100);
  ctx.lineTo(width / 2 + 30, height / 2 - 80);
  ctx.fill();
}

function drawDefaultElements(ctx, width, height) {
  // Draw simple Southwest-themed decorative elements
  
  // Horizontal line
  ctx.strokeStyle = SOUTHWEST_COLORS.blue;
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(100, height / 2 + 60);
  ctx.lineTo(width - 100, height / 2 + 60);
  ctx.stroke();
  
  // Draw airplane silhouette
  ctx.fillStyle = SOUTHWEST_COLORS.blue;
  
  // Fuselage
  ctx.beginPath();
  ctx.ellipse(width / 2, height / 2 - 50, 100, 20, 0, 0, Math.PI * 2);
  ctx.fill();
  
  // Wings
  ctx.beginPath();
  ctx.moveTo(width / 2 - 30, height / 2 - 50);
  ctx.lineTo(width / 2 - 80, height / 2 - 30);
  ctx.lineTo(width / 2 - 80, height / 2 - 10);
  ctx.lineTo(width / 2 - 30, height / 2 - 30);
  ctx.fill();
  
  ctx.beginPath();
  ctx.moveTo(width / 2 + 30, height / 2 - 50);
  ctx.lineTo(width / 2 + 80, height / 2 - 30);
  ctx.lineTo(width / 2 + 80, height / 2 - 10);
  ctx.lineTo(width / 2 + 30, height / 2 - 30);
  ctx.fill();
}

// Helper function to draw hotel buildings
function drawHotelBuilding(ctx, width, height, type) {
  switch (type) {
    case 'luxury': 
      // Draw luxury high-rise
      ctx.fillStyle = '#90a4ae';
      ctx.fillRect(width / 2 - 100, 80, 200, height / 2 + 60);
      
      // Windows
      ctx.fillStyle = '#e3f2fd';
      for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 6; col++) {
          ctx.fillRect(
            width / 2 - 80 + col * 30, 
            100 + row * 30, 
            20, 20
          );
        }
      }
      
      // Penthouse
      ctx.fillStyle = '#62727b';
      ctx.fillRect(width / 2 - 60, 50, 120, 30);
      break;
    
    case 'resort':
      // Draw resort with multiple buildings
      ctx.fillStyle = '#bcaaa4';
      
      // Main building
      ctx.fillRect(width / 2 - 70, 120, 140, height / 2);
      
      // Side buildings
      ctx.fillRect(width / 2 - 150, 160, 60, height / 2 - 20);
      ctx.fillRect(width / 2 + 90, 160, 60, height / 2 - 20);
      
      // Pool
      ctx.fillStyle = '#81d4fa';
      ctx.beginPath();
      ctx.ellipse(width / 2, height / 2 + 60, 80, 40, 0, 0, Math.PI * 2);
      ctx.fill();
      
      // Palm trees
      drawPalmTree(ctx, width / 2 - 120, height / 2 + 30, 0.7);
      drawPalmTree(ctx, width / 2 + 120, height / 2 + 30, 0.7);
      break;
      
    case 'budget':
      // Draw simpler hotel building
      ctx.fillStyle = '#bdbdbd';
      ctx.fillRect(width / 2 - 90, 140, 180, height / 2 - 20);
      
      // Windows
      ctx.fillStyle = '#e0e0e0';
      for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 4; col++) {
          ctx.fillRect(
            width / 2 - 70 + col * 40, 
            160 + row * 40, 
            25, 25
          );
        }
      }
      
      // Entrance
      ctx.fillStyle = '#9e9e9e';
      ctx.fillRect(width / 2 - 30, height / 2 - 20, 60, 40);
      break;
      
    default:
      // Draw default hotel building
      ctx.fillStyle = '#78909c';
      ctx.fillRect(width / 2 - 80, 100, 160, height / 2);
      
      // Windows
      ctx.fillStyle = '#eceff1';
      for (let row = 0; row < 5; row++) {
        for (let col = 0; col < 4; col++) {
          ctx.fillRect(
            width / 2 - 60 + col * 35, 
            130 + row * 35, 
            20, 20
          );
        }
      }
  }
}

// Helper function to draw a palm tree
function drawPalmTree(ctx, x, y, scale = 1) {
  // Trunk
  ctx.fillStyle = '#795548';
  ctx.fillRect(x - 5 * scale, y - 50 * scale, 10 * scale, 50 * scale);
  
  // Leaves
  ctx.fillStyle = '#66bb6a';
  for (let i = 0; i < 5; i++) {
    const angle = (i / 5) * Math.PI * 2;
    ctx.beginPath();
    ctx.ellipse(
      x + Math.cos(angle) * 25 * scale, 
      y - 50 * scale + Math.sin(angle) * 15 * scale, 
      40 * scale, 10 * scale, 
      angle, 0, Math.PI * 2
    );
    ctx.fill();
  }
}

// Helper function to draw car silhouettes
function drawCarSilhouette(ctx, width, height, type) {
  const centerX = width / 2;
  const baseY = height / 2 + 30;
  
  switch (type) {
    case 'economy':
      // Draw small car
      ctx.fillStyle = '#90caf9';
      
      // Car body
      ctx.beginPath();
      ctx.moveTo(centerX - 80, baseY);
      ctx.lineTo(centerX - 60, baseY - 40);
      ctx.lineTo(centerX + 60, baseY - 40);
      ctx.lineTo(centerX + 80, baseY);
      ctx.closePath();
      ctx.fill();
      
      // Windows
      ctx.fillStyle = '#e3f2fd';
      ctx.beginPath();
      ctx.moveTo(centerX - 40, baseY - 38);
      ctx.lineTo(centerX - 20, baseY - 60);
      ctx.lineTo(centerX + 40, baseY - 60);
      ctx.lineTo(centerX + 55, baseY - 38);
      ctx.closePath();
      ctx.fill();
      
      // Wheels
      ctx.fillStyle = '#212121';
      ctx.beginPath();
      ctx.arc(centerX - 50, baseY, 15, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(centerX + 50, baseY, 15, 0, Math.PI * 2);
      ctx.fill();
      break;
      
    case 'luxury':
      // Draw luxury car
      ctx.fillStyle = '#f44336';
      
      // Car body - sleeker design
      ctx.beginPath();
      ctx.moveTo(centerX - 100, baseY);
      ctx.lineTo(centerX - 80, baseY - 20);
      ctx.lineTo(centerX - 50, baseY - 35);
      ctx.lineTo(centerX + 70, baseY - 35);
      ctx.lineTo(centerX + 100, baseY);
      ctx.closePath();
      ctx.fill();
      
      // Windows
      ctx.fillStyle = '#ffcdd2';
      ctx.beginPath();
      ctx.moveTo(centerX - 40, baseY - 34);
      ctx.lineTo(centerX - 20, baseY - 55);
      ctx.lineTo(centerX + 40, baseY - 55);
      ctx.lineTo(centerX + 60, baseY - 34);
      ctx.closePath();
      ctx.fill();
      
      // Wheels - bigger
      ctx.fillStyle = '#212121';
      ctx.beginPath();
      ctx.arc(centerX - 60, baseY, 18, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(centerX + 60, baseY, 18, 0, Math.PI * 2);
      ctx.fill();
      break;
      
    case 'suv':
      // Draw SUV
      ctx.fillStyle = '#8d6e63';
      
      // Car body - taller
      ctx.beginPath();
      ctx.moveTo(centerX - 90, baseY);
      ctx.lineTo(centerX - 90, baseY - 30);
      ctx.lineTo(centerX - 50, baseY - 60);
      ctx.lineTo(centerX + 70, baseY - 60);
      ctx.lineTo(centerX + 90, baseY - 30);
      ctx.lineTo(centerX + 90, baseY);
      ctx.closePath();
      ctx.fill();
      
      // Windows
      ctx.fillStyle = '#d7ccc8';
      ctx.beginPath();
      ctx.moveTo(centerX - 80, baseY - 30);
      ctx.lineTo(centerX - 50, baseY - 55);
      ctx.lineTo(centerX + 60, baseY - 55);
      ctx.lineTo(centerX + 80, baseY - 30);
      ctx.closePath();
      ctx.fill();
      
      // Wheels - bigger, higher clearance
      ctx.fillStyle = '#212121';
      ctx.beginPath();
      ctx.arc(centerX - 60, baseY - 5, 20, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(centerX + 60, baseY - 5, 20, 0, Math.PI * 2);
      ctx.fill();
      break;
      
    case 'midsize':
    default:
      // Draw midsize car
      ctx.fillStyle = '#26a69a';
      
      // Car body
      ctx.beginPath();
      ctx.moveTo(centerX - 90, baseY);
      ctx.lineTo(centerX - 70, baseY - 30);
      ctx.lineTo(centerX + 60, baseY - 30);
      ctx.lineTo(centerX + 90, baseY);
      ctx.closePath();
      ctx.fill();
      
      // Windows
      ctx.fillStyle = '#b2dfdb';
      ctx.beginPath();
      ctx.moveTo(centerX - 50, baseY - 28);
      ctx.lineTo(centerX - 30, baseY - 50);
      ctx.lineTo(centerX + 40, baseY - 50);
      ctx.lineTo(centerX + 55, baseY - 28);
      ctx.closePath();
      ctx.fill();
      
      // Wheels
      ctx.fillStyle = '#212121';
      ctx.beginPath();
      ctx.arc(centerX - 55, baseY, 16, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(centerX + 55, baseY, 16, 0, Math.PI * 2);
      ctx.fill();
  }
}

// Generate all images
async function generateAllImages() {
  try {
    console.log('Starting image generation...');
    
    // Generate destination images
    for (const destination of destinations) {
      await generateDestinationImage(destination);
    }
    
    // Generate hotel images
    for (const hotel of hotels) {
      await generateHotelImage(hotel);
    }
    
    // Generate car images
    for (const car of cars) {
      await generateCarImage(car);
    }
    
    console.log('All images generated successfully!');
  } catch (error) {
    console.error('Error generating images:', error);
    process.exit(1);
  }
}

/**
 * Helper function to draw rounded rectangles since Node Canvas might not support it
 * @param {CanvasRenderingContext2D} ctx - The canvas context
 * @param {number} x - The x position
 * @param {number} y - The y position
 * @param {number} width - The width of the rectangle
 * @param {number} height - The height of the rectangle
 * @param {number|object} radius - The corner radius or an object specifying different radii
 */
function drawRoundedRect(ctx, x, y, width, height, radius) {
  let radii = { tl: 0, tr: 0, br: 0, bl: 0 };
  
  if (typeof radius === 'number') {
    radii = { tl: radius, tr: radius, br: radius, bl: radius };
  } else if (typeof radius === 'object') {
    radii = { ...radii, ...radius };
  }
  
  ctx.beginPath();
  ctx.moveTo(x + radii.tl, y);
  ctx.lineTo(x + width - radii.tr, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radii.tr);
  ctx.lineTo(x + width, y + height - radii.br);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radii.br, y + height);
  ctx.lineTo(x + radii.bl, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radii.bl);
  ctx.lineTo(x, y + radii.tl);
  ctx.quadraticCurveTo(x, y, x + radii.tl, y);
  ctx.closePath();
  
  return ctx;
}

// Run the script
generateAllImages(); 