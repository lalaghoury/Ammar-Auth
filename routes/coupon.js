const express = require("express");
const Coupon = require("../models/Coupon.js");
const Cart = require("../models/Cart.js");
const couponMiddleware = require("../middlewares/couponMiddleware.js");
const authMiddleware = require("../middlewares/authMiddleware.js");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const coupons = await Coupon.find();
    res.json(coupons);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/:id", getCoupon, (req, res) => {
  res.json(res.coupon);
});

router.post("/", async (req, res) => {
  const coupon = new Coupon(req.body);
  try {
    const newCoupon = await coupon.save();
    res.status(201).json({
      newCoupon,
      message: "Coupon created successfully",
      success: true,
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete("/:id", getCoupon, (req, res) => {
  res.coupon
    .remove()
    .then(() => res.json({ message: "Coupon deleted successfully" }))
    .catch((err) => res.status(500).json({ error: err.message }));
});

router.post(
  "/apply-coupon",
  authMiddleware.requireSignin,
  couponMiddleware.getCoupon,
  async (req, res) => {
    const { discountPercent, code } = req.coupon;

    try {
      const cart = await Cart.findOne({ userId: req.user._id });

      if (!cart || cart.items.length === 0) {
        return res.status(404).json({
          message:
            "We can't apply the coupon to your cart, because we couldn't find your cart. Please make sure you have added items to your cart before trying to apply a coupon.",
        });
      }

      if (cart.couponApplied || cart.coupon === code) {
        return res
          .status(400)
          .json({ message: "Coupon already applied to this cart" });
      }

      const savings = (discountPercent / 100) * cart.price;

      cart.savings = savings;
      cart.total = cart.price - cart.savings;
      cart.couponApplied = true;
      cart.coupon = code;

      await cart.save();

      return res
        .status(200)
        .json({ message: "Coupon applied successfully", cart, success: true });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        error: error.message,
        success: false,
        message: "Error applying coupon",
      });
    }
  }
);

async function getCoupon(req, res, next) {
  try {
    const coupon = await Coupon.findById(req.params.id);
    if (coupon == null) {
      return res.status(404).json({ error: "Coupon not found" });
    }
    res.coupon = coupon;
    next();
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

module.exports = router;
