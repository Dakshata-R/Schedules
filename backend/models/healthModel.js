const db = require('../config/user_db');

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