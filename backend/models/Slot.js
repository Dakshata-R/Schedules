const db = require('../config/db');

class Slot {
  static async create(slotData) {
    const { 
      skillName, 
      facultyIncharge, 
      startDate, 
      endDate, 
      fromTime, 
      toTime, 
      location, 
      priority,
      studentEmails 
    } = slotData;

    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();

      // Insert into slots table
      const [slotResult] = await connection.query(
        `INSERT INTO slots 
        (skill_name, faculty_incharge, start_date, end_date, from_time, to_time, location, priority, status) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'Available')`,
        [skillName, facultyIncharge, startDate, endDate, fromTime, toTime, location, priority]
      );

      const slotId = slotResult.insertId;

      // Insert into slot_students table
      if (studentEmails && studentEmails.length > 0) {
        const studentValues = studentEmails.map(email => [slotId, email]);
        await connection.query(
          `INSERT INTO slot_students (slot_id, student_email) VALUES ?`,
          [studentValues]
        );
      }

      await connection.commit();
      return slotId;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  static async getAll() {
    const [rows] = await db.query(`
      SELECT s.*, GROUP_CONCAT(ss.student_email) AS students 
      FROM slots s
      LEFT JOIN slot_students ss ON s.id = ss.slot_id
      GROUP BY s.id
    `);
    return rows;
  }

  static async findByStudentEmail(email, skills) {
    // Convert skills to array if it's a string
    const skillsArray = typeof skills === 'string' ? [skills] : skills;
    
    const [rows] = await db.query(`
      SELECT s.* 
      FROM slots s
      JOIN slot_students ss ON s.id = ss.slot_id
      WHERE ss.student_email = ? 
      AND s.skill_name IN (?)
      AND s.status = 'Available'
    `, [email, skillsArray]);
    return rows;
  }

  static async bookSlot(slotId, studentEmail) {
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();
      
      // 1. Check if slot exists and is available
      const [slots] = await connection.query(
        `SELECT * FROM slots 
         WHERE id = ? 
         AND status = 'Available'
         FOR UPDATE`, // Lock the row for update
        [slotId]
      );
      
      if (slots.length === 0) {
        await connection.rollback();
        return { success: false, message: 'Slot not available' };
      }

      // 2. Verify student is assigned to this slot
      const [assignments] = await connection.query(
        `SELECT * FROM slot_students 
         WHERE slot_id = ? 
         AND student_email = ?`,
        [slotId, studentEmail]
      );
  
      if (assignments.length === 0) {
        await connection.rollback();
        return { success: false, message: 'Student not assigned to this slot' };
      }

      // 3. Update slot status
      const [result] = await connection.query(
        `UPDATE slots SET status = 'Booked' 
         WHERE id = ?`,
        [slotId]
      );

      if (result.affectedRows === 0) {
        await connection.rollback();
        return { success: false, message: 'Failed to book slot' };
      }

      await connection.commit();
      return { success: true, message: 'Slot booked successfully' };
    } catch (error) {
      await connection.rollback();
      console.error('Error booking slot:', error);
      throw error;
    } finally {
      connection.release();
    }
  }

  static async getBookedSlots(studentEmail) {
    const [rows] = await db.query(`
      SELECT s.* 
      FROM slots s
      JOIN slot_students ss ON s.id = ss.slot_id
      WHERE ss.student_email = ? 
      AND s.status = 'Booked'
    `, [studentEmail]);
    return rows;
  }
  static async findBookedByStudent(email) {
    const [rows] = await db.query(`
      SELECT 
        s.id,
        s.skill_name,
        s.faculty_incharge,
        s.start_date,
        s.end_date,
        s.from_time,
        s.to_time,
        s.location,
        s.status,
        s.created_at,
        ss.student_email
      FROM slots s
      JOIN slot_students ss ON s.id = ss.slot_id
      WHERE ss.student_email = ?
      AND s.status = 'Booked'
      ORDER BY s.start_date, s.from_time
    `, [email]);
    return rows;
  }

  }



module.exports = Slot;