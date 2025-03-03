const PersonalModel = require('../models/personalmodels');

const createPersonalDetails = (req, res) => {
    console.log("Received Files:", req.files);
    console.log("Received Form Data:", req.body);

    let profileImagePath = req.files?.profileImage ? `/upload-personal/${req.files.profileImage[0].filename}` : null;
    let coverImagePath = req.files?.coverImage ? `/upload-personal/${req.files.coverImage[0].filename}` : null;

    const formData = {
        studentId: req.body.studentId,
        name: req.body.name,
        dob: req.body.dob,
        age: req.body.age,
        bloodGroup: req.body.bloodGroup,
        weight: req.body.weight,
        height: req.body.height,
        fatherName: req.body.fatherName,
        motherName: req.body.motherName,
        fatherOccupation: req.body.fatherOccupation,
        motherOccupation: req.body.motherOccupation,
        profileImage: profileImagePath,
        coverImage: coverImagePath
    };

    PersonalModel.create(formData, (err, result) => {
        if (err) {
            console.error("Error inserting data:", err);
            return res.status(500).json({ message: "Database error" });
        }
        res.status(201).json({ message: "Personal details saved successfully!" });
    });
};

const getPersonalDetails = (req, res) => {
    PersonalModel.getAll((err, results) => {
        if (err) {
            console.error("Error fetching data:", err);
            return res.status(500).json({ message: "Database error" });
        }

        // Convert stored file paths to full URLs
        results = results.map(person => ({
            ...person,
            profileImage: person.profileImage ? `http://localhost:5000${person.profileImage}` : null,
            coverImage: person.coverImage ? `http://localhost:5000${person.coverImage}` : null
        }));

        res.status(200).json(results);
    });
};

module.exports = {
    createPersonalDetails,
    getPersonalDetails
};