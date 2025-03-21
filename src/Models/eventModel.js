const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  status: {
    type: String,
    enum: ['present', 'absent'],
    default: 'absent'
  },
  checkInTime: {
    type: Date
  },
  checkOutTime: {
    type: Date
  }
});

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  eventType: {
    type: String,
    enum: ['Pre-placement Talk', 'Workshop', 'Interview', 'Training', 'Job Fair', 'Other'],
    required: true
  },
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company'
  },
  location: {
    type: String
  },
  mode: {
    type: String,
    enum: ['online', 'offline', 'hybrid'],
    required: true
  },
  meetingLink: {
    type: String
  },
  startDateTime: {
    type: Date,
    required: true
  },
  endDateTime: {
    type: Date,
    required: true
  },
  eligibleDepartments: {
    type: [String]
  },
  eligibleBatches: {
    type: [String]
  },
  coordinatorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PlacementOfficer',
    required: true
  },
  status: {
    type: String,
    enum: ['upcoming', 'ongoing', 'completed', 'cancelled'],
    default: 'upcoming'
  },
  attendance: [attendanceSchema],
  reminderSent: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Create indexes for efficient querying
eventSchema.index({ startDateTime: 1 });
eventSchema.index({ status: 1 });
eventSchema.index({ companyId: 1, startDateTime: 1 });

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;
