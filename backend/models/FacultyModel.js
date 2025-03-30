const data_db = require('../config/data_db');

class FacultyModel {
  // Fetch faculty details by email
  static async getFacultyByEmail(email) {
    const query = `
      SELECT * FROM user_data WHERE email = ? AND role = 'faculty'
    `;
    return new Promise((resolve, reject) => {
      data_db.query(query, [email], (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results[0]);
        }
      });
    });
  }
}

module.exports = FacultyModel;