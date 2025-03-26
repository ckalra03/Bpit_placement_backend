const express = require("express");
const { register, login, getMe , logout } = require("../Controllers/authController");
const { authMiddleware } = require("../Middleware/authMiddleware");



const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/me", authMiddleware, getMe); // Protected route

module.exports = router;
