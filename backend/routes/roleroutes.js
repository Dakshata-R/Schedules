const express = require('express');
const roleController = require('../controllers/rolecontroller');

const router = express.Router();

router.post('/api/saveRole', roleController.saveRole);
router.get('/api/getRoles', roleController.getRoles);
router.delete('/api/deleteRole/:id', roleController.deleteRole);
router.put('/api/updateRole/:id', roleController.updateRole);

module.exports = router;