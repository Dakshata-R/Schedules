const db = require('../../../config/db');



const SlotBooking = {
  // Book a slot
  bookSlot: async (slotId, studentEmail, bookedTimeSlot, selectedTiming = null) => {
    try {
      // Start transaction
      await db.query('START TRANSACTION');

      // 1. Check if slot exists and has capacity
      const [slot] = await db.query(
        `SELECT id, booked_count, max_capacity, start_datetime
         FROM slot_schedules 
         WHERE id = ? FOR UPDATE`,
        [slotId]
      );

      if (!slot || slot.length === 0) {
        throw new Error('Slot not found');
      }

      if (slot[0].booked_count >= slot[0].max_capacity) {
        throw new Error('This slot is already fully booked');
      }

      // 2. Check if student already booked this slot
      const [existingBooking] = await db.query(
        `SELECT id FROM slot_bookings 
         WHERE slot_id = ? AND student_email = ? AND status = 'booked'`,
        [slotId, studentEmail]
      );

      if (existingBooking && existingBooking.length > 0) {
        throw new Error('You have already booked this slot');
      }

      // Get the slot date from start_datetime
      const slotDate = selectedTiming 
      ? new Date(selectedTiming.start).toISOString().split('T')[0] 
      : new Date(slot[0].start_datetime).toISOString().split('T')[0];
    
      // 3. Create the booking
   // In the bookSlot method, modify the INSERT query:
const [result] = await db.query(
  `INSERT INTO slot_bookings 
   (slot_id, student_email, faculty, venue, booked_date, booked_time_slot, status, specific_start, specific_end) 
   VALUES (?, ?, ?, ?, ?, ?, 'booked', ?, ?)`,
  [
    slotId, 
    studentEmail,
    slot[0].faculties, // Store faculty info from slot_schedules
    slot[0].venues,    // Store venue info from slot_schedules
    slotDate,
    bookedTimeSlot,
    selectedTiming ? new Date(selectedTiming.start) : null,
    selectedTiming ? new Date(selectedTiming.end) : null
  ]
);

// In getStudentBookings method, simplify the query since we now store the data directly:
getStudentBookings: async (studentEmail) => {
  const [bookings] = await db.query(
    `SELECT 
       sb.*, 
       ss.template_name,
       ss.start_datetime,
       ss.end_datetime
     FROM slot_bookings sb
     JOIN slot_schedules ss ON sb.slot_id = ss.id
     WHERE sb.student_email = ?
     ORDER BY sb.booked_date DESC`,
    [studentEmail]
  );
  
  // Parse the JSON strings for faculty and venue
  return bookings.map(booking => ({
    ...booking,
    faculty: JSON.parse(booking.faculty || '[]'),
    venue: JSON.parse(booking.venue || '[]')
  }));
}
      // 4. Update slot booked count
      await db.query(
        `UPDATE slot_schedules 
         SET booked_count = booked_count + 1 
         WHERE id = ?`,
        [slotId]
      );

      // Commit transaction
      await db.query('COMMIT');

      return {
        id: result.insertId,
        slot_id: slotId,
        student_email: studentEmail,
        status: 'booked'
      };

    } catch (error) {
      // Rollback on error
      await db.query('ROLLBACK');
      throw error;
    }
  },
  // In SlotBooking.js
getAllBookings: async () => {
  const [bookings] = await db.query(
    `SELECT 
       sb.id,
       sb.slot_id,
       sb.student_email,
       sb.booked_date,
       sb.booked_time_slot,
       sb.status,
       sb.created_at,
       sb.updated_at,
       ss.template_name,
       ss.start_datetime,
       ss.end_datetime
     FROM slot_bookings sb
     JOIN slot_schedules ss ON sb.slot_id = ss.id
     ORDER BY sb.booked_date DESC`
  );
  return bookings;
},
  // Get student's bookings
  getStudentBookings: async (studentEmail) => {
    const [bookings] = await db.query(
      `SELECT 
         sb.*, 
         ss.template_name, 
         ss.start_datetime, 
         ss.end_datetime,
         ss.venues,
         ss.faculties
       FROM slot_bookings sb
       JOIN slot_schedules ss ON sb.slot_id = ss.id
       WHERE sb.student_email = ?
       ORDER BY sb.booked_date DESC`,
      [studentEmail]
    );
    
    // Parse the JSON strings for venues and faculties
    return bookings.map(booking => ({
      ...booking,
      venues: JSON.parse(booking.venues || '[]'),
      faculties: JSON.parse(booking.faculties || '[]')
    }));
  },

  // Cancel a booking
  cancelBooking: async (bookingId, studentEmail) => {
    try {
      // Start transaction
      await db.query('START TRANSACTION');

      // 1. Get the booking and verify ownership
      const [booking] = await db.query(
        `SELECT id, slot_id, status 
         FROM slot_bookings 
         WHERE id = ? AND student_email = ? FOR UPDATE`,
        [bookingId, studentEmail]
      );

      if (!booking || booking.length === 0) {
        throw new Error('Booking not found or unauthorized');
      }

      if (booking[0].status !== 'booked') {
        throw new Error('Only booked slots can be cancelled');
      }

      // 2. Update booking status
      await db.query(
        `UPDATE slot_bookings 
         SET status = 'cancelled' 
         WHERE id = ?`,
        [bookingId]
      );

      // 3. Decrement slot booked count
      await db.query(
        `UPDATE slot_schedules 
         SET booked_count = booked_count - 1 
         WHERE id = ?`,
        [booking[0].slot_id]
      );

      // Commit transaction
      await db.query('COMMIT');

      return { success: true };

    } catch (error) {
      // Rollback on error
      await db.query('ROLLBACK');
      throw error;
    }
  },

  // Check slot availability
  checkSlotAvailability: async (slotId) => {
    const [result] = await db.query(
      `SELECT 
         ss.id,
         ss.template_name,
         ss.booked_count,
         ss.max_capacity,
         (ss.max_capacity - ss.booked_count) as available_slots
       FROM slot_schedules ss
       WHERE ss.id = ?`,
      [slotId]
    );
    return result[0];
  },

  // Get booking by ID
  getBookingById: async (bookingId) => {
    const [booking] = await db.query(
      `SELECT * FROM slot_bookings WHERE id = ?`,
      [bookingId]
    );
    return booking[0];
  }
};

module.exports = SlotBooking;