// backend/controllers/adduserController.js
const adduserModel = require('../models/adduserModel');

const getAllFaculty = async (req, res) => {
  try {
    const faculty = await adduserModel.getAllFaculty();
    res.json(faculty);
  } catch (error) {
    console.error('Error fetching faculty:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  getAllFaculty
};