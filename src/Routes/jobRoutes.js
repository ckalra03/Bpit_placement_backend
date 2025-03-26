const express = require("express");

const {
  createJob,
  getAllJobs,
  getJobById,
  updateJob,
  deleteJob
} = require("../Controllers/jobController");
const { authMiddleware, authorize } = require("../Middleware/authMiddleware");

const router = express.Router();

// Allow placement officers, recruiters, and admins to create job postings
router.post("/create", authMiddleware, authorize(["placement_officer", "recruiter", "admin"]), createJob);

// Public routes
router.get("/", getAllJobs);
router.get("/:id", getJobById);

// Allow placement officers, recruiters, and admins to update or delete jobs
router.put("/:id", authMiddleware, authorize(["placement_officer", "recruiter", "admin"]), updateJob);
router.delete("/:id", authMiddleware, authorize(["placement_officer", "recruiter", "admin"]), deleteJob);

module.exports = router;
