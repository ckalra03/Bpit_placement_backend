const mongoose = require('mongoose');

const selectionProcessSchema = new mongoose.Schema({
  roundNumber: {
    type: Number,
    required: true,
    min: 1
  },
  roundType: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  duration: {
    type: Number,
    min: 0
  }
});

const packageSchema = new mongoose.Schema({
  currency: {
    type: String,
    default: 'INR',
    trim: true
  },
  minSalary: {
    type: Number,
    min: 0
  },
  maxSalary: {
    type: Number,
    min: 0
  },
  salaryPeriod: {
    type: String,
    enum: ['annual', 'monthly'],
    default: 'annual',
    trim: true
  }
});

const eligibilityCriteriaSchema = new mongoose.Schema({
  departments: {
    type: [String],
    default: []
  },
  minCGPA: {
    type: Number,
    min: 0,
    max: 10
  },
  backlogs: {
    type: Number,
    default: 0,
    min: 0
  },
  batch: {
    type: [String],
    default: []
  },
  gender: {
    type: String,
    enum: ['All', 'Male', 'Female'],
    default: 'All'
  }
});

const jobPostingSchema = new mongoose.Schema({
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Recruiter',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  jobType: {
    type: String,
    enum: ['Full-time', 'Internship', 'Part-time'],
    required: true
  },
  positions: {
    type: Number,
    required: true,
    min: 1
  },
  location: {
    type: String,
    required: true,
    trim: true
  },
  workMode: {
    type: String,
    enum: ['Remote', 'Onsite', 'Hybrid'],
    required: true
  },
  skills: {
    type: [String],
    required: true,
    default: []
  },
  qualifications: {
    type: [String],
    default: []
  },
  responsibilities: {
    type: [String],
    default: []
  },
  package: packageSchema,
  perks: {
    type: [String],
    default: []
  },
  eligibilityCriteria: eligibilityCriteriaSchema,
  applicationDeadline: {
    type: Date,
    required: true
  },
  tentativeDriveDate: {
    type: Date
  },
  selectionProcess: {
    type: [selectionProcessSchema],
    default: []
  },
  documents: {
    type: [String],
    default: []
  },
  additionalNotes: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['draft', 'pending_approval', 'approved', 'active', 'closed', 'cancelled'],
    default: 'draft'
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PlacementOfficer'
  },
  approvedDate: {
    type: Date
  },
  isActive: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

const JobPosting = mongoose.model('JobPosting', jobPostingSchema);
module.exports = JobPosting;
