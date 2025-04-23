const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors"); // Import cors
const cookieParser = require("cookie-parser");
const connectDB = require("./src/Config/db");
const authRoutes = require("./src/Routes/authRoutes");
const jobRoutes = require("./src/Routes/jobRoutes");
const profileRoutes = require("./src/Routes/profileRoutes");
const applicationRoutes = require("./src/Routes/applicationRoutes")

dotenv.config();

const app = express();

// Connect to Database
connectDB();

// Middleware
app.use(express.json());
app.use(cookieParser());

// CORS Middleware
app.use(
  cors({
    origin: "http://localhost:5173", // Allow requests from frontend
    credentials: true, // Allow cookies & authentication headers
  })
);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/profile", profileRoutes);
app.use('/api/applications', applicationRoutes);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
