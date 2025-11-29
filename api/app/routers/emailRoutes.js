const express = require('express');
const multer = require('multer');
const emailController = require('../controllers/emailController');

const router = express.Router();

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedMimes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel',
      'text/csv'
    ];
    
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only Excel and CSV files are allowed.'));
    }
  }
});

// Test SMTP connection
router.post('/test-connection', emailController.testSMTPConnection);

// Upload Excel file to extract emails
router.post('/upload-excel', upload.single('file'), emailController.uploadExcelFile);

// Send emails
router.post('/send', emailController.sendEmails);

module.exports = router;


