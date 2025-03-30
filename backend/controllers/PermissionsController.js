const PermissionsModel = require('../models/PermissionsModel');

const PermissionsController = {
  // Fetch permissions by name
  getPermissionsByName: async (req, res) => {
    const { name } = req.query;

    if (!name) {
      return res.status(400).json({ message: 'Name is required' });
    }

    try {
      const permissionData = await PermissionsModel.getPermissionsByName(name);
      if (!permissionData) {
        return res.status(404).json({ message: 'Permissions not found' });
      }
      res.status(200).json(permissionData);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching permissions', error });
    }
  },
};

module.exports = PermissionsController;