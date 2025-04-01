// profileController.js
const User = require("../Models/userModel");
const Student = require("../Models/studentModel");
const Recruiter = require("../Models/recruiterModel");
const PlacementOfficer = require("../Models/placementOfficerModel");
const Company = require("../Models/companyModel");
const mongoose = require("mongoose");

// Get profile completion status
exports.getProfileStatus = async (req, res) => {
  try {
    // User info is already available from the JWT token via auth middleware
    const userId = req.user.userId;
    const roles = req.user.roles;
    
    if (!userId || !roles) {
      return res.status(400).json({ message: "User information not found in token" });
    }

    let profileComplete = false;
    let roleModel = null;
    let primaryRole = roles[0]; // Assuming primary role is first in array

    // Check if role-specific profile exists
    if (roles.includes("student")) {
      roleModel = await Student.findOne({ userId });
      primaryRole = "student";
    } else if (roles.includes("recruiter")) {
      roleModel = await Recruiter.findOne({ userId });
      primaryRole = "recruiter";
    } else if (roles.includes("placementOfficer")) {
      roleModel = await PlacementOfficer.findOne({ userId });
      primaryRole = "placementOfficer";
    }

    profileComplete = !!roleModel; // Convert to boolean

    // Get basic user info
    const user = await User.findById(userId).select("name email isVerified");

    res.status(200).json({ 
      profileComplete,
      role: primaryRole,
      user: {
        name: user.name,
        email: user.email,
        isVerified : user.isVerified,
        
        id: userId
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update profile based on role directly from JWT token
exports.updateProfile = async (req, res) => {
  try {
    // Get role from JWT token (already decoded in auth middleware)
    const roles = req.user.roles;

    if (!roles || !roles.length) {
      return res.status(400).json({ message: "User role not found" });
    }

    // Direct to appropriate controller based on role
    if (roles.includes("student")) {
      return this.updateStudentProfile(req, res);
    } else if (roles.includes("recruiter")) {
      return this.updateRecruiterProfile(req, res);
    } else if (roles.includes("placement_officer")) {
      return this.updatePlacementOfficerProfile(req, res);
    } else {
      return res.status(400).json({ message: "Invalid user role for profile update" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update student profile without transactions
exports.updateStudentProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    
    // Extract student profile data from request body
    const {
      enrollmentNumber,
      department,
      branch,
      batch,
      cgpa,
      semester,
      dateOfBirth,
      gender,
      address,
      skills,
      linkedinProfile,
      githubProfile,
      portfolioWebsite
    } = req.body;

    // Check if student profile already exists
    let studentProfile = await Student.findOne({ userId });

    if (studentProfile) {
      // Update existing profile
      studentProfile.enrollmentNumber = enrollmentNumber || studentProfile.enrollmentNumber;
      studentProfile.department = department || studentProfile.department;
      studentProfile.branch = branch || studentProfile.branch;
      studentProfile.batch = batch || studentProfile.batch;
      studentProfile.cgpa = cgpa || studentProfile.cgpa;
      studentProfile.semester = semester || studentProfile.semester;
      studentProfile.dateOfBirth = dateOfBirth || studentProfile.dateOfBirth;
      studentProfile.gender = gender || studentProfile.gender;
      studentProfile.address = address || studentProfile.address;
      studentProfile.skills = skills || studentProfile.skills;
      studentProfile.linkedinProfile = linkedinProfile || studentProfile.linkedinProfile;
      studentProfile.githubProfile = githubProfile || studentProfile.githubProfile;
      studentProfile.portfolioWebsite = portfolioWebsite || studentProfile.portfolioWebsite;
      
      await studentProfile.save();
    } else {
      // Create new student profile
      studentProfile = new Student({
        userId,
        enrollmentNumber,
        department,
        branch,
        batch,
        cgpa,
        semester,
        dateOfBirth,
        gender,
        address,
        skills,
        linkedinProfile,
        githubProfile,
        portfolioWebsite
      });
      
      await studentProfile.save();
    }

    res.status(200).json({ 
      message: "Student profile updated successfully", 
      profile: studentProfile 
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update recruiter profile without transactions
exports.updateRecruiterProfile = async (req, res) => {
  try {
    const userId = req.user.userId;

    // Extract recruiter and company data from request body
    const {
      designation,
      department,
      officeContactNumber,
      companyEmailDomain,
      alternateEmail,
      linkedInProfile,
      verificationDocuments,
      companyId,
      companyName,
      logo,
      description,
      industry,
      companyType,
      website,
      headquartersLocation,
      establishedYear,
      employeeCount,
      socialMedia,
      address,
      contactEmail,
      contactPhone
    } = req.body;

    let company;

    // If companyId is provided, update the company if it exists
    if (companyId) {
      company = await Company.findById(companyId);
      if (!company) {
        return res.status(404).json({ message: "Company not found" });
      }

      // Update company fields if provided
      company.name = companyName || company.name;
      company.logo = logo || company.logo;
      company.description = description || company.description;
      company.industry = industry || company.industry;
      company.companyType = companyType || company.companyType;
      company.website = website || company.website;
      company.headquartersLocation = headquartersLocation || company.headquartersLocation;
      company.establishedYear = establishedYear || company.establishedYear;
      company.employeeCount = employeeCount || company.employeeCount;
      company.socialMedia = socialMedia || company.socialMedia;
      company.address = address || company.address;
      company.contactEmail = contactEmail || company.contactEmail;
      company.contactPhone = contactPhone || company.contactPhone;

      await company.save();
    } else {
      // If no companyId is provided, create a new company
      company = new Company({
        name: companyName,
        logo,
        description,
        industry,
        companyType,
        website,
        headquartersLocation,
        establishedYear,
        employeeCount,
        socialMedia,
        address,
        contactEmail,
        contactPhone
      });

      await company.save();
    }

    // Handle Recruiter information
    let recruiterProfile = await Recruiter.findOne({ userId });

    if (recruiterProfile) {
      // Update existing recruiter profile
      recruiterProfile.companyId = company._id;
      recruiterProfile.designation = designation || recruiterProfile.designation;
      recruiterProfile.department = department || recruiterProfile.department;
      recruiterProfile.officeContactNumber = officeContactNumber || recruiterProfile.officeContactNumber;
      recruiterProfile.companyEmailDomain = companyEmailDomain || recruiterProfile.companyEmailDomain;
      recruiterProfile.alternateEmail = alternateEmail || recruiterProfile.alternateEmail;
      recruiterProfile.linkedInProfile = linkedInProfile || recruiterProfile.linkedInProfile;

      if (verificationDocuments && verificationDocuments.length > 0) {
        recruiterProfile.verificationDocuments = [
          ...recruiterProfile.verificationDocuments,
          ...verificationDocuments
        ];
      }

      await recruiterProfile.save();
    } else {
      // Create new recruiter profile
      recruiterProfile = new Recruiter({
        userId,
        companyId: company._id,
        designation,
        department,
        officeContactNumber,
        companyEmailDomain,
        alternateEmail,
        linkedInProfile,
        verificationDocuments: verificationDocuments || []
      });

      await recruiterProfile.save();
    }

    res.status(200).json({
      message: "Recruiter profile updated successfully",
      recruiterProfile,
      company
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


// Update placement officer profile without transactions
exports.updatePlacementOfficerProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    
    // Extract placement officer data from request body
    const {
      designation,
      department,
      employeeId,
      responsibilities,
      contactDetails
    } = req.body;

    // Check if placement officer profile already exists
    let placementOfficerProfile = await PlacementOfficer.findOne({ userId });
    
    if (placementOfficerProfile) {
      // Update existing profile
      placementOfficerProfile.designation = designation || placementOfficerProfile.designation;
      placementOfficerProfile.department = department || placementOfficerProfile.department;
      placementOfficerProfile.employeeId = employeeId || placementOfficerProfile.employeeId;
      placementOfficerProfile.responsibilities = responsibilities || placementOfficerProfile.responsibilities;
      placementOfficerProfile.contactDetails = contactDetails || placementOfficerProfile.contactDetails;
      
      await placementOfficerProfile.save();
    } else {
      // Create new placement officer profile
      placementOfficerProfile = new PlacementOfficer({
        userId,
        designation,
        department,
        employeeId,
        responsibilities,
        contactDetails
      });
      
      await placementOfficerProfile.save();
    }
    
    res.status(200).json({ 
      message: "Placement Officer profile updated successfully", 
      profile: placementOfficerProfile 
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
