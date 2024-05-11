const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const { requireSignin, isAdmin } = require("../middlewares/authMiddleware");

// Get All Products
router.get("/all", productController.listProducts);

// Get Single Product
router.get("/single/:productId", productController.readProduct);

// Get lazy load products
router.get("/lazy-load", productController.getLazyProducts);

// Get All Product Names
router.get("/names", productController.listProductsNames);

// GET Filtered Products
router.get("/filter", productController.listFilteredProducts);

// Get Products by User Wishlists
router.get(
  "/user-wishlist",
  requireSignin,
  productController.readWishlistProducts
);

// Get User Wishlist Count
router.get(
  "/user-wishlist-count",
  requireSignin,
  productController.readWishlistProductsCount
);

// Create New Product
router.post("/new", isAdmin, productController.createProduct);

// Add Product to Wishlist
router.post(
  "/add-to-wishlist/:productId",
  requireSignin,
  productController.addToWishlist
);

// Remove Product from Wishlist
router.post(
  "/remove-from-wishlist/:productId",
  requireSignin,
  productController.removeFromWishlist
);

// Update Product
router.put("/edit/:productId", isAdmin, productController.updateProduct);

// Delete Product
router.delete("/:productId", isAdmin, productController.deleteProduct);

module.exports = router;
