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
  maxParticipants: {
    type: Number,
    default: null   // null = unlimited
  },
  conductedBy: {
    type: mongoose.Schema.Types.ObjectId,   
    ref: "Faculty",                        
    required: false
  },

  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending"
  },
  registeredStudents: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  ]
});

module.exports = mongoose.model("Event", eventSchema);
