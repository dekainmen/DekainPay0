require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();

/**
 * ===============================
 * Middleware
 * ===============================
 */

// Parse JSON
app.use(bodyParser.json());

// Parse x-www-form-urlencoded
// Required for payment redirects + webhooks
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

/**
 * ===============================
 * Static Frontend
 * ===============================
 */

app.use(
  express.static(
    path.join(__dirname, "public")
  )
);

/**
 * ===============================
 * Routes
 * ===============================
 */

// Payment Routes
app.use(
  "/api/payment",
  require("./routes/payment.routes")
);

// Products Routes
app.use(
  "/api/products",
  require("./routes/products.routes")
);

// Orders Routes
app.use(
  "/api/orders",
  require("./routes/orders.routes")
);

/**
 * ===============================
 * Gateway Return URL (UPDATED)
 * ===============================
 * Handles redirect from gateway
 * Supports GET + POST
 */

app.all(
  "/payment-return",
  (req, res) => {

    console.log(
      "==============================="
    );
    console.log(
      "PAYMENT RETURN HIT"
    );
    console.log(
      "METHOD:",
      req.method
    );
    console.log(
      "QUERY:",
      req.query
    );
    console.log(
      "BODY:",
      req.body
    );
    console.log(
      "==============================="
    );

    /**
     * Extract params safely
     * Gateways send different keys
     */

    const status =
      req.body.status ||
      req.body.txn_status ||
      req.body.payment_status ||
      req.body.result ||
      req.body.paymentStatus ||
      req.query.status ||
      req.query.txn_status ||
      req.query.payment_status ||
      req.query.result ||
      req.query.paymentStatus ||
      "UNKNOWN";

    const order_id =
      req.body.order_id ||
      req.body.txnid ||
      req.body.orderId ||
      req.body.merchant_order_id ||
      req.body.orderid ||
      req.query.order_id ||
      req.query.txnid ||
      req.query.orderId ||
      req.query.merchant_order_id ||
      req.query.orderid ||
      "NA";

    /**
     * Normalize status
     */

    const normalizedStatus =
      String(status).toUpperCase();

    console.log(
      "Normalized Status:",
      normalizedStatus,
      "Order ID:",
      order_id
    );

    /**
     * SUCCESS CASE
     */

    if (
      normalizedStatus === "SUCCESS" ||
      normalizedStatus === "COMPLETED" ||
      normalizedStatus === "PAID"
    ) {

      return res.redirect(
        `/success.html?order_id=${order_id}`
      );
    }

    /**
     * FAILURE / CANCELLED / UNKNOWN
     */

    return res.redirect(
      `/failure.html?order_id=${order_id}`
    );
  }
);

/**
 * ===============================
 * Health Check
 * ===============================
 */

app.get("/health", (req, res) => {
  res.send("Server running");
});

/**
 * ===============================
 * Start Server
 * ===============================
 */

const PORT =
  process.env.PORT || 3000;

app.listen(PORT, () =>
  console.log(
    `Server running on ${PORT}`
  )
);
