// infra_db.js
const mysql = require('mysql2');

// Create a connection to the MySQL database
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'sandhiya',
  database: 'infra_management',
});

// Connect to the database
db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to the infra_management database');
});

module.exports = db;