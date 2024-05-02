const app = require("express")();
require("dotenv").config();

// Middlewares

const useMiddlwares = require("./utils/useMiddlwares");

////////////////////////////////////////////////////////////////////////////////////////////////

// Routes

const useRoutes = require("./utils/useRoutes");

////////////////////////////////////////////////////////////////////////////////////////////////

// Database Connection

const connectDB = require("./utils/db");
const PORT = process.env.PORT || 8000;

connectDB().then((mongooseConnection) => {
  useMiddlwares(app, mongooseConnection);
  useRoutes(app);

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
