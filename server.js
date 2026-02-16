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
// (Required for payment webhooks)
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

// Payment Routes (Create + Webhook)
app.use(
  "/api/payment",
  require("./routes/payment.routes")
);

// Products
app.use(
  "/api/products",
  require("./routes/products.routes")
);

// Orders
app.use(
  "/api/orders",
  require("./routes/orders.routes")
);

// Products
app.use(
  "/api/products",
  require("./routes/products.routes")
);

/**
 * ===============================
 * Gateway Return URL
 * ===============================
 * Handles payment redirect
 */

app.get(
  "/payment-return",
  (req, res) => {

    console.log(
      "Payment Redirect Hit:",
      req.query
    );

    const {
      status,
      order_id
    } = req.query;

    /**
     * SUCCESS
     */
    if (
      status === "SUCCESS" ||
      status === "success"
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
