const express = require('express');
const path = require('path');
const router = express.Router();

const IMAGE_DIR = path.join(__dirname, '../images');
const LOWRES_DIR = path.join(__dirname, '../images-lowres');

router.get('/:imageName', (req, res) => {
  const { imageName } = req.params;
  const lowResImagePath = path.join(LOWRES_DIR, imageName);

  res.sendFile(lowResImagePath);
});

router.get('/high/:imageName', (req, res) => {
  const { imageName } = req.params;
  const originalImagePath = path.join(IMAGE_DIR, imageName);

  res.sendFile(originalImagePath);
});

module.exports = router;
