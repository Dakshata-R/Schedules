// backend/controllers/schedules/essentials/student_categoryController.js
const StudentCategory = require('../../../models/schedules/essentials/student_categoryModel');

exports.getStudentYears = async (req, res) => {
  try {
    const years = await StudentCategory.getStudentYears();
    res.status(200).json(years);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching student years' });
  }
};

exports.getStudentsByYear = async (req, res) => {
  try {
    let year = req.params.year;
    
    if (!year) {
      return res.status(400).json({ message: 'Year parameter is required' });
    }

    // Convert "Final Year" to "4" if needed
    if (year === 'Final Year') {
      year = '4';
    }

    const count = await StudentCategory.getStudentCountByYear(year);
    
    let displayYear;
    switch(year) {
      case '1': displayYear = '1st Year'; break;
      case '2': displayYear = '2nd Year'; break;
      case '3': displayYear = '3rd Year'; break;
      case '4': displayYear = 'Final Year'; break;
      case 'All students': displayYear = 'All students'; break;
      default: displayYear = `${year} Year`;
    }

    res.status(200).json({
      year: displayYear,
      count: count
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Error fetching student count',
      error: error.message
    });
  }
};