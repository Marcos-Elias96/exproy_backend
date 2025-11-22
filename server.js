const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// --- Ruta raíz ---
app.get("/", (req, res) => {
  res.send("Backend funcionando ✔️");
});

// --- Conexión MongoDB ---
mongoose.connect("mongodb+srv://flutterUser:Exproy2025@cluster0.ruxthth.mongodb.net/exproyDB?retryWrites=true&w=majority&appName=Cluster0")
  .then(() => console.log("MongoDB conectado ✔️"))
  .catch(err => console.error("Error Mongo:", err));

// Modelo
const User = require("./models/User");

// --- Registro ---
app.post("/register", async (req, res) => {
  const { usuario, password } = req.body;

  try {
    // Verificar si ya existe por correo o matrícula
    const existe = usuario.includes("@")
      ? await User.findOne({ correo: usuario })
      : await User.findOne({ matricula: usuario });

    if (existe) return res.json({ ok: false, msg: "Usuario ya existe" });

    const nuevo = new User({
      usuario,
      password,
      rol: usuario.includes("@") ? "profesor" : "alumno",
      correo: usuario.includes("@") ? usuario : null,
      matricula: usuario.includes("@") ? null : usuario
    });

    await nuevo.save();
    res.json({ ok: true, rol: nuevo.rol });

  } catch (err) {
    console.error(err);
    res.json({ ok: false, msg: "Error servidor" });
  }
});

// --- Login ---
app.post("/login", async (req, res) => {
  const { usuario, password } = req.body;

  try {
    // Buscar usuario dependiendo si es matrícula o correo
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

// --- Puerto Railway ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () =>
  console.log("Servidor corriendo en puerto:", PORT)
);