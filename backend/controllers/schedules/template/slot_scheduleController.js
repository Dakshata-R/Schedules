// controllers/schedules/template/slot_scheduleController.js
const SlotSchedule = require('../../../models/schedules/template/slot_scheduleModel');
const { validationResult } = require('express-validator');
const db = require('../../../config/db');

exports.createSlotSchedule = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      template_name,
      priority,
      slot_duration,
      duration_unit,
      number_of_slots,
      start_datetime,
      end_datetime,
      open_to,
      slots_per_student,
      venues,
      faculties
    } = req.body;

    // Get creator info from authenticated user
    if (!req.user || !req.user.email) {
      return res.status(401).json({
        status: 'fail',
        message: 'User authentication required'
      });
    }

    const newSlotSchedule = await SlotSchedule.create({
      template_name,
      priority,
      slot_duration,
      duration_unit,
      number_of_slots,
      start_datetime: new Date(start_datetime),
      end_datetime: new Date(end_datetime),
      open_to,
      slots_per_student: slots_per_student || null,
      venues: JSON.stringify(venues),
      faculties: JSON.stringify(faculties),
      created_by: req.user.email.split('@')[0],
      created_email: req.user.email
    });

    res.status(201).json({
      status: 'success',
      data: {
        slotSchedule: newSlotSchedule
      }
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message
    });
  }
};
exports.getAllSlotSchedules = async (req, res) => {
  try {
    const schedules = await SlotSchedule.getAll();
    res.status(200).json({
      status: 'success',
      data: {
        schedules
      }
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message
    });
  }
};
// Add this new controller method
// In slot_scheduleController.js
exports.getSlotsForStudent = async (req, res) => {
  try {
    const { email } = req.params;
    const slots = await SlotSchedule.getSlotsForStudent(email);
    
    // Format dates consistently before sending to frontend
    const formattedSlots = slots.map(slot => ({
      ...slot,
      start_datetime: new Date(slot.start_datetime).toISOString(),
      end_datetime: new Date(slot.end_datetime).toISOString()
    }));
    
    res.status(200).json({
      status: 'success',
      data: {
        slots: formattedSlots
      }
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message
    });
  }
};
// Add this to your slot_scheduleController.js
exports.getScheduleResponses = async (req, res) => {
  try {
    const { scheduleId } = req.params;
    
    if (!scheduleId) {
      return res.status(400).json({
        status: 'fail',
        message: 'Schedule ID is required'
      });
    }

    const responses = await SlotSchedule.getResponsesForSchedule(scheduleId);
    
    res.status(200).json({
      status: 'success',
      data: {
        responses
      }
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message
    });
  }
};
// Add this to your slot_scheduleController.js
exports.getSchedulesCreatedBy = async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) {
      return res.status(400).json({
        status: 'fail',
        message: 'Email parameter is required'
      });
    }

    const schedules = await SlotSchedule.getCreatedBy(email);
    
    res.status(200).json({
      status: 'success',
      data: {
        schedules
      }
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message
    });
  }
};
// controllers/schedules/template/slot_scheduleController.js

exports.getSchedulesForFaculty = async (req, res) => {
  const { email } = req.params;

  try {
    // Get faculty name from email
    const [facultyRows] = await db.query(
      `SELECT CONCAT(first_name) AS full_name FROM faculty WHERE email = ?`,
      [email]
    );

    if (!facultyRows.length) {
      return res.status(404).json({ message: 'Faculty not found' });
    }

    const facultyName = facultyRows[0].full_name;

    // Find schedules that include this faculty name
    const [schedules] = await db.query(
      `SELECT * FROM slot_schedules
       WHERE JSON_SEARCH(faculties, 'one', ?) IS NOT NULL`,
      [facultyName]
    );
    

    const formatted = schedules.map(s => ({
      ...s,
      start_datetime: new Date(s.start_datetime).toISOString(),
      end_datetime: new Date(s.end_datetime).toISOString()
    }));

    res.json({ status: 'success', data: { schedules: formatted } });
  } catch (err) {
    console.error("Error fetching schedules for faculty:", err);
    res.status(500).json({ message: 'Internal server error' });
  }
};
// Add this to slot_scheduleController.js
exports.getSchedulesByFacultyEmail = async (req, res) => {
  try {
    const { email } = req.params;
    
    // First get faculty name from email
    const [facultyRows] = await db.query(
      `SELECT first_name FROM faculty WHERE email = ?`,
      [email]
    );
    
    if (!facultyRows.length) {
      return res.status(404).json({ message: 'Faculty not found' });
    }
    
    const facultyName = facultyRows[0].first_name;
    
    // Find schedules that include this faculty name in the faculties array
    const [schedules] = await db.query(
      `SELECT * FROM slot_schedules 
       WHERE JSON_SEARCH(faculties, 'one', ?) IS NOT NULL
       ORDER BY start_datetime`,
      [facultyName]
    );
    
    // Process the schedules data
    const processedSchedules = schedules.map(schedule => {
      const faculties = typeof schedule.faculties === 'string'
        ? JSON.parse(schedule.faculties)
        : schedule.faculties;
    
      const venues = typeof schedule.venues === 'string'
        ? JSON.parse(schedule.venues)
        : schedule.venues;
    
      const faculty = faculties.find(f => f.name === facultyName);
    
      return {
        ...schedule,
        template_name: schedule.template_name,
        booked_date: new Date(schedule.start_datetime).toISOString().split('T')[0],
        booked_time_slot: `${new Date(schedule.start_datetime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${new Date(schedule.end_datetime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
        faculty_name: facultyName,
        venue_name: venues?.[0]?.name || 'Location not specified',
        students: []
      };
    });
    
    res.status(200).json({
      status: 'success',
      data: {
        schedules: processedSchedules
      }
    });
  } catch (err) {
    console.error("Error fetching schedules by faculty email:", err);
    res.status(500).json({
      status: 'fail',
      message: 'Internal server error'
    });
  }
};
