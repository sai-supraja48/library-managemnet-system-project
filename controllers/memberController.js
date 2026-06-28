const User = require("../models/User");

// Get All Members
const getMembers = async (req, res) => {
  try {
    const members = await User.find({ role: "member" }).select("-password");

    res.status(200).json({
      success: true,
      count: members.length,
      members,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete Member
const deleteMember = async (req, res) => {
  try {
    const member = await User.findById(req.params.id);

    if (!member || member.role !== "member") {
      return res.status(404).json({
        success: false,
        message: "Member not found",
      });
    }

    await member.deleteOne();

    res.status(200).json({
      success: true,
      message: "Member deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const Borrow = require("../models/Borrow");

const myBorrowedBooks = async (req, res) => {
  try {
    const borrowedBooks = await Borrow.find({
      memberId: req.user._id,
      status: "borrowed",
    }).populate("bookId");

    res.status(200).json({
      success: true,
      books: borrowedBooks,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getMembers,
  deleteMember,
  myBorrowedBooks
};