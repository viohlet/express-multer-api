'use strict';

const multer = require('multer');
const storage = multer.memoryStorage(); //dont do this with real apps

module.exports = multer({ storage });
