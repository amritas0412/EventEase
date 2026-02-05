const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
  name: String,
  id: String,
  contact: Number,

  resetToken: String,
  resetTokenExpiry: Date
});

module.exports = mongoose.model("Student", userSchema, "student");
