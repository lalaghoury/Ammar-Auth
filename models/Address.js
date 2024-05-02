const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const addressSchema = new Schema(
  {
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    address_line_1: { type: String, required: true },
    appartment: { type: String },
    street: { type: String, required: true },
    address_line_2: { type: String },
    city: { type: String, required: true },
    state: { type: String, required: true },
    country: { type: String, required: true, default: "UK" },
    pincode: { type: String, required: true },
    phone: { type: String, required: true },
    address_type: {
      type: String,
      required: true,
      enum: ["shipping", "billing"],
    },
    user: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Address", addressSchema);
