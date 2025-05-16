#!/usr/bin/env node

/**
 * Specialized script to generate trip images for the trips list view
 * 
 * This script creates standardized, optimized images for the trip listing pages.
 * Used primarily for GitHub Pages deployment where dynamic image generation isn't possible.
 */

const fs = require('fs');
const path = require('path');
const { createCanvas } = require('canvas');

// Configuration
const OUTPUT_DIR = path.join(__dirname, '../public/images/trips-list');
const WIDTH = 640;  // Standard width for trip list cards
const HEIGHT = 320; // Standard height for trip list cards

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

// Trip data with region-specific styling
const trips = [
  {
    id: 'trip1',
    destination: 'Maui, Hawaii',
    description: 'Relax on beautiful beaches and enjoy stunning sunsets',
    region: 'beach',
    price: 1499.99
  },
  {
    id: 'trip2',
    destination: 'Cancun, Mexico',
    description: 'Crystal clear waters and vibrant nightlife',
    region: 'beach',
    price: 1250.00
  },
  {
    id: 'trip3',
    destination: 'New York City',
    description: 'The city that never sleeps - museums, shows & cuisine',
    region: 'city',
    price: 1300.00
  },
  {
    id: 'trip4',
    destination: 'Rome, Italy',
    description: 'Ancient ruins and authentic Italian cuisine',
    region: 'europe',
    price: 1850.00
  },
  {
    id: 'trip5',
    destination: 'Tokyo, Japan',
    description: 'Blend of tradition and cutting-edge technology',
    region: 'asia',
    price: 1799.99
  },
  {
    id: 'trip6',
    destination: 'Paris, France',
    description: 'City of lights, romance, and exquisite cuisine',
    region: 'europe',
    price: 1650.00
  },
  {
    id: 'trip7',
    destination: 'Sydney, Australia',
    description: 'Iconic Opera House and stunning harbor views',
    region: 'beach',
    price: 2200.00
  },
  {
    id: 'trip8',
    destination: 'Banff, Canada',
    description: 'Breathtaking mountain views and outdoor adventures',
    region: 'mountain',
    price: 1600.00
  },
  {
    id: 'trip9',
    destination: 'Santorini, Greece',
    description: 'White-washed buildings and blue domes overlooking the sea',
    region: 'beach',
    price: 1950.00
  }
];

// Region-specific styling
const regionStyles = {
  beach: {
    bgColor: '#e0f7fa',
    textColor: '#006064',
    iconEmoji: '🏖️',
    gradient: ['#e0f7fa', '#80deea', '#4dd0e1']
  },
  city: {
    bgColor: '#e8eaf6',
    textColor: '#1a237e',
    iconEmoji: '🏙️',
    gradient: ['#e8eaf6', '#c5cae9', '#9fa8da']
  },
  mountain: {
    bgColor: '#e8f5e9',
    textColor: '#1b5e20',
    iconEmoji: '🏔️',
    gradient: ['#e8f5e9', '#a5d6a7', '#81c784']
  },
  europe: {
    bgColor: '#ede7f6',
    textColor: '#4527a0',
    iconEmoji: '🏛️',
    gradient: ['#ede7f6', '#d1c4e9', '#b39ddb']
  },
  asia: {
    bgColor: '#fff3e0',
    textColor: '#e65100',
    iconEmoji: '🏮',
    gradient: ['#fff3e0', '#ffe0b2', '#ffcc80']
  },
  usa: {
    bgColor: '#e3f2fd',
    textColor: '#0d47a1',
    iconEmoji: '🗽',
    gradient: ['#e3f2fd', '#bbdefb', '#90caf9']
  }
};

/**
 * Generate a standardized trip list image
 */
async function generateTripListImage(trip) {
  const { id, destination, description, region, price } = trip;
  
  // Get the region-specific styling, or fall back to beach if not found
  const style = regionStyles[region] || regionStyles.beach;
  
  // Create canvas
  const canvas = createCanvas(WIDTH, HEIGHT);
  const ctx = canvas.getContext('2d');
  
  // Draw background gradient
  const gradient = ctx.createLinearGradient(0, 0, WIDTH, HEIGHT);
  gradient.addColorStop(0, style.gradient[0]);
  gradient.addColorStop(0.5, style.gradient[1]);
  gradient.addColorStop(1, style.gradient[2]);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);
  
  // Add some region-specific design elements
  drawRegionElements(ctx, region, WIDTH, HEIGHT);
  
  // Draw Southwest Airlines logo in top right
  drawLogo(ctx, WIDTH - 60, 60);
  
  // Draw destination name
  ctx.font = 'bold 40px Arial';
  ctx.fillStyle = style.textColor;
  ctx.textAlign = 'center';
  
  // Handle long destination names
  if (destination.length > 15) {
    const words = destination.split(',');
    if (words.length > 1) {
      ctx.fillText(words[0].trim(), WIDTH / 2, HEIGHT / 2 - 20);
      ctx.fillText(words.slice(1).join(',').trim(), WIDTH / 2, HEIGHT / 2 + 30);
    } else {
      const middleIndex = Math.floor(destination.length / 2);
      const firstHalf = destination.substring(0, middleIndex);
      const secondHalf = destination.substring(middleIndex);
      ctx.fillText(firstHalf.trim(), WIDTH / 2, HEIGHT / 2 - 20);
      ctx.fillText(secondHalf.trim(), WIDTH / 2, HEIGHT / 2 + 30);
    }
  } else {
    ctx.fillText(destination, WIDTH / 2, HEIGHT / 2);
  }
  
  // Draw short description
  ctx.font = '18px Arial';
  ctx.fillText(description, WIDTH / 2, HEIGHT / 2 + 80);
  
  // Draw price tag
  drawPriceTag(ctx, price, WIDTH - 100, 120);
  
  // Add region icon
  ctx.font = '40px Arial';
  ctx.fillText(style.iconEmoji, 60, 60);
  
  // Save the image
  const outputPath = path.join(OUTPUT_DIR, `${id}.jpg`);
  const out = fs.createWriteStream(outputPath);
  const stream = canvas.createJPEGStream({ quality: 0.9 }); // Slightly compressed for web
  
  return new Promise((resolve, reject) => {
    stream.pipe(out);
    out.on('finish', () => {
      console.log(`Created trip list image: ${outputPath}`);
      resolve(outputPath);
    });
    out.on('error', reject);
  });
}

/**
 * Draw the Southwest logo
 */
function drawLogo(ctx, x, y) {
  // Outer circle
  ctx.fillStyle = BRAND_COLORS.blue;
  ctx.beginPath();
  ctx.arc(x, y, 30, 0, Math.PI * 2);
  ctx.fill();
  
  // Inner circle
  ctx.fillStyle = BRAND_COLORS.gold;
  ctx.beginPath();
  ctx.arc(x, y, 18, 0, Math.PI * 2);
  ctx.fill();
  
  // Add "SW" text
  ctx.fillStyle = 'white';
  ctx.font = 'bold 14px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('SW', x, y);
}

/**
 * Draw a price tag
 */
function drawPriceTag(ctx, price, x, y) {
  // Background
  ctx.fillStyle = BRAND_COLORS.gold;
  ctx.beginPath();
  
  // Rounded rectangle with a little "tag" part
  ctx.moveTo(x - 60, y - 20);
  ctx.lineTo(x + 40, y - 20);
  ctx.lineTo(x + 40, y + 20);
  ctx.lineTo(x - 60, y + 20);
  ctx.closePath();
  ctx.fill();
  
  // Price text
  ctx.fillStyle = BRAND_COLORS.blue;
  ctx.font = 'bold 24px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(`$${price.toFixed(0)}`, x - 10, y);
}

/**
 * Draw region-specific design elements
 */
function drawRegionElements(ctx, region, width, height) {
  // Variables that will be used across different cases
  let towerCenterX, towerBaseY, towerHeight;
  let pagodaCenterX, pagodaBaseY;
  let statueCenterX, statueBaseY;
  
  switch (region) {
    case 'beach':
      // Draw water line
      ctx.fillStyle = '#4dd0e1';
      ctx.fillRect(0, height - 80, width, 80);
      
      // Draw simple sun
      ctx.fillStyle = '#ffeb3b';
      ctx.beginPath();
      ctx.arc(width - 80, 80, 30, 0, Math.PI * 2);
      ctx.fill();
      
      // Draw palm tree
      ctx.fillStyle = '#5d4037';
      ctx.fillRect(80, height - 140, 10, 60);
      
      ctx.fillStyle = '#66bb6a';
      ctx.beginPath();
      ctx.arc(85, height - 140, 30, 0, Math.PI, true);
      ctx.fill();
      break;
      
    case 'city':
      // Draw skyline silhouette
      ctx.fillStyle = '#9fa8da';
      
      // Simple building silhouettes
      var buildingWidths = [40, 30, 60, 50, 35, 55, 45];
      var buildingHeights = [100, 140, 120, 160, 110, 130, 150];
      var xPos = 50;
      
      for (let i = 0; i < buildingWidths.length; i++) {
        if (xPos > width) break;
        
        ctx.fillRect(
          xPos, 
          height - buildingHeights[i], 
          buildingWidths[i], 
          buildingHeights[i]
        );
        
        xPos += buildingWidths[i] + 10;
      }
      break;
      
    case 'mountain':
      // Draw mountains
      ctx.fillStyle = '#81c784';
      
      // First mountain
      ctx.beginPath();
      ctx.moveTo(0, height);
      ctx.lineTo(width / 3, height - 150);
      ctx.lineTo(width / 2, height);
      ctx.closePath();
      ctx.fill();
      
      // Second mountain
      ctx.fillStyle = '#66bb6a';
      ctx.beginPath();
      ctx.moveTo(width / 3, height);
      ctx.lineTo(2 * width / 3, height - 180);
      ctx.lineTo(width, height);
      ctx.closePath();
      ctx.fill();
      
      // Snow caps
      ctx.fillStyle = 'white';
      ctx.beginPath();
      ctx.moveTo(width / 3 - 30, height - 120);
      ctx.lineTo(width / 3, height - 150);
      ctx.lineTo(width / 3 + 30, height - 120);
      ctx.closePath();
      ctx.fill();
      
      ctx.beginPath();
      ctx.moveTo(2 * width / 3 - 30, height - 150);
      ctx.lineTo(2 * width / 3, height - 180);
      ctx.lineTo(2 * width / 3 + 30, height - 150);
      ctx.closePath();
      ctx.fill();
      break;
      
    case 'europe':
      // Draw a simple Eiffel Tower
      ctx.strokeStyle = '#7e57c2';
      ctx.lineWidth = 3;
      
      towerCenterX = width / 4;
      towerBaseY = height - 50;
      towerHeight = 150;
      
      // Base
      ctx.beginPath();
      ctx.moveTo(towerCenterX - 40, towerBaseY);
      ctx.lineTo(towerCenterX + 40, towerBaseY);
      ctx.stroke();
      
      // Legs
      ctx.beginPath();
      ctx.moveTo(towerCenterX - 40, towerBaseY);
      ctx.lineTo(towerCenterX - 10, towerBaseY - towerHeight);
      ctx.stroke();
      
      ctx.beginPath();
      ctx.moveTo(towerCenterX + 40, towerBaseY);
      ctx.lineTo(towerCenterX + 10, towerBaseY - towerHeight);
      ctx.stroke();
      
      // Cross sections
      ctx.beginPath();
      ctx.moveTo(towerCenterX - 30, towerBaseY - towerHeight / 3);
      ctx.lineTo(towerCenterX + 30, towerBaseY - towerHeight / 3);
      ctx.stroke();
      
      ctx.beginPath();
      ctx.moveTo(towerCenterX - 20, towerBaseY - 2 * towerHeight / 3);
      ctx.lineTo(towerCenterX + 20, towerBaseY - 2 * towerHeight / 3);
      ctx.stroke();
      
      ctx.beginPath();
      ctx.moveTo(towerCenterX - 10, towerBaseY - towerHeight);
      ctx.lineTo(towerCenterX + 10, towerBaseY - towerHeight);
      ctx.stroke();
      
      // Top
      ctx.beginPath();
      ctx.moveTo(towerCenterX, towerBaseY - towerHeight);
      ctx.lineTo(towerCenterX, towerBaseY - towerHeight - 20);
      ctx.stroke();
      break;
      
    case 'asia':
      // Draw a simple pagoda
      ctx.fillStyle = '#ff7043';
      
      pagodaCenterX = width / 4;
      pagodaBaseY = height - 50;
      
      // Base level
      ctx.fillRect(pagodaCenterX - 40, pagodaBaseY - 30, 80, 30);
      
      // Curved roof for base
      ctx.beginPath();
      ctx.moveTo(pagodaCenterX - 50, pagodaBaseY - 30);
      ctx.quadraticCurveTo(
        pagodaCenterX, pagodaBaseY - 50,
        pagodaCenterX + 50, pagodaBaseY - 30
      );
      ctx.fill();
      
      // Middle level
      ctx.fillRect(pagodaCenterX - 30, pagodaBaseY - 60, 60, 30);
      
      // Curved roof for middle
      ctx.beginPath();
      ctx.moveTo(pagodaCenterX - 40, pagodaBaseY - 60);
      ctx.quadraticCurveTo(
        pagodaCenterX, pagodaBaseY - 80,
        pagodaCenterX + 40, pagodaBaseY - 60
      );
      ctx.fill();
      
      // Top level
      ctx.fillRect(pagodaCenterX - 20, pagodaBaseY - 90, 40, 30);
      
      // Curved roof for top
      ctx.beginPath();
      ctx.moveTo(pagodaCenterX - 30, pagodaBaseY - 90);
      ctx.quadraticCurveTo(
        pagodaCenterX, pagodaBaseY - 110,
        pagodaCenterX + 30, pagodaBaseY - 90
      );
      ctx.fill();
      break;
      
    case 'usa':
      // Draw a US landmark (simple Statue of Liberty)
      ctx.fillStyle = '#64b5f6';
      
      statueCenterX = width / 4;
      statueBaseY = height - 50;
      
      // Base
      ctx.fillRect(statueCenterX - 20, statueBaseY - 20, 40, 20);
      
      // Body
      ctx.fillRect(statueCenterX - 10, statueBaseY - 90, 20, 70);
      
      // Head
      ctx.beginPath();
      ctx.arc(statueCenterX, statueBaseY - 100, 15, 0, Math.PI * 2);
      ctx.fill();
      
      // Torch arm
      ctx.beginPath();
      ctx.moveTo(statueCenterX, statueBaseY - 70);
      ctx.lineTo(statueCenterX + 30, statueBaseY - 100);
      ctx.lineTo(statueCenterX + 30, statueBaseY - 110);
      ctx.stroke();
      
      // Torch
      ctx.fillStyle = '#ffeb3b';
      ctx.beginPath();
      ctx.arc(statueCenterX + 30, statueBaseY - 115, 5, 0, Math.PI * 2);
      ctx.fill();
      break;
      
    default:
      // Draw generic Southwest airplane silhouette for any other region
      ctx.fillStyle = BRAND_COLORS.blue;
      
      // Fuselage
      ctx.beginPath();
      ctx.moveTo(width / 3, height / 2);
      ctx.lineTo(2 * width / 3, height / 2);
      ctx.lineTo(2 * width / 3 + 30, height / 2 - 10);
      ctx.lineTo(2 * width / 3 + 30, height / 2 + 10);
      ctx.lineTo(2 * width / 3, height / 2 + 20);
      ctx.lineTo(width / 3, height / 2 + 20);
      ctx.closePath();
      ctx.fill();
      
      // Wings
      ctx.beginPath();
      ctx.moveTo(width / 2 - 30, height / 2 + 5);
      ctx.lineTo(width / 2 - 30, height / 2 + 40);
      ctx.lineTo(width / 2 + 30, height / 2 + 40);
      ctx.lineTo(width / 2 + 30, height / 2 + 5);
      ctx.closePath();
      ctx.fill();
      
      // Tail
      ctx.beginPath();
      ctx.moveTo(width / 3, height / 2 + 10);
      ctx.lineTo(width / 3 - 20, height / 2 - 30);
      ctx.lineTo(width / 3, height / 2 - 10);
      ctx.closePath();
      ctx.fill();
  }
}

/**
 * Generate images for all trips
 */
async function generateAllTripListImages() {
  try {
    console.log('Generating optimized trip list images...');
    
    for (const trip of trips) {
      await generateTripListImage(trip);
    }
    
    console.log('All trip list images generated successfully!');
  } catch (error) {
    console.error('Error generating trip list images:', error);
    process.exit(1);
  }
}

// Run the script
generateAllTripListImages(); 