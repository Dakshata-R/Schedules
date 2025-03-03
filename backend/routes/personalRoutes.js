const express = require('express');
const multer = require('multer');
const path = require('path');
const personalController = require('../controllers/personalcontroller');

const router = express.Router();

// Multer configuration for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'upload-personal/'); // 👈 Save files in the 'uploads' folder
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

// Route to handle personal details creation with file uploads
router.post('/personal', upload.fields([
    { name: 'profileImage', maxCount: 1 },
    { name: 'coverImage', maxCount: 1 }
]), personalController.createPersonalDetails);

// Route to fetch personal details
router.get('/personal', personalController.getPersonalDetails);

module.exports = router;