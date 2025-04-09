const db = require('../../../config/db');


class SlotBooking {
  static async create(bookingData) {
    const {
      slot_id,
      student_email,
      faculty_name,
      skill_name,
      venue_name,
      start_time,
      end_time
    } = bookingData;
    
    try {
      const [result] = await db.query(
        `INSERT INTO slot_bookings 
        (slot_id, student_email, faculty_name, skill_name, venue_name, start_time, end_time) 
        VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [slot_id, student_email, faculty_name, skill_name, venue_name, start_time, end_time]
      );
      
      return result.insertId;
    } catch (error) {
      console.error('Database error in SlotBooking.create:', error);
      throw error;
    }
  }

  static async getByStudentEmail(email) {
    const [rows] = await db.query(
      'SELECT * FROM slot_bookings WHERE student_email = ? ORDER BY start_time DESC',
      [email]
    );
    return rows;
  }

  static async getAvailableSlots() {
    // This would return all slots that haven't been fully booked
    // In a real implementation, you'd need more complex logic
    const [rows] = await db.query(
      `SELECT * FROM training_slots 
       WHERE slot_id NOT IN (
         SELECT DISTINCT slot_id FROM slot_bookings
       )`
    );
    return rows;
  }
}

module.exports = SlotBooking;