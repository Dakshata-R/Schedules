const express = require('express');
const router = express.Router();
const slotScheduleController = require('../../../controllers/schedules/template/slot_scheduleController');
const { check } = require('express-validator');
const { protect, authorize } = require('../../../middleware/authMiddleware');


router.post(
  '/',
  [
    protect,
    authorize('faculty', 'admin'),
    check('template_name').notEmpty().withMessage('Template name is required'),
    check('priority').isIn(['High', 'Medium', 'Low']).withMessage('Invalid priority'),
    check('slot_duration').isInt({ min: 1 }).withMessage('Duration must be a positive number'),
    check('duration_unit').isIn(['Minutes', 'Hours']).withMessage('Invalid duration unit'),
    check('number_of_slots').isInt({ min: 1 }).withMessage('Number of slots must be a positive integer'),
    check('start_datetime').isISO8601().withMessage('Invalid start date'),
    check('end_datetime').isISO8601().withMessage('Invalid end date'),
    check('open_to').notEmpty().withMessage('Open to field is required'),
    check('venues').isArray({ min: 1 }).withMessage('At least one venue is required'),
    check('faculties').isArray({ min: 1 }).withMessage('At least one faculty is required')
  ],
  slotScheduleController.createSlotSchedule
);
// Add this new route
router.get('/for-student/:email', slotScheduleController.getSlotsForStudent);
// GET endpoint (new)
router.get('/', slotScheduleController.getAllSlotSchedules);
// Add this to your slot_scheduleRoutes.js
router.get(
  '/created-by',
  protect,
  authorize('faculty', 'admin'),
  slotScheduleController.getSchedulesCreatedBy
);
// Add this route

router.get(
  '/:scheduleId/responses',
  protect,
  authorize('faculty', 'admin'),
  slotScheduleController.getScheduleResponses
);
router.get('/for-faculty/:email', slotScheduleController.getSchedulesForFaculty);

// Add this route
router.get('/by-faculty-email/:email', slotScheduleController.getSchedulesByFacultyEmail);
module.exports = router;