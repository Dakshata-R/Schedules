const request_db = require('../config/request_db');

class StudentRequestsModel {
  // Fetch all student requests
  static async getStudentRequests() {
    const query = `
      SELECT * FROM requests
    `;
    return new Promise((resolve, reject) => {
      request_db.query(query, (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      });
    });
  }
}

module.exports = StudentRequestsModel;