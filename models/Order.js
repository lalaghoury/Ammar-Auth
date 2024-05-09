const mongoose = require("mongoose");
const { Schema } = mongoose;

const orderSchema = new Schema(
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
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required"],
    },
    status: {
      type: String,
      default: "Not Processed",
      enum: [
        "Not Processed",
        "Processing",
        "Shipped",
        "Delivered",
        "Cancelled",
      ],
    },
    payment: {},
    shipping_address: {
      type: Schema.Types.ObjectId,
      ref: "Address",
      required: [true, "Shipping address is required"],
    },
    billing_address: {
      type: Schema.Types.ObjectId,
      ref: "Address",
      required: [true, "Shipping address is required"],
    },
    amount: { type: Number, required: [true, "Amount is required"] },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
