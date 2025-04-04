const db = require('../../config/db');

const HealthModel = {
  create: async (data) => {
    const sql = `INSERT INTO health_details 
                (disability, health_issues, file_name, file_path) 
                VALUES (?, ?, ?, ?)`;
    const [result] = await db.query(sql, [
      data.disability,
      data.health_issues || null,
      data.file_name,
      data.file_path
    ]);
    return result;
  },

  getAll: async () => {
    const sql = `SELECT * FROM health_details ORDER BY uploaded_at DESC`;
    const [rows] = await db.query(sql);
    return rows;
  }
};

module.exports = HealthModel;