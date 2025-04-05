// facultyRoutes.js
const express = require('express');
const Faculty = require('../../models/login/Faculty');
const router = express.Router();

router.get('/api/faculty/has-student-request-role', async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const hasPermission = await Faculty.hasStudentRequestRole(email);
    res.json({ hasPermission });
  } catch (error) {
    console.error('Error checking student request role:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;