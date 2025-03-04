const express = require('express');
const router = express.Router();
const healthController = require('../controllers/healthController');
const multer = require('multer');
const path = require('path');

// Configure multer for file uploads (only PDFs)
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../uploads_health'));
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'application/pdf') {
            cb(null, true);
        } else {
            cb(new Error('Only PDF files are allowed!'), false);
        }
    }
});

// API Routes
router.post('/health/upload', upload.single('file'), healthController.uploadHealthDetails);
router.get('/health/details', healthController.getHealthDetails);

module.exports = router;