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
    payment: {
      cardType: {
        type: String,
        required: [true, "Payment method is required"],
      },
      brand: { type: String, required: [true, "Payment method is required"] },
      last4: { type: String, required: [true, "Payment method is required"] },
      exp_month: {
        type: Number,
        required: [true, "Payment method is required"],
      },
      exp_year: {
        type: Number,
        required: [true, "Payment method is required"],
      },
      country: { type: String, required: [true, "Payment method is required"] },
      imageUrl: {
        type: String,
        required: [true, "Payment method image is required"],
      },
    },
    shipping_address: {
      type: Object,
      required: [true, "Shipping address is required"],
    },
    billing_address: {
      type: Object,
      required: [true, "Shipping address is required"],
    },
    coupon: { type: String, default: null },
    amount: { type: Number, required: [true, "Amount is required"] },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
