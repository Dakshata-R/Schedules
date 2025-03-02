const mysql = require('mysql2');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'dakshata',
    database: 'college_portal', // 👈 Fixed database name
    connectionLimit: 10,
    multipleStatements: true 
});

const queryDatabase = (sql, params, callback) => {
    pool.getConnection((err, connection) => {
        if (err) {
            console.error("Database connection failed:", err);
            if (callback) callback(err, null);
            return;
        }

        connection.query(sql, params, (queryErr, results) => {
            connection.release();
            if (queryErr) {
                console.error("Query error:", queryErr);
                if (callback) callback(queryErr, null);
                return;
            }
            if (callback) callback(null, results);
        });
    });
};

module.exports = queryDatabase;
