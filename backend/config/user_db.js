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

module.exports = db;