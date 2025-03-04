import React, { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  Button,
  TextField,
  Chip,
  Checkbox,
  InputAdornment,
  Avatar,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

// PermissionItem Component
const PermissionItem = ({ permission, onAddNestedPermission, onEditPermission, onDeletePermission }) => {
  const [isAddingNested, setIsAddingNested] = useState(false);
  const [nestedPermission, setNestedPermission] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editedLabel, setEditedLabel] = useState(permission.label);

  const handleAddNestedPermission = () => {
    if (nestedPermission.trim()) {
      onAddNestedPermission(permission.id, nestedPermission);
      setNestedPermission("");
      setIsAddingNested(false);
    }
  };

  const handleEditPermission = () => {
    if (isEditing) {
      onEditPermission(permission.id, editedLabel); // Save the edited label
    }
    setIsEditing(!isEditing); // Toggle edit mode
  };

  const handleDeletePermission = () => {
    onDeletePermission(permission.id); // Delete the permission
  };

  return (
    <Box sx={{ marginLeft: "20px", marginBottom: "10px" }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: "10px" }}>
        {/* Checkbox for selection */}
        <Checkbox defaultChecked />

        {/* Editable permission label */}
        {isEditing ? (
          <TextField
            value={editedLabel}
            onChange={(e) => setEditedLabel(e.target.value)}
            size="small"
            variant="outlined"
          />
        ) : (
          <Typography variant="body1">{permission.label}</Typography>
        )}

        {/* Edit and Delete Icons */}
        <EditIcon
          onClick={handleEditPermission}
          sx={{ color: "grey", cursor: "pointer", "&:hover": { color: "darkgrey" } }}
        />
        <DeleteIcon
          onClick={handleDeletePermission}
          sx={{ color: "grey", cursor: "pointer", "&:hover": { color: "darkgrey" } }}
        />

        {/* Add nested permission button */}
        <Typography
          variant="body2"
          onClick={() => setIsAddingNested(!isAddingNested)}
          sx={{ cursor: "pointer" }}
        >
          +
        </Typography>
      </Box>

      {/* Input field for adding nested permissions */}
      {isAddingNested && (
        <Box sx={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "10px" }}>
          <TextField
            fullWidth
            placeholder="Type here"
            variant="outlined"
            size="small"
            value={nestedPermission}
            onChange={(e) => setNestedPermission(e.target.value)}
          />
          <AddIcon
            onClick={handleAddNestedPermission}
            sx={{
              color: "grey",
              cursor: "pointer",
              "&:hover": {
                color: "darkgrey",
              },
            }}
          />
        </Box>
      )}

      {/* Render nested permissions recursively */}
      {permission.children?.map((child) => (
        <PermissionItem
          key={child.id}
          permission={child}
          onAddNestedPermission={onAddNestedPermission}
          onEditPermission={onEditPermission}
          onDeletePermission={onDeletePermission}
        />
      ))}
    </Box>
  );
};

// RolesPop Component
const RolesPop = ({ onClose, editingRole }) => {
  const [memberInput, setMemberInput] = useState("");
  const [members, setMembers] = useState(editingRole?.members || []);
  const [permissions, setPermissions] = useState(editingRole?.permissions || []);
  const [newPermission, setNewPermission] = useState("");
  const [roleName, setRoleName] = useState(editingRole?.roleName || "");
  const [priority, setPriority] = useState(editingRole?.priority || "");

  useEffect(() => {
    if (editingRole) {
      setRoleName(editingRole.roleName);
      setPriority(editingRole.priority);
      setMembers(editingRole.members);
      setPermissions(editingRole.permissions);
    }
  }, [editingRole]);

  const handleAddMember = () => {
    if (memberInput.trim()) {
      setMembers([...members, memberInput]);
      setMemberInput("");
    }
  };

  const handleDeleteMember = (index) => {
    const updatedMembers = members.filter((_, i) => i !== index);
    setMembers(updatedMembers);
  };

  const handleAddPermission = () => {
    if (newPermission.trim()) {
      setPermissions([...permissions, { id: Date.now(), label: newPermission, children: [] }]);
      setNewPermission("");
    }
  };

  const handleAddNestedPermission = (parentId, nestedPermission) => {
    const updatedPermissions = permissions.map((permission) => {
      if (permission.id === parentId) {
        return {
          ...permission,
          children: [...permission.children, { id: Date.now(), label: nestedPermission, children: [] }],
        };
      }
      return permission;
    });
    setPermissions(updatedPermissions);
  };

  const handleEditPermission = (id, newLabel) => {
    const updatedPermissions = permissions.map((permission) => {
      if (permission.id === id) {
        return { ...permission, label: newLabel };
      }
      if (permission.children) {
        return {
          ...permission,
          children: permission.children.map((child) =>
            child.id === id ? { ...child, label: newLabel } : child
          ),
        };
      }
      return permission;
    });
    setPermissions(updatedPermissions);
  };

  const handleDeletePermission = (id) => {
    const updatedPermissions = permissions.filter((permission) => permission.id !== id);
    setPermissions(updatedPermissions);
  };

  const handleSave = async () => {
    const roleData = {
      roleName,
      priority,
      members,
      permissions,
    };

    try {
      const url = editingRole
        ? `http://localhost:5000/api/updateRole/${editingRole.id}`
        : "http://localhost:5000/api/saveRole";
      const method = editingRole ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(roleData),
      });

      if (response.ok) {
        alert(editingRole ? "Role updated successfully!" : "Role saved successfully!");
        onClose();
      } else {
        alert(editingRole ? "Failed to update role." : "Failed to save role.");
      }
    } catch (error) {
      console.error("Error saving role:", error);
      alert("An error occurred while saving the role.");
    }
  };

  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
      }}
    >
      <Paper
        sx={{
          padding: "30px",
          borderRadius: "15px",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
          width: "600px",
          maxHeight: "90vh",
          overflowY: "auto",
          textAlign: "left",
        }}
      >
        {/* Save and Cancel Buttons */}
        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginBottom: "20px" }}>
          <Button
            variant="contained"
            onClick={onClose}
            sx={{
              backgroundColor: "grey",
              color: "white",
              "&:hover": { backgroundColor: "darkgrey" },
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSave}
            sx={{
              backgroundColor: "green",
              color: "white",
              "&:hover": { backgroundColor: "darkgreen" },
            }}
          >
            Save
          </Button>
        </Box>

        {/* Role Creation Title */}
        <Typography variant="h6" component="div" gutterBottom>
          {editingRole ? "Edit Role" : "Role Creation"}
        </Typography>

        {/* Role Name */}
        <Typography variant="body1" gutterBottom>
          Role name
        </Typography>
        <TextField
          fullWidth
          placeholder="Office academics"
          variant="outlined"
          size="small"
          value={roleName}
          onChange={(e) => setRoleName(e.target.value)}
          sx={{ marginBottom: "20px" }}
        />

        {/* Set Priority */}
<Typography variant="body1" gutterBottom>
  Set Priority
</Typography>
<Box sx={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
  <Chip
    label="High"
    onClick={() => setPriority("High")}
    sx={{
      backgroundColor: priority === "High" ? "red" : "transparent",
      color: priority === "High" ? "white" : "red",
      border: "1px solid red",
      "&:hover": {
        backgroundColor: "red",
        color: "white",
      },
    }}
  />
  <Chip
    label="Medium"
    onClick={() => setPriority("Medium")}
    sx={{
      backgroundColor: priority === "Medium" ? "orange" : "transparent",
      color: priority === "Medium" ? "white" : "orange",
      border: "1px solid orange",
      "&:hover": {
        backgroundColor: "orange",
        color: "white",
      },
    }}
  />
  <Chip
    label="Low"
    onClick={() => setPriority("Low")}
    sx={{
      backgroundColor: priority === "Low" ? "green" : "transparent",
      color: priority === "Low" ? "white" : "green",
      border: "1px solid green",
      "&:hover": {
        backgroundColor: "green",
        color: "white",
      },
    }}
  />
</Box>

        {/* Assign Members */}
        <Typography variant="body1" gutterBottom>
          Assign members
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
          <TextField
            fullWidth
            placeholder="Add member"
            variant="outlined"
            size="small"
            value={memberInput}
            onChange={(e) => setMemberInput(e.target.value)}
          />
          <Button
            variant="contained"
            onClick={handleAddMember}
            sx={{
              backgroundColor: "green",
              color: "white",
              textTransform: "none",
              padding: "8px 16px",
              width: "150px",
              "&:hover": { backgroundColor: "darkgreen" },
            }}
          >
            Add member
          </Button>
        </Box>

        {/* Display Members with Avatars */}
        <Box sx={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
          {members.slice(0, 2).map((member, index) => (
            <Avatar
              key={index}
              alt={member}
              src={`https://via.placeholder.com/40?text=${member[0]}`}
              sx={{ width: 40, height: 40 }}
            />
          ))}
          {members.length > 2 && (
            <Chip
              label={`+${members.length - 2}`}
              sx={{ backgroundColor: "lightgrey", color: "black", borderRadius: "20px", padding: "5px 10px" }}
            />
          )}
        </Box>

        {/* Display Members as Chips */}
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: "10px", marginBottom: "20px" }}>
          {members.map((member, index) => (
            <Chip
              key={index}
              label={member}
              onDelete={() => handleDeleteMember(index)}
            />
          ))}
        </Box>

        {/* Set Permissions */}
        <Typography variant="body1" gutterBottom>
          Set permissions
        </Typography>
        <Box sx={{ marginBottom: "20px" }}>
          <Box sx={{ marginBottom: "10px" }}>
            <TextField
              fullWidth
              placeholder="Type here"
              variant="outlined"
              size="small"
              value={newPermission}
              onChange={(e) => setNewPermission(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <AddIcon
                      onClick={handleAddPermission}
                      sx={{ color: "grey", cursor: "pointer", "&:hover": { color: "darkgrey" } }}
                    />
                  </InputAdornment>
                ),
              }}
            />
          </Box>
          {permissions.map((permission) => (
            <PermissionItem
              key={permission.id}
              permission={permission}
              onAddNestedPermission={handleAddNestedPermission}
              onEditPermission={handleEditPermission}
              onDeletePermission={handleDeletePermission}
            />
          ))}
        </Box>
      </Paper>
    </Box>
  );
};

export default RolesPop;