const express = require('express');
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const IMAGE_DIR = path.join(__dirname, '../images');
const LOWRES_DIR = path.join(__dirname, '../image-lowres');

//make sure lowres directory exists
if (!fs.existsSync(LOWRES_DIR))
{
    fs.mkdirSync(LOWRES_DIR);
}

router.get('/:imageName', async (req, res) =>
{
    const { imageName } = req.params;
    const originalImagePath = path.join(IMAGE_DIR, imageName);
    const lowResImagePath = path.join(LOWRES_DIR, imageName);

    if (!fs.existsSync(originalImagePath))
    {
        return res.status(404).send('Image not found');
    }

    //check for low res version
    if (!fs.existsSync(lowResImagePath))
    {
        //create lowres image
        await sharp(originalImagePath)
            .resize(30) //width of 30px
            .toFile(lowResImagePath);
    }

    res.sendFile(lowResImagePath);
});

router.get('/high/:imageName', (req, res) =>
{
    const { imageName } = req.params;
    const originalImagePath = path.join(IMAGE_DIR, imageName);

    if (!fs.existsSync(originalImagePath))
    {
        return res.status(404).send('Image not found');
    }

    res.sendFile(originalImagePath);
});

module.exports = router;