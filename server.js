const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// ruta raíz
app.get("/", (req, res) => {
  res.send("Backend funcionando ✔️");
});

// MongoDB
mongoose.connect("mongodb+srv://flutterUser:Exproy2025@cluster0.ruxthth.mongodb.net/exproyDB?retryWrites=true&w=majority&appName=Cluster0")
  .then(() => console.log("MongoDB conectado ✔️"))
  .catch(err => console.error("Error Mongo:", err));

const User = require("./models/User");

// --- Registro ---
app.post("/register", async (req, res) => {
  const { usuario, password } = req.body;

  try {
    let correo = null;
    let matricula = null;

    if (usuario.includes("@")) correo = usuario;
    else matricula = usuario;

    // verificar existencia
    const existe = await User.findOne({
      $or: [
        { correo },
        { matricula }
      ]
    });

    if (existe) return res.json({ ok: false, msg: "Usuario ya existe" });

    const nuevo = new User({
      correo,
      matricula,
      password,
      rol: correo ? "profesor" : "alumno"
    });

    await nuevo.save();

    res.json({ ok: true, rol: nuevo.rol });

  } catch (err) {
    console.error("🔥 ERROR REGISTER:", err);
    res.json({ ok: false, msg: "Error servidor" });
  }
});

// --- Login ---
app.post("/login", async (req, res) => {
  const { usuario, password } = req.body;

  try {
    const query = usuario.includes("@")
      ? { correo: usuario }
      : { matricula: usuario };

    const user = await User.findOne(query);

    if (!user) return res.json({ ok: false, msg: "Usuario no existe" });

    if (user.password !== password)
      return res.json({ ok: false, msg: "Contraseña incorrecta" });

    res.json({ ok: true, rol: user.rol });

  } catch (err) {
    console.error("🔥 ERROR LOGIN:", err);
    res.json({ ok: false, msg: "Error servidor" });
  }
});

// Puerto Railway
const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () =>
  console.log("Servidor corriendo en puerto:", PORT)
);