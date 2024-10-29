const useRoutes = (app) => {
  // Welcome Route
  app.get("/", (req, res) => {
    res.send("Assalom-Alaikum! Ammar Backend API");
  });

  // User Routes
  const userRoute = require("../routes/user");
  app.use("/api/users", userRoute);

  // Auth Routes
  const authRoute = require("../routes/auth");
  app.use("/api/auth", authRoute);

  // Image Routes
  const imageRouter = require("../routes/image");
  app.use("/api/images", imageRouter);
};

module.exports = useRoutes;
