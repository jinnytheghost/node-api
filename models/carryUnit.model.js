const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const CarryUnitTypes = require("./carryUnitType.model");

let CarryUnitSchema = new Schema({
  id: mongoose.Schema.Types.ObjectId,
  typeId: { type: Schema.Types.ObjectId, ref: "CarryUnitTypes" },
  externalCarryUnitId: { type: String, required: true },
  creationTime: { type: Number, default: Date.now },
  carryUnitId: { type: String },
  isArchived: { type: Boolean, default: false }
});

module.exports = mongoose.model("CarryUnit", CarryUnitSchema);
