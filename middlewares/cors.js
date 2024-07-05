const cors = require("cors");

const useCors = (app) => {
  app.use(
    cors({
      origin: [
        "http://localhost:4173",
        "http://localhost:5173",
        "http://localhost:3000",
        "https://euphoria-frontend-theta.vercel.app",
        "https://euphoria-eight.vercel.app",
        "https://euphoria-commerce.netlify.app",
        "*"
      ],
      credentials: true,
    })
  );
};

module.exports = useCors;
