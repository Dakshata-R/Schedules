// backend/models/schedules/essentials/student_categoryModel.js
const pool = require('../../../config/db');

class StudentCategory {
  static async getStudentYears() {
    try {
      const [rows] = await pool.query('SELECT DISTINCT year FROM students ORDER BY year');
      return rows.map(row => row.year);
    } catch (error) {
      throw error;
    }
  }
}

module.exports = StudentCategory;