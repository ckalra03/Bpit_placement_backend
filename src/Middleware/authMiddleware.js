const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config(); // Load environment variables

const authMiddleware = (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) {
    return res.status(401).json({ message: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET);
    req.user = decoded; // Add user details to request
    next();
  } catch (error) {
    res.status(400).json({ message: "Invalid token" });
  }
};

module.exports = authMiddleware;
