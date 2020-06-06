const mongoose = require("mongoose");

const UsersSchema = mongoose.Schema;
const users = new UsersSchema({
  _id: mongoose.Schema.Types.ObjectId,
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  country: { type: String, required: true },
  phone: { type: Number, required: true },
});

module.exports = mongoose.model("users", users);
