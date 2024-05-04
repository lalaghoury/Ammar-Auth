// adminRoutes.js
const express = require("express");
const userController = require("../../controllers/userController");
const { isAdmin } = require("../../middlewares/authMiddleware");
const router = express.Router();

// @route GET api/users/all for admin
router.get("/all", isAdmin, userController.getAllUsers);

// @route GET api/users/:id for admin
router.get("/:id", isAdmin, userController.getUserById);

// @route PUT api/users/:id for admin
router.put("/update/:id", isAdmin, userController.updateUser);

// @route DELETE api/users/:id for admin
router.delete("/:id", isAdmin, userController.deleteUser);

module.exports = router;
