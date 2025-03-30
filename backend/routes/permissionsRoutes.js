const express = require('express');
const router = express.Router();
const PermissionsController = require('../controllers/PermissionsController');

// Define the /permissions endpoint
router.get('/', PermissionsController.getPermissionsByName);

module.exports = router;