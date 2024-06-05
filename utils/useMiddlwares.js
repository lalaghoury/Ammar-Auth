const express = require("express");
const path = require("path");

const useMiddlewares = (app, mongooseConnection) => {
  // Configuring Express JSON
  const useJson = require("../middlewares/json");
  useJson(app);

  // Configuring CORS
  const useCors = require("../middlewares/cors");
  useCors(app);

  // Configuring Express Session
  const useExpressSession = require("../middlewares/express-session");
  useExpressSession(app, mongooseConnection);

  // Configuring Passport
  const usePassport = require("../middlewares/passport");
  usePassport(app);
};

module.exports = useMiddlewares;
