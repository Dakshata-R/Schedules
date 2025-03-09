// inframodals.js
const db = require('../config/infra_db'); // Import the db connection

// Export the db object and other functions
module.exports = {
  db, // Export the db object
  saveBasic: (uniqueId, venueName, location, priority, primaryPurpose, responsiblePersons, imagePath, callback) => {
    const query = `
      INSERT INTO basic (uniqueId, venueName, location, priority, primaryPurpose, responsiblePersons, imagePath)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    db.query(query, [uniqueId, venueName, location, priority, primaryPurpose, JSON.stringify(responsiblePersons), imagePath], callback);
  },
  saveVenueType: (capacity, floor, maintenanceFrequency, usageFrequency, accessibilityOptions, ventilationType, callback) => {
    const query = `
      INSERT INTO venue_type (capacity, floor, maintenanceFrequency, usageFrequency, accessibilityOptions, ventilationType)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    db.query(query, [capacity, floor, JSON.stringify(maintenanceFrequency), JSON.stringify(usageFrequency), JSON.stringify(accessibilityOptions), ventilationType], callback);
  },
  saveFacility: (id, roles, facilities, selectedFacilities, callback) => {
    const query = `
      INSERT INTO facility (id, roles, facilities, selectedFacilities)
      VALUES (?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
      roles = JSON_MERGE_PRESERVE(COALESCE(roles, JSON_ARRAY()), ?),
      facilities = JSON_MERGE_PRESERVE(COALESCE(facilities, JSON_ARRAY()), ?),
      selectedFacilities = JSON_MERGE_PRESERVE(COALESCE(selectedFacilities, JSON_ARRAY()), ?)
    `;
    db.query(query, [
      id,
      JSON.stringify(roles),
      JSON.stringify(facilities),
      JSON.stringify(selectedFacilities),
      JSON.stringify(roles),
      JSON.stringify(facilities),
      JSON.stringify(selectedFacilities)
    ], callback);
  },
  fetchCombinedData: (callback) => {
    const query = `
      SELECT 
        b.id,
        b.uniqueId,
        b.venueName,
        b.location,
        b.priority,
        b.primaryPurpose,
        b.responsiblePersons,
        f.roles AS accessToRoles
      FROM basic b
      LEFT JOIN facility f ON b.id = f.id
    `;
    db.query(query, (err, results) => {
      if (err) {
        console.error('Error executing query:', err);
        return callback(err, null);
      }
      console.log('Query Results:', results); // Debugging
      callback(null, results);
    });
  },
  deleteRow: (uniqueId, callback) => {
    const query = 'DELETE FROM basic WHERE uniqueId = ?';
    db.query(query, [uniqueId], callback);
  }
};