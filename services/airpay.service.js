const crypto = require("crypto");

exports.createPayment = async (order) => {

  const mercid = process.env.AIRPAY_MERCHANT_ID;
  const secret = process.env.AIRPAY_SECRET_KEY;

  const orderId = order.order_id;
  const amount = Number(order.amount).toFixed(2);
  const email = order.email;
  const phone = order.phone;
  const name = order.name;

  const returnUrl = `${process.env.BASE_URL}/payment/return`;
  const notifyUrl = `${process.env.BASE_URL}/api/payment/webhook/airpay`;

  /**
   * FORM FLOW CHECKSUM
   */
  const checksumString =
    mercid +
    orderId +
    amount +
    email +
    phone +
    secret;

  const checksum = crypto
    .createHash("sha256")
    .update(checksumString)
    .digest("hex");

  console.log("FORM CHECKSUM STRING:", checksumString);
  console.log("FORM CHECKSUM:", checksum);

  return {
    type: "form",
    action: "https://payments.airpay.co.in/pay/index.php",
    method: "POST",
    fields: {
      mercid,
      orderid: orderId,
      amount,
      buyerEmail: email,
      buyerPhone: phone,
      buyerFirstName: name,
      buyerLastName: "User",
      returnUrl,
      notifyUrl,
      checksum
    }
  };
};