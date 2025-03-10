import React, { useState } from "react";
import { Button, TextField, Typography, Box, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";

const AuthPage = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const url = isRegister
      ? "http://localhost:5000/api/auth/register"
      : "http://localhost:5000/api/auth/login";

    const payload = isRegister
      ? { email, password, role }
      : { email, password };

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message);
        if (!isRegister) {
          localStorage.setItem("token", "dummy-token"); // Store a dummy token for now
          localStorage.setItem("role", data.role); // Store the user's role from the response
          navigate("/dashboard"); // Navigate to the dashboard after successful login
        }
      } else {
        setMessage(data.message || "An error occurred");
      }
    } catch (error) {
      setMessage("Server error. Please try again later.");
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#f0f2f5",
      }}
    >
      <Paper
        elevation={3}
        sx={{
          padding: 4,
          width: 400,
          textAlign: "center",
          backgroundColor: "#fff",
          borderRadius: 2,
        }}
      >
        <Typography variant="h5" sx={{ marginBottom: 3, fontWeight: "bold" }}>
          {isRegister ? "Register" : "Login"}
        </Typography>

        {message && (
          <Typography
            variant="body2"
            sx={{
              color: isRegister ? "green" : "blue",
              marginBottom: 2,
            }}
          >
            {message}
          </Typography>
        )}

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            sx={{ marginBottom: 2 }}
          />

          <TextField
            fullWidth
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            sx={{ marginBottom: 2 }}
          />

          {isRegister && (
            <TextField
              fullWidth
              select
              label="Role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              SelectProps={{ native: true }}
              sx={{ marginBottom: 2 }}
            >
              <option value="student">Student</option>
              <option value="faculty">Faculty</option>
            </TextField>
          )}

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{
              backgroundColor: "#4caf50",
              color: "#fff",
              marginBottom: 2,
              "&:hover": { backgroundColor: "#388e3c" },
            }}
          >
            {isRegister ? "Register" : "Login"}
          </Button>
        </form>

        <Typography variant="body2">
          {isRegister ? "Already have an account? " : "New user? "}
          <Button
            onClick={() => setIsRegister(!isRegister)}
            sx={{
              color: "#4caf50",
              textTransform: "none",
              fontWeight: "bold",
              "&:hover": { backgroundColor: "transparent" },
            }}
          >
            {isRegister ? "Login" : "Register"}
          </Button>
        </Typography>
      </Paper>
    </Box>
  );
};

export default AuthPage;