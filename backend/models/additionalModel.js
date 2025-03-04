const mysql = require('mysql2');

// Create a connection to the MySQL database
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'sandhiya', // 👈 Use your MySQL password
    database: 'user_management', // 👈 Updated database name
});


const AdditionalModel = {
    // Insert new additional details record
    create: (data, callback) => {
        const sql = `INSERT INTO additional_details (additional_info, file_name, file_path) 
                     VALUES (?, ?, ?)`;

        db.query(sql, [
            data.additional_info || null,
            data.file_name,
            data.file_path
        ], callback);
    },

    // Get all additional details records
    getAll: (callback) => {
        const sql = `SELECT * FROM additional_details ORDER BY uploaded_at DESC`;
        queryDatabase(sql, [], callback);
    }
};

module.exports = AdditionalModel;