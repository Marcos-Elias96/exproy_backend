const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// =====================================
//   CONEXIÓN A MONGODB ATLAS
// =====================================
mongoose.connect(
  "mongodb+srv://EliasMarcos:Exproy2025db123@cluster0.ruxthth.mongodb.net/exproy2025?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
)
.then(() => console.log("Conectado a MongoDB Atlas"))
.catch((err) => console.error("Error al conectar:", err));

// =====================================
//        ESQUEMA DEL USUARIO
// =====================================
const UserSchema = new mongoose.Schema({
  usuario: String,   // correo o matrícula
  password: String,
  rol: String        // alumno | profesor
});

const User = mongoose.model("usuarios", UserSchema);

// =====================================
//            REGISTRO
// =====================================
app.post("/register", async (req, res) => {
  const { usuario, password, rol } = req.body;

  try {
    const exists = await User.findOne({ usuario });

    if (exists) {
      return res.json({ ok: false, msg: "Usuario ya existe" });
    }

    const newUser = new User({ usuario, password, rol });
    await newUser.save();

    return res.json({ ok: true, msg: "Cuenta creada correctamente" });

  } catch (err) {
    return res.json({ ok: false, msg: "Error del servidor", error: err });
  }
});

// =====================================
//              LOGIN
// =====================================
app.post("/login", async (req, res) => {
  const { usuario, password, rol } = req.body;

  try {
    const user = await User.findOne({ usuario });

    if (!user) {
      return res.json({ ok: false, msg: "Usuario no encontrado" });
    }

    if (user.password !== password) {
      return res.json({ ok: false, msg: "Contraseña incorrecta" });
    }

    if (user.rol !== rol) {
      return res.json({ ok: false, msg: "El rol no coincide" });
    }

    return res.json({
      ok: true,
      msg: "Login exitoso",
      rol: user.rol,
    });

  } catch (err) {
    return res.json({ ok: false, msg: "Error del servidor", error: err });
  }
});

// =====================================
//           INICIAR SERVIDOR
// =====================================
app.listen(3000, () => {
  console.log("Servidor corriendo en http://10.0.2.2:3000");
});