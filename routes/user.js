const express = require("express");
const userController = require("../controllers/userController");
const { requireSignin, isAdmin } = require("../middlewares/authMiddleware");
const router = express.Router();

// Admin Routes

// @route GET api/users/admin/all for admin
router.get("/admin/all", isAdmin, userController.getAllUsers);

// @route GET api/users/admin/get-user/:id for admin
router.get("/admin/get-user/:id", isAdmin, userController.getUserById);

// @route PUT api/users/admin/update/:id for admin
router.put("/admin/update/:id", isAdmin, userController.updateUser);

// @route DELETE api/users/admin/delete:id for admin
router.delete("/admin/delete/:id", isAdmin, userController.deleteUser);

// User Routes

// @route GET api/users/get-user (without Id) for user
router.get("/get-user", requireSignin, userController.getUserWithAuth);

// @route PUT api/users/:id for user
router.put("/update/:id", requireSignin, userController.updateUser);

// @route DELETE api/users/:id for user
router.delete("/delete/:id", requireSignin, userController.deleteUser);

module.exports = router;
