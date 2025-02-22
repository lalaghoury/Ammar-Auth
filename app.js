const path = require('path');
const express = require('express');
require('dotenv').config();

const PORT = process.env.PORT || 8000;
const app = express();

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Configuring Middlewares
const useMiddlwares = require('./utils/useMiddlewares');
useMiddlwares(app);

// Configuring Routes
const useRoutes = require('./utils/useRoutes');
useRoutes(app);

// Connecting to MongoDB
const connectDB = require('./utils/db');
connectDB().then(() => {
  // Starting Server
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
