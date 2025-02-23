const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// Define schema for user model with unique username and required password
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

// Middleware to hash password before saving a new or updated password
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

// Method to compare provided password with the stored hashed password
userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// Export the user model
module.exports = mongoose.model("User", userSchema);
