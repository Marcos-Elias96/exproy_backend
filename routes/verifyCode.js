const express = require("express");
const router = express.Router();

router.post("/", (req, res) => {
  const { sentCode, userCode } = req.body;

  if (!sentCode || !userCode) {
    return res.json({ ok: false, msg: "Datos incompletos" });
  }

  if (sentCode == userCode) {
    return res.json({ ok: true, msg: "Código correcto" });
  }

  return res.json({ ok: false, msg: "Código incorrecto" });
});

module.exports = router;