// backend/routes/studentRoutes.js
const express = require('express');
const router = express.Router();
const studentController = require('../../controllers/student_requests/studentController');
router.get('/', studentController.getStudentByEmail);
router.get('/booked-slots/:email', async (req, res) => {
    try {
      const { email } = req.params;
      
      // Find all slots booked by this student
      const bookedSlots = await Slot.findAll({
        where: {
          booked_by: email,
          isBooked: true
        },
        include: [
          {
            model: Request,
            as: 'request',
            attributes: ['student_name', 'roll_number', 'department']
          }
        ]
      });
  
      // Format the response
      const formattedSlots = bookedSlots.map(slot => ({
        id: slot.id,
        title: slot.skill_name || 'Booked Slot',
        faculty: slot.faculty_incharge,
        start: new Date(`${slot.start_date}T${slot.from_time}`),
        end: new Date(`${slot.end_date}T${slot.to_time}`),
        location: slot.location,
        color: '#4CAF50', // Green color for booked slots
        borderColor: '#2E7D32',
        requestDetails: slot.request
      }));
  
      res.json(formattedSlots);
    } catch (error) {
      console.error('Error fetching booked slots:', error);
      res.status(500).json({ message: 'Failed to fetch booked slots' });
    }
  });
  // Add this to slotRoutes.js
module.exports = router;