const SlotBooking = require('../../../models/schedules/template/SlotBooking');

exports.bookSlot = async (req, res) => {
  try {
    const { slotId, studentEmail, startTime, endTime } = req.body;
    
    // Convert ISO strings to MySQL format
    const formatForMySQL = (isoString) => {
      const date = new Date(isoString);
      return date.toISOString().slice(0, 19).replace('T', ' ');
    };

    // In a real app, you'd get these from the slot details
    const faculty_name = req.body.faculty_name || "Default Faculty";
    const skill_name = req.body.skill_name || "Default Skill";
    const venue_name = req.body.venue_name || "Default Venue";
    
    const bookingId = await SlotBooking.create({
      slot_id: slotId,
      student_email: studentEmail,
      faculty_name,
      skill_name,
      venue_name,
      start_time: formatForMySQL(startTime),
      end_time: formatForMySQL(endTime)
    });
    
    res.status(201).json({
      success: true,
      message: "Slot booked successfully!",
      data: { bookingId }
    });
  } catch (error) {
    console.error('Error booking slot:', error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to book slot"
    });
  }
};

exports.getStudentBookings = async (req, res) => {
  try {
    const { email } = req.params;
    const bookings = await SlotBooking.getByStudentEmail(email);
    
    res.status(200).json({
      success: true,
      data: { bookings }
    });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch bookings"
    });
  }
};

exports.getAvailableSlots = async (req, res) => {
  try {
    const slots = await SlotBooking.getAvailableSlots();
    
    res.status(200).json({
      success: true,
      data: { slots }
    });
  } catch (error) {
    console.error('Error fetching available slots:', error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch available slots"
    });
  }
};