const express = require('express');
const router = express.Router();
const coursesController = require('../../../controllers/schedules/essentials/coursesController');

router.get('/', coursesController.getCourses);

module.exports = router;