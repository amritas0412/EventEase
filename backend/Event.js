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

  conductedBy: {
    type: mongoose.Schema.Types.ObjectId,   // ✅ IMPORTANT
    ref: "Faculty",                        // ✅ IMPORTANT
    required: true
  },

  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending"
  }
});

module.exports = mongoose.model("Event", eventSchema);
