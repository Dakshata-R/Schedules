const Slot = require('../models/Slot');
const db = require('../config/db');

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
exports.getFacultySlotsByEmail = async (req, res) => {
  const { email } = req.params;

  try {
    // 1. First get the faculty member's details
    const [facultyRows] = await db.query(
      `SELECT id, CONCAT(first_name) AS full_name 
       FROM faculty 
       WHERE email = ?`,
      [email]
    );

    if (!facultyRows.length) {
      return res.status(404).json({ error: 'Faculty not found' });
    }

    const facultyId = facultyRows[0].id;
    const facultyName = facultyRows[0].full_name;

    // 2. Get all slots assigned to this faculty (without date filtering)
    const [slots] = await db.query(
      `SELECT 
        s.id,
        s.skill_name AS template_name,
        s.faculty_incharge,
        DATE_FORMAT(s.start_date, '%Y-%m-%d') AS booked_date,
        CONCAT(TIME_FORMAT(s.from_time, '%H:%i'), ' - ', TIME_FORMAT(s.to_time, '%H:%i')) AS booked_time_slot,
        s.location AS venue_name,
        GROUP_CONCAT(DISTINCT ss.student_email) AS students,
        JSON_ARRAYAGG(
  JSON_OBJECT(
    'email', ss.student_email,
    'name', (SELECT CONCAT(first_name) FROM students WHERE email = ss.student_email)
  )
) AS student_details

      FROM slots s
      LEFT JOIN slot_students ss ON s.id = ss.slot_id
      WHERE s.faculty_incharge = ? 
      GROUP BY s.id
      ORDER BY s.start_date, s.from_time`,
      [facultyName, facultyId]
    );

    // 3. Format the response
    const formattedSlots = slots.map(slot => ({
      ...slot,
      students: slot.students ? slot.students.split(',') : [],
      student_details: slot.student_details || []
    }));
    

    res.json(formattedSlots);
  } catch (err) {
    console.error('Error fetching faculty slots:', err);
    res.status(500).json({ error: 'Failed to fetch faculty slots' });
  }
};