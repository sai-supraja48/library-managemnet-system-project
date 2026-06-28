const { body, validationResult } = require("express-validator");

// Register Validation
const registerValidation = [
  body("name")
    .notEmpty()
    .withMessage("Name is required"),

  body("email")
    .isEmail()
    .withMessage("Valid email is required"),

  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
];

// Login Validation
const loginValidation = [
  body("email")
    .isEmail()
    .withMessage("Valid email is required"),

  body("password")
    .notEmpty()
    .withMessage("Password is required"),
];

// Book Validation
const bookValidation = [
  body("title")
    .notEmpty()
    .withMessage("Title is required"),

  body("author")
    .notEmpty()
    .withMessage("Author is required"),

  body("isbn")
    .notEmpty()
    .withMessage("ISBN is required"),

  body("category")
    .notEmpty()
    .withMessage("Category is required"),

  body("quantity")
    .isInt({ min: 0 })
    .withMessage("Quantity must be a positive number"),
];

// Handle Validation Errors
const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array(),
    });
  }

  next();
};

module.exports = {
  registerValidation,
  loginValidation,
  bookValidation,
  validate,
};