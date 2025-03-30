const StudentRequestsModel = require('../models/StudentRequestsModel');
const data_db = require('../config/data_db'); // Ensure correct import

const StudentRequestsController = {
  // Fetch all student requests
  getStudentRequests: async (req, res) => {
    try {
      const requests = await StudentRequestsModel.getStudentRequests();
      res.status(200).json(requests);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching student requests', error });
    }
  },

  // Fetch mobile_number and register_id for a student by email
  getStudentDetails: async (req, res) => {
    const { email } = req.params;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    try {
      const query = `
        SELECT mobile_number, register_id FROM user_data WHERE email = ?
      `;
      data_db.query(query, [email], (err, results) => {
        if (err) {
          return res.status(500).json({ message: 'Error fetching student details', error: err });
        }
        if (results.length === 0) {
          return res.status(404).json({ message: 'Student not found' });
        }
        res.status(200).json({
          mobile_number: results[0].mobile_number,
          register_id: results[0].register_id,
        });
      });
    } catch (error) {
      res.status(500).json({ message: 'Error fetching student details', error });
    }
  },
};

module.exports = StudentRequestsController; // Ensure correct export