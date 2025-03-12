// venueRoutes.js
const express = require('express');
const { fetchVenues } = require('../controllers/venueController');

const router = express.Router();

router.get('/venues', fetchVenues);

module.exports = router;