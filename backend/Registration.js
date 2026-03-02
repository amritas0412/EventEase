const mongoose = require("mongoose");

const registrationSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    required: true
  },
  name: String,
  eventName: String,
  date: String,
  conductedBy: String,

  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Event",
    default: null
  },

  placementId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Placement",
    default: null
  },

  registrationDate: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Registration", registrationSchema, "registration");