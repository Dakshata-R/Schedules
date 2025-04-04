const pool = require('../../config/db');

class Student {
  static async findByEmail(email) {
    const [rows] = await pool.query('SELECT * FROM students WHERE email = ?', [email]);
    return rows[0];
  }

  static async createUserFromStudent(studentId, userId) {
    await pool.query('UPDATE students SET user_id = ? WHERE id = ?', [userId, studentId]);
  }
}


module.exports = Student;