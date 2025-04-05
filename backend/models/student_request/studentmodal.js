// backend/models/studentmodal.js
const pool = require('../../config/db');


const Student = {
  findByEmail: async (email) => {
    try {
      const query = `
        SELECT first_name, roll_number AS rollNumber, department 
        FROM students 
        WHERE email = ?
      `;
      const [rows] = await pool.query(query, [email]);
      return rows[0]; // Returns first matching student or undefined
    } catch (error) {
      throw error;
    }
  }
};

module.exports = Student;