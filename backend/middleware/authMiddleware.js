const jwt = require('jsonwebtoken');
const pool = require('../config/db');

exports.protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route'
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // For admin (since admin is not in the database)
    if (decoded.id === 0 && decoded.role === 'admin') {
      req.user = {
        id: 0,
        role: 'admin'
      };
      return next();
    }

    const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [decoded.id]);
    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    req.user = {
      id: rows[0].id,
      email: rows[0].email,
      role: decoded.role
    };

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route'
    });
  }
};

exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role ${req.user.role} is not authorized to access this route`
      });
    }
    next();
  };
};