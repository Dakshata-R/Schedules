// backend/routes/schedules/essentials/student_categoryRoutes.js
const express = require('express');
const router = express.Router();
const studentCategoryController = require('../../../controllers/schedules/essentials/student_categoryController');
// Add at the top of student_categoryRoutes.js
console.log('Student category routes loaded');
router.get('/student-years', studentCategoryController.getStudentYears);


module.exports = router;