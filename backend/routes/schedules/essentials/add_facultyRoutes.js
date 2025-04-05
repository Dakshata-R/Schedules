const express = require('express');
const router = express.Router();
const facultyController = require('../../../controllers/schedules/essentials/add_facultyController');

router.get('/', facultyController.getAllFaculties);

module.exports = router;