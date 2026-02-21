const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema({
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Event",
    required: true
  },
  placementId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Placement",
    default: null
  },
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    default: ""
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// 🚫 Prevent duplicate feedback from same student for same event
feedbackSchema.index({ eventId: 1, studentId: 1 }, { unique: true });

module.exports = mongoose.model("Feedback", feedbackSchema);