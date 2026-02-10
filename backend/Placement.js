const mongoose = require("mongoose");

const placementSchema = new mongoose.Schema({
  name: String,
  jobrole: String,
  date: String,
  time: String,
  endtime: String,
  venue: String,
  location: String,
  audience: String,
  stipend: Number,
  description: String,
  status: {
    type: String,
    default: "pending",
  },
  registrations: [
    {
      name: String,
      email: String,
    },
  ],
  totalAppeared: { type: Number, default: 0 },
  totalPlaced: { type: Number, default: 0 },
});

module.exports = mongoose.model("Placement", placementSchema, "placementModule");
