const pool = require('../../../config/db');

const venueModel = {
  getAllVenues: async () => {
    try {
      const [rows] = await pool.query('SELECT * FROM venues');
      return rows;
    } catch (error) {
      console.error('Error in venueModel.getAllVenues:', error);
      throw error;
    }
  }
};

module.exports = venueModel;