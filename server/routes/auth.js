const express = require("express");
const User = require("../models/User"); // Import the User model for database operations
const jwt = require("jsonwebtoken");
require("dotenv").config(); // Load environment variables from the .env file

const router = express.Router();

// Retrieve the JWT secret from the environment, or a default string
const secret = process.env.JWT_SECRET || "defaultSecretKey";

// Route to handle user signup
router.post("/signup", async (req, res) => {
  const { username, password } = req.body; // Extract username and password from the request body

  try {
    // Ensure both username and password are provided
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }

    // Check the database to see if a user with the given username already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "Username already exists" });
    }

    // Create a new user document; the pre-save hook will hash the password
    const newUser = new User({ username, password });
    await newUser.save();

    // Respond with a success message upon successful creation of the user
    res.status(201).json({ message: "User created successfully!" });
  } catch (err) {
    // Log any errors that occur during signup and return an error response
    console.error("Error during signup:", err);
    res.status(500).json({ message: "Error creating user", error: err.message });
  }
});

// Route to handle user login
router.post("/login", async (req, res) => {
  const { username, password } = req.body; // Extract login credentials from the request body

  try {
    // Ensure that both username and password are provided
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }

    console.log(`Login attempt for username: ${username}`); // Log the login attempt

    // Find the user in the database by username
    const user = await User.findOne({ username });
    if (!user) {
      console.error(`Login failed - User not found: ${username}`);
      return res.status(404).json({ message: "User not found" });
    }

    // Verify that the provided password matches the stored hash
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      console.error(`Login failed - Invalid password for user: ${username}`);
      return res.status(401).json({ message: "Invalid password" });
    }

    // Generate a JWT token with the user's ID and an expiration time of 1 hour
    const token = jwt.sign({ userId: user._id }, secret, { expiresIn: "1h" });

    // Send a successful response with the token and user details
    res.status(200).json({
      message: "Login successful",
      token,
      userId: user._id,
      username: user.username,
    });
  } catch (err) {
    // Log any errors during the login process and return an error response
    console.error("Error during login:", err);
    res.status(500).json({ message: "Error during login", error: err.message });
  }
});

module.exports = router;
