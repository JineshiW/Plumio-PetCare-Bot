const mongoose = require("mongoose");

const petSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true }, // Pet type (e.g., Dog, Cat)
  breed: { type: String, required: true }, // Pet breed (e.g., Pomsky)
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Reference to the owner (User model)
});

const Pet = mongoose.model("Pet", petSchema);

module.exports = Pet;
