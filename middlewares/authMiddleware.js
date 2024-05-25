require("dotenv").config();
const JWT = require("jsonwebtoken");

const requireSignin = async (req, res, next) => {
  try {
    const token = req?.user?.token;

    if (!token) {
      return res.status(401).send("Access denied. No token provided.");
    }

    const decode = JWT.verify(token, process.env.JWT_SECRET_KEY);

    if (!decode || decode.status !== "active") {
      return res.status(401).json({
        message: "Profile not found. Please login again.",
        success: false,
      });
    }

    if (decode._id.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        message: "You are not authorized to access this resource.",
        success: false,
      });
    }

    req.user = { ...decode, userId: decode._id };

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
    const token = req?.user?.token;

    if (!token) {
      return res.status(401).send("Access denied. No token provided.");
    }

    const decode = JWT.verify(token, process.env.JWT_SECRET_KEY);

    if (!decode) {
      return res.status(401).json({
        message: "Profile not found. Please login again.",
        success: false,
      });
    } else if (decode.role !== "admin" || decode.status !== "active") {
      return res.status(401).json({
        message: "You are not authorized to access this resource.",
        success: false,
      });
    }

    if (decode._id.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        message: "You are not authorized to access this resource.",
        success: false,
      });
    }

    req.user = { ...decode, userId: decode._id };

    next();
  } catch (error) {
    res.status(401).send({ success: false, message: "Unauthorized", error });
  }
};

const SignToken = (user) => {
  return JWT.sign(
    {
      avatar: user.avatar,
      name: user.name,
      status: user.status,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      newsletter: user.newsletter,
      phone: user.phone,
      role: user.role,
      provider: user.provider,
      _id: user._id,
    },
    process.env.JWT_SECRET_KEY,
    {
      expiresIn: "7d",
    }
  );
};

module.exports = { requireSignin, isAdmin, SignToken };
