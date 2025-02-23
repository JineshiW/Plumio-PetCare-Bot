const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const authRoutes = require("./routes/auth");
const chatRoutes = require("./routes/chat");
const path = require("path");
const fs = require("fs");

dotenv.config(); // Load environment variables

const app = express();

// Middleware
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Serve static receipt files
app.use("/receipts", express.static(path.join(__dirname, "receipts")));

// MongoDB Connection
const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
  console.error("Error: MONGO_URI is not defined in .env");
  process.exit(1);
}

mongoose
  .connect(MONGO_URI, { serverSelectionTimeoutMS: 30000 })
  .then(() => console.log("✅ MongoDB Connected!"))
  .catch((err) => console.error("❌ MongoDB connection error:", err.message));

mongoose.connection.on("disconnected", () =>
  console.log("⚠️ MongoDB disconnected!")
);

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/chat", chatRoutes);

// Chat API - Returns message & receipt link if available
app.post("/api/chat", (req, res) => {
  const { userId, message } = req.body;

  if (!userId) {
    return res.status(400).json({ error: "User ID is required" });
  }

  const receiptFileName = `receipt_${userId}.pdf`;
  const receiptPath = path.join(__dirname, "receipts", receiptFileName);

  let responseMessage = "Your appointment is confirmed! 🎉";
  let receiptUrl = null;

  // Check if the receipt file exists
  if (fs.existsSync(receiptPath)) {
    receiptUrl = `http://localhost:5000/receipts/${receiptFileName}`;
  }

  res.json({
    message: responseMessage,
    receiptUrl, // Will be null if receipt doesn't exist
  });
});

// Start Server
const PORT = process.env.PORT || 5000;
app
  .listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  })
  .on("error", (err) => {
    if (err.code === "EADDRINUSE") {
      console.error(`❌ Port ${PORT} is already in use. Try a different port.`);
      process.exit(1);
    }
  });