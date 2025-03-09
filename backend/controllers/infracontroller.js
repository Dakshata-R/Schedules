const infraModel = require('../models/inframodals');

// Existing controller functions
exports.saveBasic = (req, res) => {
  const { uniqueId, venueName, location, priority, primaryPurpose, responsiblePersons } = req.body;
  const imagePath = req.file ? req.file.path : '';

  infraModel.saveBasic(uniqueId, venueName, location, priority, primaryPurpose, responsiblePersons, imagePath, (err, result) => {
    if (err) {
      console.error('Error saving basic data:', err);
      res.status(500).send('Error saving basic data');
      return;
    }
    res.status(200).send('Basic data saved successfully');
  });
};

exports.saveVenueType = (req, res) => {
  const { capacity, floor, maintenanceFrequency, usageFrequency, accessibilityOptions, ventilationType } = req.body;

  infraModel.saveVenueType(capacity, floor, maintenanceFrequency, usageFrequency, accessibilityOptions, ventilationType, (err, result) => {
    if (err) {
      console.error('Error saving venue type data:', err);
      res.status(500).send('Error saving venue type data');
      return;
    }
    res.status(200).send('Venue type data saved successfully');
  });
};

exports.saveFacility = (req, res) => {
  const { id, roles, facilities, selectedFacilities } = req.body;

  // Ensure that roles, facilities, and selectedFacilities are arrays
  if (!Array.isArray(roles) || !Array.isArray(facilities) || !Array.isArray(selectedFacilities)) {
    return res.status(400).send('Invalid data format: roles, facilities, and selectedFacilities must be arrays');
  }

  infraModel.saveFacility(id, roles, facilities, selectedFacilities, (err, result) => {
    if (err) {
      console.error('Error saving facility data:', err);
      res.status(500).send('Error saving facility data');
      return;
    }
    res.status(200).send('Facility data saved successfully');
  });
};
exports.fetchCombinedData = (req, res) => {
  infraModel.fetchCombinedData((err, results) => {
    if (err) {
      console.error('Error fetching combined data:', err);
      res.status(500).send('Error fetching combined data');
      return;
    }
    console.log('Fetched Data:', results); // Debugging
    res.status(200).json(results);
  });
};

// New controller function to delete a row by uniqueId
exports.deleteRow = (req, res) => {
  const { uniqueId } = req.params;

  infraModel.deleteRow(uniqueId, (err, result) => {
    if (err) {
      console.error('Error deleting row:', err);
      res.status(500).send('Failed to delete row');
      return;
    }
    res.status(200).send('Row deleted successfully');
  });
};
