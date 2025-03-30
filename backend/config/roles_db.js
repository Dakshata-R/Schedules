const mysql = require('mysql2');

const roles_db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'sandhiya',
  database: 'roles_management',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

roles_db.getConnection((err, connection) => {
  if (err) {
    console.error('Error connecting to the roles_management database:', err);
    return;
  }
  console.log('Connected to the roles_management database');
  connection.release();
});

module.exports = roles_db;