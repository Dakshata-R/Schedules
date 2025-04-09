// models/schedules/template/slot_scheduleModel.js
const db = require('../../../config/db');

class SlotSchedule {
  static async create(data) {
    try {
      const [result] = await db.query(
        `INSERT INTO slot_schedules SET ?`,
        data
      );
      return result;
    } catch (err) {
      throw err;
    }
  }

  static async getAll() {
    try {
      const [results] = await db.query(
        `SELECT * FROM slot_schedules ORDER BY created_at DESC`
      );
      return results;
    } catch (err) {
      throw err;
    }
  }
  // Add this method to slot_scheduleModel.js
static async getSlotsForStudent(studentEmail) {
  try {
    // First get the student's year
    const [studentRows] = await db.query(
      `SELECT year FROM students WHERE email = ?`,
      [studentEmail]
    );
    
    if (studentRows.length === 0) {
      return [];
    }
    
    const studentYear = studentRows[0].year;
    let openToValue;
    
    // Map student year to open_to format
    switch(studentYear) {
      case 1: openToValue = '1st Year'; break;
      case 2: openToValue = '2nd Year'; break;
      case 3: openToValue = '3rd Year'; break;
      case 4: openToValue = 'Final Year'; break;
      default: openToValue = `${studentYear} Year`;
    }
    
    // Get all slots open to "All students" or the student's specific year
    const [slots] = await db.query(
      `SELECT * FROM slot_schedules 
       WHERE open_to = ? OR open_to = ? 
       ORDER BY start_datetime DESC`,
      ['All students', openToValue]
    );
    
    return slots;
  } catch (err) {
    throw err;
  }
}
}


module.exports = SlotSchedule;