const roleModel = require('../../models/role/rolemodals');

exports.saveRole = async (req, res) => {
  try {
    const result = await roleModel.saveRole(req.body);
    res.status(201).json({
      success: true,
      message: 'Role created successfully',
      data: result
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
};

exports.getRoles = async (req, res) => {
  try {
    const roles = await roleModel.getRoles();
    res.status(200).json(roles); // Changed to directly return the array
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch roles'
    });
  }
};

exports.deleteRole = async (req, res) => {
  try {
    await roleModel.deleteRole(req.params.id);
    res.status(200).json({
      success: true,
      message: 'Role deleted successfully'
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

exports.updateRole = async (req, res) => {
  try {
    const result = await roleModel.updateRole(req.params.id, req.body);
    res.status(200).json({
      success: true,
      message: 'Role updated successfully',
      data: result
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};