const express = require('express');
const router = express.Router();
const slotBookingController = require('../../../controllers/schedules/template/slotBookingController');

// Book a slot
router.post('/:slotId/book', slotBookingController.bookSlot);

router.get('/all', slotBookingController.getAllBookings);
// Get student's bookings
router.get('/student/:studentEmail', slotBookingController.getStudentBookings);

// Cancel a booking
router.post('/:bookingId/cancel', slotBookingController.cancelBooking);

module.exports = router;




