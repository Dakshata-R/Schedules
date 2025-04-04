const pool = require('../../config/db');

class Faculty {
  static async findByEmail(email) {
    const [rows] = await pool.query('SELECT * FROM faculty WHERE email = ?', [email]);
    return rows[0];
  }

  static async createUserFromFaculty(facultyId, userId) {
    await pool.query('UPDATE faculty SET user_id = ? WHERE id = ?', [userId, facultyId]);
  }
}

module.exports = Faculty;