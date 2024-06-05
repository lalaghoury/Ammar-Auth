// Cookies and Sessions Configuration
const session = require("express-session");
const MongoStore = require("connect-mongo");

const useExpressSession = (app) => {
  app.use(
    session({
      secret: process.env.SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: {
        sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
        secure: process.env.NODE_ENV === "production",
      },
    })
  );
};

module.exports = useExpressSession;
