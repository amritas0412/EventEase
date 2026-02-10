const mongoose = require("mongoose");

const registrationSchema = new mongoose.Schema({
  studentId: { type: String, required: true },

  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Event",
    default: null,
  },

  placementId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Placement",
    default: null,
  },

  registrationDate: {
    type: Date,
    default: Date.now,
  },
});

registrationSchema.index(
  { studentId: 1, eventId: 1, placementId: 1 },
  { unique: true }
);

module.exports = mongoose.model("Registration", registrationSchema, "registration");