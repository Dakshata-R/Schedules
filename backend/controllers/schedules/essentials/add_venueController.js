const venueModel = require('../../../models/schedules/essentials/add_venueModel');

const venueController = {
  getAllVenues: async (req, res) => {
    try {
      const venues = await venueModel.getAllVenues();
      res.json(venues);
    } catch (error) {
      console.error('Error in venueController.getAllVenues:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};

module.exports = venueController;