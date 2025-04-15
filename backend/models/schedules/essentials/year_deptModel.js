const db = require('../../../config/db');

const getYearsAndDepartments = async () => {
  try {
    const [rows] = await db.query(`
      SELECT DISTINCT year, department 
      FROM students
      ORDER BY year, department
    `);
    return rows;
  } catch (error) {
    console.error('Error fetching years and departments:', error);
    throw error;
  }
};

module.exports = {
  getYearsAndDepartments
};