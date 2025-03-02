const HealthModel = require('../models/healthModel');
const path = require('path');
const fs = require('fs');

const uploadDirectory = path.join(__dirname, '../uploads_health');

// Ensure the uploads_health directory exists
if (!fs.existsSync(uploadDirectory)) {
    fs.mkdirSync(uploadDirectory, { recursive: true });
}

// Controller to handle file upload and data insertion
const uploadHealthDetails = (req, res) => {
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

    HealthModel.create(healthData, (err, result) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ message: "Failed to save health details" });
        }
        res.status(201).json({ message: "Health details saved successfully!" });
    });
};

// Controller to fetch all health records
const getHealthDetails = (req, res) => {
    HealthModel.getAll((err, results) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ message: "Failed to fetch health details" });
        }
        res.status(200).json(results);
    });
};

module.exports = {
    uploadHealthDetails,
    getHealthDetails
};
