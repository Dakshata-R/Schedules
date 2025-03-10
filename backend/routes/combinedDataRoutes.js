// routes/combinedDataRoutes.js
const express = require('express');
const router = express.Router();
const combinedDataController = require('../controllers/combinedDataController');

router.get('/fetch-data', combinedDataController.getCombinedData);

module.exports = router;