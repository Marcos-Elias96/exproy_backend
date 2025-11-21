const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();  // <--- IMPORTANTE para Railway

const app = express();
app.use(express.json());
app.use(cors());

// Conectar MongoDB
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("Conectado a MongoDB Atlas"))
  .catch((err) => console.log("Error Mongo:", err));

// Modelo
const User = require("./models/User");

// RUTA: Registrar usuario
app.post("/register", async (req, res) => {
  const { usuario, password } = req.body;

  try {
    const exists = await User.findOne({ usuario });
    if (exists) return res.json({ ok: false, msg: "Usuario ya existe" });

    const rol = usuario.includes("@") ? "profesor" : "alumno";

    await new User({ usuario, password, rol }).save();

    res.json({ ok: true, rol });
  } catch (err) {
    res.json({ ok: false, msg: "Error servidor" });
  }
});

// RUTA: Login
app.post("/login", async (req, res) => {
  const { usuario, password } = req.body;

  try {
    const user = await User.findOne({ usuario });

    if (!user) return res.json({ ok: false, msg: "Usuario no existe" });
    if (user.password !== password)
      return res.json({ ok: false, msg: "Contraseña incorrecta" });

    res.json({ ok: true, rol: user.rol });
  } catch (err) {
    res.json({ ok: false, msg: "Error servidor" });
  }
});

// Rutas 2FA
app.use("/sendCode", require("./routes/sendCode"));
app.use("/verifyCode", require("./routes/verifyCode"));
app.use("/resetPassword", require("./routes/resetPassword"));

// PUERTO DINÁMICO PARA RAILWAY ⚠️
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Servidor corriendo en puerto:", PORT);
});
