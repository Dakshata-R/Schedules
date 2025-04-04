const db = require('../../config/db');

exports.saveRole = async (roleData) => {
  try {
    const { roleName, priority, members, permissions } = roleData;
    
    // Insert role
    const [roleResult] = await db.query(
      'INSERT INTO create_roles (role_name, priority) VALUES (?, ?)',
      [roleName, priority]
    );
    const roleId = roleResult.insertId;

    // Insert members
    if (members && members.length > 0) {
      const memberValues = members.map(member => [roleId, member]);
      await db.query(
        'INSERT INTO members (role_id, member_name) VALUES ?',
        [memberValues]
      );
    }

    // Insert permissions (flatten nested structure)
    if (permissions && permissions.length > 0) {
      const permissionValues = [];
      const processPermission = (permission, parentId = null) => {
        permissionValues.push([roleId, permission.label, parentId]);
        if (permission.children) {
          permission.children.forEach(child => {
            processPermission(child, permission.id);
          });
        }
      };
      
      permissions.forEach(permission => {
        processPermission(permission);
      });

      if (permissionValues.length > 0) {
        await db.query(
          'INSERT INTO permissions (role_id, permission_label, parent_permission_id) VALUES ?',
          [permissionValues]
        );
      }
    }

    return { id: roleId, ...roleData };
  } catch (err) {
    console.error('Error saving role:', err);
    throw err;
  }
};

exports.getRoles = async () => {
  try {
    // Get all roles
    const [roles] = await db.query('SELECT * FROM create_roles');
    
    // Get members for each role
    const [members] = await db.query('SELECT * FROM members');
    const membersByRole = members.reduce((acc, member) => {
      if (!acc[member.role_id]) acc[member.role_id] = [];
      acc[member.role_id].push(member.member_name);
      return acc;
    }, {});

    // Get permissions for each role (with hierarchy)
    const [permissions] = await db.query('SELECT * FROM permissions ORDER BY parent_permission_id IS NULL DESC');
    const permissionsByRole = permissions.reduce((acc, perm) => {
      if (!acc[perm.role_id]) acc[perm.role_id] = [];
      acc[perm.role_id].push(perm);
      return acc;
    }, {});

    // Build the permission tree for each role
    const buildPermissionTree = (roleId, parentId = null) => {
      return permissionsByRole[roleId]
        ?.filter(perm => (perm.parent_permission_id === parentId) || 
                        (parentId === null && perm.parent_permission_id === null))
        .map(perm => ({
          id: perm.id,
          label: perm.permission_label,
          children: buildPermissionTree(roleId, perm.id)
        })) || [];
    };

    // Combine all data
    return roles.map(role => ({
      id: role.id,
      roleName: role.role_name,
      priority: role.priority,
      members: membersByRole[role.id] || [],
      permissions: buildPermissionTree(role.id)
    }));
  } catch (err) {
    console.error('Error fetching roles:', err);
    throw err;
  }
};

exports.deleteRole = async (roleId) => {
  try {
    // Permissions and members will be deleted automatically due to ON DELETE CASCADE
    await db.query('DELETE FROM create_roles WHERE id = ?', [roleId]);
    return true;
  } catch (err) {
    console.error('Error deleting role:', err);
    throw err;
  }
};

exports.updateRole = async (roleId, roleData) => {
  try {
    const { roleName, priority, members, permissions } = roleData;
    
    // Update role
    await db.query(
      'UPDATE create_roles SET role_name = ?, priority = ? WHERE id = ?',
      [roleName, priority, roleId]
    );

    // Delete existing members and permissions
    await db.query('DELETE FROM members WHERE role_id = ?', [roleId]);
    await db.query('DELETE FROM permissions WHERE role_id = ?', [roleId]);

    // Insert new members
    if (members && members.length > 0) {
      const memberValues = members.map(member => [roleId, member]);
      await db.query(
        'INSERT INTO members (role_id, member_name) VALUES ?',
        [memberValues]
      );
    }

    // Insert new permissions (flatten nested structure)
    if (permissions && permissions.length > 0) {
      const permissionValues = [];
      const processPermission = (permission, parentId = null) => {
        permissionValues.push([roleId, permission.label, parentId]);
        if (permission.children) {
          permission.children.forEach(child => {
            processPermission(child, permission.id);
          });
        }
      };
      
      permissions.forEach(permission => {
        processPermission(permission);
      });

      if (permissionValues.length > 0) {
        await db.query(
          'INSERT INTO permissions (role_id, permission_label, parent_permission_id) VALUES ?',
          [permissionValues]
        );
      }
    }

    return { id: roleId, ...roleData };
  } catch (err) {
    console.error('Error updating role:', err);
    throw err;
  }
};