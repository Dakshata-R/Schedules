const queryDatabase = require('../config/db');

const HealthModel = {
    // Insert new health record
    create: (data, callback) => {
        const sql = `INSERT INTO health_details (disability, health_issues, file_name, file_path) 
                     VALUES (?, ?, ?, ?)`;

        queryDatabase(sql, [
            data.disability,
            data.health_issues || null,
            data.file_name,
            data.file_path
        ], callback);
    },

    // Get all health records
    getAll: (callback) => {
        const sql = `SELECT * FROM health_details ORDER BY uploaded_at DESC`;
        queryDatabase(sql, [], callback);
    }
};

module.exports = HealthModel;
