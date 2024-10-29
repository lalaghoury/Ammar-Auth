const cors = require("cors");

const useCors = (app) => {
  app.use(
    cors({
      origin: [
        "http://localhost:4173",
        "http://localhost:5173",
        process.env.CLIENT_URL,
        "*"
      ],
      credentials: true,
    })
  );
};

module.exports = useCors;
