const multer = require('multer');
const path = require('path');

// Configure Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads'); // Local uploads directory
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname)); // File name with extension
  },
});

// Filter allowed file types
const fileFilter = (req, file, cb) => {
  console.log('🚀 ~ fileFilter ~ file:', file);
  const allowedTypes = [
    'image/jpeg',
    'image/png',
    'video/mp4',
    'audio/mpeg',
    'audio/wav',
    'video/quicktime',
  ];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type'), false);
  }
};

// Multer middleware instance
const upload = multer({
  storage,
  limits: {
    fileSize: 1024 * 1024 * 50, // Limit files to 50 MB
  },
  fileFilter,
});

module.exports = upload;
