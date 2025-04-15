const Infrastructure = require('../models/inframodel');
const Venue = require('../models/venuemodel');

exports.saveInfrastructure = async (req, res) => {
  try {
    // Extract all fields from the request
    const infraData = {
      unique_id: req.body.unique_id,
      venue_name: req.body.venue_name,
      location: req.body.location,
      priority: req.body.priority,
      primary_purpose: req.body.primary_purpose,
      responsible_persons: req.body.responsible_persons,
      capacity: req.body.capacity,
      floor: req.body.floor,
      maintenance_frequency: req.body.maintenance_frequency,
      usage_frequency: req.body.usage_frequency,
      ventilation_type: req.body.ventilation_type,
      accessibility_options: req.body.accessibility_options,
      facilities: req.body.facilities,
      selected_facilities: req.body.selected_facilities,
      assigned_users: req.body.assigned_users,
      image: req.file ? req.file.buffer.toString('base64') : null
    };

    // Validate required fields
    if (!infraData.unique_id || !infraData.venue_name || !infraData.location) {
      return res.status(400).json({ 
        success: false, 
        error: 'Missing required fields' 
      });
    }

    // Save infrastructure data
    const id = await Infrastructure.create(infraData);
    
    // Determine venue type based on venue_name
    let venueType = 'Seminar Hall'; // default
    const venueNameLower = infraData.venue_name.toLowerCase();
    
    if (venueNameLower.includes('lab')) {
      venueType = 'Lab';
    } else if (venueNameLower.includes('conference') || venueNameLower.includes('meeting')) {
      venueType = 'Conference Room';
    } else if (venueNameLower.includes('auditorium')) {
      venueType = 'Auditorium';
    }

    // Save to venues table without unique_id
    await Venue.create({
      venue_name: infraData.venue_name,
      capacity: infraData.capacity,
      type: venueType
    });

    res.status(201).json({ success: true, id });
  } catch (error) {
    console.error('Error saving infrastructure:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to save infrastructure',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

exports.getAllInfrastructure = async (req, res) => {
  try {
    const infraList = await Infrastructure.getAll();
    res.status(200).json({ success: true, data: infraList });
  } catch (error) {
    console.error('Error fetching infrastructure:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch infrastructure',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

exports.deleteInfrastructure = async (req, res) => {
  try {
    const { uniqueId } = req.params;
    const affectedRows = await Infrastructure.deleteByUniqueId(uniqueId);
    
    if (affectedRows === 0) {
      return res.status(404).json({ success: false, error: 'Infrastructure not found' });
    }
    
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error deleting infrastructure:', error);
    res.status(500).json({ success: false, error: 'Failed to delete infrastructure' });
  }
};