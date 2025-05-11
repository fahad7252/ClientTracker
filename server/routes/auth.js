const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const { register, login, getMe, logout } = require("../controllers/auth");
const { protect } = require("../middleware/auth");

// Route: /api/auth/register
router.post(
  "/register",
  [
    check("name", "Name is required").not().isEmpty(),
    check("email", "Please include a valid email").isEmail(),
    check(
      "password",
      "Please enter a password with 6 or more characters"
    ).isLength({ min: 6 }),
  ],
  register
);

// Route: /api/auth/login
router.post(
  "/login",
  [
    check("email", "Please include a valid email").isEmail(),
    check("password", "Password is required").exists(),
  ],
  login
);

// Route: /api/auth/me
router.get("/me", protect, getMe);

// Route: /api/auth/logout
router.get("/logout", protect, logout);

module.exports = router;
