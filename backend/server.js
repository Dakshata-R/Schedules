const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const infraRoutes = require('./routes/infraroutes');
const roleRoutes = require('./routes/roleroutes');
const personalRoutes = require('./routes/personalRoutes');
const academicRoutes = require('./routes/academicRoutes');
const communicationRoutes = require('./routes/communicationRoutes');
const advisorRoutes = require('./routes/advisorRoutes');
const healthRoutes = require('./routes/healthRoutes'); // 👈 Correct import for healthRoutes
const additionalRoutes = require('./routes/additionalRoutes'); // 👈 Import additionalRoutes
const combinedDataRoutes = require('./routes/combinedDataRoutes');
const authRoutes = require("./routes/loginroutes");

const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); // 👈 Add this for form data
app.use('/uploads_additional', express.static(path.join(__dirname, 'uploads_additional'))); // 👈 Serve static files for additional uploads

// Routes
app.use(infraRoutes);
app.use(roleRoutes);
app.use('/api', personalRoutes);
app.use('/api', academicRoutes);
app.use('/api', communicationRoutes);
app.use('/api', advisorRoutes);
app.use('/api', healthRoutes); // 👈 Use healthRoutes
app.use('/api', additionalRoutes); 
app.use('/api', combinedDataRoutes);
app.use("/api/auth", authRoutes);
// 👈 Use additionalRoutes

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});