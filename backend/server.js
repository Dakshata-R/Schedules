const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./config/db'); // Ensure this is correctly pointing to db.js
const path = require('path');

const app = express();

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files if needed
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/uploads_academic', express.static(path.join(__dirname, 'uploads_academic')));

// Import existing routes
const personalRoutes = require('./routes/personalRoutes');
app.use('/api', personalRoutes);

const academicRoutes = require('./routes/academicRoutes');
app.use('/api', academicRoutes);

const communicationRoutes = require('./routes/communicationRoutes');
app.use('/api', communicationRoutes);

const advisorRoutes = require('./routes/advisorRoutes');
app.use('/api', advisorRoutes);

const healthRoutes = require('./routes/healthRoutes');
app.use('/api', healthRoutes);

const additionalRoutes = require('./routes/additionalRoutes');
app.use('/api', additionalRoutes);

app._router.stack.forEach((r) => {
    if (r.route && r.route.path) {
        console.log(r.route.path);
    }
});

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
