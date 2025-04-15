const yearDeptModel = require('../../../models/schedules/essentials/year_deptModel');

const getYearsAndDepartments = async (req, res) => {
  try {
    const data = await yearDeptModel.getYearsAndDepartments();
    res.json(data);
  } catch (error) {
    console.error('Error in getYearsAndDepartments:', error);
    res.status(500).json({ error: 'Failed to fetch years and departments' });
  }
};

module.exports = {
  getYearsAndDepartments
};