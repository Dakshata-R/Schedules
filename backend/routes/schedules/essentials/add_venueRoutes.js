const express = require('express');
const router = express.Router();
const venueController = require('../../../controllers/schedules/essentials/add_venueController');

router.get('/', venueController.getAllVenues);

module.exports = router;