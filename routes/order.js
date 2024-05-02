const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const { requireSignin, isAdmin } = require("../middlewares/authMiddleware");

// @route GET api/orders/all for user
router.get("/my-orders", requireSignin, orderController.getUserOrders);

// @route GET api/orders/all for admin
router.get("/all", isAdmin, orderController.getAllOrders);

// @route GET api/orders/:id for admin
router.get("/:id", isAdmin, orderController.getOrderById);

// @route GET api/orders/:id for user
router.get("/:id", requireSignin, orderController.getOrderById);

// @route POST api/orders for user
router.post("/new", orderController.createOrder);

// @route PUT api/orders/:id for admin
router.put("/update/:id", isAdmin, orderController.updateOrder);

// @route DELETE api/orders/:id for admin
router.delete("/:id", isAdmin, orderController.deleteOrder);

module.exports = router;
