const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./src/Config/db"); // Import the DB connection function
const authRoutes = require("./src/Routes/authRoutes");

dotenv.config(); // Load environment variables

const app = express();

// Connect to Database
connectDB();

// Middleware
app.use(express.json()); // Parse JSON request bodies

// Routes
app.use("/api/auth", authRoutes);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
