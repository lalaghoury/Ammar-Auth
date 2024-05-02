const session = require("express-session");

const useExpressSession = (app) => {
  app.use(
    session({
      secret: process.env.SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: {
        sameSite: "strict",
      },
    })
  );
};

module.exports = useExpressSession;
