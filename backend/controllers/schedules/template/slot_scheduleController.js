// controllers/schedules/template/slot_scheduleController.js
const SlotSchedule = require('../../../models/schedules/template/slot_scheduleModel');
const { validationResult } = require('express-validator');

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
      faculties: JSON.stringify(faculties)
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
// Add this new controller method
exports.getSlotsForStudent = async (req, res) => {
  try {
    const { email } = req.params;
    const slots = await SlotSchedule.getSlotsForStudent(email);
    
    res.status(200).json({
      status: 'success',
      data: {
        slots
      }
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message
    });
  }
};