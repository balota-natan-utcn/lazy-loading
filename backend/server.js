const express = require('express');
const path = require('path');
const fs = require('fs');
const sharp = require('sharp');
const cors = require('cors');

const app = express();
const port = 3000;

// Enable CORS to allow frontend to communicate with backend
app.use(cors());

// Serve images folders statically
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/images-lowres', express.static(path.join(__dirname, 'images-lowres')));

// API endpoint to get image list
app.get('/api/images', (req, res) => {
  const imagesDir = path.join(__dirname, 'images');
  
  fs.readdir(imagesDir, (err, files) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to read images directory' });
    }
    
    // Filter for image files only
    const imageFiles = files.filter(file => {
      const ext = path.extname(file).toLowerCase();
      return ['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(ext);
    });
    
    res.json({ images: imageFiles });
  });
});

// Function to ensure low-res version exists
function ensureLowResExists(filename) {
  const highResPath = path.join(__dirname, 'images', filename);
  const lowResPath = path.join(__dirname, 'images-lowres', filename);
  const lowResDirPath = path.join(__dirname, 'images-lowres');
  
  // Create the lowres directory if it doesn't exist
  if (!fs.existsSync(lowResDirPath)) {
    fs.mkdirSync(lowResDirPath, { recursive: true });
  }
  
  // If low-res version doesn't exist, create it
  if (!fs.existsSync(lowResPath)) {
    return sharp(highResPath)
      .resize({ width: 300 }) // Resize to width of 300px
      .jpeg({ quality: 60 })  // Lower quality
      .toFile(lowResPath);
  }
  
  return Promise.resolve();
}

// Endpoint to ensure low-res version exists and return path
app.get('/api/lowres/:image', async (req, res) => {
  const filename = req.params.image;
  
  try {
    await ensureLowResExists(filename);
    res.json({ path: `/images-lowres/${filename}` });
  } catch (error) {
    console.error('Error generating low-res image:', error);
    res.status(500).json({ error: 'Failed to generate low-res image' });
  }
});

// Serve frontend static files
app.use(express.static(path.join(__dirname, '..', 'frontend')));

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
