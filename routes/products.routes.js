const express = require("express");
const router = express.Router();

/**
 * Load products JSON
 */
const products =
  require("../data/products.json");

/**
 * CATEGORY MAPPER
 * Maps raw Shopify categories
 * → Site navigation categories
 */
function mapCategory(product) {

  const raw = (
    product.category ||
    product.product_type ||
    product.type ||
    ""
  ).toLowerCase();

  if (
    raw.includes("wallet") ||
    raw.includes("bag") ||
    raw.includes("sunglass") ||
    raw.includes("belt")
  ) {
    return "Accessories";
  }

  if (raw.includes("analog watch") ||
    raw.includes("smart watch")
    ) {
    return "Watches";
  }

  if (
    raw.includes("running shoes") ||  
    raw.includes("sneaker and casual shoes") ||
    raw.includes("flip flops") ||
    raw.includes("formal shoes")
  )
    return "Footwear";

  if (
    raw.includes("shirts") ||
    raw.includes("t-shirts") ||
    raw.includes("jackets") ||
    raw.includes("jeans") ||
    raw.includes("jackets") ||
    raw.includes("sweatshirts") ||
    raw.includes("trousers") ||
    raw.includes("shorts")
  )
    return "Clothing";

  if (
    raw.includes("nehru jackets") ||
    raw.includes("kurta")
   )
    return "Ethnics";

  if (
    raw.includes("facecream") ||
    raw.includes("facewash") ||
    raw.includes("perfumes") ||  
    raw.includes("deodrants") ||
    raw.includes("trimmers") ||
    raw.includes("shampoo")
  )
    return "Grooming";

  return "Accessories";
}

/**
 * GET all / category products
 */
router.get("/", (req, res) => {

  try {

    const { category } =
      req.query;

    let result = products;

    /**
     * Category filter
     */
    if (category) {

      result =
        products.filter(p =>

          mapCategory(p)
            .toLowerCase() ===
          category.toLowerCase()
        );
    }

    res.json(result);

  } catch (err) {

    console.error(
      "PRODUCT FETCH ERROR:",
      err
    );

    res.status(500).json({
      error:
        "Failed to fetch products"
    });
  }
});

module.exports = router;
