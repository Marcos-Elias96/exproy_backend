const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());

// =====================================
//           ROOT TEST ROUTE
// =====================================
app.get("/", (req, res) => {
  res.send("Backend funcionando ✔️");
});

// =====================================
//        CONEXIÓN A MONGO ATLAS
// =====================================
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("Conectado a MongoDB Atlas"))
  .catch((err) => console.log("Error Mongo:", err));

// Modelo
const User = require("./models/User");

// =====================================
//              REGISTRO
// =====================================
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

    return res.json({ ok: true, rol: nuevo.rol });

  } catch (err) {
    console.log("Error en /register:", err);
    return res.json({ ok: false, msg: "Error servidor" });
  }
});

// =====================================
//                LOGIN
// =====================================
app.post("/login", async (req, res) => {
  const { usuario, password } = req.body;

  try {
    const isEmail = usuario.includes("@");

    const user = isEmail
      ? await User.findOne({ correo: usuario })
      : await User.findOne({ matricula: usuario });

    if (!user) return res.json({ ok: false, msg: "Usuario no existe" });

    if (user.password !== password)
      return res.json({ ok: false, msg: "Contraseña incorrecta" });

    return res.json({
      ok: true,
      rol: user.rol,
      usuario: user.usuario
    });

  } catch (err) {
    console.log("Error en /login:", err);
    return res.json({ ok: false, msg: "Error servidor" });
  }
});

// =====================================
//             RUTAS 2FA
// =====================================
app.use("/sendCode", require("./routes/sendCode"));
app.use("/verifyCode", require("./routes/verifyCode"));
app.use("/resetPassword", require("./routes/resetPassword"));

// =====================================
//            PUERTO RAILWAY
// =====================================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Servidor corriendo en puerto:", PORT));