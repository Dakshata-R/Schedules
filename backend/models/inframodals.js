const db = require('../config/db');
exports.saveBasic = (uniqueId, venueName, location, priority, primaryPurpose, responsiblePersons, imagePath, callback) => {
  const query = `
    INSERT INTO basic (uniqueId, venueName, location, priority, primaryPurpose, responsiblePersons, imagePath)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;
  db.query(query, [uniqueId, venueName, location, priority, primaryPurpose, JSON.stringify(responsiblePersons), imagePath], (err, result) => {
    if (err) return callback(err);
    callback(null, result.insertId); // Return the auto-incremented ID
  });
};

exports.saveVenueType = (basicId, capacity, floor, maintenanceFrequency, usageFrequency, accessibilityOptions, ventilationType, callback) => {
  const query = `
    INSERT INTO venue_type (basic_id, capacity, floor, maintenanceFrequency, usageFrequency, accessibilityOptions, ventilationType)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;
  db.query(query, [basicId, capacity, floor, maintenanceFrequency, usageFrequency, JSON.stringify(accessibilityOptions), ventilationType], callback);
};

exports.saveFacility = (basicId, roles, facilities, selectedFacilities, callback) => {
  const query = `
    INSERT INTO facility (basic_id, roles, facilities, selectedFacilities)
    VALUES (?, ?, ?, ?)
  `;
  db.query(query, [basicId, JSON.stringify(roles), JSON.stringify(facilities), JSON.stringify(selectedFacilities)], callback);
};

exports.fetchCombinedData = (callback) => {
  const query = `
    SELECT 
      b.id AS basicId,
      b.uniqueId,
      b.venueName,
      b.location,
      b.priority,
      b.primaryPurpose,
      b.responsiblePersons,
      b.imagePath,
      v.id AS venueTypeId,
      v.capacity,
      v.floor,
      v.maintenanceFrequency,
      v.usageFrequency,
      v.accessibilityOptions,
      v.ventilationType,
      f.id AS facilityId,
      f.roles AS accessToRoles,
      f.facilities,
      f.selectedFacilities
    FROM basic b
    LEFT JOIN venue_type v ON b.id = v.basic_id
    LEFT JOIN facility f ON b.id = f.basic_id
  `;
  db.query(query, callback);
};