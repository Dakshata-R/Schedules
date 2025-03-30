const db = require('../config/request_db');

class RequestModel {
  // Create a new request
  static createRequest(data, callback) {
    const query = `
      INSERT INTO requests (name, department, priority, skills, email)
      VALUES (?, ?, ?, ?, ?)
    `;
    db.query(
      query,
      [data.name, data.department, data.priority, JSON.stringify(data.skills), data.email],
      callback
    );
  }

  // Fetch requests by email
  static getRequestsByEmail(email, callback) {
    const query = `
      SELECT * FROM requests WHERE email = ?
    `;
    db.query(query, [email], callback);
  }

  // Delete a request by ID
  static deleteRequestById(id, callback) {
    const query = `
      DELETE FROM requests WHERE id = ?
    `;
    db.query(query, [id], callback);
  }
}

module.exports = RequestModel;