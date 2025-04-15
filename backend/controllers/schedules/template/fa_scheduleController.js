const faScheduleModel = require('../../../models/schedules/template/fa_scheduleModel');

const db = require('../../../config/db');

const getSchedulesByFacultyEmail = async (req, res) => {
  try {
    const { email } = req.params;

    const [schedules] = await db.query(
      `SELECT * FROM fa_schedules 
       WHERE created_by = ?
       ORDER BY start_date, start_time`,
      [email]
    );

    const processedSchedules = schedules.map(schedule => {
      const startDateTime = schedule.start_datetime
        ? new Date(schedule.start_datetime)
        : new Date(`${schedule.start_date}T${schedule.start_time}`);

      const duration = parseInt(schedule.duration);
      const endDateTime = new Date(startDateTime.getTime() + (schedule.duration_unit === 'Hours'
        ? duration * 60 * 60 * 1000
        : duration * 60 * 1000));
      
      let venues = [];
      try {
        venues = JSON.parse(schedule.venues);
      } catch (e) {}

      return {
        ...schedule,
        template_name: schedule.fa_type || 'FA Schedule',
        start_datetime: startDateTime,
        end_datetime: endDateTime,
        booked_date: schedule.start_date,
        booked_time_slot: `${startDateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${endDateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
        faculty_name: email,
        venue_name: Array.isArray(venues)
          ? venues.map(v => v.name).join(', ')
          : 'Location not specified',
        students: [],
      };
    });

    res.status(200).json({
      status: 'success',
      data: {
        schedules: processedSchedules
      }
    });
  } catch (err) {
    console.error("Error fetching FA schedules by faculty email:", err);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

const createFASchedule = async (req, res) => {
    try {
      const faData = req.body;
      // Ensure created_by is passed from the frontend or use session/authentication data
      if (!faData.created_by) {
        return res.status(400).json({
          success: false,
          message: "Faculty email (created_by) is required.",
        });
      }
  
      const result = await faScheduleModel.createFASchedule(faData);
      res.status(201).json({
        success: true,
        data: result,
        message: "FA schedule created successfully",
      });
    } catch (error) {
      console.error("Error in createFASchedule:", error);
      res.status(500).json({
        success: false,
        message: "Failed to create FA schedule",
        error: error.message,
      });
    }
  };
const getFASchedulesByEmail = async (req, res) => {
    try {
      const { email } = req.query;
      const schedules = await faScheduleModel.getFASchedulesByEmail(email);
      res.status(200).json({
        success: true,
        data: { schedules },
        message: 'FA schedules fetched successfully'
      });
    } catch (error) {
      console.error('Error in getFASchedulesByEmail:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch FA schedules',
        error: error.message
      });
    }
  };
  const getFASchedulesForStudent = async (req, res) => {
    try {
      const { email } = req.params;
      
      const [studentRows] = await db.query(
        `SELECT year, department FROM students WHERE email = ?`,
        [email]
      );
  
      if (!studentRows.length) {
        return res.status(404).json({ success: false, message: 'Student not found' });
      }
  
      const { year, department } = studentRows[0];
  
      const [schedules] = await db.query(
        `SELECT * FROM fa_schedules 
         WHERE year = ? AND department = ?
         ORDER BY start_date, start_time`,
        [year, department]
      );
  
      const processedSchedules = schedules.map(schedule => {
        const startDateTime = schedule.start_datetime
          ? new Date(schedule.start_datetime)
          : new Date(`${schedule.start_date}T${schedule.start_time}`);
  
        const duration = parseInt(schedule.duration);
        const endDateTime = new Date(startDateTime.getTime() + (schedule.duration_unit === 'Hours'
          ? duration * 60 * 60 * 1000
          : duration * 60 * 1000));
  
        let venues = [];
        try {
          venues = JSON.parse(schedule.venues);
        } catch (e) {}
  
        return {
          title: schedule.fa_type || 'FA Schedule',
          start: startDateTime,
          end: endDateTime,
          faculty: schedule.faculties,
          location: Array.isArray(venues) ? venues.map(v => v.name).join(', ') : 'N/A',
          slotData: schedule
        };
      });
  
      res.status(200).json({
        success: true,
        data: processedSchedules
      });
    } catch (error) {
      console.error("Error in getFASchedulesForStudent:", error);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  };
  
  
  module.exports = {
    getSchedulesByFacultyEmail,
  createFASchedule,
  getFASchedulesByEmail,
  getFASchedulesForStudent

  };
  