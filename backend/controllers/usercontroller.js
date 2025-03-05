const express = require('express');
const router = express.Router();
const personalController = require('../controllers/personalcontroller');
const communicationController = require('../controllers/communicationController');
const advisorController = require('../controllers/advisorController');

// Route to fetch combined data
router.get('/fetch-data', async (req, res) => {
  try {
    // Fetch personal details
    const personalDetails = await new Promise((resolve, reject) => {
      personalController.getPersonalDetails(req, { json: resolve }, reject);
    });
    console.log("Personal Details:", personalDetails);

    // Fetch communication details
    const communicationDetails = await new Promise((resolve, reject) => {
      communicationController.getCommunicationDetails(req, { json: resolve }, reject);
    });
    console.log("Communication Details:", communicationDetails);

    // Fetch advisor details
    const advisorDetails = await new Promise((resolve, reject) => {
      advisorController.getAdvisors(req, { json: resolve }, reject);
    });
    console.log("Advisor Details:", advisorDetails);

    // Combine the data
    const combinedData = personalDetails.map((personal, index) => ({
      userId: personal.studentId,
      username: personal.name,
      dob: personal.dob,
      bloodGroup: personal.bloodGroup,
      contactNumber1: communicationDetails[index]?.mobile1 || 'N/A',
      classAdvisor: advisorDetails[index]?.advisor_name || 'N/A',
    }));

    console.log("Combined Data:", combinedData);
    res.status(200).json(combinedData);
  } catch (error) {
    console.error('Error fetching combined data:', error);
    res.status(500).json({ message: 'Error fetching data' });
  }
});
module.exports = router;