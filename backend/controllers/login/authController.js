const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../../models/login/User');
const Faculty = require('../../models/login/Faculty');
const Student = require('../../models/login/Student');
const { ADMIN_CREDENTIALS } = require('../../utils/constants');

const generateToken = (userId, role) => {
  return jwt.sign({ id: userId, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Check admin credentials
    if (Array.isArray(ADMIN_CREDENTIALS)) {
      const adminUser = ADMIN_CREDENTIALS.find(admin => admin.email === email);
      if (adminUser) {
        if (adminUser.password === password) {
          const token = generateToken(0, 'admin');
          return res.status(200).json({ success: true, token, role: 'admin', message: 'Admin logged in successfully' });
        } else {
          return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }
      }
    }

    // Check if user exists in the database
    const user = await User.findByEmail(email);

    if (!user) {
      // Check if email exists in faculty or student tables
      const faculty = await Faculty.findByEmail(email);
      const student = await Student.findByEmail(email);

      if (!faculty && !student) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      // First-time login - create user account
      const roleId = faculty ? 2 : 3; // 2 for faculty, 3 for student
      const username = email.split('@')[0];
      const userId = await User.create({ username, email, password, role_id: roleId });

      // Update faculty or student table with user_id
      if (faculty) {
        await Faculty.createUserFromFaculty(faculty.id, userId);
      } else {
        await Student.createUserFromStudent(student.id, userId);
      }

      const role = faculty ? 'faculty' : 'student';
      const token = generateToken(userId, role);

      return res.status(200).json({ success: true, token, role, message: 'First-time login successful' });
    }

    // Existing user - verify password
    const isMatch = await User.comparePassword(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Get user role
    const userWithRole = await User.findUserWithRole(email);
    if (!userWithRole) {
      return res.status(500).json({ success: false, message: 'Error retrieving user role' });
    }

    const token = generateToken(user.id, userWithRole.role_name);

    res.status(200).json({ success: true, token, role: userWithRole.role_name, message: 'Logged in successfully' });
  } catch (error) {
    next(error);
  }
};

exports.getUserRole = async (req, res, next) => {
  try {
    const user = await User.findUserWithRole(req.user.email);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({ success: true, role: user.role_name });
  } catch (error) {
    next(error);
  }
};
