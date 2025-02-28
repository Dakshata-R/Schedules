const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(bodyParser.json());
app.use(cors());

// MySQL connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "sandhiya",
  database: "roles_management",
});

db.connect((err) => {
  if (err) throw err;
  console.log("MySQL connected");
});

// API to save role
app.post("/api/saveRole", (req, res) => {
  const { roleName, priority, members, permissions } = req.body;

  // Insert role
  const roleQuery = "INSERT INTO roles (role_name, priority) VALUES (?, ?)";
  db.query(roleQuery, [roleName, priority], (err, result) => {
    if (err) return res.status(500).send(err);

    const roleId = result.insertId;

    // Insert members
    const memberQuery = "INSERT INTO members (role_id, member_name) VALUES ?";
    const memberValues = members.map((member) => [roleId, member]);
    db.query(memberQuery, [memberValues], (err) => {
      if (err) return res.status(500).send(err);

      // Insert permissions
      const permissionQuery =
        "INSERT INTO permissions (role_id, permission_label, parent_permission_id) VALUES ?";
      const permissionValues = permissions.flatMap((permission) =>
        flattenPermissions(permission, roleId)
      );
      db.query(permissionQuery, [permissionValues], (err) => {
        if (err) return res.status(500).send(err);
        res.status(200).send("Role saved successfully");
      });
    });
  });
});

// Helper function to flatten nested permissions
const flattenPermissions = (permission, roleId, parentId = null) => {
  const permissions = [[roleId, permission.label, parentId]];
  if (permission.children) {
    permission.children.forEach((child) => {
      permissions.push(...flattenPermissions(child, roleId, permission.id));
    });
  }
  return permissions;
};

// API to fetch all roles
app.get("/api/getRoles", (req, res) => {
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
    if (err) return res.status(500).send(err);

    // Organize the data into a nested structure
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

    res.status(200).json(roles);
  });
});

// API to delete a role
app.delete("/api/deleteRole/:id", (req, res) => {
  const roleId = req.params.id;

  // Delete associated members
  const deleteMembersQuery = "DELETE FROM members WHERE role_id = ?";
  db.query(deleteMembersQuery, [roleId], (err) => {
    if (err) return res.status(500).send(err);

    // Delete associated permissions
    const deletePermissionsQuery = "DELETE FROM permissions WHERE role_id = ?";
    db.query(deletePermissionsQuery, [roleId], (err) => {
      if (err) return res.status(500).send(err);

      // Delete the role
      const deleteRoleQuery = "DELETE FROM roles WHERE id = ?";
      db.query(deleteRoleQuery, [roleId], (err) => {
        if (err) return res.status(500).send(err);
        res.status(200).send("Role deleted successfully");
      });
    });
  });
});
// API to update a role
app.put("/api/updateRole/:id", (req, res) => {
  const roleId = req.params.id;
  const { roleName, priority, members, permissions } = req.body;

  // Update role
  const updateRoleQuery = "UPDATE roles SET role_name = ?, priority = ? WHERE id = ?";
  db.query(updateRoleQuery, [roleName, priority, roleId], (err) => {
    if (err) return res.status(500).send(err);

    // Delete existing members and permissions for the role
    const deleteMembersQuery = "DELETE FROM members WHERE role_id = ?";
    db.query(deleteMembersQuery, [roleId], (err) => {
      if (err) return res.status(500).send(err);

      // Insert updated members
      const memberQuery = "INSERT INTO members (role_id, member_name) VALUES ?";
      const memberValues = members.map((member) => [roleId, member]);
      db.query(memberQuery, [memberValues], (err) => {
        if (err) return res.status(500).send(err);

        // Insert updated permissions
        const permissionQuery =
          "INSERT INTO permissions (role_id, permission_label, parent_permission_id) VALUES ?";
        const permissionValues = permissions.flatMap((permission) =>
          flattenPermissions(permission, roleId)
        );
        db.query(permissionQuery, [permissionValues], (err) => {
          if (err) return res.status(500).send(err);
          res.status(200).send("Role updated successfully");
        });
      });
    });
  });
});

// Start the server
app.listen(5000, () => {
  console.log("Server running on port 5000");
});