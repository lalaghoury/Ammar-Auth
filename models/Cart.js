// cart.model.js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const cartSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: [true, "Product is required"],
        },
        quantity: { type: Number },
        color: { type: String, required: [true, "Color is required"] },
        size: { type: String, required: [true, "Size is required"] },
        price: { type: Number, default: 0 },
      },
    ],
    couponApplied: { type: Boolean, default: false },
    coupon: {
      type: String,
      default: null,
    },
    price: { type: Number, default: 0 },
    total: { type: Number, default: 0 },
    savings: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Cart", cartSchema);
