const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Batch = require('./batch.model');
const CarryUnit = require('./carryUnit.model');

let BatchToCarryUnitSchema = new Schema({
  id: mongoose.Schema.Types.ObjectId,
  batchId: { type: Schema.Types.ObjectId, ref: 'Batch' },
  carryUnitId: { type: Schema.Types.ObjectId, ref: 'CarryUnit' },
  creationTime: { type: Number, default: Date.now },
});

module.exports = mongoose.model("BatchToCarryUnit", BatchToCarryUnitSchema);
