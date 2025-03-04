const express = require('express');
const multer = require('multer');
const infraController = require('../controllers/infracontroller');
const path = require('path');

const router = express.Router();

// Configure multer storage to use the original filename
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Save files in the 'uploads' directory
  },
  filename: function (req, file, cb) {
    // Use the original filename
    const originalName = file.originalname;
    const fileExtension = path.extname(originalName); // Get the file extension
    const fileNameWithoutExtension = path.basename(originalName, fileExtension); // Get the filename without extension
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9); // Add a unique suffix to avoid conflicts
    const finalFileName = `${fileNameWithoutExtension}-${uniqueSuffix}${fileExtension}`; // Combine everything
    cb(null, finalFileName);
  },
});

const upload = multer({ storage: storage });

router.post('/api/save-basic', upload.single('image'), infraController.saveBasic);
router.post('/api/save-venue-type', infraController.saveVenueType);
router.post('/api/save-facility', infraController.saveFacility);

module.exports = router;