const queryDatabase = require('../config/db');

const PersonalModel = {
    create: (data, callback) => {
        const sql = `INSERT INTO personal 
        (studentId, name, dob, age, bloodGroup, weight, height, fatherName, motherName, fatherOccupation, motherOccupation, profileImage, coverImage) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

        queryDatabase(sql, [
            data.studentId, 
            data.name, 
            data.dob, 
            data.age, 
            data.bloodGroup, 
            data.weight, 
            data.height, 
            data.fatherName, 
            data.motherName, 
            data.fatherOccupation, 
            data.motherOccupation, 
            data.profileImage || null,  
            data.coverImage || null
        ], callback);
    },
    getAll: (callback) => {
        const sql = `SELECT * FROM personal`;
        queryDatabase(sql, [], callback);
    }
};

module.exports = PersonalModel;
