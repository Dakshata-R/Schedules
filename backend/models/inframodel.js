const pool = require('../config/db');
class Infrastructure {
  static async create(infraData) {
    const {
      unique_id, venue_name, location, priority, primary_purpose, responsible_persons,
      capacity, floor, maintenance_frequency, usage_frequency, ventilation_type, accessibility_options,
      facilities, selected_facilities, assigned_users // Removed access_to_roles
    } = infraData;
  
    const [result] = await pool.execute(
      `INSERT INTO infrastructure (
        unique_id, venue_name, location, priority, primary_purpose, responsible_persons,
        capacity, floor, maintenance_frequency, usage_frequency, ventilation_type, accessibility_options,
        facilities, selected_facilities, assigned_users
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        unique_id, 
        venue_name, 
        location, 
        priority, 
        primary_purpose, 
        JSON.stringify(responsible_persons || []),
        capacity, 
        floor, 
        JSON.stringify(maintenance_frequency || []), 
        JSON.stringify(usage_frequency || []), 
        ventilation_type, 
        JSON.stringify(accessibility_options || []),
        JSON.stringify(facilities || []), 
        JSON.stringify(selected_facilities || []), 
        JSON.stringify(assigned_users || [])
      ]
    );
    return result.insertId;
  }

  static async getAll() {
    const [rows] = await pool.execute('SELECT * FROM infrastructure');
    return rows.map(row => {
      try {
        return {
          ...row,
          responsible_persons: row.responsible_persons ? JSON.parse(row.responsible_persons) : [],
          maintenance_frequency: row.maintenance_frequency ? JSON.parse(row.maintenance_frequency) : [],
          usage_frequency: row.usage_frequency ? JSON.parse(row.usage_frequency) : [],
          accessibility_options: row.accessibility_options ? JSON.parse(row.accessibility_options) : [],
          facilities: row.facilities ? JSON.parse(row.facilities) : [],
          selected_facilities: row.selected_facilities ? JSON.parse(row.selected_facilities) : [],
          assigned_users: row.assigned_users ? JSON.parse(row.assigned_users) : []
        };
      } catch (error) {
        console.error('Error parsing row data:', error);
        return {
          ...row,
          responsible_persons: [],
          maintenance_frequency: [],
          usage_frequency: [],
          accessibility_options: [],
          facilities: [],
          selected_facilities: [],
          assigned_users: []
        };
      }
    });
  }

  static async getById(id) {
    const [rows] = await pool.execute('SELECT * FROM infrastructure WHERE id = ?', [id]);
    if (rows.length === 0) return null;
    
    const row = rows[0];
    try {
      return {
        ...row,
        responsible_persons: row.responsible_persons ? JSON.parse(row.responsible_persons) : [],
        maintenance_frequency: row.maintenance_frequency ? JSON.parse(row.maintenance_frequency) : [],
        usage_frequency: row.usage_frequency ? JSON.parse(row.usage_frequency) : [],
        accessibility_options: row.accessibility_options ? JSON.parse(row.accessibility_options) : [],
        facilities: row.facilities ? JSON.parse(row.facilities) : [],
        selected_facilities: row.selected_facilities ? JSON.parse(row.selected_facilities) : [],
        assigned_users: row.assigned_users ? JSON.parse(row.assigned_users) : []
      };
    } catch (error) {
      console.error('Error parsing row data:', error);
      return {
        ...row,
        responsible_persons: [],
        maintenance_frequency: [],
        usage_frequency: [],
        accessibility_options: [],
        facilities: [],
        selected_facilities: [],
        assigned_users: []
      };
    }
  }

  static async deleteByUniqueId(uniqueId) {
    const [result] = await pool.execute('DELETE FROM infrastructure WHERE unique_id = ?', [uniqueId]);
    return result.affectedRows;
  }
}

module.exports = Infrastructure;