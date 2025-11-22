const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  usuario: { type: String, required: true, unique: true },
  password: { type: String, required: true },

  rol: { type: String, required: true },

  correo: { type: String, default: null },
  matricula: { type: String, default: null }
});

module.exports = mongoose.model("User", UserSchema);