const express = require('express');
const router = express.Router();
const slotBookingController = require('../../../controllers/schedules/template/slotBookingController');
// Book a slot
router.post('/book-slot', slotBookingController.bookSlot);

// Get bookings for a student
router.get('/for-student/:email', slotBookingController.getStudentBookings);

// Get available slots
router.get('/available-slots', slotBookingController.getAvailableSlots);




module.exports = router;
