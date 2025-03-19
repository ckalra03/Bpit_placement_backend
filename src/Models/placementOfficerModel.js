const mongoose = require('mongoose');

const placementOfficerSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  designation: {
    type: String,
    required: true,
    trim: true
  },
  department: {
    type: String,
    required: true,
    trim: true
  },
  employeeId: {
    type: String,
    required: true,
    unique: true,
    index: true // Optimized for faster lookups
  },
  responsibilities: {
    type: [String],
    set: (val) => val.map((res) => res.trim()) // Trims each responsibility
  },
  contactDetails: {
    officePhone: {
      type: String,
      validate: {
        validator: function (v) {
          return /^[0-9]{10}$/.test(v);
        },
        message: 'Invalid phone number format'
      }
    },
    extension: {
      type: String,
      validate: {
        validator: function (v) {
          return /^[0-9]+$/.test(v);
        },
        message: 'Invalid extension format'
      }
    },
    alternateEmail: {
      type: String,
      lowercase: true,
      trim: true,
      validate: {
        validator: function (v) {
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
        },
        message: 'Invalid email format'
      }
    }
  }
}, { timestamps: true });

const PlacementOfficer = mongoose.model('PlacementOfficer', placementOfficerSchema);
module.exports = PlacementOfficer;
