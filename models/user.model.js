const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let UsersSchema = new Schema({
  _id: mongoose.Schema.Types.ObjectId,
  firstname: { type: String, required: true, max: 100 },
  lastname: { type: String, required: true, max: 100 },
  email: { type: String, required: true, max: 100 }
});

// Export the model
module.exports = mongoose.model("User", UsersSchema);
