const express =
  require("express");

const router =
  express.Router();

/**
 * Load products JSON
 */
const products =
  require("../data/products.json");

/**
 * GET all products
 */
router.get("/", (req, res) => {

  res.json(products);

});

module.exports = router;
