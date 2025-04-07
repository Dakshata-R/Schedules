require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const fs = require('fs');
process.env.TZ = 'Asia/Kolkata';
const errorHandler = require('./middleware/errorHandler');

// Import routes
const authRoutes = require('./routes/login/authRoutes');
const personalRoutes = require('./routes/user/personalRoutes');
const academicRoutes = require('./routes/user/academicRoutes');
const communicationRoutes = require('./routes/user/communicationRoutes');
const advisorRoutes = require('./routes/user/advisorRoutes');
const healthRoutes = require('./routes/user/healthRoutes');
const additionalRoutes = require('./routes/user/additionalRoutes');
const combinedDataRoutes = require('./routes/user/combinedDataRoutes');
const roleRoutes = require('./routes/role/roleroutes');
const infraRoutes = require('./routes/infraroutes');
const studentRoutes = require('./routes/student_request/studentRoutes');
const studentRequestRoutes = require('./routes/student_request/studentRequestRoutes');
const FacultyRoutes = require('./routes/student_request/facultyRoutes');
const facultyRoutes = require('./routes/schedules/essentials/add_facultyRoutes');
const slotRoutes = require('./routes/slotRoutes');
const venueRoutes = require('./routes/schedules/essentials/add_venueRoutes');
const studentCategoryRoutes = require('./routes/schedules/essentials/student_categoryRoutes');
const slotScheduleRoutes = require('./routes/schedules/template/slot_scheduleRoutes');
const app = express();

// ======================
// 1. Directory Setup
// ======================
const uploadDirs = [
  path.join(__dirname, 'uploads_additional'),
  path.join(__dirname, 'uploads_health')
];

// Create upload directories if they don't exist
uploadDirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`Created directory: ${dir}`);
  }
});

// ======================
// 2. Middleware
// ======================
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Serve static files
app.use('/uploads_additional', express.static(uploadDirs[0]));
app.use('/uploads_health', express.static(uploadDirs[1]));

// ======================
// 3. Routes
// ======================
app.use('/api/auth', authRoutes);
app.use('/api', personalRoutes);
app.use('/api', academicRoutes);
app.use('/api', communicationRoutes);
app.use('/api', advisorRoutes);
app.use('/api', healthRoutes);
app.use('/api', additionalRoutes);
app.use('/api', combinedDataRoutes);
app.use(roleRoutes);
app.use(infraRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/requests', studentRequestRoutes);
app.use('/api/student-requests', studentRequestRoutes);
// In your main Express app file
app.use('/', FacultyRoutes);
app.use('/api/faculties', facultyRoutes); 
app.use('/api/slots', slotRoutes);
app.use('/api/venues', venueRoutes);
app.use('/api/student-categories', studentCategoryRoutes);
app.use('/api/slot-schedules', slotScheduleRoutes);

// ======================
// 4. Error Handling
// ======================
app.use(errorHandler);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('Upload directories:');
  uploadDirs.forEach(dir => console.log(`- ${dir}`));
});