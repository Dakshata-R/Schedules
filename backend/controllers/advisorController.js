const AdvisorModel = require('../models/advisorModel');

const createAdvisor = (req, res) => {
    const formData = {
        advisor_name: req.body.advisor_name,
        country_code: req.body.country_code,
        contact_number: req.body.contact_number,
        email: req.body.email,
        accommodation_type: req.body.accommodation_type,
        hostel_name: req.body.hostel_name,
        floor: req.body.floor,
        room_type: req.body.room_type,
        room_number: req.body.room_number,
        college_transport: req.body.college_transport,
        route: req.body.route,
        stage: req.body.stage,
        stopping: req.body.stopping,
        bus_number: req.body.bus_number
    };

    AdvisorModel.create(formData, (err, result) => {
        if (err) {
            console.error("Error inserting data:", err);
            return res.status(500).json({ message: "Database error", error: err });
        }
        res.status(201).json({ message: "Advisor details saved successfully!" });
    });
};

const getAdvisors = (req, res) => {
    AdvisorModel.getAll((err, results) => {
        if (err) {
            console.error("Error fetching data:", err);
            return res.status(500).json({ message: "Database error" });
        }
        res.status(200).json(results);
    });
};

module.exports = {
    createAdvisor,
    getAdvisors
};
