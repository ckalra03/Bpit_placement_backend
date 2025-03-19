const mongoose = require('mongoose');

const statusHistorySchema = new mongoose.Schema({
  status: {
    type: String,
    required: true,
    trim: true
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  remarks: {
    type: String,
    trim: true
  }
});

const interviewStatusSchema = new mongoose.Schema({
  roundNumber: {
    type: Number,
    required: true,
    min: 1
  },
  status: {
    type: String,
    enum: ['pending', 'passed', 'failed'],
    default: 'pending',
    trim: true
  },
  score: {
    type: Number,
    min: 0
  },
  feedback: {
    type: String,
    trim: true
  },
  interviewDate: {
    type: Date
  },
  interviewTime: {
    type: String,
    trim: true
  },
  interviewLocation: {
    type: String,
    trim: true
  },
  interviewMode: {
    type: String,
    enum: ['online', 'in-person'],
    trim: true
  },
  interviewLink: {
    type: String,
    trim: true
  },
  interviewers: {
    type: [String],
    default: []
  }
});

const offerDetailsSchema = new mongoose.Schema({
  offerDate: {
    type: Date
  },
  joiningDate: {
    type: Date
  },
  package: {
    type: Number,
    min: 0
  },
  position: {
    type: String,
    trim: true
  },
  offerLetterUrl: {
    type: String,
    trim: true
  },
  offerAccepted: {
    type: Boolean,
    default: false
  },
  acceptedDate: {
    type: Date
  }
});

const applicationSchema = new mongoose.Schema({
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'JobPosting',
    required: true
  },
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  resume: {
    type: String,
    required: true,
    trim: true
  },
  appliedDate: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['applied', 'shortlisted', 'rejected', 'interview_scheduled', 'selected', 'not_selected'],
    default: 'applied',
    trim: true
  },
  statusHistory: {
    type: [statusHistorySchema],
    default: []
  },
  selectedForRound: {
    type: Number,
    default: 0,
    min: 0
  },
  interviewStatus: {
    type: [interviewStatusSchema],
    default: []
  },
  offerDetails: offerDetailsSchema
}, {
  timestamps: true
});

// Compound index to ensure a student can apply only once for a job
applicationSchema.index({ jobId: 1, studentId: 1 }, { unique: true });

const Application = mongoose.model('Application', applicationSchema);
module.exports = Application;
