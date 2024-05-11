const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const categorySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    description: { type: String, required: false },
    products: [{ type: Schema.Types.ObjectId, ref: "Product" }],
    image: { type: String, required: [true, "Image is required"] },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Category", categorySchema);
