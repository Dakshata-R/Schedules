const roles_db = require('../config/roles_db');

class PermissionsModel {
  // Fetch permissions by name
  static async getPermissionsByName(name) {
    const query = `
      SELECT p.permission_label 
      FROM permissions p
      JOIN members m ON p.role_id = m.role_id
      WHERE m.member_name = ?
    `;
    return new Promise((resolve, reject) => {
      roles_db.query(query, [name], (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results[0]);
        }
      });
    });
  }
}

module.exports = PermissionsModel;
