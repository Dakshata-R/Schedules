const queryDatabase = require('../config/db');

const CommunicationModel = {
    create: async (data, callback) => {
        const sql = `INSERT INTO communication_details 
            (mobile1, mobile2, personal_email, official_email, location, current_address, permanent_address) 
            VALUES (?, ?, ?, ?, ?, ?, ?)`;
        
        queryDatabase(sql, [
            data.mobile1, 
            data.mobile2, 
            data.personal_email, 
            data.official_email, 
            data.location, 
            data.current_address, 
            data.permanent_address
        ], callback);
    },
    getAll: (callback) => {
        const sql = `SELECT * FROM communication_details`;
        queryDatabase(sql, [], callback);
    }
};

module.exports = CommunicationModel;
