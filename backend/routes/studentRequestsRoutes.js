const express = require('express');
const router = express.Router();
const StudentRequestsController = require('../controllers/StudentRequestsController'); // Ensure correct import

// Define the /student-requests endpoint
router.get('/', StudentRequestsController.getStudentRequests);

// New endpoint to fetch mobile_number and register_id for a student by email
router.get('/:email/details', StudentRequestsController.getStudentDetails);

module.exports = router;