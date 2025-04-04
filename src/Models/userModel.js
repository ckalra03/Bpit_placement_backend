const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 8
  },
  roles: {
    type: String, // Supports multiple roles
    enum: ['student', 'placement_officer', 'recruiter', 'admin'],
    required: [true, 'Role is required']
  },
  name: {
    type: String,
    required: [true, 'Name is required'],
  },
  profilePicture: {
    type: String,
    default: 'https://www.clipartkey.com/mpngs/m/152-1520367_user-profile-default-image-png-clipart-png-download.png'
  },
  contactNumber: {
    type: String,
    trim: true
  },
  lastLogin: {
    type: Date
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  verificationDate: {
    type: Date
  },
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  socialLogins: {
    googleId: String,
    linkedinId: String
  }
}, {
  timestamps: true
});

// Password hashing middleware
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  const salt = await bcrypt.genSalt(10); // More secure hashing
  this.password = await bcrypt.hash(this.password, salt);
  
  next();
});

// Password comparison method
userSchema.methods.comparePassword = function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
