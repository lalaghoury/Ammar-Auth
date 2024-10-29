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

  // Category Routes
  const categoryRouter = require("../routes/category");
  app.use("/api/categories", categoryRouter);

  // Dress Style Routes
  const dressStyleRouter = require("../routes/dressStyle");
  app.use("/api/dress-styles", dressStyleRouter);

  // Product Routes
  const productRoute = require("../routes/product");
  app.use("/api/products", productRoute);

  // Cart Routes
  const cartRoute = require("../routes/cart");
  app.use("/api/cart", cartRoute);

  // Order Routes
  const orderRoute = require("../routes/order");
  app.use("/api/orders", orderRoute);

  // Checkout Routes
  const checkoutRoute = require("../routes/checkout");
  app.use("/api/checkout", checkoutRoute);
};

module.exports = useRoutes;
