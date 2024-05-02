const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/categoryController");

// Get All Categories
router.get("/all", categoryController.listCategories);

// Gett All Category Names
router.get("/names", categoryController.listCategoriesNames);

// Get Single Category
router.get("/:categoryId", categoryController.readCategory);

// Create New Category
router.post("/new", categoryController.createCategory);

// Update Category
router.put("/:categoryId", categoryController.updateCategory);

// Delete Category
router.get("/:categoryId", categoryController.deleteCategory);

module.exports = router;
