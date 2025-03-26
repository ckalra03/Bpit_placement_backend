const mongoose = require('mongoose');
const User = require('../Models/userModel');

const recruiterSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true,
    index: true // Optimized for performance
  },
  designation: {
    type: String,
    required: true,
    trim: true
  },
  department: {
    type: String,
    trim: true
  },
  officeContactNumber: {
    type: String,
    validate: {
      validator: function (v) {
        return /^[0-9]{10}$/.test(v);
      },
      message: 'Invalid phone number format'
    }
  },
  companyEmailDomain: {
    type: String,
    lowercase: true,
    trim: true,
    validate: {
      validator: function (v) {
        return /^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(v);
      },
      message: 'Invalid email domain format'
    }
  },
  alternateEmail: {
    type: String,
    lowercase: true,
    trim: true
  },
  linkedInProfile: {
    type: String,
    trim: true
  },
  verificationDocuments: {
    type: [String], // Array of document URLs or file references
    default: []
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  verificationDate: {
    type: Date,
    default: function () {
      return this.isVerified ? new Date() : null;
    }
  }
}, { timestamps: true });

const Recruiter = mongoose.model('Recruiter', recruiterSchema);
module.exports = Recruiter;
