const express = require("express");
const mysql = require("mysql2"); // Use 'pg' for PostgreSQL
const app = express();

// Middleware to parse JSON requests
app.use(express.json());

// Database connection configuration
const db = mysql.createConnection({
  host: "localhost", // Database host
  user: "root", // Database username
  password: "sandhiya", // Database password
  database: "roles_management", // Database name
});

// Connect to the database
db.connect((err) => {
  if (err) {
    console.error("Error connecting to the database:", err);
    return;
  }
  console.log("Connected to the database");
});

// API endpoint to fetch roles
app.get("/api/getRoles", (req, res) => {
    const query = `
      SELECT 
        r.id AS roleId, 
        r.role_name AS roleName, 
        r.priority, 
        m.member_name AS member, 
        p.permission_label AS permission
      FROM roles r
      LEFT JOIN members m ON r.id = m.role_id
      LEFT JOIN permissions p ON r.id = p.role_id
    `;
  
    db.query(query, (err, results) => {
      if (err) {
        console.error("Error fetching roles:", err);
        return res.status(500).send("Error fetching roles");
      }
  
      console.log("Raw results from database:", results); // Log raw results
  
      // Organize data into a structured format
      const roles = {};
      results.forEach((row) => {
        if (!roles[row.roleId]) {
          roles[row.roleId] = {
            roleName: row.roleName,
            priority: row.priority,
            members: [],
            permissions: [],
          };
        }
        if (row.member && !roles[row.roleId].members.includes(row.member)) {
          roles[row.roleId].members.push(row.member);
        }
        if (row.permission && !roles[row.roleId].permissions.includes(row.permission)) {
          roles[row.roleId].permissions.push(row.permission);
        }
      });
  
      console.log("Formatted roles:", roles); // Log formatted roles
  
      res.status(200).json(Object.values(roles));
    });
  });

// Default route
app.get("/", (req, res) => {
  res.send("Welcome to the Roles API!");
});

// Start the server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});