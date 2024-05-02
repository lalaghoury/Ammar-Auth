const express = require("express");
const router = express.Router();

const { requireSignin } = require("../middlewares/authMiddleware");
const cartController = require("../controllers/cartController");

// Get cart contents
router.get("/my-cart", requireSignin, cartController.listCart);

// Get count
router.get("/user-cart-count", requireSignin, cartController.getCount);

// Add item to cart
router.post("/add", requireSignin, cartController.createCart);

// Update item quantity in cart
router.put("/update", requireSignin, cartController.updateCart);

// Remove item from cart
router.delete("/remove/:itemId", requireSignin, cartController.deleteCartItem);

module.exports = router;
