const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let StagesSchema = new Schema({
  id: mongoose.Schema.Types.ObjectId,
  name: { type: String, required: true, max: 100 },
  creationTime: { type: Number, default: Date.now },
  isArchived: { type: Boolean, default: false }
});

module.exports = mongoose.model("Stages", StagesSchema);
