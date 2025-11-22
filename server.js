const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());

// Ruta raíz
app.get("/", (req, res) => {
  res.status(200).send("Backend funcionando ✔️");
});

// Conexión MongoDB
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("Conectado a MongoDB Atlas"))
  .catch((err) => console.error("Error MongoDB:", err));

// Modelo
const User = require("./models/User");

// ==========================
//     REGISTRO
// ==========================
app.post("/register", async (req, res) => {
  const { usuario, password } = req.body;

  try {
    const exists = await User.findOne({ usuario });
    if (exists) return res.json({ ok: false, msg: "Usuario ya existe" });

    const esProfesor = usuario.includes("@");

    const nuevo = new User({
      usuario,
      password,
      rol: esProfesor ? "profesor" : "alumno",
      correo: esProfesor ? usuario : null,
      matricula: esProfesor ? null : usuario
    });

    await nuevo.save();
    res.json({ ok: true, rol: nuevo.rol });

  } catch (err) {
    console.error(err);
    res.json({ ok: false, msg: "Error servidor" });
  }
});

// ==========================
//        LOGIN
// ==========================
app.post("/login", async (req, res) => {
  const { usuario, password } = req.body;

  try {
    const user = usuario.includes("@")
      ? await User.findOne({ correo: usuario })
      : await User.findOne({ matricula: usuario });

    if (!user) return res.json({ ok: false, msg: "Usuario no existe" });

    if (user.password !== password)
      return res.json({ ok: false, msg: "Contraseña incorrecta" });

    res.json({ ok: true, rol: user.rol });

  } catch (err) {
    console.error(err);
    res.json({ ok: false, msg: "Error servidor" });
  }
});

// ==========================
//    DESACTIVAR 2FA TEMPORAL
// ==========================
// 🚫 Estas rutas están rompiendo Railway
// app.use("/sendCode", require("./routes/sendCode"));
// app.use("/verifyCode", require("./routes/verifyCode"));
// app.use("/resetPassword", require("./routes/resetPassword"));

// PUERTO
const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log("Servidor corriendo en puerto:", PORT);
});
