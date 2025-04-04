class Role {
    static async findById(id) {
      const [rows] = await pool.query('SELECT * FROM login_roles WHERE id = ?', [id]);
      return rows[0];
    }
  }
  
  module.exports = Role;