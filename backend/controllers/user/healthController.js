const HealthModel = require('../../models/user/healthModel');
const path = require('path');
const fs = require('fs');

const uploadDirectory = path.join(__dirname, '../../uploads_health');

// Ensure directory exists
if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory, { recursive: true });
}

const uploadHealthDetails = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const { disability, health_issues } = req.body;
    const filePath = `/uploads_health/${req.file.filename}`;

    const healthData = {
      disability,
      health_issues,
      file_name: req.file.filename,
      file_path: filePath
    };

    const result = await HealthModel.create(healthData);
    res.status(201).json({ 
      message: "Health details saved successfully!",
      fileUrl: `http://localhost:${process.env.PORT || 8000}${filePath}`
    });
  } catch (err) {
    console.error("Error in uploadHealthDetails:", err);
    res.status(500).json({ message: "Failed to save health details" });
  }
};

const getHealthDetails = async (req, res) => {
  try {
    const results = await HealthModel.getAll();
    const enrichedResults = results.map(item => ({
      ...item,
      file_url: item.file_path ? `http://localhost:${process.env.PORT || 8000}${item.file_path}` : null
    }));
    res.status(200).json(enrichedResults);
  } catch (err) {
    console.error("Error in getHealthDetails:", err);
    res.status(500).json({ message: "Failed to fetch health details" });
  }
};

module.exports = {
  uploadHealthDetails,
  getHealthDetails
};