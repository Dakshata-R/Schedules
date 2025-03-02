const express = require('express');
const multer = require('multer');
const path = require('path');
const additionalController = require('../controllers/additionalController');

const router = express.Router();

// Configure multer for file uploads (only PDFs)
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../uploads_additional'));
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
router.post('/additional/upload', upload.single('file'), additionalController.uploadAdditionalDetails);
router.get('/additional/details', additionalController.getAdditionalDetails);

module.exports = router;
