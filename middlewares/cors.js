const cors = require("cors");

const useCors = (app) => {
  app.use(
    cors({
      origin: ["https://euphoria-frontend-dnfjmhfka-aasil-ghourys-projects.vercel.app", "http://localhost:5173", "http://localhost:3000", "https://euphoria-frontend-theta.vercel.app"],
      credentials: true,
    })
  );
};

module.exports = useCors;
