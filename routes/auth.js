const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController.js");
const { requireSignin, isAdmin } = require("../middlewares/authMiddleware");
require("../strategies/local-strategy");
require("../strategies/google-strategy.js");
require("../strategies/discord-strategy.js");
const passport = require("passport");

router.post("/signup", authController.signUp);
router.post("/signin", passport.authenticate("local"), authController.signIn);
router.post("/signout", authController.signOut);
router.post("/send-verification-link", authController.sendVerificationLink);
router.get("/verify", requireSignin, authController.verifySignin);
router.get("/verify/admin", isAdmin, authController.verifySignin);

router.get("/google", passport.authenticate("google"), authController.done);
router.get("/facebook", passport.authenticate("facebook"), authController.done);
router.get("/discord", passport.authenticate("discord"), authController.done);

router.get("/google/callback", (req, res, next) => {
  passport.authenticate("google", (err, user, info) => {
    if (err) {
      return res.redirect(
        `http://localhost:3000/sign-in?error=${encodeURIComponent(err.message)}`
      );
    }
    if (!user) {
      return res.redirect(
        `http://localhost:3000/sign-in?error=${encodeURIComponent(
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

router.get("/twitter/callback", (req, res, next) => {
  passport.authenticate("twitter", (err, user, info) => {
    if (err) {
      return res.redirect(
        `http://localhost:3000/sign-in?error=${encodeURIComponent(err.message)}`
      );
    }
    if (!user) {
      return res.redirect(
        `http://localhost:3000/sign-in?error=${encodeURIComponent(
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

router.get("/facebook/callback", (req, res, next) => {
  passport.authenticate("facebook", (err, user, info) => {
    if (err) {
      return res.redirect(
        `http://localhost:3000/sign-in?error=${encodeURIComponent(err.message)}`
      );
    }
    if (!user) {
      return res.redirect(
        `http://localhost:3000/sign-in?error=${encodeURIComponent(
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
        `http://localhost:3000/sign-in?error=${encodeURIComponent(err.message)}`
      );
    }
    if (!user) {
      return res.redirect(
        `http://localhost:3000/sign-in?error=${encodeURIComponent(
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

router.post("/reset-password/:resetToken", authController.resetPassword);

router.get("/login/success", (req, res) => {
  if (req.user) {
    res.status(200).json({
      success: true,
      message: "Successfully Loged In",
      user: req.user,
    });
  } else {
    res.status(403).json({ error: true, message: "Not Authorized" });
  }
});

router.get("/login/failed", (req, res) => {
  res.redirect(
    `http://localhost:3000/sign-in?error=${encodeURIComponent(
      "Log in failure"
    )}`
  );
});

router.get(
  "/verify/admin",
  requireSignin,
  isAdmin,
  authController.verifySignin
);

module.exports = router;
