const mysql = require("mysql2");

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "sandhiya",
  database: "data",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

const getUserByName = async (email) => {
  const [rows] = await pool
    .promise()
    .query("SELECT name, register_id AS rollNumber, department FROM user_data WHERE email = ?", [email]);
  return rows[0];
};

module.exports = {
  getUserByName,
};