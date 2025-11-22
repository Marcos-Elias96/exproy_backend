const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  usuario: { type: String, required: true, unique: true }, // matrícula o correo
  password: { type: String, required: true },
  rol: { type: String, enum: ["alumno", "profesor"], required: true },

  matricula: { type: String, default: null },
  correo: { type: String, default: null },

  fechaRegistro: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("User", UserSchema);
