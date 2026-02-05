const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
  name: String,
  id: String,
  department: String,
  designation: String,
  
  resetToken: String,
  resetTokenExpiry: Date
});

module.exports = mongoose.model("Faculty", userSchema, "faculty");
