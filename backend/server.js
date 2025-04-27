const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const imagesRoute = require('./routes/images');

const app = express();
const PORT = 3000;

const IMAGE_DIR = path.join(__dirname, 'images');
const LOWRES_DIR = path.join(__dirname, 'images-lowres');

// Ensure low-res directory exists
if (!fs.existsSync(LOWRES_DIR))
{
  fs.mkdirSync(LOWRES_DIR);
}

// Pre-generate low-res images
async function generateLowResImages()
{
  const files = fs.readdirSync(IMAGE_DIR);

  for (const file of files)
  {
    const originalImagePath = path.join(IMAGE_DIR, file);
    const lowResImagePath = path.join(LOWRES_DIR, file);

    // Skip if already exists
    if (fs.existsSync(lowResImagePath)) continue;

    try
    {
      await sharp(originalImagePath)
        .resize({ width: 20 }) //20px width
        .toFile(lowResImagePath);

      console.log(`Generated low-res for ${file}`);
    } catch (err)
    {
      console.error(`Failed to process ${file}`, err);
    }
  }
}

// Generate images before server starts
generateLowResImages().then(() =>
{
  app.use(cors());
  app.use('/images', imagesRoute);

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
