const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let SubstrateIngredientsSchema = new Schema({
  id: mongoose.Schema.Types.ObjectId,
  name: { type: String, required: true, max: 100 },
  type: { type: String, required: true, max: 100 },
  supplier: { type: String, required: true, max: 100 },
  percentOfTotalWeight: { type: Number, required: true },
  weight: { type: Number, required: true },
  code: { type: String, required: true },
  deliveryTime: { type: Number, default: Date.now },
  creationTime: { type: Number, default: Date.now },
  isArchived: { type: Boolean, default: false },
  feedId: { type: String },
  usedInSubstrate: { type: Number },
  notes: { type: String, default: "" }
});

let RegisteredSubstrateSchema = new Schema({
  id: mongoose.Schema.Types.ObjectId,
  name: { type: String, required: true, max: 100 },
  batchName: { type: String, required: true, max: 100 },
  ingredients: [SubstrateIngredientsSchema],
  moisture: { type: Number, required: true },
  weight: { type: Number, required: true },
  deliveryTime: { type: Number, default: Date.now },
  creationTime: { type: Number, default: Date.now },
  isArchived: { type: Boolean, default: false },
  substrateId: { type: String },
  notes: { type: String, default: "" }
});

// use mongoose midleware to add substrateId before saving new substrate
RegisteredSubstrateSchema.pre('save', function (next) {
  this.substrateId = this.get('_id'); // considering _id is input by client
  next();
});

module.exports = mongoose.model("RegisteredSubstrate", RegisteredSubstrateSchema);
