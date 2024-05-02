const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const colorSchema = new Schema({
  name: {
    type: String,
    required: [true, "Color name is required"],
    unique: true,
    example: "red",
  },
  code: {
    type: String,
    required: [true, "Color code is required"],
  },
});

module.exports = mongoose.model("Color", colorSchema);
