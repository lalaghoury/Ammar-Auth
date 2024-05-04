const passport = require("passport");
const { Strategy } = require("passport-local");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const { SignToken } = require("../middlewares/authMiddleware");

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser(async (user, done) => {
  try {
    if (!user) throw new Error("User Not Found");
    const token = SignToken(user);
    done(null, token);
  } catch (err) {
    done(err, null);
  }
});

passport.use(
  new Strategy({ usernameField: "email" }, async (email, password, done) => {
    try {
      const user = await User.findOne({ email });

      if (user && user.provider !== "local") {
        return done(null, false, {
          message: `Email is already registered. Sign in with ${user.provider}.`,
          success: false,
        });
      }

      if (!user) {
        return done(null, false, {
          message: "User with that email does not exist!",
        });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return done(null, false, { message: "Invalid Credentials" });
      }

      done(null, user);
    } catch (err) {
      done(err);
    }
  })
);

module.exports = passport;
