const User = require("../Models/userModel");
const Student = require("../Models/studentModel");
const Recruiter = require("../Models/recruiterModel");
const PlacementOfficer = require("../Models/placementOfficerModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config(); // Load environment variables

// Register a new user
exports.register = async (req, res) => {
  try {
    const { name, email, password, roles } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    // Create new user
    const newUser = new User({ name, email, password, roles });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Login user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    
    // Find user in DB
    const user = await User.findOne({ email });
    if (!user) {
        return res.status(400).json({ message: "Invalid email" });
    }
    
    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        return res.status(400).json({ message: "Invalid password" });
    }
    
    // Generate JWT token
    const token = jwt.sign({ userId: user._id, roles: user.roles }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

      // Set cookie
      res.cookie("token", token, {
        httpOnly: true, // Prevent access from JavaScript (more secure)
        secure: process.env.NODE_ENV === "production", // Use secure cookies in production
        sameSite: "Strict", // Protect against CSRF attacks
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get logged-in user details

exports.getMe = async (req, res) => {
  try {
    // Fetch user details without password
    const user = await User.findById(req.user.userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    let additionalDetails = null;

    // Fetch additional details based on roles
    if (user.roles === "student") {
      additionalDetails = await Student.findOne({ userId: user._id });
    } else if (user.roles === "recruiter") {
      additionalDetails = await Recruiter.findOne({ userId : user._id });
    } else if (user.roles === "placement_officer") {
      additionalDetails = await PlacementOfficer.findOne({ userId : user._id });
    }

    // Return both user details and roles-specific details
    res.status(200).json({
      user,
      additionalDetails, // This could be student, recruiter, or placement officer details
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

//Logout 

exports.logout = (req, res) => {
    res.clearCookie("token"); // Remove JWT token from cookies
    res.status(200).json({ message: "Logged out successfully" });
  };

