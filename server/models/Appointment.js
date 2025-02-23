const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({
  doctorName: String,
  petType: String,
  petName: String,
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  date: String,
  time: String,
});

module.exports = mongoose.model("Appointment", appointmentSchema);
