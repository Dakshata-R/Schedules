const Slot = require('../models/Slot');

exports.createSlot = async (req, res) => {
  try {
    const slotId = await Slot.create(req.body);
    res.status(201).json({ success: true, slotId });
  } catch (error) {
    console.error('Error creating slot:', error);
    res.status(500).json({ success: false, message: 'Failed to create slot' });
  }
};

exports.getAllSlots = async (req, res) => {
  try {
    const slots = await Slot.getAll();
    res.status(200).json({ success: true, slots });
  } catch (error) {
    console.error('Error fetching slots:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch slots' });
  }
};

exports.bookSlot = async (req, res) => {
  try {
    const { slotId } = req.params;
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ success: false, message: 'Student email is required' });
    }

    const success = await Slot.bookSlot(slotId, email);
    if (success) {
      res.json({ success: true, message: 'Slot booked successfully' });
    } else {
      res.status(404).json({ success: false, message: 'Slot not found or already booked' });
    }
  } catch (error) {
    console.error('Error booking slot:', error);
    res.status(500).json({ success: false, message: 'Failed to book slot' });
  }
};

// Additional method that was in your routes but fits better in controller
exports.getRequestsByEmail = async (req, res) => {
  try {
    const { email } = req.params;
    const requests = await StudentRequest.findByEmail(email);
    
    const requestsWithSlots = await Promise.all(requests.map(async (request) => {
      if (request.status === 'Approved') {
        const slots = await Slot.findByStudentEmail(email, request.skills);
        return { ...request, slots };
      }
      return request;
    }));
    
    res.json(requestsWithSlots);
  } catch (error) {
    console.error('Error fetching requests:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};