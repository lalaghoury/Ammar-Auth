const mongoose = require("mongoose");
const { Schema } = mongoose;

const productSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
    },
    handle: {
      type: String,
      required: [true, "Handle is required"],
    },
    brand: {
      type: String,
      required: [true, "Brand is required"],
      default: "Our Brand",
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "Category is required"],
      ref: "Category",
    },
    dressStyle: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "Type is required"],
      ref: "DressStyle",
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    shipping: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
    },
    currency: {
      type: String,
      required: [true, "Currency is required"],
      default: "USD",
    },
    images: [
      {
        name: {
          type: String,
          required: [true, "Name is required"],
        },
        url: {
          type: String,
          required: [true, "Url is required"],
        },
      },
    ],
    thumbnail: {
      type: String,
      required: [true, "Thumbnail is required"],
    },
    sku: {
      type: String,
    },
    barcode: {
      type: String,
    },
    quantity: {
      type: Number,
    },
    allow_backorder: {
      type: Boolean,
    },
    height: {
      type: Number,
    },
    width: {
      type: Number,
    },
    length: {
      type: Number,
    },
    weight: {
      type: Number,
    },
    wishlists: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    ratings: {
      type: Number,
      default: 0,
    },
    numOfReviews: {
      type: Number,
      default: 0,
    },
    reviews: [
      {
        user: {
          type: mongoose.Schema.ObjectId,
          ref: "User",
          required: true,
        },
        name: {
          type: String,
          required: true,
        },
        rating: {
          type: Number,
          required: true,
        },
        comment: {
          type: String,
          required: true,
        },
      },
    ],
    sizes: [
      {
        type: String,
        enum: ["XXS", "XL", "XS", "S", "M", "L", "XXL", "3XL", "4XL"],
        required: [true, "Size is required"],
      },
    ],
    colors: [
      {
        type: String,
        required: [true, "Color is required"],
        enum: [
          "Purple",
          "Black",
          "Red",
          "Orange",
          "Navy",
          "White",
          "Broom",
          "Green",
          "Yellow",
          "Grey",
          "Pink",
          "Blue",
        ],
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
