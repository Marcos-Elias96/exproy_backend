const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  correo:    { type: String, unique: true, sparse: true },
  matricula: { type: String, unique: true, sparse: true },
  password:  { type: String, required: true },
  rol:       { type: String, default: 'alumno' }
});

module.exports = mongoose.model('User', UserSchema);
