const Application = require('../Models/applicationModel');
const JobPosting = require('../Models/jobPostingModel');
const Student = require('../Models/studentModel');
const mongoose = require('mongoose');

// POST /api/applications/apply
const applyForJob = async (req, res) => {
  try {
    const { jobId, resume } = req.body;
    const studentId = req.user.userId;

    if (!jobId || !resume) {
      return res.status(400).json({ message: 'Job ID and resume are required' });
    }

    const job = await JobPosting.findById(jobId);
    if (!job) return res.status(404).json({ message: 'Job not found' });

    if (job.status !== "active") {
      return res.status(400).json({ message: 'Job is not open for applications' });
    }

    const existingApplication = await Application.findOne({ jobId, studentId });
    if (existingApplication) {
      return res.status(400).json({ message: 'Already applied for this job' });
    }

    const application = new Application({
      jobId,
      studentId,
      resume
    });

    await application.save();
    res.status(201).json({ message: 'Application submitted', application });

  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};


// GET /api/applications/:studentId
const getApplicationsByStudent = async (req, res) => {
  try {
    const { studentId } = req.params;

    const applications = await Application.find({ studentId })
      .populate('jobId', 'title companyName')  // modify as per your JobPosting fields
      .sort({ createdAt: -1 });

    res.status(200).json(applications);

  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// GET /api/applications/job/:jobId
const getApplicationsByJob = async (req, res) => {
  try {
    const { jobId } = req.params;

    const applications = await Application.find({ jobId })
      .populate('studentId', 'name email rollNumber') // modify based on Student fields
      .sort({ createdAt: -1 });

    res.status(200).json(applications);

  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// PUT /api/applications/update/:id
const updateApplicationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, remarks } = req.body;

    const application = await Application.findById(id);
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    application.status = status;
    application.statusHistory.push({
      status,
      updatedBy: req.user._id,
      remarks
    });

    await application.save();
    res.status(200).json({ message: 'Application status updated', application });

  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = {
  applyForJob,
  getApplicationsByStudent,
  getApplicationsByJob,
  updateApplicationStatus
};
