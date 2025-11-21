const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  usuario: String,
  password: String,
  rol: String
});

module.exports = mongoose.model("usuarios", UserSchema);