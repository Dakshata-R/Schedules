const mysql = require('mysql2');
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'sandhiya',
  database: 'infra_management',
});

// Existing functions for saving data
exports.saveBasic = (uniqueId, venueName, location, priority, primaryPurpose, responsiblePersons, imagePath, callback) => {
  const query = `
    INSERT INTO basic (uniqueId, venueName, location, priority, primaryPurpose, responsiblePersons, imagePath)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;
  db.query(query, [uniqueId, venueName, location, priority, primaryPurpose, JSON.stringify(responsiblePersons), imagePath], callback);
};

exports.saveVenueType = (capacity, floor, maintenanceFrequency, usageFrequency, accessibilityOptions, ventilationType, callback) => {
  const query = `
    INSERT INTO venue_type (capacity, floor, maintenanceFrequency, usageFrequency, accessibilityOptions, ventilationType)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  db.query(query, [capacity, floor, JSON.stringify(maintenanceFrequency), JSON.stringify(usageFrequency), JSON.stringify(accessibilityOptions), ventilationType], callback);
};

exports.saveFacility = (roles, facilities, selectedFacilities, callback) => {
  const query = `
    INSERT INTO facility (roles, facilities, selectedFacilities)
    VALUES (?, ?, ?)
  `;
  db.query(query, [JSON.stringify(roles), JSON.stringify(facilities), JSON.stringify(selectedFacilities)], callback);
};

// New function to fetch combined data
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
    LEFT JOIN venue_type v ON b.id = v.id
    LEFT JOIN facility f ON b.id = f.id
  `;
  db.query(query, callback);
};

// New function to delete a row by uniqueId
exports.deleteRow = (uniqueId, callback) => {
  const query = 'DELETE FROM basic WHERE uniqueId = ?';
  db.query(query, [uniqueId], callback);
};