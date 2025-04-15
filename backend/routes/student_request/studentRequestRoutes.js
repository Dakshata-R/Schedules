const express = require('express');
const router = express.Router();
const studentRequestController = require('../../controllers/student_requests/studentRequestController');

// Create a new request
router.post('/', studentRequestController.createRequest);
// Approve request and create slot
router.put('/:id/approve', studentRequestController.approveRequestAndCreateSlot);
// Get requests by student email
router.get('/student/:email', studentRequestController.getRequestsByEmail);
// Get requests with slots
router.get('/with-slots/:email', studentRequestController.getRequestsWithSlots);
// Get booked slots for calendar view
router.get('/booked-slots/:email', studentRequestController.getBookedSlots);
// Get all requests (for admin)
router.get('/', studentRequestController.getAllRequests);
// Delete request
router.delete('/:id', studentRequestController.deleteRequest);
// Update request status
router.put('/:id/status', studentRequestController.updateRequestStatus);
// Get faculty schedule
router.get('/faculty/schedule/:email', studentRequestController.getFacultySchedule);
module.exports = router;