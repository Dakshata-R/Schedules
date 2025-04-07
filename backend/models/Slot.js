const db = require('../config/db');
const moment = require('moment');

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
      SELECT 
        s.id,
        s.skill_name as skillName,
        s.faculty_incharge as facultyIncharge,
        DATE_FORMAT(s.start_date, '%Y-%m-%d') as startDate,
        DATE_FORMAT(s.end_date, '%Y-%m-%d') as endDate,
        TIME_FORMAT(s.from_time, '%H:%i:%s') as fromTime,
        TIME_FORMAT(s.to_time, '%H:%i:%s') as toTime,
        s.location,
        s.priority,
        s.status,
        GROUP_CONCAT(ss.student_email) AS studentEmails
      FROM slots s
      LEFT JOIN slot_students ss ON s.id = ss.slot_id
      GROUP BY s.id
    `);
    return rows;
  }

  static async findByStudentEmail(email, skills) {
    console.log('Searching slots for:', email, 'with skills:', skills);
    
    const skillsArray = typeof skills === 'string' ? [skills] : skills;
    
    // Convert skills to uppercase for case-insensitive matching
    const upperSkills = skillsArray.map(skill => skill.toUpperCase());
    
    const [rows] = await db.query(`
      SELECT 
        s.id,
        s.skill_name as skillName,
        s.faculty_incharge as facultyIncharge,
        DATE_FORMAT(s.start_date, '%Y-%m-%d') as startDate,
        DATE_FORMAT(s.end_date, '%Y-%m-%d') as endDate,
        TIME_FORMAT(s.from_time, '%H:%i:%s') as fromTime,
        TIME_FORMAT(s.to_time, '%H:%i:%s') as toTime,
        s.location,
        s.priority,
        s.status,
        CASE WHEN s.status = 'Booked' THEN 1 ELSE 0 END as isBooked
      FROM slots s
      JOIN slot_students ss ON s.id = ss.slot_id
      WHERE ss.student_email = ? 
      AND UPPER(s.skill_name) IN (?)
        AND s.status IN ('Available', 'Booked')
      ORDER BY s.start_date, s.from_time
    `, [email, upperSkills]);
    
    console.log('Found slots:', rows);
    return rows;
  }
static async bookSlot(slotId, studentEmail) {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();
    
    // Check if slot exists and is available
    const [slots] = await connection.query(
      `SELECT * FROM slots 
       WHERE id = ? 
       AND status = 'Available'
       FOR UPDATE`,
      [slotId]
    );
    
    if (slots.length === 0) {
      await connection.rollback();
      return { success: false, message: 'Slot not available' };
    }

    // Verify student is assigned to this slot
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

    // Update slot status
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
      SELECT 
        s.id,
        s.skill_name as skillName,
        s.faculty_incharge as facultyIncharge,
        DATE_FORMAT(s.start_date, '%Y-%m-%d') as startDate,
        DATE_FORMAT(s.end_date, '%Y-%m-%d') as endDate,
        TIME_FORMAT(s.from_time, '%H:%i:%s') as fromTime,
        TIME_FORMAT(s.to_time, '%H:%i:%s') as toTime,
        s.location,
        s.status
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
        s.skill_name as skillName,
        s.faculty_incharge as facultyIncharge,
        DATE_FORMAT(s.start_date, '%Y-%m-%d') as startDate,
        DATE_FORMAT(s.end_date, '%Y-%m-%d') as endDate,
        TIME_FORMAT(s.from_time, '%H:%i:%s') as fromTime,
        TIME_FORMAT(s.to_time, '%H:%i:%s') as toTime,
        s.location,
        s.status,
        s.created_at as createdAt,
        ss.student_email as studentEmail
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