const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const user = require("../Models/userModel");

dotenv.config(); // Load environment variables

const authMiddleware = (req, res, next) => {
    try {
        const token = req.cookies.token; // Extract token from cookies
        if (!token) return res.status(401).json({ message: "Unauthorized, token missing" });
    
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Attach user data to request
        next();
      }  catch (error) {
    res.status(400).json({ message: "Invalid token" });
  }
};

// Middleware to authorize specific roles
// Enhanced authorization middleware in authMiddleware.js

const User = require("../Models/userModel");

const authorize = (roles) => async (req, res, next) => {
  try {

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





module.exports = {authMiddleware,authorize};
