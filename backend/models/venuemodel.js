const pool = require('../config/db');

class Venue {
  static async create(venueData) {
    const { venue_name, capacity, type } = venueData;
    
    const [result] = await pool.execute(
      `INSERT INTO venues (venue_name, capacity, type) 
       VALUES (?, ?, ?)`,
      [venue_name, capacity, type]
    );
    
    return result.insertId;
  }
}

module.exports = Venue;