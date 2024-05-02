const User = require("../models/User");
require("dotenv").config();

const requireSignin = async (req, res, next) => {
  try {
    const user = await User.findById(req.user?._id);

    if (!user || user.status !== "active") {
      return res.status(401).json({
        message: "Profile not found. Please login again.",
        success: false,
      });
    }

    req.user = { ...user._doc, userId: user._id };

    next();
  } catch (error) {
    console.error("Error in requireSignin middleware:", error);
    return res.status(401).json({
      message: "Please login to continue",
    });
  }
};

const isAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.user?._id);

    if (!user) {
      return res.status(401).json({
        message: "Profile not found. Please login again.",
        success: false,
      });
    } else if (user.role !== "admin" || user.status !== "active") {
      return res.status(401).json({
        message: "You are not authorized to access this resource.",
        success: false,
      });
    }

    req.user = { ...user._doc, userId: user._id };
    next();
  } catch (error) {
    res.status(401).send({ success: false, message: "Unauthorized", error });
  }
};

module.exports = { requireSignin, isAdmin };
