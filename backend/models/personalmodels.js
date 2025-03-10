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