const path = require("path");

const useRoutes = (app) => {
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

  // Coupon Routes
  const couponRoute = require("../routes/coupon");
  app.use("/api/coupon", couponRoute);

  // Address Routes
  const addressRoute = require("../routes/address");
  app.use("/api/address", addressRoute);

  // Checkout Routes
  const braintreeRoute = require("../routes/braintree");
  app.use("/api/checkout", braintreeRoute);

  // Catch-all route to serve index.html for any other route
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../client", "dist", "index.html"));
  });
};

module.exports = useRoutes;
