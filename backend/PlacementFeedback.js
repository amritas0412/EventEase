const mongoose = require("mongoose");

const placementFeedbackSchema = new mongoose.Schema({
  placementId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Placement",
    required: true
  },
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    required: true
  },
  rating: {
    type: Number,
    required: true
  },
  comment: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});


placementFeedbackSchema.index(
  { placementId: 1, studentId: 1 },
  { unique: true }
);

module.exports = mongoose.model( "PlacementFeedback", placementFeedbackSchema );