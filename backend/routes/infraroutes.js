const express = require('express');
const multer = require('multer');
const infraController = require('../controllers/infracontroller');
const path = require('path');

const router = express.Router();

// Configure multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const originalName = file.originalname;
    const fileExtension = path.extname(originalName);
    const fileNameWithoutExtension = path.basename(originalName, fileExtension);
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const finalFileName = `${fileNameWithoutExtension}-${uniqueSuffix}${fileExtension}`;
    cb(null, finalFileName);
  },
});

const upload = multer({ storage: storage });

// Existing routes
router.post('/api/save-basic', upload.single('image'), infraController.saveBasic);
router.post('/api/save-venue-type', infraController.saveVenueType);
router.post('/api/save-facility', infraController.saveFacility);

// New route for fetching combined data
router.get('/api/fetch-combined-data', infraController.fetchCombinedData);

// New route for deleting a row by uniqueId
router.delete('/api/delete-row/:uniqueId', infraController.deleteRow);

module.exports = router;