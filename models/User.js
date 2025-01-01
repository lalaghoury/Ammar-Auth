const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    name: { type: String, required: true, maxlength: 50 },
    email: { type: String, required: true, unique: true, maxlength: 50 },
    password: { type: String, required: true },
    role: {
      type: String,
      default: "user",
      enum: ["startup", "admin", "sponsor"],
    },
    sub_role: {
      type: String,
      required: false,
      enum: [
        "founder",
        "investor",
        "mentor",
        "employee",
        "manager",
        "admin",
        "advisor",
      ],
    },
    newsletter: { type: Boolean, default: false },
    avatar: {
      type: String,
      default:
        "https://w7.pngwing.com/pngs/178/595/png-transparent-user-profile-computer-icons-login-user-avatars-thumbnail.png",
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      maxlength: 18,
      validate: {
        validator: function (v) {
          return /^(\+?\d{1,3})?[-. (]*\d{3}[-. )]*\d{3}[-. ]*\d{4}$/.test(v);
        },
        message: "Please enter a valid phone number",
      },
      default: "+92 1234567890",
    },
    resetToken: { type: String, default: "" },
    resetTokenExpiration: { type: Date, default: null },
    status: {
      type: String,
      default: "active",
      enum: ["active", "disabled", "blocked"],
    },
    provider: {
      type: String,
      default: "local",
      enum: ["local", "google", "discord"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
