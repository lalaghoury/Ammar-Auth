const User = require("../models/User");
const bcrypt = require("bcryptjs");
const { sendEmail } = require("../config/nodemailerConfig");
const cryptoObj = require("crypto");
const { SignToken } = require("../middlewares/authMiddleware");

module.exports = authController = {
  signUp: async (req, res) => {
    try {
      if (!req.body.email || !req.body.name || !req.body.password) {
        return res
          .status(400)
          .json({ message: "All fields are required", success: false });
      }

      const existingUser = await User.findOne({ email: req.body.email });

      if (existingUser) {
        return res
          .status(400)
          .json({ message: "Email already exists", success: false });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(req.body.password, salt);

      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword,
      });

      const savedUser = await newUser.save();

      sendEmail(
        savedUser.email,
        "Account Created",
        `Welcome ${savedUser.name}! You have successfully created an account , Baobao.`
      );

      res.status(201).json({
        message: "Account created successfully",
        success: true,
        savedUser,
      });
    } catch (error) {
      res.status(400).json({ message: error.message, success: false });
    }
  },

  signIn: async (req, res) => {
    const user = req.user;

    if (!user) {
      return res.json({
        success: false,
        message: "User not found, Please login again!",
      });
    }

    await sendEmail(
      user.email,
      "Login Successful",
      `Hi ${user.name}, welcome to our platform!`,
      `<html lang="en" className="scroll-smooth">
          <head>
            <style>
              p {
                font-family: Arial, sans-serif;
                line-height: 1.5;
                color: #333;
                padding: 1rem;
                background-color: #f5f5f5;
                border: 1px solid #ccc;
                border-radius: 0.25rem;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                max-width: 400px;
              }
            </style>
          </head>
          <body>
            <p>Hi ${user.name}, welcome to our platform!.</p>
            <button style="background-color: #4CAF50; color: white; padding: 14px 20px; margin: 8px 0; border: none; cursor: pointer; width: 100%;">
              <a style="text-decoration: none; color: white;" href="${process.env.CLIENT_AUTH_SUCCESS_URL}" target="_blank">Click here</a>
            </button>
          </body>
        </html>`
    );

    try {
      res.json({
        message: "Sign in successful!",
        success: true,
        user: {
          avatar: user.avatar,
          name: user.name,
          status: user.status,
          email: user.email,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
          newsletter: user.newsletter,
          phone: user.phone,
          role: user.role,
          _id: user._id,
        },
      });
    } catch (error) {
      res.status(400).json({ message: error.message, success: false });
    }
  },

  signOut: (req, res) => {
    try {
      req.logout((err) => {
        if (err) {
          console.error(err);
          return res
            .status(500)
            .json({ message: "Failed to logout", success: false });
        }

        req.session.destroy((err) => {
          if (err) {
            console.error(err);
            return res
              .status(500)
              .json({ message: "Failed to destroy session", success: false });
          }

          res.json({ message: "Logged out successfully", success: true });
        });
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Failed to logout", success: false });
    }
  },

  sendVerificationLink: async (req, res) => {
    try {
      const { email } = req.body;
      const user = await User.findOne({ email });
      if (!user) {
        return res
          .status(404)
          .json({ success: false, error: "User not found" });
      }
      const resetToken = cryptoObj.randomBytes(32).toString("hex");
      const expirationTime = new Date(Date.now() + 10 * 60 * 1000);
      await User.findOneAndUpdate(
        { email },
        { resetToken, resetTokenExpiration: expirationTime }
      );
      const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
      await sendEmail(
        email,
        "Password Reset",
        "_",
        `
        <html lang="en" className="scroll-smooth">
          <head>
            <style>
              p {
                font-family: Arial, sans-serif;
                line-height: 1.5;
                color: #333;
                padding: 1rem;
                background-color: #f5f5f5;
                border: 1px solid #ccc;
                border-radius: 0.25rem;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                max-width: 400px;
              }
            </style>
          </head>
          <body>
            <p>Hi ${user.name} Please click on this link to reset your password: </p>
            <p>This link will expire in 10 minutes</p>
            <a href="${resetUrl}" target="_blank" style="text-decoration: none; color: #4CAF50; background-color: #f5f5f5; padding: 14px 20px; margin: 8px 0; border: none; display: inline-block; cursor: pointer; width: 100%; font-size: 20px; display: flex; align-items: center; justify-content: center;">Click here</a>
          </body>
          `
      );
      res
        .status(200)
        .json({ success: true, message: "Reset link sent successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: "Internal server error" });
    }
  },

  resetPassword: async (req, res) => {
    try {
      const { resetToken } = req.params;
      const { password } = req.body;
      const user = await User.findOne({ resetToken });
      if (!user) {
        return res
          .status(404)
          .json({ success: false, message: "User not found, Try again" });
      }
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      await User.findOneAndUpdate(
        { resetToken },
        { password: hashedPassword, resetToken: null }
      );
      res
        .status(200)
        .json({ success: true, message: "Password changed successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: "Internal server error" });
    }
  },

  verified: (req, res) => {
    try {
      const user = req.user;
      res
        .status(200)
        .json({ message: "Sign in successful!", success: true, user });
    } catch (error) {
      res.status(400).json({ message: error.message, success: false });
    }
  },
};
