const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  recipientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: [
      'job_post', 
      'application_update', 
      'interview_scheduled', 
      'offer_received', 
      'event_invitation',
      'deadline_reminder',
      'system'
    ],
    required: true,
    trim: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  message: {
    type: String,
    required: true,
    trim: true
  },
  relatedTo: {
    model: {
      type: String,
      enum: ['job', 'application', 'interview', 'event', 'company'],
      trim: true
    },
    id: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: 'relatedTo.model',
      required: function () {
        return this.relatedTo && this.relatedTo.model;
      }
    }
  },
  isRead: {
    type: Boolean,
    default: false
  },
  expiresAt: {
    type: Date
  }
}, {
  timestamps: true
});

// TTL Index to automatically delete expired notifications
notificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Compound Index for optimizing unread notifications retrieval
notificationSchema.index({ recipientId: 1, isRead: 1 });

const Notification = mongoose.model('Notification', notificationSchema);
module.exports = Notification;
