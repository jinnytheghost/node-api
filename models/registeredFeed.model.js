const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let RegisteredFeedSchema = new Schema({
  id: mongoose.Schema.Types.ObjectId,
  name: { type: String, required: true, max: 100 },
  type: { type: String, required: true, max: 100 },
  supplier: { type: String, required: true, max: 100 },
  weight: { type: Number, required: true },
  code: { type: String, required: true },
  deliveryTime: { type: Number, default: Date.now },
  creationTime: { type: Number, default: Date.now },
  isArchived: { type: Boolean, default: false },
  notes: { type: String, default: '' }
});

module.exports = mongoose.model("RegisteredFeed", RegisteredFeedSchema);
