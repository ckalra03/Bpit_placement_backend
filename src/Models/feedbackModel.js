const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: [
      'student_to_company', 
      'company_to_college', 
      'student_to_process',
      'placement_officer_to_company',
      'placement_officer_to_student'
    ],
    required: true
  },
  givenBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  forEntity: {
    type: {
      type: String,
      enum: ['company', 'placement_process', 'student', 'event', 'job'],
      required: true
    },
    id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: 'forEntity.type'
    }
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: true
  },
  comments: {
    type: String,
    trim: true
  },
  submissionDate: {
    type: Date,
    default: Date.now
  },
  isAnonymous: {
    type: Boolean,
    default: false
  },
  tags: {
    type: [String],
    default: []
  }
}, {
  timestamps: true
});

// Index for faster retrieval of feedback based on type and entity
feedbackSchema.index({ type: 1 });
feedbackSchema.index({ 'forEntity.type': 1, 'forEntity.id': 1 });

const Feedback = mongoose.model('Feedback', feedbackSchema);
module.exports = Feedback;
