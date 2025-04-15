// backend/routes/adduserRoutes.js
const express = require('express');
const router = express.Router();
const adduserController = require('../controllers/adduserController');

router.get('/api/faculty', adduserController.getAllFaculty);

module.exports = router;