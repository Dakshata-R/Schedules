const db = require('../config/user_db');

const AcademicModel = {
    create: (data, callback) => {
        const sql = `INSERT INTO academic_details 
        (school, tenth_marks, tenth_percent, twelfth_marks, twelfth_percent, school_medium, department, semester_grade, uploaded_file) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;

        db.query(sql, [
            data.school, 
            data.tenth_marks, 
            data.tenth_percent, 
            data.twelfth_marks, 
            data.twelfth_percent, 
            data.school_medium, 
            data.department, 
            data.semester_grade, 
            data.uploaded_file || null
        ], callback);
    },
    getAll: (callback) => {
        const sql = `SELECT * FROM academic_details`;
        db.query(sql, [], callback);
    }
};

module.exports = AcademicModel;