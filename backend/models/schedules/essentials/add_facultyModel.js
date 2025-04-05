const pool = require('../../../config/db');

const facultyModel = {
  getAllFaculties: async () => {
    try {
      const [rows] = await pool.query(`
        SELECT 
          id,
          faculty_id,
          first_name AS name,
          faculty_level,
          department,
          specialization
        FROM faculty
      `);
      return rows;
    } catch (error) {
      console.error('Error in facultyModel.getAllFaculties:', error);
      throw error;
    }
  }
};

module.exports = facultyModel;