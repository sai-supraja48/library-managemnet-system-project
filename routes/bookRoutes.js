const express = require("express");
const router = express.Router();

const {
  addBook,
  getBooks,
  getBook,
  updateBook,
  deleteBook,
  borrowBook,
  returnBook,
  myBorrowedBooks,
} = require("../controllers/bookController");

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const {
  bookValidation,
  validate,
} = require("../validators/validationRules");

// Everyone logged in can view books
router.get("/", protect, getBooks);
router.get("/:id", protect, getBook);

// Librarian only
router.post("/", protect, authorizeRoles("librarian"), addBook);
router.put("/:id", protect, authorizeRoles("librarian"), updateBook);
router.delete("/:id", protect, authorizeRoles("librarian"), deleteBook);

router.post(
  "/:id/borrow",
  protect,
  authorizeRoles("member"),
  borrowBook
);

router.post(
  "/:id/return",
  protect,
  authorizeRoles("member"),
  returnBook
);
router.get(
  "/me/books",
  protect,
  authorizeRoles("member"),
  myBorrowedBooks
);

router.post(
  "/",
  protect,
  authorizeRoles("librarian"),
  bookValidation,
  validate,
  addBook
);

module.exports = router;