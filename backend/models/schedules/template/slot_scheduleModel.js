// models/schedules/template/slot_scheduleModel.js
const db = require('../../../config/db');

class SlotSchedule {
  static async create(data) {
    try {
      const [result] = await db.query(
        `INSERT INTO slot_schedules SET ?`,
        data
      );
      return result;
    } catch (err) {
      throw err;
    }
  }

  // Add other model methods as needed
}

module.exports = SlotSchedule;