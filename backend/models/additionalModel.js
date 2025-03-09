const db = require('../config/user_db');
const AdditionalModel = {
    create: (data, callback) => {
        const sql = `INSERT INTO additional_details (additional_info, file_name, file_path) 
                     VALUES (?, ?, ?)`;

        db.query(sql, [
            data.additional_info || null,
            data.file_name,
            data.file_path
        ], callback);
    },

    getAll: (callback) => {
        const sql = `SELECT * FROM additional_details ORDER BY uploaded_at DESC`;
        db.query(sql, [], callback);
    }
};

module.exports = AdditionalModel;