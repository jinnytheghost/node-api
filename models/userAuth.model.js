const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let UsersAuthSchema = new Schema({
  _id: mongoose.Schema.Types.ObjectId,
  email: {
    type: String,
    required: true,
    unique: true,
    match: /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
  },
  password: { type: String, required: true },
  isAdmin: Boolean,
  secretToken: String,
  active: Boolean,
  name: { type: String, default: 'John Doe' },
  userId: { type: String },
  isArchived: { type: Boolean, default: false }
});

// Export the model
module.exports = mongoose.model("UserAuth", UsersAuthSchema);
