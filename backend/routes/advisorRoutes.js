const express = require('express');
const router = express.Router();
const advisorController = require('../controllers/advisorController');
const multer = require('multer');
const path = require('path');

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads_advisor/'); // 👈 Save files in the 'uploads_advisor' folder
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname)); // Unique filename
    }
});

const upload = multer({ storage });

// Route to handle advisor details creation with file uploads
router.post('/advisors', upload.fields([
    { name: 'profileImage', maxCount: 1 },
    { name: 'coverImage', maxCount: 1 }
]), advisorController.createAdvisor);

// Route to fetch advisor details
router.get('/advisors', advisorController.getAdvisors);

module.exports = router;