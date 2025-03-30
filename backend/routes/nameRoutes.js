// nameRoutes.js
const express = require("express");
const { fetchUserName } = require("../controllers/nameController");

const router = express.Router();

router.get("/user-data", fetchUserName);

module.exports = router;