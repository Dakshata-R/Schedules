const mysql = require('mysql2');

const request_db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'sandhiya',
  database: 'request_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

request_db.getConnection((err, connection) => {
  if (err) {
    console.error('Error connecting to the request_db database:', err);
    return;
  }
  console.log('Connected to the request_db database');
  connection.release();
});

module.exports = request_db;