const session = require("express-session");
const MongoStore = require("connect-mongo");

const useExpressSession = (app, mongooseConnection) => {
  app.use(
    session({
      secret: process.env.SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: {
        // sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
        // secure: process.env.NODE_ENV === "production",
        sameSite: "None",
        secure: true,
        path: "/",
        domain: "https://euphoria-frontend-theta.vercel.app"
      },
      store: MongoStore.create({ mongoUrl: process.env.MONGO_URL }),
    })
  );
};

module.exports = useExpressSession;
