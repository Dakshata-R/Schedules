const express = require('express');
const router = express.Router();
const communicationController = require('../controllers/communicationController');

router.post('/communication', communicationController.createCommunicationDetails);
router.get('/communication', communicationController.getCommunicationDetails);

module.exports = router;
