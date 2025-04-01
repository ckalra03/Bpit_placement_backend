// profileRoutes.js
const express = require("express");
const router = express.Router();
const profileController = require("../Controllers/profileController");
const { authMiddleware, authorize, requireCompleteProfile } = require("../Middleware/authMiddleware");

// Get profile completion status
router.get("/status", authMiddleware, profileController.getProfileStatus);

// Main route for updating user profile based on role
router.post("/update", authMiddleware, profileController.updateProfile);

// Role-specific routes with authorization
router.post(
  "/student/update", 
  authMiddleware, 
  authorize(["student"]), 
  profileController.updateStudentProfile
);

router.post(
  "/recruiter/update", 
  authMiddleware, 
  authorize(["recruiter"]), 
  profileController.updateRecruiterProfile
);

router.post(
  "/placement-officer/update", 
  authMiddleware, 
  authorize(["placementOfficer", "placement_officer"]), 
  profileController.updatePlacementOfficerProfile
);

// Example protected route that requires a complete profile
router.get(
  "/dashboard", 
  authMiddleware, 
  requireCompleteProfile,
  (req, res) => {
    res.status(200).json({ message: "Access granted to dashboard" });
  }
);

module.exports = router;