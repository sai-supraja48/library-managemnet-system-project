const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

dotenv.config();

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

const authRoutes = require("./routes/authRoutes");

app.use("/api/auth", authRoutes);

const protect = require("./middleware/authMiddleware");

app.get("/api/profile", protect, (req, res) => {
  res.json({
    success: true,
    user: req.user,
  });
});

const bookRoutes = require("./routes/bookRoutes");

app.use("/api/books", bookRoutes);

const memberRoutes = require("./routes/memberRoutes");

app.use("/api/members", memberRoutes);

app.get("/", (req, res) => {
  res.send("Library Management API Running...");
});

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

const errorHandler = require("./middleware/errorMiddleware");

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});