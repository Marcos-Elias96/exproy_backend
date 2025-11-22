const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  // correo o matrícula — uno de los dos siempre existe
  correo: { type: String, default: null, unique: false },
  matricula: { type: String, default: null, unique: false },

  // se elimina "usuario" porque duplicaba info
  password: { type: String, required: true },

  rol: { type: String, required: true }
});

// índice compuesto para evitar duplicados reales
UserSchema.index({ correo: 1, matricula: 1 }, { unique: true });

module.exports = mongoose.model("User", UserSchema);