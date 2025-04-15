const db = require('../../../config/db');
// In fa_scheduleModel.js
const createFASchedule = async (faData) => {
  try {
    const start_datetime = new Date(`${faData.start_date}T${faData.start_time}`).toISOString();

    // First insert the FA schedule
    const [result] = await db.query(
      `INSERT INTO fa_schedules 
      (fa_type, priority, start_date, start_time, duration, duration_unit, year, department, course_code, syllabus_topic, mode, venues, faculties, created_by) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        faData.fa_type,
        faData.priority,
        faData.start_date,
        faData.start_time,
        faData.duration,
        faData.duration_unit,
        faData.year,
        faData.department,
        faData.course_code,
        faData.syllabus_topic,
        faData.mode,
        faData.venues,
        faData.faculties,
        faData.created_by,
      ]
    );

    const scheduleId = result.insertId;
    const end_datetime = new Date(new Date(start_datetime).getTime() + 
      (faData.duration_unit === 'Hours' ? faData.duration * 60 * 60 * 1000 : faData.duration * 60 * 1000));

    // Schedule for each faculty
    const faculties = JSON.parse(faData.faculties);
    for (const faculty of faculties) {
      const [facultyData] = await db.query(
        `SELECT email FROM faculty WHERE first_name = ?`,
        [faculty.name]
      );
      
      if (facultyData.length > 0) {
        const facultyEmail = facultyData[0].email;
        await db.query(
          `INSERT INTO faculty_schedules 
          (faculty_email, schedule_id, start_datetime, end_datetime, status) 
          VALUES (?, ?, ?, ?, 'Scheduled')`,
          [facultyEmail, scheduleId, start_datetime, end_datetime]
        );
      }
    }

    // Schedule for students in the same year and department
    const [students] = await db.query(
      `SELECT email FROM students 
       WHERE year = ? AND department = ?`,
      [faData.year, faData.department]
    );

    for (const student of students) {
      await db.query(
        `INSERT INTO student_schedules 
        (student_email, schedule_id, start_datetime, end_datetime, status) 
        VALUES (?, ?, ?, ?, 'Scheduled')`,
        [student.email, scheduleId, start_datetime, end_datetime]
      );
    }

    return result;
  } catch (error) {
    console.error("Error creating FA schedule:", error);
    throw error;
  }
};
const getFASchedulesByEmail = async (email) => {
  const [rows] = await db.query(
    `SELECT * FROM fa_schedules WHERE created_by = ?`,
    [email]
  );
  return rows;
};


module.exports = {
  createFASchedule,
  getFASchedulesByEmail
};