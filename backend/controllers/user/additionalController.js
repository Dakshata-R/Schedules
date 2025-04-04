const AdditionalModel = require('../../models/user/additionalModel');
const path = require('path');
const fs = require('fs');

const uploadDirectory = path.join(__dirname, '../../uploads_additional');

// Ensure directory exists
if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory, { recursive: true });
}

const uploadAdditionalDetails = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const { additional_info } = req.body;
    const filePath = `/uploads_additional/${req.file.filename}`;

    const additionalData = {
      additional_info,
      file_name: req.file.filename,
      file_path: filePath
    };

    const result = await AdditionalModel.create(additionalData);
    res.status(201).json({ 
      message: "Additional details saved successfully!",
      fileUrl: `http://localhost:${process.env.PORT || 8000}${filePath}`
    });
  } catch (err) {
    console.error("Error in uploadAdditionalDetails:", err);
    res.status(500).json({ message: "Failed to save additional details" });
  }
};

const getAdditionalDetails = async (req, res) => {
  try {
    const results = await AdditionalModel.getAll();
    const enrichedResults = results.map(item => ({
      ...item,
      file_url: item.file_path ? `http://localhost:${process.env.PORT || 8000}${item.file_path}` : null
    }));
    res.status(200).json(enrichedResults);
  } catch (err) {
    console.error("Error in getAdditionalDetails:", err);
    res.status(500).json({ message: "Failed to fetch additional details" });
  }
};

module.exports = {
  uploadAdditionalDetails,
  getAdditionalDetails
};