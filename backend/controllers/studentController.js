// backend/controllers/studentController.js
const Student = require('../models/studentmodal');

const studentController = {
  getStudentByEmail: async (req, res) => {
    try {
      const { email } = req.query;
      
      if (!email) {
        return res.status(400).json({ error: 'Email is required' });
      }

      const student = await Student.findByEmail(email);

      if (!student) {
        return res.status(404).json({ error: 'Student not found' });
      }

      res.json(student);
    } catch (error) {
      console.error('Error fetching student:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};

module.exports = studentController;