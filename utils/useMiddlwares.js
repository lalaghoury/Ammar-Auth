const useMiddlwares = (app) => {
  // Configuring Express JSON
  const useJson = require("../middlewares/json");
  useJson(app);

  // Configuring CORS
  const useCors = require("../middlewares/cors");
  useCors(app);

  // Configuring Cookie Parser
  const useCookieParser = require("../middlewares/cookie-parser");
  useCookieParser(app);

  // Configuring Express Session
  const useExpressSession = require("../middlewares/express-session");
  useExpressSession(app);

  // Configuring Passport
  const usePassport = require("../middlewares/passport");
  usePassport(app);

  // Serving Static Files
  const useExpressStatic = require("../middlewares/express-static");
  useExpressStatic(app);
};

module.exports = useMiddlwares;
