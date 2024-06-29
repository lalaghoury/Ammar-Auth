const mongoose = require("mongoose");
const { Schema } = mongoose;

const PendingOrdersSchema = new Schema(
  {
    products: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: [true, "Product is required"],
        },
        quantity: { type: Number, required: [true, "Quantity is required"] },
        color: { type: String, required: [true, "Color is required"] },
        size: { type: String, required: [true, "Size is required"] },
      },
    ],
    customer: {
      type: String,
      required: [true, "Customer id is required"],
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required"],
    },
    coupon: { type: Object },
    couponApplied: { type: Boolean, default: false },
    amount: { type: Number, required: [true, "Total is required"] },
  },
  { timestamps: true }
);

module.exports = mongoose.model("PendingOrders", PendingOrdersSchema);
