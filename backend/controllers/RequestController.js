const RequestModel = require('../models/RequestModal');

const RequestController = {
  // Create a new request
  createRequest: (req, res) => {
    const { name, department, priority, skills, email } = req.body;

    RequestModel.createRequest({ name, department, priority, skills, email }, (err, result) => {
      if (err) {
        return res.status(500).json({ message: 'Error creating request', error: err });
      }
      res.status(201).json({ message: 'Request created successfully', requestId: result.insertId });
    });
  },

  // Fetch requests by email
  getRequestsByEmail: (req, res) => {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    RequestModel.getRequestsByEmail(email, (err, results) => {
      if (err) {
        return res.status(500).json({ message: 'Error fetching requests', error: err });
      }
      res.status(200).json(results);
    });
  },

  // Delete a request by ID
  deleteRequestById: (req, res) => {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: 'Request ID is required' });
    }

    RequestModel.deleteRequestById(id, (err, result) => {
      if (err) {
        return res.status(500).json({ message: 'Error deleting request', error: err });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Request not found' });
      }

      res.status(200).json({ message: 'Request deleted successfully' });
    });
  },
};

module.exports = RequestController;