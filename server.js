const express = require("express");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const connectDB = require("./src/Config/db"); // Import the DB connection function
const authRoutes = require("./src/Routes/authRoutes");
const jobRoutes = require("./src/Routes/jobRoutes");


dotenv.config(); // Load environment variables

const app = express();

// Connect to Database
connectDB();

// Middleware
app.use(express.json()); // Parse JSON request bodies
app.use(cookieParser()); // Enable cookie parsing

// Routes
app.use("/api/auth", authRoutes);
// Use job routes
app.use("/api/jobs", jobRoutes);




// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
