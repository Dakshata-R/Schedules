const mysql = require('mysql2');

// Create a connection to the MySQL database
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'sandhiya', // 👈 Use your MySQL password
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

const HealthModel = {
    create: (data, callback) => {
        const sql = `INSERT INTO health_details 
            (disability, health_issues, file_name, file_path) 
            VALUES (?, ?, ?, ?)`;

        db.query(sql, [
            data.disability,
            data.health_issues || null,
            data.file_name,
            data.file_path
        ], callback);
    },
    getAll: (callback) => {
        const sql = `SELECT * FROM health_details ORDER BY uploaded_at DESC`;
        db.query(sql, [], callback);
    }
};

module.exports = HealthModel;