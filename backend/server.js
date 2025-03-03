const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const infraRoutes = require('./routes/infraroutes');
const roleRoutes = require('./routes/roleroutes');

const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use('/uploadinfra', express.static('uploadinfra'));

// Routes
app.use(infraRoutes);
app.use(roleRoutes);

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});