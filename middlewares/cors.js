const cors = require("cors");

const useCors = (app) => {
  app.use(
    cors({
      origin: "https://euphoria-frontend-dnfjmhfka-aasil-ghourys-projects.vercel.app",
      credentials: true,
    })
  );
};

module.exports = useCors;
