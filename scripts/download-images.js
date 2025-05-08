#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';

// Get current file directory in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Image definitions
const IMAGES = {
  destinations: [
    { filename: 'southwest-hawaii.jpg', placeholderText: 'Tropical+Hawaiian+Beach+Resort' },
    { filename: 'southwest-cancun.jpg', placeholderText: 'Beautiful+Cancun+Beach+Resort' },
    { filename: 'southwest-vegas.jpg', placeholderText: 'Las+Vegas+Strip+Night' },
    { filename: 'southwest-denver.jpg', placeholderText: 'Denver+Mountain+View' },
    { filename: 'southwest-orlando.jpg', placeholderText: 'Orlando+Theme+Park' },
    { filename: 'southwest-sanfrancisco.jpg', placeholderText: 'San+Francisco+Golden+Gate+Bridge' },
  ],
  hotels: [
    // Hawaii hotels
    { filename: 'hotel-hawaii-1.jpg', placeholderText: 'Hawaiian+Beach+Resort' },
    { filename: 'hotel-hawaii-2.jpg', placeholderText: 'Luxury+Hawaii+Hotel+Pool' },
    // Cancun hotels
    { filename: 'hotel-cancun-1.jpg', placeholderText: 'Cancun+Beachfront+Resort' },
    { filename: 'hotel-cancun-2.jpg', placeholderText: 'Cancun+Swimming+Pool+Resort' },
    // Las Vegas hotels
    { filename: 'hotel-vegas-1.jpg', placeholderText: 'Las+Vegas+Casino+Resort' },
    { filename: 'hotel-vegas-2.jpg', placeholderText: 'Las+Vegas+Luxury+Suite' },
    // Denver hotels
    { filename: 'hotel-denver-1.jpg', placeholderText: 'Denver+Mountain+Lodge' },
    { filename: 'hotel-denver-2.jpg', placeholderText: 'Denver+City+Hotel' },
    // Orlando hotels
    { filename: 'hotel-orlando-1.jpg', placeholderText: 'Orlando+Family+Resort' },
    { filename: 'hotel-orlando-2.jpg', placeholderText: 'Orlando+Theme+Park+Hotel' },
    { filename: 'hotel-orlando-3.jpg', placeholderText: 'Orlando+Villa+Resort' },
    // San Francisco hotels
    { filename: 'hotel-sf-1.jpg', placeholderText: 'San+Francisco+Bay+View+Hotel' },
    { filename: 'hotel-sf-2.jpg', placeholderText: 'San+Francisco+Boutique+Hotel' },
    { filename: 'hotel-sf-3.jpg', placeholderText: 'San+Francisco+Luxury+Hotel' },
  ],
  cars: [
    { filename: 'car-jeep.jpg', placeholderText: 'Jeep+Wrangler+SUV' },
    { filename: 'car-mustang.jpg', placeholderText: 'Ford+Mustang+Convertible+Car' },
    { filename: 'car-jetta.jpg', placeholderText: 'Volkswagen+Jetta+Sedan' },
    { filename: 'car-spark.jpg', placeholderText: 'Chevrolet+Spark+Economy+Car' },
    { filename: 'car-mustang-convertible.jpg', placeholderText: 'Mustang+Convertible+Red' },
    { filename: 'car-camry.jpg', placeholderText: 'Toyota+Camry+Sedan' },
    { filename: 'car-jeep-cherokee.jpg', placeholderText: 'Jeep+Grand+Cherokee+SUV' },
    { filename: 'car-outback.jpg', placeholderText: 'Subaru+Outback+Wagon' },
    { filename: 'car-pacifica.jpg', placeholderText: 'Chrysler+Pacifica+Minivan' },
    { filename: 'car-sienna.jpg', placeholderText: 'Toyota+Sienna+Minivan' },
    { filename: 'car-prius.jpg', placeholderText: 'Toyota+Prius+Hybrid' },
    { filename: 'car-tesla.jpg', placeholderText: 'Tesla+Model+3+Electric' },
  ]
};

// Function to download an image
const downloadImage = (url, filepath) => {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filepath);
    https.get(url, (response) => {
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        console.log(`✅ Downloaded: ${filepath}`);
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(filepath, () => {}); // Delete the file if there's an error
      console.error(`❌ Error downloading ${url}: ${err.message}`);
      reject(err);
    });
  });
};

// Main function
async function main() {
  try {
    console.log('Starting image downloads...');
    
    // Process each image category
    for (const [category, images] of Object.entries(IMAGES)) {
      console.log(`\nDownloading ${category} images...`);
      const categoryPath = path.resolve(__dirname, `../public/images/${category}`);
      
      // Ensure directory exists
      if (!fs.existsSync(categoryPath)) {
        fs.mkdirSync(categoryPath, { recursive: true });
        console.log(`Created directory: ${categoryPath}`);
      }
      
      // Download each image in the category
      for (const image of images) {
        const filepath = path.join(categoryPath, image.filename);
        
        // Skip if file already exists
        if (fs.existsSync(filepath)) {
          console.log(`⏭️ Skipping (already exists): ${image.filename}`);
          continue;
        }
        
        // Create the URL for placeholder image
        const url = `https://placehold.co/800x600?text=${image.placeholderText}`;
        
        // Download the image
        await downloadImage(url, filepath);
      }
    }
    
    console.log('\n✅ All images have been downloaded successfully!');
    
  } catch (error) {
    console.error('Error downloading images:', error);
    process.exit(1);
  }
}

main(); 