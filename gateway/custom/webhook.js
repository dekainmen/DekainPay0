const kv =
  require("../../config/kv");

/**
 * Payment Gateway Webhook
 */
module.exports =
  async (req, res) => {

  try {

    console.log(
      "WEBHOOK RECEIVED:",
      req.body
    );

    const {
      status,
      order_id,
      amount,
      remark1,
      remark2
    } = req.body;

    if (!order_id) {

      return res.status(400)
        .send("Missing order_id");
    }

    /**
     * Fetch existing order
     */
    const existing =
      await kv.get(
        `order:${order_id}`
      );

    if (!existing) {

      console.log(
        "Order not found in KV:",
        order_id
      );

      return res.status(404)
        .send("Order not found");
    }

    /**
     * Safe parse
     */
    let order;

    if (typeof existing === "string") {
      order = JSON.parse(existing);
    } else {
      order = existing;
    }

    /**
     * Map gateway status
     */
    let paymentStatus =
      "PENDING";

    if (status === "SUCCESS") {
      paymentStatus = "SUCCESS";
    }

    if (status === "FAILED") {
      paymentStatus = "FAILED";
    }

    /**
     * Update order
     */
    order.status =
      paymentStatus;

    order.gateway_response =
      req.body;

    order.updated_at =
      Date.now();

    /**
     * Save back to KV
     */
    await kv.set(
      `order:${order_id}`,
      JSON.stringify(order)
    );

    console.log(
      "ORDER UPDATED:",
      order_id,
      paymentStatus
    );

    res.send(
      "Webhook processed"
    );

  } catch (err) {

    console.error(
      "WEBHOOK ERROR:",
      err
    );

    res.status(500)
      .send("Webhook failed");
  }
};
