// backend/controllers/schedules/essentials/student_categoryController.js
const StudentCategory = require('../../../models/schedules/essentials/student_categoryModel');

exports.getStudentYears = async (req, res) => {
  try {
    const years = await StudentCategory.getStudentYears();
    res.status(200).json(years);
  } catch (error) {
    console.error('Error fetching student years:', error);
    res.status(500).json({ message: 'Error fetching student years' });
  }
};