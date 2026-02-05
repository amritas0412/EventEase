const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
  name: String,
  id: String,

  resetToken: String,
  resetTokenExpiry: Date
});

module.exports = mongoose.model("Admin", userSchema, "admin");