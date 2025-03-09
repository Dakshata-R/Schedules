const db = require('../config/user_db');

const PersonalModel = {
    create: (data, callback) => {
        const sql = `INSERT INTO personal 
        (studentId, name, dob, age, bloodGroup, weight, height, fatherName, motherName, fatherOccupation, motherOccupation, profileImage, coverImage) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

        db.query(sql, [
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
        ], (err, result) => {
            if (err) return callback(err);
            callback(null, result);
        });
    },
    getAll: (callback) => {
        const sql = `SELECT * FROM personal`;
        db.query(sql, [], (err, results) => {
            if (err) return callback(err);
            callback(null, results);
        });
    }
};

module.exports = PersonalModel;