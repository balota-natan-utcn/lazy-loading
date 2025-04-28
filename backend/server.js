const express = require('express');
const path = require('path');
const fs = require('fs');
const cors = require('cors');

const app = express();
const port = 3000;

// Enable CORS to allow frontend to communicate with backend
app.use(cors());

// Serve images folder statically
app.use('/images', express.static(path.join(__dirname, 'images')));

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

// Serve frontend static files
app.use(express.static(path.join(__dirname, '..', 'frontend')));

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});