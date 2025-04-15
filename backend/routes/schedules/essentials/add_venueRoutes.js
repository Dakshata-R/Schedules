const express = require('express');
const router = express.Router();
const venueController = require('../../../controllers/schedules/essentials/add_venueController');

router.get('/', venueController.getAllVenues);
router.get('/check-availability', venueController.checkVenueAvailability);

module.exports = router;