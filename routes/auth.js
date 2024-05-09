const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController.js");
const { requireSignin, isAdmin } = require("../middlewares/authMiddleware");
require("../strategies/local-strategy");
require("../strategies/google-strategy.js");
require("../strategies/discord-strategy.js");
const passport = require("passport");

// Passport Routes
router.post("/signin", passport.authenticate("local"), authController.signIn);
router.get("/google", passport.authenticate("google"), authController.verified);
router.get(
  "/facebook",
  passport.authenticate("facebook"),
  authController.verified
);
router.get(
  "/discord",
  passport.authenticate("discord"),
  authController.verified
);

// Passport Callback Routes
router.get("/google/callback", (req, res, next) => {
  passport.authenticate("google", (err, user, info) => {
    if (err) {
      return res.redirect(
        `${process.env.CLIENT_URL}/sign-in?error=${encodeURIComponent(
          err.message
        )}`
      );
    }
    if (!user) {
      return res.redirect(
        `${process.env.CLIENT_URL}/sign-in?error=${encodeURIComponent(
          info.message
        )}`
      );
    }
    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      return res.redirect(process.env.CLIENT_AUTH_SUCCESS_URL);
    });
  })(req, res, next);
});
router.get("/discord/callback", (req, res, next) => {
  passport.authenticate("discord", (err, user, info) => {
    if (err) {
      return res.redirect(
        `${process.env.CLIENT_URL}/sign-in?error=${encodeURIComponent(
          err.message
        )}`
      );
    }
    if (!user) {
      return res.redirect(
        `${process.env.CLIENT_URL}/sign-in?error=${encodeURIComponent(
          info.message
        )}`
      );
    }
    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      return res.redirect(process.env.CLIENT_AUTH_SUCCESS_URL);
    });
  })(req, res, next);
});

// Euphoria-Backend\routes\auth.js
router.post("/signup", authController.signUp);
router.post("/signout", authController.signOut);
router.post("/send-verification-link", authController.sendVerificationLink);
router.post("/reset-password/:resetToken", authController.resetPassword);
router.get("/login/failed", (req, res) => {
  res.redirect(
    `${process.env.CLIENT_URL}/sign-in?error=${encodeURIComponent(
      "Log in failure"
    )}`
  );
});

// Euphoria-Backend\routes\auth.js~Verified
router.get("/verify/admin", isAdmin, authController.verified);
router.get("/verify", requireSignin, authController.verified);
router.get("/verify/admin", isAdmin, authController.verified);

module.exports = router;
