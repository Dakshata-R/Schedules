const db = require('../../config/db');

const AdditionalModel = {
  create: async (data) => {
    const sql = `INSERT INTO additional_details 
                (additional_info, file_name, file_path) 
                VALUES (?, ?, ?)`;
    const [result] = await db.query(sql, [
      data.additional_info || null,
      data.file_name,
      data.file_path
    ]);
    return result;
  },

  getAll: async () => {
    const sql = `SELECT * FROM additional_details ORDER BY uploaded_at DESC`;
    const [rows] = await db.query(sql);
    return rows;
  }
};

module.exports = AdditionalModel;