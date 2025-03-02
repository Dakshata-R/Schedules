const express = require('express');
const router = express.Router();
const academicController = require('../controllers/academicController');
const multer = require('multer');
const path = require('path');

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads_academic/'); // Save files to the uploads_academic folder
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Rename with timestamp
    }
});


const upload = multer({ storage: storage });

router.post('/academic', upload.single('file'), academicController.createAcademicDetails);
router.get('/academic', academicController.getAcademicDetails);

module.exports = router;
