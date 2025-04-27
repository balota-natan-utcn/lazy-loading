const express = require('express');
const cors = require('cors');
const app = express();
const imagesRoute = require('./routes/images');

app.use(cors());
app.use('/images', imagesRoute);

const PORT = 3000;
app.listen(PORT, () => console.log('Server running on port ${PORT}'));