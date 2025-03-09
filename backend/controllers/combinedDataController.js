// controllers/combinedDataController.js
const CombinedDataModel = require('../models/combinedData');

exports.getCombinedData = (req, res) => {
  CombinedDataModel.fetchCombinedData((err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Error fetching combined data' });
    }
    res.status(200).json(data);
  });
};