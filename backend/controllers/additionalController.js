const AdditionalModel = require('../models/additionalModel');
const path = require('path');
const fs = require('fs');

const uploadDirectory = path.join(__dirname, '../uploads_additional');

// Ensure the uploads_additional directory exists
if (!fs.existsSync(uploadDirectory)) {
    fs.mkdirSync(uploadDirectory, { recursive: true });
}

// Controller to handle file upload and data insertion
const uploadAdditionalDetails = (req, res) => {
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

    AdditionalModel.create(additionalData, (err, result) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ message: "Failed to save additional details" });
        }
        res.status(201).json({ message: "Additional details saved successfully!" });
    });
};

// Controller to fetch all additional records
const getAdditionalDetails = (req, res) => {
    AdditionalModel.getAll((err, results) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ message: "Failed to fetch additional details" });
        }
        res.status(200).json(results);
    });
};

module.exports = {
    uploadAdditionalDetails,
    getAdditionalDetails
};