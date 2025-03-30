const express = require('express');
const router = express.Router();
const FacultyController = require('../controllers/FacultyController');

// Define the /faculty endpoint
router.get('/', FacultyController.getFacultyByEmail);

module.exports = router;