const JobPosting = require("../Models/jobPostingModel");
const Company = require("../Models/companyModel");

// Create a new job posting
exports.createJob = async (req, res) => {
  try {
    const { companyId, title, description, jobType, positions, location, workMode, skills, applicationDeadline, companyName } = req.body;

    // Check if all required fields are present
    if (!title || !description || !jobType || !positions || !location || !workMode || !skills || !applicationDeadline) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    let companyExists = null;

    // Check if companyId is provided
    if (companyId) {
      companyExists = await Company.findById(companyId);
    } else if (companyName) {
      // Register the company on the fly if not exists
      companyExists = await Company.findOne({ name: companyName });

      if (!companyExists) {
        const newCompany = new Company({ name: companyName });
        companyExists = await newCompany.save();
      }
    }

    if (!companyExists) {
      return res.status(400).json({ message: "Company not found or not registered." });
    }

    // Create the job if company exists
    const newJob = new JobPosting({
      companyId: companyExists._id,
      createdBy: req.user.userId,
      title,
      description,
      jobType,
      positions,
      location,
      workMode,
      skills,
      applicationDeadline,
    });

    await newJob.save();
    res.status(201).json({ message: "Job posted successfully", job: newJob });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get all job postings (Public)
exports.getAllJobs = async (req, res) => {
  try {
    const jobs = await JobPosting.find().populate("companyId", "name");
    res.status(200).json(jobs);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get job details by ID
exports.getJobById = async (req, res) => {
  try {
    const job = await JobPosting.findById(req.params.id).populate("companyId", "name");
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }
    res.status(200).json(job);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update job details (Recruiter / Placement Officer / Admin)
exports.updateJob = async (req, res) => {
  try {
    const job = await JobPosting.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    const updatedJob = await JobPosting.findByIdAndUpdate(req.params.id, req.body, { new: true });

    res.status(200).json({ message: "Job updated successfully", job: updatedJob });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Delete job posting (Recruiter / Placement Officer / Admin)
exports.deleteJob = async (req, res) => {
  try {
    const job = await JobPosting.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    await JobPosting.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Job deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
