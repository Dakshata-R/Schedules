const db = require('../config/venue_db');

const getVenues = (callback) => {
  db.query('SELECT * FROM venues', (err, results) => {
    if (err) {
      return callback(err, null);
    }
    callback(null, results);
  });
};

module.exports = { getVenues };
