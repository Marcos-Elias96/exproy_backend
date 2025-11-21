const express = require("express");
const router = express.Router();
const twilio = require("twilio");
require("dotenv").config();

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

router.post("/", async (req, res) => {
  const { phone } = req.body;

  if (!phone) {
    return res.json({ ok: false, msg: "Número requerido" });
  }

  const code = Math.floor(100000 + Math.random() * 900000);

  try {
    const to = `whatsapp:+52${phone}`;

    const message = await client.messages.create({
      from: process.env.TWILIO_WHATSAPP_FROM,
      to: to,
      body: `Tu código de verificación es: ${code}`
    });

    return res.json({ ok: true, code, sid: message.sid });

  } catch (err) {
    console.log("❌ ERROR TWILIO:", err);
    return res.json({ ok: false, msg: "Error enviando WhatsApp", error: err });
  }
});

module.exports = router;