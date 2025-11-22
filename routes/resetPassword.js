const express = require("express");
const router = express.Router();
const User = require("../models/User");

router.post("/", async (req, res) => {
  const { usuario, newPassword } = req.body;

  const isEmail = usuario.includes("@");

  try {
    const user = isEmail
      ? await User.findOne({ correo: usuario })
      : await User.findOne({ matricula: usuario });

    if (!user)
      return res.json({ ok: false, msg: "Usuario no encontrado" });

    user.password = newPassword;
    await user.save();

    res.json({ ok: true, msg: "Contraseña actualizada" });
  } catch (err) {
    res.json({ ok: false, msg: "Error al actualizar" });
  }
});

module.exports = router;
