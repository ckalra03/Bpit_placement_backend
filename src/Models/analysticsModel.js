const mongoose = require('mongoose');

const statisticsSchema = new mongoose.Schema({
  totalStudents: { type: Number, default: 0 },
  eligibleStudents: { type: Number, default: 0 },
  registeredStudents: { type: Number, default: 0 },
  placedStudents: { type: Number, default: 0 },
  placementPercentage: { 
    type: Number, 
    default: function () {
      return this.totalStudents ? (this.placedStudents / this.totalStudents) * 100 : 0;
    } 
  },
  averagePackage: { type: Number, default: 0 },
  highestPackage: { type: Number, default: 0 },
  companiesVisited: { type: Number, default: 0 },
  totalOffers: { type: Number, default: 0 },
  multipleOffers: { type: Number, default: 0 }
});

const departmentWiseSchema = new mongoose.Schema({
  department: { type: String, required: true, trim: true },
  totalStudents: { type: Number, default: 0 },
  placedStudents: { type: Number, default: 0 },
  placementPercentage: { 
    type: Number, 
    default: function () {
      return this.totalStudents ? (this.placedStudents / this.totalStudents) * 100 : 0;
    } 
  },
  averagePackage: { type: Number, default: 0 },
  highestPackage: { type: Number, default: 0 }
});

const monthlyTrendSchema = new mongoose.Schema({
  month: { type: String, required: true, trim: true },
  jobPostings: { type: Number, default: 0 },
  applications: { type: Number, default: 0 },
  selections: { type: Number, default: 0 },
  averagePackage: { type: Number, default: 0 }
});

const companyWiseSchema = new mongoose.Schema({
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
  companyName: { type: String, required: true, trim: true },
  studentsHired: { type: Number, default: 0 },
  averagePackage: { type: Number, default: 0 },
  roles: { type: [String] }
});

const analyticsSchema = new mongoose.Schema({
  academicYear: { type: String, required: true, unique: true, trim: true },
  statistics: { type: statisticsSchema, default: () => ({}) },
  departmentWise: [departmentWiseSchema],
  monthlyTrends: [monthlyTrendSchema],
  companyWise: [companyWiseSchema],
  lastUpdated: { type: Date, default: Date.now }
}, { timestamps: true });

// Index for faster retrieval of analytics per year
analyticsSchema.index({ academicYear: 1 });

const Analytics = mongoose.model('Analytics', analyticsSchema);
module.exports = Analytics;
