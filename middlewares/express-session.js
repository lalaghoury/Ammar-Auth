const session = require("express-session");
const MongoStore = require("connect-mongo");

const useExpressSession = (app, mongooseConnection) => {
  app.use(
    session({
      secret: process.env.SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: {
        sameSite: "strict",
      },
      store: new MongoStore({
        mongoUrl: process.env.MONGO_URL,
        mongooseConnection,
      }),
    })
  );
};

module.exports = useExpressSession;