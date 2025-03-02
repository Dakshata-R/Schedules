const express = require('express');
const router = express.Router();
const advisorController = require('../controllers/advisorController');

router.post('/advisors', advisorController.createAdvisor);
router.get('/advisors', advisorController.getAdvisors);

module.exports = router;
