const facultyModel = require('../../../models/schedules/essentials/add_facultyModel');

const facultyController = {
  getAllFaculties: async (req, res) => {
    try {
      const faculties = await facultyModel.getAllFaculties();
      res.json(faculties);
    } catch (error) {
      console.error('Error in facultyController.getAllFaculties:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};

module.exports = facultyController;