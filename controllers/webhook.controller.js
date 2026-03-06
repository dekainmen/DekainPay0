// controllers/webhook.controller.js

const crypto = require("crypto");

exports.airpayWebhook = async (req, res) => {

  const body = req.body;

  const data = `${body.mercid}|${body.orderid}|${body.amount}|${body.status}`;

  const generated = crypto
    .createHash("sha256")
    .update(data)
    .digest("hex");

  if (generated !== body.checksum) {
    return res.status(400).send("Invalid checksum");
  }

  const orderId = body.orderid;

  if (body.status === "success") {
    await markOrderPaid(orderId);
  } else {
    await markOrderFailed(orderId);
  }

  res.sendStatus(200);
};