const mongoose = require("mongoose");

const inspectionSchema = new mongoose.Schema({
  planType: { type: String, enum: ["Single", "Double"], required: true },
  lotSize: Number,

  // Single Sampling
  sampleSize: Number,
  acceptanceNumber: Number,
  defectsObserved: Number,

  // Double Sampling
  n1: Number,
  c1: Number,
  r1: Number,
  d1: Number,
  n2: Number,
  c2: Number,
  r2: Number,
  d2: Number,

  decision: String,
  date: { type: Date, default: Date.now }
});


module.exports = mongoose.model("Inspection", inspectionSchema);
