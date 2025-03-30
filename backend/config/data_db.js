const mysql = require('mysql2');

const data_db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'sandhiya',
  database: 'data',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

data_db.getConnection((err, connection) => {
  if (err) {
    console.error('Error connecting to the data database:', err);
    return;
  }
  console.log('Connected to the data database');
  connection.release();
});

module.exports = data_db;