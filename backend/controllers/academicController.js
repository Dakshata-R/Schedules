const AcademicModel = require('../models/academicModel');

const createAcademicDetails = (req, res) => {
    console.log("Received Files:", req.file);
    console.log("Received Form Data:", req.body);

    let uploadedFilePath = req.file ? `/uploads_academic/${req.file.filename}` : null;

    const formData = {
        school: req.body.school,
        tenth_marks: req.body.tenth_marks,
        tenth_percent: req.body.tenth_percent,
        twelfth_marks: req.body.twelfth_marks,
        twelfth_percent: req.body.twelfth_percent,
        school_medium: req.body.school_medium,
        department: req.body.department,
        semester_grade: req.body.semester_grade,
        uploaded_file: uploadedFilePath
    };

    AcademicModel.create(formData, (err, result) => {
        if (err) {
            console.error("Error inserting data:", err);
            return res.status(500).json({ message: "Database error" });
        }
        res.status(201).json({ message: "Academic details saved successfully!" });
    });
};

const getAcademicDetails = (req, res) => {
    AcademicModel.getAll((err, results) => {
        if (err) {
            console.error("Error fetching data:", err);
            return res.status(500).json({ message: "Database error" });
        }
        
        results = results.map(academic => ({
            ...academic,
            uploaded_file: academic.uploaded_file ? `http://localhost:5000${academic.uploaded_file}` : null
        }));

        res.status(200).json(results);
    });
};

module.exports = {
    createAcademicDetails,
    getAcademicDetails
};
