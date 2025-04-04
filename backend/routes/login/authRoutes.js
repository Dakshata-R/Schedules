const express = require('express');
const router = express.Router();
const authController = require('../../controllers/login/authController');
const { protect } = require('../../middleware/authMiddleware');

router.post('/login', authController.login);
router.get('/me', protect, authController.getUserRole);

module.exports = router;