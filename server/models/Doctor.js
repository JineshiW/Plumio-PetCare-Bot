const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  petTypes: { type: [String], required: true },
  availableDates: { type: [String], required: true },
  location: { type: String, required: true }  // ✅ Added location field
});

module.exports = mongoose.model("Doctor", doctorSchema);
