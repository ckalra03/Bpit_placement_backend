const mongoose = require('mongoose');

const achievementSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  date: { type: Date }
});

const educationSchema = new mongoose.Schema({
  degree: { type: String, required: true },
  institution: { type: String, required: true },
  startDate: { type: Date },
  endDate: { type: Date },
  percentage: { type: Number }
});

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  technologies: { type: [String] },
  startDate: { type: Date },
  endDate: { type: Date },
  link: { type: String }
});

const workExperienceSchema = new mongoose.Schema({
  company: { type: String, required: true },
  position: { type: String, required: true },
  description: { type: String },
  startDate: { type: Date, required: true },
  endDate: { type: Date }
});

const certificationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  issuingOrganization: { type: String, required: true },
  issueDate: { type: Date },
  expiryDate: { type: Date },
  credentialURL: { type: String }
});

const placementHistorySchema = new mongoose.Schema({
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
  offerDate: { type: Date, required: true },
  package: { type: Number, required: true },
  jobType: { type: String, enum: ['full-time', 'internship'], required: true },
  status: { type: String, enum: ['accepted', 'rejected', 'pending'], default: 'pending' }
});

const studentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  enrollmentNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    index: true // Optimized for faster lookups
  },
  department: { type: String, required: true },
  branch: { type: String, required: true },
  batch: { type: String, required: true },
  cgpa: { type: Number, min: 0, max: 10, default: 0 },
  semester: { type: Number, min: 1, max: 8, default: 1 },
  dateOfBirth: { type: Date },
  gender: { type: String, enum: ['Male', 'Female', 'Other'] },
  address: {
    street: { type: String },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
    country: { type: String, required: true }
  },
  skills: { type: [String] },
  resume: {
    url: { type: String },
    lastUpdated: { type: Date, default: Date.now }
  },
  linkedinProfile: {
    type: String,
    validate: {
      validator: function (v) {
        return /^https:\/\/(www\.)?linkedin\.com\/.*$/.test(v);
      },
      message: 'Invalid LinkedIn URL'
    }
  },
  githubProfile: {
    type: String,
    validate: {
      validator: function (v) {
        return /^https:\/\/(www\.)?github\.com\/.*$/.test(v);
      },
      message: 'Invalid GitHub URL'
    }
  },
  portfolioWebsite: {
    type: String,
    validate: {
      validator: function (v) {
        return /^(https?:\/\/)?([\w\d\-_]+\.+[A-Za-z]{2,})+/.test(v);
      },
      message: 'Invalid Portfolio Website URL'
    }
  },
  achievements: [achievementSchema],
  education: [educationSchema],
  projects: [projectSchema],
  workExperience: [workExperienceSchema],
  certifications: [certificationSchema],
  placementHistory: [placementHistorySchema], // New field for placement tracking
  appliedJobs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Job' }], // Track applied job IDs
  eligibilityStatus: { type: Boolean, default: true },
  blacklisted: { type: Boolean, default: false },
  placementStatus: {
    type: String,
    enum: ['placed', 'not_placed', 'internship_only'],
    default: 'not_placed'
  },
  resumeUpdatedAt: { type: Date, default: Date.now } // Track last resume update
}, { timestamps: true });

// Automatically update resume lastUpdated field
studentSchema.pre('save', function (next) {
  if (this.isModified('resume.url')) {
    this.resume.lastUpdated = Date.now();
    this.resumeUpdatedAt = Date.now();
  }
  next();
});

const Student = mongoose.model('Student', studentSchema);
module.exports = Student;
