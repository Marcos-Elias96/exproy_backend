const express = require("express");
const router = express.Router();
const User = require("../models/User");

router.post("/", async (req, res) => {
  const { usuario, newPassword } = req.body;

  if (!usuario || !newPassword) {
    return res.json({ ok: false, msg: "Faltan datos" });
  }

  try {
    const user = await User.findOne({ usuario });

    if (!user) {
      return res.json({ ok: false, msg: "Usuario no encontrado" });
    }

    user.password = newPassword;
    await user.save();

    return res.json({ ok: true, msg: "Contraseña actualizada" });
  } catch (err) {
    return res.json({ ok: false, msg: "Error al actualizar", error: err });
  }
});

module.exports = router;