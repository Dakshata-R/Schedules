const mysql = require('mysql2');

// Create a connection to the MySQL database
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'dakshata', // 👈 Use your MySQL password
    database: 'user_management', // 👈 Updated database name
});

// Connect to the database
db.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to the user_management database');
});
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
        queryDatabase(sql, [], callback);
    }
};

module.exports = AcademicModel;