const app = require("express")();
require("dotenv").config();
const useMiddlwares = require("./utils/useMiddlwares");
const useRoutes = require("./utils/useRoutes");
const connectDB = require("./utils/db");
const PORT = process.env.PORT || 8000;

connectDB().then((mongooseConnection) => {
  useMiddlwares(app, mongooseConnection);
  useRoutes(app);

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
