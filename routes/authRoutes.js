const express = require("express");
const router = express.Router();

const {
  register,
  login,
} = require("../controllers/authController");

const {
  registerValidation,
  loginValidation,
  validate,
} = require("../validators/validationRules");

// Register
router.post(
  "/register",
  registerValidation,
  validate,
  register
);

// Login
router.post(
  "/login",
  loginValidation,
  validate,
  login
);

module.exports = router;

