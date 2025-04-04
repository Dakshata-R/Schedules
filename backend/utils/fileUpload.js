const fs = require('fs');
const path = require('path');

const uploadDir = path.join(__dirname, '../../uploads');

// Ensure upload directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const uploadFile = async (file) => {
  if (!file) return null;
  return `/uploads/${file.filename}`;
};

const deleteFile = async (filePath) => {
  if (!filePath) return;
  
  const fullPath = path.join(__dirname, '../../', filePath);
  if (fs.existsSync(fullPath)) {
    fs.unlinkSync(fullPath);
  }
};

module.exports = {
  uploadFile,
  deleteFile
};