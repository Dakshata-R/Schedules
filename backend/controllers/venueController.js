const Venue = require('../models/venueModals');

const fetchVenues = (req, res) => {
  Venue.getVenues((err, venues) => {
    if (err) {
      res.status(500).json({ error: 'Failed to fetch venues' });
    } else {
      res.json(venues);
    }
  });
};

module.exports = { fetchVenues };
