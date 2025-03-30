const { getUserByName } = require("../models/nameModel");

const fetchUserName = async (req, res) => {
  const { email } = req.query;

  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  try {
    const user = await getUserByName(email);
    if (user) {
      res.json({
        name: user.name,
        rollNumber: user.rollNumber,
        department: user.department,
      });
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  fetchUserName,
};