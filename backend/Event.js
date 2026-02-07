
const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  eventName: {
    type: String,
    required: true
  },
  date: String,
  startTime: String,
  endTime: String,
  venue: String,
  eligible: String,
  description: String,

  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending"
  }
});

module.exports = mongoose.model("Event", eventSchema);
