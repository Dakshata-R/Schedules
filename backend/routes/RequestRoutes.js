const express = require('express');
const RequestController = require('../controllers/RequestController');
const router = express.Router();

// Create a new request
router.post('/requests', RequestController.createRequest);

// Fetch requests by email
router.get('/requests', RequestController.getRequestsByEmail);

// Delete a request by ID
router.delete('/requests/:id', RequestController.deleteRequestById); // Add this line

module.exports = router;