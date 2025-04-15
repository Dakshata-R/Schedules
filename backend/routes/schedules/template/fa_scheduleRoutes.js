const express = require('express');
const router = express.Router();

const faScheduleController = require('../../../controllers/schedules/template/fa_scheduleController');
router.get('/by-faculty-email/:email', faScheduleController.getSchedulesByFacultyEmail);

router.post('/', faScheduleController.createFASchedule);
router.get('/created-by', faScheduleController.getFASchedulesByEmail);
router.get('/for-student/:email', faScheduleController.getFASchedulesForStudent);

module.exports = router;