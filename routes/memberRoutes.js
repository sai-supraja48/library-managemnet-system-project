const express = require("express");
const router = express.Router();

const {
  getMembers,
  deleteMember,
  myBorrowedBooks
} = require("../controllers/memberController");

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

// Librarian
router.get("/", protect, authorizeRoles("librarian"), getMembers);
router.delete("/:id", protect, authorizeRoles("librarian"), deleteMember);

// Member
router.get(
  "/me/books",
  protect,
  authorizeRoles("member"),
  myBorrowedBooks
);

module.exports = router;