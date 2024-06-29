const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController.js");
const {
  requireSignin,
  isAdmin,
  notRequireSignin,
} = require("../middlewares/authMiddleware");
require("../strategies/local-strategy");
require("../strategies/google-strategy.js");
require("../strategies/discord-strategy.js");
const passport = require("passport");

// Passport Routes
router.post(
  "/signin",
  passport.authenticate("local", { session: false }),
  authController.signIn
);
router.get("/google", passport.authenticate("google", { session: false }));
router.get("/discord", passport.authenticate("discord", { session: false }));

// Passport Callback Routes
router.get(
  "/google/callback",
  (req, res, next) => {
    passport.authenticate("google", { session: false }, (err, user, info) => {
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
      req.user = user;
      next();
    })(req, res, next);
  },
  authController.callbackSignin
);

router.get(
  "/discord/callback",
  (req, res, next) => {
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
      req.user = user;
      next();
    })(req, res, next);
  },
  authController.callbackSignin
);

// Euphoria-Backend\routes\auth.js
router.post("/signup", authController.signUp);
router.post("/signout", authController.signOut);
router.post(
  "/send-verification-link",
  notRequireSignin,
  authController.sendVerificationLink
);
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
