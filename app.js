const app = require("express")();
require("dotenv").config();

// Middlewares

const useMiddlwares = require("./utils/useMiddlwares");
useMiddlwares(app);

////////////////////////////////////////////////////////////////////////////////////////////////

// Routes

const useRoutes = require("./utils/useRoutes");
useRoutes(app);

////////////////////////////////////////////////////////////////////////////////////////////////

// Database Connection

const connectDB = require("./utils/db");
const PORT = process.env.PORT || 8000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
