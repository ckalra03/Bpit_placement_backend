const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../Middleware/authMiddleware');
const {
  applyForJob,
  getApplicationsByStudent,
  getApplicationsByJob,
  updateApplicationStatus
} = require('../Controllers/applicationController');

// Apply for a job (Student only)
router.post('/apply', authMiddleware, applyForJob);

// Get applications of a student
router.get('/:studentId', authMiddleware, getApplicationsByStudent);

// Get all applications for a specific job
router.get('/job/:jobId', authMiddleware, getApplicationsByJob);

// Update application status (Admin/Recruiter only)
router.put('/update/:id', authMiddleware, updateApplicationStatus);

module.exports = router;
