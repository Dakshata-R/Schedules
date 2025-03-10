const mysql = require('mysql2');
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'dakshata',
  database: 'roles_management',
});

exports.saveRole = (roleName, priority, members, permissions, callback) => {
  const roleQuery = 'INSERT INTO roles (role_name, priority) VALUES (?, ?)';
  db.query(roleQuery, [roleName, priority], (err, result) => {
    if (err) return callback(err);

    const roleId = result.insertId;

    const memberQuery = 'INSERT INTO members (role_id, member_name) VALUES ?';
    const memberValues = members.map((member) => [roleId, member]);
    db.query(memberQuery, [memberValues], (err) => {
      if (err) return callback(err);

      const permissionQuery = 'INSERT INTO permissions (role_id, permission_label, parent_permission_id) VALUES ?';
      const permissionValues = permissions.flatMap((permission) => flattenPermissions(permission, roleId));
      db.query(permissionQuery, [permissionValues], callback);
    });
  });
};

exports.getRoles = (callback) => {
  const query = `
    SELECT 
      roles.id AS role_id, 
      roles.role_name, 
      roles.priority, 
      members.member_name, 
      permissions.permission_label, 
      permissions.parent_permission_id
    FROM roles
    LEFT JOIN members ON roles.id = members.role_id
    LEFT JOIN permissions ON roles.id = permissions.role_id
  `;
  db.query(query, (err, results) => {
    if (err) return callback(err);

    const roles = results.reduce((acc, row) => {
      const role = acc.find((r) => r.id === row.role_id);
      if (!role) {
        acc.push({
          id: row.role_id,
          roleName: row.role_name,
          priority: row.priority,
          members: row.member_name ? [row.member_name] : [],
          permissions: row.permission_label
            ? [{ label: row.permission_label, parentId: row.parent_permission_id }]
            : [],
        });
      } else {
        if (row.member_name && !role.members.includes(row.member_name)) {
          role.members.push(row.member_name);
        }
        if (row.permission_label) {
          role.permissions.push({ label: row.permission_label, parentId: row.parent_permission_id });
        }
      }
      return acc;
    }, []);
    callback(null, roles);
  });
};

exports.deleteRole = (roleId, callback) => {
  const deleteMembersQuery = 'DELETE FROM members WHERE role_id = ?';
  db.query(deleteMembersQuery, [roleId], (err) => {
    if (err) return callback(err);

    const deletePermissionsQuery = 'DELETE FROM permissions WHERE role_id = ?';
    db.query(deletePermissionsQuery, [roleId], (err) => {
      if (err) return callback(err);

      const deleteRoleQuery = 'DELETE FROM roles WHERE id = ?';
      db.query(deleteRoleQuery, [roleId], callback);
    });
  });
};

exports.updateRole = (roleId, roleName, priority, members, permissions, callback) => {
  const updateRoleQuery = 'UPDATE roles SET role_name = ?, priority = ? WHERE id = ?';
  db.query(updateRoleQuery, [roleName, priority, roleId], (err) => {
    if (err) return callback(err);

    const deleteMembersQuery = 'DELETE FROM members WHERE role_id = ?';
    db.query(deleteMembersQuery, [roleId], (err) => {
      if (err) return callback(err);

      const memberQuery = 'INSERT INTO members (role_id, member_name) VALUES ?';
      const memberValues = members.map((member) => [roleId, member]);
      db.query(memberQuery, [memberValues], (err) => {
        if (err) return callback(err);

        const permissionQuery = 'INSERT INTO permissions (role_id, permission_label, parent_permission_id) VALUES ?';
        const permissionValues = permissions.flatMap((permission) => flattenPermissions(permission, roleId));
        db.query(permissionQuery, [permissionValues], callback);
      });
    });
  });
};

const flattenPermissions = (permission, roleId, parentId = null) => {
  const permissions = [[roleId, permission.label, parentId]];
  if (permission.children) {
    permission.children.forEach((child) => {
      permissions.push(...flattenPermissions(child, roleId, permission.id));
    });
  }
  return permissions;
};