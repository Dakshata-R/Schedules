const CombinedDataModel = require('../../models/user/combinedData');

exports.getCombinedData = async (req, res) => {
  try {
    const data = await CombinedDataModel.fetchCombinedData();
    res.status(200).json(data);
  } catch (err) {
    console.error('Error in getCombinedData:', err);
    res.status(500).json({ error: 'Error fetching combined data' });
  }
};