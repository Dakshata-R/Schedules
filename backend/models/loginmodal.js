const db = require("../config/login_db");

class User {
  // Create a new user
  static async create(email, password, role) {
    const query = "INSERT INTO users (email, password, role) VALUES (?, ?, ?)";
    const [result] = await db.promise().query(query, [email, password, role]);
    return result;
  }

  // Find a user by email
  static async findByEmail(email) {
    const query = "SELECT * FROM users WHERE email = ?";
    const [rows] = await db.promise().query(query, [email]);
    return rows[0];
  }
}

module.exports = User;