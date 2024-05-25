// Cookies and Sessions Configuration
const session = require("express-session");
const MongoStore = require("connect-mongo");

const useExpressSession = (app, mongooseConnection) => {
  app.use(
    session({
      secret: process.env.SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: {
        ssameSite: process.env.NODE_ENV === "production" ? "None" : "Strict",
        secure: process.env.NODE_ENV === "production",
        path: "/",
        domain:
          process.env.NODE_ENV === "production"
            ? "euphoria-frontend-theta.vercel.app"
            : undefined,
      },
      store: MongoStore.create({ mongoUrl: process.env.MONGO_URL }),
    })
  );
};

module.exports = useExpressSession;
