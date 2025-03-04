const CommunicationModel = require('../models/communicationModel');

const createCommunicationDetails = (req, res) => {
    console.log("Received Communication Data:", req.body);

    const formData = {
        mobile1: req.body.mobile1,
        mobile2: req.body.mobile2,
        personal_email: req.body.personalEmail,
        official_email: req.body.officialEmail,
        location: req.body.location,
        current_address: req.body.currentAddress,
        permanent_address: req.body.permanentAddress
    };

    CommunicationModel.create(formData, (err, result) => {
        if (err) {
            console.error("Error inserting communication data:", err);
            return res.status(500).json({ message: "Database error" });
        }
        res.status(201).json({ message: "Communication details saved successfully!" });
    });
};

const getCommunicationDetails = (req, res) => {
    CommunicationModel.getAll((err, results) => {
        if (err) {
            console.error("Error fetching communication data:", err);
            return res.status(500).json({ message: "Database error" });
        }
        res.status(200).json(results);
    });
};

module.exports = {
    createCommunicationDetails,
    getCommunicationDetails
};