const express = require('express');
const router = express.Router();
const slotController = require('../controllers/slotController');
const StudentRequest = require('../models/student_request/StudentRequest');
const Slot = require('../models/Slot');

// Create a new slot
router.post('/', slotController.createSlot);
// Change this route in slotRoutes.js

// Change this in slotRoutes.js
router.post('/:slotId/book', slotController.bookSlot);
router.post('/api/slots/:slotId/book', slotController.bookSlot);
// Get all slots
router.get('/', slotController.getAllSlots);

// Get slots for a specific student with skills
router.get('/student/:email/:skills', async (req, res) => {
  try {
    const { email, skills } = req.params;
    const slots = await Slot.findByStudentEmail(email, [skills]);
    res.json(slots);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Book a slot


// Get requests by email with slots
// Change this route
router.get('/requests/:email', async (req, res) => {
  try {
    const { email } = req.params;
    const requests = await StudentRequest.findByEmail(email);
    
    // Get slots for each approved request
    const requestsWithSlots = await Promise.all(requests.map(async (request) => {
      if (request.status === 'Approved') {
        const slots = await Slot.findByStudentEmail(email, request.skills);
        // Add isBooked flag to each slot
        const slotsWithBookingStatus = slots.map(slot => ({
          ...slot,
          isBooked: slot.status === 'Booked'
        }));
        return { ...request, slots: slotsWithBookingStatus };
      }
      return request;
    }));
    
    res.json(requestsWithSlots);
  } catch (error) {
    console.error('Error fetching requests:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Add this new route
// In slotRoutes.js, update the getRequestsWithSlots route
router.get('/requests/with-slots/:email', async (req, res) => {
  try {
    const { email } = req.params;
    const requests = await StudentRequest.findByEmail(email);
    
    const requestsWithSlots = await Promise.all(requests.map(async (request) => {
      if (request.status === 'Approved') {
        const slots = await Slot.findByStudentEmail(email, request.skills);
        const slotsWithBookingStatus = slots.map(slot => ({
          ...slot,
          isBooked: slot.status === 'Booked' // Make sure this matches your database status
        }));
        return { ...request, slots: slotsWithBookingStatus };
      }
      return { ...request, slots: [] };
    }));
    
    res.json(requestsWithSlots);
  } catch (error) {
    console.error('Error fetching requests with slots:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});




module.exports = router;