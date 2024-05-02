const passport = require("passport");

const usePassport = (app) => {
  // Initialize the passport
  app.use(passport.initialize());

  // Initialize the session
  app.use(passport.session());
};

module.exports = usePassport;
