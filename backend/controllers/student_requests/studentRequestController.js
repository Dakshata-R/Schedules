const StudentRequest = require('../../models/student_request/StudentRequest');
const Slot = require('../../models/Slot');  // Add this line
exports.getRequestsWithSlots = async (req, res) => {
  try {
    const { email } = req.params;
    const requests = await StudentRequest.findByEmail(email);
    
    const requestsWithSlots = await Promise.all(
      requests.map(async (request) => {
        if (request.status === 'Approved') {
          const skills = typeof request.skills === 'string' 
            ? JSON.parse(request.skills) 
            : request.skills;
          const slots = await Slot.findByStudentEmail(email, skills);
          return { ...request, slots };
        }
        return request;
      })
    );
    
    res.json(requestsWithSlots);
  } catch (error) {
    console.error('Error fetching requests:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
exports.getBookedSlots = async (req, res) => {
  try {
    const { email } = req.params;
    const slots = await Slot.findBookedByStudent(email);
    
    // Format the response for calendar display
    const formattedSlots = slots.map(slot => {
      try {
        // Extract date parts from the database values
        const startDate = new Date(slot.start_date);
        const endDate = new Date(slot.end_date);
        
        // Parse time strings (assuming format is HH:MM:SS or HH:MM)
        const [fromHours, fromMinutes] = slot.from_time.split(':').map(Number);
        const [toHours, toMinutes] = slot.to_time.split(':').map(Number);
        
        // Apply time to dates
        startDate.setHours(fromHours, fromMinutes || 0, 0, 0);
        endDate.setHours(toHours, toMinutes || 0, 0, 0);

        return {
          id: slot.id,
          title: slot.skill_name,
          faculty: slot.faculty_incharge,
          start: startDate.toISOString(),
          end: endDate.toISOString(),
          location: slot.location,
          color: '#4CAF50',
          borderColor: '#2E7D32',
          extendedProps: {
            faculty_incharge: slot.faculty_incharge,
            skill_name: slot.skill_name,
            location: slot.location
          }
        };
      } catch (error) {
        console.error('Error formatting slot:', error, slot);
        return null;
      }
    }).filter(slot => slot !== null);

    res.json(formattedSlots);
  } catch (error) {
    console.error('Error fetching booked slots:', error);
    res.status(500).json({ message: 'Failed to fetch booked slots' });
  }
};
exports.createRequest = async (req, res) => {
  try {
    const { student_email, student_name, roll_number, department, priority, skills } = req.body;
    
    if (!student_email || !student_name || !priority) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const requestId = await StudentRequest.create({
      student_email,
      student_name,
      roll_number,
      department,
      priority,
      skills: skills || []
    });

    res.status(201).json({
      message: 'Request created successfully',
      requestId
    });
  } catch (error) {
    console.error('Error creating request:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
exports.approveRequestAndCreateSlot = async (req, res) => {
  try {
    const { id } = req.params;
    const slotData = req.body;

    // 1. Create the slot first
    const slotId = await Slot.create(slotData);

    // 2. Update the request status and link the slot
    const affectedRows = await StudentRequest.updateStatusAndSlot(id, 'Approved', slotId);

    if (affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Request not found' });
    }
    
    res.status(200).json({
      success: true,
      message: 'Request approved and slot created',
      slotId
    });
  } catch (error) {
    console.error('Error approving request:', error);
    res.status(500).json({ success: false, message: 'Failed to approve request' });
  }
};
exports.getRequestsByEmail = async (req, res) => {
  try {
    const { email } = req.params;
    const requests = await StudentRequest.findByEmail(email);
    res.json(requests);
  } catch (error) {
    console.error('Error fetching requests:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getAllRequests = async (req, res) => {
  try {
    const requests = await StudentRequest.findAll();
    res.json(requests);
  } catch (error) {
    console.error('Error fetching all requests:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.updateRequestStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['Pending', 'Approved', 'Rejected'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status value' });
    }

    const affectedRows = await StudentRequest.updateStatus(id, status);

    if (affectedRows === 0) {
      return res.status(404).json({ error: 'Request not found' });
    }

    res.json({ message: 'Request status updated successfully' });
  } catch (error) {
    console.error('Error updating request status:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
exports.deleteRequest = async (req, res) => {
    try {
      const { id } = req.params;
      
      // First check if the request exists
      const requestExists = await StudentRequest.findById(id);
      if (!requestExists) {
        return res.status(404).json({ error: 'Request not found' });
      }
  
      const affectedRows = await StudentRequest.deleteById(id);
      
      if (affectedRows === 0) {
        return res.status(404).json({ error: 'Request not found or already deleted' });
      }
  
      res.status(200).json({ message: 'Request deleted successfully' });
    } catch (error) {
      console.error('Error deleting request:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };