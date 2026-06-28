const Book = require("../models/Book");
const Borrow = require("../models/Borrow");

// Add Book
const addBook = async (req, res) => {
  try {
    const { title, author, isbn, category, quantity } = req.body;

    // Required fields
    if (!title || !author || !isbn || !category || quantity == null) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Quantity validation
    if (quantity < 0) {
      return res.status(400).json({
        success: false,
        message: "Quantity cannot be negative",
      });
    }

    // Duplicate ISBN
    const existingBook = await Book.findOne({ isbn });

    if (existingBook) {
      return res.status(400).json({
        success: false,
        message: "Book with this ISBN already exists",
      });
    }

    const book = await Book.create({
      title,
      author,
      isbn,
      category,
      quantity,
      availableQuantity: quantity,
    });

    res.status(201).json({
      success: true,
      message: "Book added successfully",
      book,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get All Books
const getBooks = async (req, res) => {
  try {

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 5;

    const skip = (page - 1) * limit;

    const search = req.query.search || "";
    const category = req.query.category;

    let filter = {
      $or: [
        {
          title: {
            $regex: search,
            $options: "i",
          },
        },
        {
          author: {
            $regex: search,
            $options: "i",
          },
        },
      ],
    };

    if (category) {
      filter.category = category;
    }

    const books = await Book.find(filter)
      .skip(skip)
      .limit(limit);

    const totalBooks = await Book.countDocuments(filter);

    res.status(200).json({
      success: true,
      currentPage: page,
      totalPages: Math.ceil(totalBooks / limit),
      totalBooks,
      books,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Single Book
const getBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Book not found",
      });
    }

    res.status(200).json({
      success: true,
      book,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Invalid Book ID",
    });
  }
};

// Update Book
const updateBook = async (req, res) => {
  try {

    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Book not found",
      });
    }

    const {
      title,
      author,
      isbn,
      category,
      quantity,
      availableQuantity,
    } = req.body;

    if (title) book.title = title;
    if (author) book.author = author;
    if (isbn) book.isbn = isbn;
    if (category) book.category = category;

    if (quantity !== undefined) {
      if (quantity < 0) {
        return res.status(400).json({
          success: false,
          message: "Quantity cannot be negative",
        });
      }

      book.quantity = quantity;
    }

    if (availableQuantity !== undefined) {
      if (availableQuantity < 0) {
        return res.status(400).json({
          success: false,
          message: "Available quantity cannot be negative",
        });
      }

      book.availableQuantity = availableQuantity;
    }

    await book.save();

    res.status(200).json({
      success: true,
      message: "Book updated successfully",
      book,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete Book
const deleteBook = async (req, res) => {
  try {

    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Book not found",
      });
    }

    await book.deleteOne();

    res.status(200).json({
      success: true,
      message: "Book deleted successfully",
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Invalid Book ID",
    });
  }
};

// Borrow Book
const borrowBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    // Check Book Exists
    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Book not found",
      });
    }

    // Check Availability
    if (book.availableQuantity <= 0) {
      return res.status(400).json({
        success: false,
        message: "Book is currently unavailable",
      });
    }

    // Check Already Borrowed
    const alreadyBorrowed = await Borrow.findOne({
      memberId: req.user._id,
      bookId: book._id,
      status: "borrowed",
    });

    if (alreadyBorrowed) {
      return res.status(400).json({
        success: false,
        message: "You have already borrowed this book",
      });
    }

    // Create Borrow Record
    const borrow = await Borrow.create({
      memberId: req.user._id,
      bookId: book._id,
      borrowDate: new Date(),
      status: "borrowed",
    });

    // Reduce Available Quantity
    book.availableQuantity -= 1;
    await book.save();

    res.status(200).json({
      success: true,
      message: "Book borrowed successfully",
      borrow,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Invalid Book ID",
    });
  }
};

// Return Book
const returnBook = async (req, res) => {
  try {

    const borrow = await Borrow.findOne({
      memberId: req.user._id,
      bookId: req.params.id,
      status: "borrowed",
    });

    if (!borrow) {
      return res.status(404).json({
        success: false,
        message: "No active borrow record found",
      });
    }

    // Update Borrow Record
    borrow.status = "returned";
    borrow.returnDate = new Date();

    await borrow.save();

    // Increase Available Quantity
    const book = await Book.findById(req.params.id);

    if (book) {
      book.availableQuantity += 1;
      await book.save();
    }

    res.status(200).json({
      success: true,
      message: "Book returned successfully",
      borrow,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Invalid Book ID",
    });
  }
};

// My Borrowed Books
const myBorrowedBooks = async (req, res) => {
  try {

    const borrowedBooks = await Borrow.find({
      memberId: req.user._id,
      status: "borrowed",
    })
      .populate({
        path: "bookId",
        select: "title author category isbn quantity availableQuantity",
      })
      .sort({ borrowDate: -1 });

    res.status(200).json({
      success: true,
      totalBooks: borrowedBooks.length,
      borrowedBooks,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  addBook,
  getBooks,
  getBook,
  updateBook,
  deleteBook,
  borrowBook,
  returnBook,
  myBorrowedBooks,
};  