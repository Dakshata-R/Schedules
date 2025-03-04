const express = require('express');
const router = express.Router();
const communicationController = require('../controllers/communicationController');

// Route to handle communication details creation
router.post('/communication', communicationController.createCommunicationDetails);

// Route to fetch communication details
router.get('/communication', communicationController.getCommunicationDetails);

module.exports = router;