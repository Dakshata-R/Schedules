const express = require('express');
const router = express.Router();
const multer = require('multer');
const infraController = require('../controllers/infracontroller');

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(), // Store files in memory
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Save infrastructure data (single route with upload middleware)
router.post('/save-infrastructure', upload.single('image'), infraController.saveInfrastructure);

// Get all infrastructure
router.get('/fetch-combined-data', infraController.getAllInfrastructure);

// Delete infrastructure by unique ID
router.delete('/delete-row/:uniqueId', infraController.deleteInfrastructure);

module.exports = router;