const cors = require("cors");

const useCors = (app) => {
  app.use(
    cors({
      origin: "http://localhost:5173",
      credentials: true,
    })
  );
};

module.exports = useCors;
