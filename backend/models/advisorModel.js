const queryDatabase = require('../config/db');

const AdvisorModel = {
    create: (data, callback) => {
        const sql = `INSERT INTO class_advisors 
        (advisor_name, country_code, contact_number, email, accommodation_type, hostel_name, floor, room_type, room_number, college_transport, route, stage, stopping, bus_number) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

        queryDatabase(sql, [
            data.advisor_name,
            data.country_code,
            data.contact_number,
            data.email,
            data.accommodation_type,
            data.hostel_name || null,
            data.floor || null,
            data.room_type || null,
            data.room_number || null,
            data.college_transport || null,
            data.route || null,
            data.stage || null,
            data.stopping || null,
            data.bus_number || null
        ], callback);
    },
    getAll: (callback) => {
        const sql = `SELECT * FROM class_advisors`;
        queryDatabase(sql, [], callback);
    }
};

module.exports = AdvisorModel;
