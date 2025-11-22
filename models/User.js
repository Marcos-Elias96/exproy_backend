const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  correo: { type: String, default: null },
  matricula: { type: String, default: null },

  password: { type: String, required: true },
  rol: { type: String, required: true }
});

module.exports = mongoose.model("User", UserSchema);