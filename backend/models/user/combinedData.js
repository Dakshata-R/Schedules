const db = require('../../config/db');

const CombinedDataModel = {
  fetchCombinedData: async () => {
    try {
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
      
      const [results] = await db.query(query);
      return results;
    } catch (err) {
      console.error("Error fetching combined data:", err);
      throw err; // Let the controller handle the error
    }
  }
};

module.exports = CombinedDataModel;