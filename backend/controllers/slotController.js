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

// In slotController.js
exports.bookSlot = async (req, res) => {
  try {
    const { slotId } = req.params;
    const { email } = req.body;
    
    console.log(`Attempting to book slot ${slotId} for ${email}`); // Debug log
    
    if (!email) {
      console.log('Booking failed: No email provided');
      return res.status(400).json({ success: false, message: 'Student email is required' });
    }

    const result = await Slot.bookSlot(slotId, email);
    if (result.success) {
      console.log(`Successfully booked slot ${slotId} for ${email}`);
      res.json({ success: true, message: 'Slot booked successfully' });
    } else {
      console.log(`Booking failed for slot ${slotId}: ${result.message}`);
      res.status(404).json({ success: false, message: result.message });
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
// Add this new method
exports.getRequestsWithSlots = async (req, res) => {
  try {
    const { email } = req.params;
    const requests = await StudentRequest.findByEmail(email);
    
    const requestsWithSlots = await Promise.all(requests.map(async (request) => {
      if (request.status === 'Approved') {
        const slots = await Slot.findByStudentEmail(email, request.skills);
        const slotsWithBookingStatus = slots.map(slot => ({
          ...slot,
          isBooked: slot.status === 'Booked'
        }));
        return { ...request, slots: slotsWithBookingStatus };
      }
      return { ...request, slots: [] };
    }));
    
    res.json(requestsWithSlots);
  } catch (error) {
    console.error('Error fetching requests with slots:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};