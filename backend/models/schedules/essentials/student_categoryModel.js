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

  static async getStudentCountByYear(year) {
    try {
      let query;
      let params = [];
      
      if (year === 'All students') {
        query = 'SELECT COUNT(*) as count FROM students';
      } else {
        const yearNum = parseInt(year);
        if (isNaN(yearNum)) {
          throw new Error('Invalid year parameter');
        }
        query = 'SELECT COUNT(*) as count FROM students WHERE year = ?';
        params = [yearNum];
      }
      
      const [rows] = await pool.query(query, params);
      return rows[0].count;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = StudentCategory;