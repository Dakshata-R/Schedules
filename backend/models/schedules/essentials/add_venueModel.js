const pool = require('../../../config/db');

const venueModel = {
  getAllVenues: async () => {
    try {
      const [rows] = await pool.query('SELECT * FROM venues');
      return rows;
    } catch (error) {
      console.error('Error in venueModel.getAllVenues:', error);
      throw error;
    }
  },

  checkAvailability: async (venueId, startDateTime, endDateTime) => {
    try {
      const requestedStart = new Date(startDateTime);
      const requestedEnd = new Date(endDateTime);
      const venueIdNum = parseInt(venueId);
  
      console.log('\n=== VENUE AVAILABILITY CHECK ===');
      console.log(`Checking venue ${venueIdNum} from ${requestedStart} to ${requestedEnd}`);
  
      // Step 1: Get all schedules
      const [allSchedules] = await pool.query(
        'SELECT id, template_name, start_datetime, end_datetime, venues FROM slot_schedules'
      );
  
      // Step 2: Filter schedules that contain the venue (match by ID)
      const schedulesWithThisVenue = [];
      for (const schedule of allSchedules) {
        try {
          const parsedVenues = typeof schedule.venues === 'string' ? JSON.parse(schedule.venues) : schedule.venues;
  
          const hasVenue = parsedVenues.some(v => parseInt(v.id) === venueIdNum);
          if (hasVenue) {
            console.log(`✅ Venue ${venueIdNum} found in schedule ID ${schedule.id}`);
            schedulesWithThisVenue.push(schedule);
          }
        } catch (err) {
          console.error(`❌ Failed to parse venues in schedule ID ${schedule.id}:`, schedule.venues);
          console.error(err.message);
        }
      }
  
      console.log(`\n✅ Total schedules that include venue ${venueIdNum}: ${schedulesWithThisVenue.length}`);
      schedulesWithThisVenue.forEach(s => {
        console.log(`- ID: ${s.id}, Template: ${s.template_name}, Start: ${s.start_datetime}, End: ${s.end_datetime}`);
      });
  
      // Step 3: Check which of these schedules have a time conflict
      const conflictingSchedules = schedulesWithThisVenue.filter(schedule => {
        const scheduleStart = new Date(schedule.start_datetime);
        const scheduleEnd = new Date(schedule.end_datetime);
        return scheduleStart < requestedEnd && scheduleEnd > requestedStart;
      });
  
      console.log(`\n⛔ Conflicting schedules (timing overlap): ${conflictingSchedules.length}`);
      conflictingSchedules.forEach(s => {
        console.log(`- ⚠️ Schedule ID ${s.id} from ${s.start_datetime} to ${s.end_datetime}`);
      });
  
      return {
        available: conflictingSchedules.length === 0,
        conflicts: conflictingSchedules.map(s => ({
          id: s.id,
          template_name: s.template_name,
          start_datetime: s.start_datetime,
          end_datetime: s.end_datetime
        }))
      };
    } catch (error) {
      console.error('❌ Error in venue availability check:', error);
      return {
        available: false,
        error: error.message,
        conflicts: []
      };
    }
  }
  

};

module.exports = venueModel;