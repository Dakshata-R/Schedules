const db = require('../../config/db');

class StudentRequest {
  static async create(studentData) {
    const { student_email, student_name, roll_number, department, priority, skills, status } = studentData;
    
    const query = `
      INSERT INTO student_requests 
      (student_email, student_name, roll_number, department, priority, skills, status)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    
    const [result] = await db.execute(query, [
      student_email,
      student_name,
      roll_number,
      department,
      priority,
      JSON.stringify(skills),
      status || 'Pending'
    ]);
    
    return result.insertId;
  }
  static async update(id, updateData) {
    const fields = [];
    const values = [];
    
    for (const [key, value] of Object.entries(updateData)) {
      fields.push(`${key} = ?`);
      values.push(value);
    }
    
    if (fields.length === 0) {
      return 0;
    }
    
    const query = `UPDATE student_requests SET ${fields.join(', ')} WHERE id = ?`;
    const [result] = await db.execute(query, [...values, id]);
    
    return result.affectedRows;
  }
  static async updateStatus(id, status) {
    const query = 'UPDATE student_requests SET status = ? WHERE id = ?';
    const [result] = await db.execute(query, [status, id]);
    return result.affectedRows; // Should return 1 if updated
  }
  static async findByEmail(email) {
    const query = 'SELECT * FROM student_requests WHERE student_email = ? ORDER BY created_at DESC';
    const [rows] = await db.execute(query, [email]);
    return rows;
  }
  static async updateStatusAndSlot(id, status, slotId = null) {
    const query = 'UPDATE student_requests SET status = ?, slot_id = ? WHERE id = ?';
    const [result] = await db.execute(query, [status, slotId, id]);
    return result.affectedRows;
  }
  static async findAll() {
    const query = 'SELECT * FROM student_requests ORDER BY created_at DESC';
    const [rows] = await db.execute(query);
    return rows;
  }
  static async findById(id) {
    const query = 'SELECT * FROM student_requests WHERE id = ?';
    const [rows] = await db.execute(query, [id]);
    return rows[0]; // Returns the first matching request or undefined
  }
  static async deleteById(id) {
    const query = 'DELETE FROM student_requests WHERE id = ?';
    const [result] = await db.execute(query, [id]);
    return result.affectedRows;
  }
  static async updateStatus(id, status) {
    const query = 'UPDATE student_requests SET status = ? WHERE id = ?';
    const [result] = await db.execute(query, [status, id]);
    return result.affectedRows;
  }
}


module.exports = StudentRequest;