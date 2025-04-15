const express = require('express');
const router = express.Router();
const yearDeptController = require('../../../controllers/schedules/essentials/year_deptController');

router.get('/students/years-departments', yearDeptController.getYearsAndDepartments);

module.exports = router;