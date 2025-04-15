// backend/routes/schedules/essentials/student_categoryRoutes.js
const express = require('express');
const router = express.Router();
const studentCategoryController = require('../../../controllers/schedules/essentials/student_categoryController');

router.get('/student-years', studentCategoryController.getStudentYears);
router.get('/students-by-year/:year', studentCategoryController.getStudentsByYear);

module.exports = router;