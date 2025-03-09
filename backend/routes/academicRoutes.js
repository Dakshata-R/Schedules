const express = require('express');
const multer = require('multer');
const path = require('path');
const academicController = require('../controllers/academicController');

const router = express.Router();

// Multer configuration for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads_academic/'); // 👈 Save files in the 'uploads_academic' folder
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname)); // Unique filename
    }
});

const upload = multer({ storage });

// Route to handle academic details creation with file upload
router.post('/academic', upload.single('file'), academicController.createAcademicDetails);

// Route to fetch academic details
router.get('/academic', academicController.getAcademicDetails);

module.exports = router;