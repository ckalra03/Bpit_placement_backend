const jwt = require("jsonwebtoken");
const User = require("../Models/userModel");
const Recruiter = require("../Models/recruiterModel");
const Student = require("../Models/studentModel");
const PlacementOfficer = require("../Models/placementOfficerModel");

// Main authentication middleware
const authMiddleware = (req, res, next) => {
  try {
    let token;

    // Get token from Authorization header or cookie
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      // Token from Authorization header
      token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies.token) {
      // Token from cookie
      token = req.cookies.token;
    }

    if (!token) {
      return res.status(401).json({ message: "Unauthorized, token missing" });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach user data to request
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

// Middleware to authorize specific roles
const authorize = (roles) => async (req, res, next) => {
  try {
    // Check if user has any of the required roles
    if (!req.user || !roles.some(role => req.user.roles.includes(role))) {
      return res.status(403).json({ message: "Forbidden: Access denied" });
    }

    // Special check for recruiters - must be verified
    if (req.user.roles.includes('recruiter') && 
        !req.user.roles.includes('admin') && 
        !req.user.roles.includes('placement_officer')) {
      
      const user = await User.findById(req.user.userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      if (!user.isVerified) {
        return res.status(403).json({ 
          message: "Access denied: Your recruiter profile must be verified" 
        });
      }
    }
    
    next(); 
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Middleware to check if profile is complete
const requireCompleteProfile = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const roles = req.user.roles;
    
    let profileComplete = false;
    
    // Check if role-specific profile exists
    if (roles.includes("student")) {
      const profile = await Student.findOne({ userId });
      profileComplete = !!profile;
    } else if (roles.includes("recruiter")) {
      const profile = await Recruiter.findOne({ userId });
      profileComplete = !!profile;
    } else if (roles.includes("placementOfficer")) {
      const profile = await PlacementOfficer.findOne({ userId });
      profileComplete = !!profile;
    } else {
      // Admin or other roles might not need profiles
      profileComplete = true;
    }
    
    if (!profileComplete) {
      return res.status(403).json({ 
        message: "Please complete your profile before accessing this resource",
        profileRequired: true
      });
    }
    
    next();
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  authMiddleware,
  authorize,
  requireCompleteProfile
};