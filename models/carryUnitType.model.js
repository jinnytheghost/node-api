const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let CarryUnitTypeSchema = new Schema({
  id: mongoose.Schema.Types.ObjectId,
  type: { type: String, required: true, max: 100 },
  height: { type: Number, default: 0 },
  width: { type: Number, default: 0 },
  length: { type: Number, default: 0 },
  weight: { type: Number, default: 0 },
  registrationTime: { type: Number, default: Date.now },
  creationTime: { type: Number, default: Date.now },
  carryUnitId: { type: String },
  isArchived: { type: Boolean, default: false }
});

module.exports = mongoose.model("CarryUnitTypes", CarryUnitTypeSchema);
