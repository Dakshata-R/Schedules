const express = require('express');
const router = express.Router();
const personalController = require('../controllers/personalController');
const upload = require('../middleware/uploadMiddleware');

router.post('/personal', upload.fields([
    { name: 'profileImage', maxCount: 1 },
    { name: 'coverImage', maxCount: 1 }
]), personalController.createPersonalDetails);

router.get('/personal', personalController.getPersonalDetails);

module.exports = router;
