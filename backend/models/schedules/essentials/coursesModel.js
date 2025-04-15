const db = require('../../../config/db');

const getCoursesByYearAndDept = async (year, department) => {
  try {
    const [rows] = await db.query(`
      SELECT * FROM courses 
      WHERE year = ? AND department = ?
      ORDER BY course_code
    `, [year, department]);
    return rows;
  } catch (error) {
    console.error('Error fetching courses:', error);
    throw error;
  }
};

module.exports = {
  getCoursesByYearAndDept
};