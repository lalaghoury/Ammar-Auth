const app = require("express")();
require("dotenv").config();
const useMiddlwares = require("./utils/useMiddlwares");
const useRoutes = require("./utils/useRoutes");
const connectDB = require("./utils/db");
const PORT = process.env.PORT || 8000;

// Connecting to MongoDB
connectDB().then((mongooseConnection) => {
  // Configuring Middlewares
  useMiddlwares(app, mongooseConnection);

  // Configuring Routes
  useRoutes(app);

  // Starting Server
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
