const StudentRequest = require('../../models/student_request/StudentRequest');
const Slot = require('../../models/Slot');  // Add this line
const moment = require('moment-timezone');

exports.getRequestsWithSlots = async (req, res) => {
  try {
    // Disable caching
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    
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
exports.getFacultySchedule = async (req, res) => {
  try {
    const { email } = req.params;
    
    // Disable caching
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');

    // First get all slots where the faculty is in charge
    const facultySlots = await Slot.findByFacultyEmail(email);

    // Format the slots for the frontend
    const formattedSlots = facultySlots.map(slot => {
      const startDateTime = moment.tz(`${slot.startDate} ${slot.fromTime}`, 'YYYY-MM-DD HH:mm:ss', 'Asia/Kolkata').toISOString();
      const endDateTime = moment.tz(`${slot.endDate} ${slot.toTime}`, 'YYYY-MM-DD HH:mm:ss', 'Asia/Kolkata').toISOString();
      
      return {
        id: slot.id,
        title: slot.skillName,
        start: startDateTime,
        end: endDateTime,
        location: slot.location,
        studentDetails: {
          student_name: slot.student_name || 'Student',
          roll_number: slot.roll_number || '',
          department: slot.department || ''
        }
      };
    });

    res.json(formattedSlots);
  } catch (error) {
    console.error('Error fetching faculty schedule:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
exports.getBookedSlots = async (req, res) => {
  try {
    const { email } = req.params;
    
    // Disable caching for this endpoint
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');

    const bookedSlots = await Slot.findBookedByStudent(email);
    
    if (!bookedSlots || bookedSlots.length === 0) {
      return res.status(200).json([]);
    }

    const formattedSlots = bookedSlots.map(slot => {
      // Use moment-timezone to handle dates properly
      const startDateTime = moment.tz(`${slot.startDate} ${slot.fromTime}`, 'YYYY-MM-DD HH:mm:ss', 'Asia/Kolkata').toISOString();
      const endDateTime = moment.tz(`${slot.endDate} ${slot.toTime}`, 'YYYY-MM-DD HH:mm:ss', 'Asia/Kolkata').toISOString();
    
      return {
        id: slot.id,
        title: slot.skillName,
        faculty: slot.facultyIncharge,
        start: startDateTime,
        end: endDateTime,
        location: slot.location,
        color: '#4CAF50',
        borderColor: '#2E7D32',
        extendedProps: {
          faculty_incharge: slot.facultyIncharge,
          skill_name: slot.skillName,
          location: slot.location,
          rawData: {
            startDate: slot.startDate,
            endDate: slot.endDate,
            fromTime: slot.fromTime,
            toTime: slot.toTime
          }
        }
      };
    });

    res.status(200).json(formattedSlots);
  } catch (error) {
    console.error('Error fetching booked slots:', error);
    res.status(500).json({ error: 'Internal server error' });
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