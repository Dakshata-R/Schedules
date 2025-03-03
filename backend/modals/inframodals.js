const mysql = require('mysql2');
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'sandhiya',
  database: 'infra_management',
});

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