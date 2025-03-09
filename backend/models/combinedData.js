// models/combinedData.js
const db = require('../config/user_db');

const CombinedDataModel = {
    fetchCombinedData: (callback) => {
      const query = `
        SELECT 
          p.studentId AS userId,
          p.name AS username,
          p.dob,
          p.bloodGroup,
          c.mobile1 AS contactNumber1,
          a.advisor_name AS classAdvisor
        FROM personal p
        LEFT JOIN communication_details c ON p.id = c.id
        LEFT JOIN class_advisors a ON p.id = a.id
      `;

    db.query(query, (err, results) => {
      if (err) {
        console.error("Error fetching combined data:", err);
        return callback(err, null);
      }
      callback(null, results);
    });
  },
};

module.exports = CombinedDataModel;