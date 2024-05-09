const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const { requireSignin, isAdmin } = require("../middlewares/authMiddleware");

// @route GET api/orders/all for admin
router.get("/admin/all", isAdmin, orderController.getAllOrders);

// @route GET api/orders/:id for admin
router.get("/admin/:id", isAdmin, orderController.getOrderById);

// @route PUT api/orders/:id for admin
router.put("/admin/update/:id", isAdmin, orderController.updateOrder);

// @route GET api/orders/all for user
router.get("/my-orders", requireSignin, orderController.getUserOrders);

// @route GET api/orders/:id for user
router.get("/:id", requireSignin, orderController.getOrderById);

// @route POST api/orders for user
router.post("/new", requireSignin, orderController.createOrder);

// @route PUT api/orders/:id for admin
router.put("/update/:id", requireSignin, orderController.updateOrder);

// @route DELETE api/orders/:id for admin
router.delete("/:id", requireSignin, orderController.deleteOrder);

module.exports = router;
