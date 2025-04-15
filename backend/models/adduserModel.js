// backend/models/adduserModel.js
const pool = require('../config/db');

const getAllFaculty = async () => {
  try {
    const [rows] = await pool.query('SELECT id, first_name, faculty_level, department FROM faculty');
    return rows;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getAllFaculty
};