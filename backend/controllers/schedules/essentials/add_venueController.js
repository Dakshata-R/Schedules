const venueModel = require('../../../models/schedules/essentials/add_venueModel');
const pool = require('../../../config/db'); // Add this line to import pool

const venueController = {
  getAllVenues: async (req, res) => {
    try {
      const venues = await venueModel.getAllVenues();
      res.json(venues);
    } catch (error) {
      console.error('Error in venueController.getAllVenues:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  checkVenueAvailability: async (req, res) => {
    try {
      const { venueId, startDateTime, endDateTime } = req.query;
      
      if (!venueId || !startDateTime || !endDateTime) {
        return res.status(400).json({ error: 'Missing required parameters' });
      }
  
      // Validate dates
      const startDate = new Date(startDateTime);
      const endDate = new Date(endDateTime);
      
      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        return res.status(400).json({ error: 'Invalid date parameters' });
      }
  
      console.log(`\n[Controller] Checking availability for venue ${venueId}`);
      console.log(`Time range: ${startDate} to ${endDate}`);
      
      const availability = await venueModel.checkAvailability(
        venueId, 
        startDate.toISOString(), 
        endDate.toISOString()
      );
      
      res.json(availability);
    } catch (error) {
      console.error('Error checking venue availability:', error);
      res.status(500).json({ 
        error: 'Internal server error',
        details: error.message 
      });
    }
    console.log('Venue IDs in database:');
const [allSchedules] = await pool.query('SELECT id, venues FROM slot_schedules');
allSchedules.forEach(s => {
  console.log(`Schedule ${s.id}:`, s.venues);
});
  }
};

module.exports = venueController;