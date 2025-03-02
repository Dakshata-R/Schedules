const queryDatabase = require('../config/db');

const AdditionalModel = {
    // Insert new additional details record
    create: (data, callback) => {
        const sql = `INSERT INTO additional_details (additional_info, file_name, file_path) 
                     VALUES (?, ?, ?)`;

        queryDatabase(sql, [
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
