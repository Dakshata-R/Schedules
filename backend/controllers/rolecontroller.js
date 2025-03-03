const roleModel = require('../modals/rolemodals');

exports.saveRole = (req, res) => {
  const { roleName, priority, members, permissions } = req.body;

  roleModel.saveRole(roleName, priority, members, permissions, (err, result) => {
    if (err) return res.status(500).send(err);
    res.status(200).send('Role saved successfully');
  });
};

exports.getRoles = (req, res) => {
  roleModel.getRoles((err, results) => {
    if (err) return res.status(500).send(err);
    res.status(200).json(results);
  });
};

exports.deleteRole = (req, res) => {
  const roleId = req.params.id;

  roleModel.deleteRole(roleId, (err, result) => {
    if (err) return res.status(500).send(err);
    res.status(200).send('Role deleted successfully');
  });
};

exports.updateRole = (req, res) => {
  const roleId = req.params.id;
  const { roleName, priority, members, permissions } = req.body;

  roleModel.updateRole(roleId, roleName, priority, members, permissions, (err, result) => {
    if (err) return res.status(500).send(err);
    res.status(200).send('Role updated successfully');
  });
};