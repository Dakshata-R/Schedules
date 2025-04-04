 const sampleData = require('../../config/db')
 const bcrypt = require('bcryptjs');

class User {
  static async create({ username, email, password, role_id }) {
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const [result] = await sampleData.query(
        'INSERT INTO users (username, email, password, role_id) VALUES (?, ?, ?, ?)',
        [username, email, hashedPassword, role_id]
      );
      return result.insertId;
    } catch (error) {
      throw new Error(`Error creating user: ${error.message}`);
    }
  }

  static async findByEmail(email) {
    try {
      const [rows] = await sampleData.query(
        'SELECT * FROM users WHERE email = ?', 
        [email]
      );
      return rows[0] || null; // Return null if no user found
    } catch (error) {
      throw new Error(`Error finding user by email: ${error.message}`);
    }
  }

  static async comparePassword(candidatePassword, hashedPassword) {
    try {
      return await bcrypt.compare(candidatePassword, hashedPassword);
    } catch (error) {
      throw new Error(`Error comparing passwords: ${error.message}`);
    }
  }

  static async findUserWithRole(email) {
    try {
      const [rows] = await sampleData.query(`
        SELECT u.*, r.name as role_name 
        FROM users u 
        JOIN roles r ON u.role_id = r.id 
        WHERE u.email = ?
      `, [email]);
      return rows[0] || null;
    } catch (error) {
      throw new Error(`Error finding user with role: ${error.message}`);
    }
  }

  static async updatePassword(email, newPassword) {
    try {
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await sampleData.query(
        'UPDATE users SET password = ? WHERE email = ?',
        [hashedPassword, email]
      );
    } catch (error) {
      throw new Error(`Error updating password: ${error.message}`);
    }
  }
}

module.exports = User;