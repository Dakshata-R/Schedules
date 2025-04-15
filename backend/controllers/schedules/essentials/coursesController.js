const coursesModel = require('../../../models/schedules/essentials/coursesModel');

const getCourses = async (req, res) => {
  try {
    const { year, department } = req.query;
    if (!year || !department) {
      return res.status(400).json({ error: 'Year and department are required' });
    }
    const courses = await coursesModel.getCoursesByYearAndDept(year, department);
    res.json(courses);
  } catch (error) {
    console.error('Error in getCourses:', error);
    res.status(500).json({ error: 'Failed to fetch courses' });
  }
};

module.exports = {
  getCourses
};