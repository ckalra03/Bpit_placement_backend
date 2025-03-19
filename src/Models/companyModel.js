const mongoose = require('mongoose');

const visitHistorySchema = new mongoose.Schema({
  academicYear: {
    type: String,
    required: true
  },
  studentsHired: {
    type: Number,
    default: 0
  },
  averagePackage: {
    type: Number,
    default: 0
  },
  visitDate: {
    type: Date
  }
});

const companySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    index: true // Optimized for performance
  },
  logo: {
    type: String
  },
  description: {
    type: String,
    trim: true
  },
  industry: {
    type: String,
    trim: true
  },
  companyType: {
    type: String,
    enum: ['Product', 'Service', 'Startup', 'Consulting', 'Other'],
    trim: true
  },
  website: {
    type: String,
    trim: true
  },
  headquartersLocation: {
    type: String,
    trim: true
  },
  establishedYear: {
    type: Number,
    min: 1900,
    max: new Date().getFullYear(),
    validate: {
      validator: function (v) {
        return v <= new Date().getFullYear();
      },
      message: 'Established year cannot be in the future'
    }
  },
  employeeCount: {
    type: String,
    trim: true
  },
  socialMedia: {
    linkedin: { type: String, trim: true },
    twitter: { type: String, trim: true },
    facebook: { type: String, trim: true }
  },
  address: {
    street: { type: String, trim: true },
    city: { type: String, trim: true },
    state: { type: String, trim: true },
    pincode: { type: String, trim: true },
    country: { type: String, trim: true }
  },
  contactEmail: {
    type: String,
    lowercase: true,
    trim: true,
    validate: {
      validator: function (v) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      },
      message: 'Invalid email format'
    }
  },
  contactPhone: {
    type: String,
    trim: true,
    validate: {
      validator: function (v) {
        return /^[0-9]{10}$/.test(v);
      },
      message: 'Invalid phone number format'
    }
  },
  registrationDate: {
    type: Date,
    default: Date.now
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
  },
  previousYearSelections: {
    type: Number,
    default: 0
  },
  companyRating: {
    type: Number,
    min: 1,
    max: 5,
    default: 3
  },
  visitHistory: [visitHistorySchema]
}, {
  timestamps: true
});

const Company = mongoose.model('Company', companySchema);
module.exports = Company;
