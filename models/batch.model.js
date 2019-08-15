const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Stages = require('./stages.model');
const UserAuth = require('./userAuth.model');

let BatchSchema = new Schema({
  id: mongoose.Schema.Types.ObjectId,
  name: { type: String, required: true, max: 100 },
  registrationTime: { type: Number, default: Date.now },
  emanationTime: { type: Number, default: Date.now },
  supplier: { type: String, required: true, max: 100 },
  stageId: { type: Schema.Types.ObjectId, ref: 'Stages' },
  userId: { type: Schema.Types.ObjectId, ref: 'UserAuth' },
  creationTime: { type: Number, default: Date.now },
  weight: { type: Number, default: 0 },
  notes: { type: String, default: '' }
});

module.exports = mongoose.model("Batch", BatchSchema);
