const db = require('../../../config/db');
const SlotBooking = require('../../../models/schedules/template/SlotBooking');

exports.bookSlot = async (req, res) => {
    try {
        const { slotId } = req.params;
        const { email, selectedTiming } = req.body;

        // Validate input
        if (!email) {
            return res.status(400).json({ 
                success: false,
                message: "Student email is required"
            });
        }

        // Check if slot exists
        const [slot] = await db.query(
            `SELECT * FROM slot_schedules WHERE id = ?`,
            [slotId]
        );
        
        if (!slot || slot.length === 0) {
            return res.status(404).json({ 
                success: false,
                message: "Slot not found"
            });
        }

        const slotData = slot[0];
        const slotDate = selectedTiming 
  ? new Date(selectedTiming.start).toISOString().split('T')[0] 
  : new Date(slotData.start_datetime).toISOString().split('T')[0];

        // Check if student has already booked this slot
        const [existingBooking] = await db.query(
            `SELECT * FROM slot_bookings 
             WHERE slot_id = ? AND student_email = ? AND status = 'booked'`,
            [slotId, email]
        );

        if (existingBooking && existingBooking.length > 0) {
            return res.status(400).json({ 
                success: false,
                message: "You have already booked this slot"
            });
        }

        // Check capacity for specific timing if provided
        if (selectedTiming) {
            const [timingBookings] = await db.query(
                `SELECT COUNT(*) as count FROM slot_bookings 
                 WHERE slot_id = ? 
                 AND specific_start = ? 
                 AND specific_end = ?
                 AND status = 'booked'`,
                [
                    slotId,
                    new Date(selectedTiming.start),
                    new Date(selectedTiming.end)
                ]
            );

            if (timingBookings[0].count >= 3) {
                return res.status(400).json({ 
                    success: false,
                    message: "This specific timing is already fully booked"
                });
            }
        }

        // Create booking
        const [bookingResult] = await db.query(
            `INSERT INTO slot_bookings SET ?`,
            {
                slot_id: slotId,
                student_email: email,
                booked_date: slotDate,
                booked_time_slot: selectedTiming ? 
                    `${new Date(selectedTiming.start).toLocaleTimeString()} - ${new Date(selectedTiming.end).toLocaleTimeString()}` :
                    `${new Date(slotData.start_datetime).toLocaleTimeString()} - ${new Date(slotData.end_datetime).toLocaleTimeString()}`,
                status: 'booked',
                specific_start: selectedTiming ? new Date(selectedTiming.start) : null,
                specific_end: selectedTiming ? new Date(selectedTiming.end) : null
            }
        );

        // Update slot booked count (general count, not per timing)
        await db.query(
            `UPDATE slot_schedules 
             SET booked_count = booked_count + 1 
             WHERE id = ?`,
            [slotId]
        );

        res.status(201).json({
            success: true,
            message: "Slot booked successfully",
            data: {
                id: bookingResult.insertId,
                ...bookingResult
            }
        });

    } catch (error) {
        console.error("Error booking slot:", error);
        res.status(500).json({ 
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};
exports.getAllBookings = async (req, res) => {
    try {
        const bookings = await SlotBooking.getAllBookings();

        res.status(200).json({
            success: true,
            data: bookings
        });

    } catch (error) {
        console.error("Error fetching all bookings:", error);
        res.status(500).json({ 
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};
exports.getStudentBookings = async (req, res) => {
    try {
        const { studentEmail } = req.params;

        const bookings = await SlotBooking.getStudentBookings(studentEmail);

        res.status(200).json({
            success: true,
            data: bookings
        });

    } catch (error) {
        console.error("Error fetching student bookings:", error);
        res.status(500).json({ 
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};
// New endpoint just for student's bookings
exports.getStudentCalendarBookings = async (req, res) => {
    try {
        const { studentEmail } = req.params;
        const [bookings] = await db.query(`
            SELECT sb.*, ss.template_name, 
                   f.name as faculty_name, 
                   v.name as venue_name
            FROM slot_bookings sb
            JOIN slot_schedules ss ON sb.slot_id = ss.id
            LEFT JOIN slot_faculty sf ON ss.id = sf.slot_id
            LEFT JOIN faculties f ON sf.faculty_id = f.id
            LEFT JOIN slot_venue sv ON ss.id = sv.slot_id
            LEFT JOIN venues v ON sv.venue_id = v.id
            WHERE sb.status = 'booked' 
            AND (sb.student_email = ? OR ss.is_public = true)
            ORDER BY sb.booked_date DESC`,
            [studentEmail]
        );
        res.status(200).json({ success: true, data: bookings });
    } catch (error) {
        // ... error handling
    }
};
// Cancel a booking
exports.cancelBooking = async (req, res) => {
    try {
        const { bookingId } = req.params;
        const { email } = req.body;

        const booking = await SlotBooking.findById(bookingId);
        
        if (!booking) {
            return res.status(404).json({ 
                success: false,
                message: "Booking not found"
            });
        }

        // Verify student owns this booking
        if (booking.student_email !== email) {
            return res.status(403).json({ 
                success: false,
                message: "Unauthorized to cancel this booking"
            });
        }

        // Update booking status
        booking.status = 'cancelled';
        await booking.save();

        // Decrement slot booked count
        await SlotSchedule.findByIdAndUpdate(booking.slot_id, {
            $inc: { booked_count: -1 }
        });

        res.status(200).json({
            success: true,
            message: "Booking cancelled successfully"
        });

    } catch (error) {
        console.error("Error cancelling booking:", error);
        res.status(500).json({ 
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};

// Helper function to format time
function formatTime(dateTime) {
    const date = new Date(dateTime);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}