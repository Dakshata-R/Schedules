// models/Faculty.js
const pool = require('../../config/db');

class Faculty {
  static async findByEmail(email) {
    const [rows] = await pool.query('SELECT * FROM faculty WHERE email = ?', [email]);
    return rows[0];
  }

  static async createUserFromFaculty(facultyId, userId) {
    await pool.query('UPDATE faculty SET user_id = ? WHERE id = ?', [userId, facultyId]);
  }

  static async hasStudentRequestRole(email) {
    const query = `
      SELECT 1 FROM faculty f
      JOIN members m ON LOWER(f.first_name) = LOWER(m.member_name)
      JOIN create_roles cr ON m.role_id = cr.id
      WHERE f.email = ? AND cr.role_name = 'Student skill request'
      LIMIT 1
    `;
    const [rows] = await pool.query(query, [email]);
    return rows.length > 0;
  }
}

module.exports = Faculty;