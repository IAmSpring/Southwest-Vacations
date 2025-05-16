#!/usr/bin/env node

/**
 * Simple script to generate trip images for Southwest Vacations app
 * 
 * This script creates basic placeholder images for trips when real images aren't available.
 * Used primarily for GitHub Pages deployment where dynamic image generation isn't possible.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createCanvas } from 'canvas';

// Get current file directory with ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const IMAGES_DIR = path.join(__dirname, '../public/images/destinations');
const COLORS = {
  beach: { bg: '#e0f7fa', text: '#006064' },
  city: { bg: '#e8eaf6', text: '#1a237e' }, 
  mountain: { bg: '#e8f5e9', text: '#1b5e20' },
  europe: { bg: '#ede7f6', text: '#4527a0' },
  asia: { bg: '#fff3e0', text: '#e65100' },
  usa: { bg: '#e3f2fd', text: '#0d47a1' },
  default: { bg: '#f5f5f5', text: '#212121' }
};

// Trip destinations to generate
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

// Ensure the destination directory exists
if (!fs.existsSync(IMAGES_DIR)) {
  fs.mkdirSync(IMAGES_DIR, { recursive: true });
  console.log(`Created directory: ${IMAGES_DIR}`);
}

/**
 * Generate an image for a destination
 */
function generateDestinationImage(destination) {
  const { id, name, type } = destination;
  const colors = COLORS[type] || COLORS.default;
  
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
  ctx.fillStyle = '#304CB2'; // Southwest Blue
  ctx.beginPath();
  ctx.ellipse(width - 70, 70, 40, 40, 0, 0, Math.PI * 2);
  ctx.fill();
  
  ctx.fillStyle = '#FFBF27'; // Southwest Gold
  ctx.beginPath();
  ctx.ellipse(width - 70, 70, 25, 25, 0, 0, Math.PI * 2);
  ctx.fill();
  
  // Draw destination text
  ctx.font = 'bold 40px Arial';
  ctx.fillStyle = colors.text;
  ctx.textAlign = 'center';
  ctx.fillText(name, width / 2, height / 2);
  
  // Draw Southwest Vacations text
  ctx.font = '20px Arial';
  ctx.fillText('Southwest Vacations', width / 2, height / 2 + 40);
  
  // Save the image
  const outputPath = path.join(IMAGES_DIR, `${id}.jpg`);
  const out = fs.createWriteStream(outputPath);
  const stream = canvas.createJPEGStream({ quality: 0.95 });
  
  return new Promise((resolve, reject) => {
    stream.pipe(out);
    out.on('finish', () => {
      console.log(`Created image: ${outputPath}`);
      resolve(outputPath);
    });
    out.on('error', reject);
  });
}

// Helper drawing functions based on destination type
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
  
  // Building 1
  ctx.fillRect(100, height / 2 - 100, 60, 100);
  
  // Building 2
  ctx.fillRect(200, height / 2 - 150, 40, 150);
  
  // Building 3 (tallest)
  ctx.fillRect(300, height / 2 - 200, 50, 200);
  
  // Building 4
  ctx.fillRect(400, height / 2 - 130, 70, 130);
  
  // Building 5
  ctx.fillRect(500, height / 2 - 180, 45, 180);
  
  // Building 6
  ctx.fillRect(600, height / 2 - 120, 80, 120);
  
  // Windows
  ctx.fillStyle = '#ffeb3b';
  for (let x = 110; x < 150; x += 15) {
    for (let y = height / 2 - 90; y < height / 2; y += 20) {
      ctx.fillRect(x, y, 10, 10);
    }
  }
}

function drawMountainElements(ctx, width, height) {
  // Draw mountains
  ctx.fillStyle = '#78909c';
  ctx.beginPath();
  ctx.moveTo(0, height / 2);
  ctx.lineTo(200, height / 2 - 150);
  ctx.lineTo(400, height / 2);
  ctx.fill();
  
  ctx.fillStyle = '#607d8b';
  ctx.beginPath();
  ctx.moveTo(250, height / 2);
  ctx.lineTo(450, height / 2 - 200);
  ctx.lineTo(650, height / 2);
  ctx.fill();
  
  ctx.fillStyle = '#455a64';
  ctx.beginPath();
  ctx.moveTo(500, height / 2);
  ctx.lineTo(700, height / 2 - 180);
  ctx.lineTo(width, height / 2);
  ctx.fill();
  
  // Draw snow caps
  ctx.fillStyle = '#eceff1';
  ctx.beginPath();
  ctx.moveTo(170, height / 2 - 120);
  ctx.lineTo(200, height / 2 - 150);
  ctx.lineTo(230, height / 2 - 120);
  ctx.fill();
  
  ctx.beginPath();
  ctx.moveTo(420, height / 2 - 170);
  ctx.lineTo(450, height / 2 - 200);
  ctx.lineTo(480, height / 2 - 170);
  ctx.fill();
  
  ctx.beginPath();
  ctx.moveTo(670, height / 2 - 150);
  ctx.lineTo(700, height / 2 - 180);
  ctx.lineTo(730, height / 2 - 150);
  ctx.fill();
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
  ctx.strokeStyle = '#304CB2';
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(100, height / 2 + 60);
  ctx.lineTo(width - 100, height / 2 + 60);
  ctx.stroke();
  
  // Draw airplane silhouette
  ctx.fillStyle = '#304CB2';
  
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

// Generate all images
async function generateAllImages() {
  try {
    for (const destination of destinations) {
      await generateDestinationImage(destination);
    }
    console.log('All trip images generated successfully!');
  } catch (error) {
    console.error('Error generating images:', error);
    process.exit(1);
  }
}

// Run the script
generateAllImages(); 