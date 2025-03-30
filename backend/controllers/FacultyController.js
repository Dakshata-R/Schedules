const FacultyModel = require('../models/FacultyModel');

const FacultyController = {
  // Fetch faculty details by email
  getFacultyByEmail: async (req, res) => {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    try {
      const facultyData = await FacultyModel.getFacultyByEmail(email);
      if (!facultyData) {
        return res.status(404).json({ message: 'Faculty not found' });
      }
      res.status(200).json(facultyData);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching faculty data', error });
    }
  },
};

module.exports = FacultyController;