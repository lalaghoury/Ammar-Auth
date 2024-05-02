const Category = require("../models/Category");

const categoryController = {
  listCategories: async (req, res) => {
    try {
      const categories = await Category.find();
      if (!categories) {
        return res
          .status(404)
          .json({ message: "No categories found", success: false });
      }
      res.json({
        success: true,
        message: "Categories fetched successfully",
        categories,
      });
    } catch (error) {
      res.status(500).json({ error, success: false });
    }
  },

  listCategoriesNames: async (req, res) => {
    try {
      const categoriesNames = await Category.find({}, { name: 1, _id: 1 });

      if (!categoriesNames) {
        return res
          .status(404)
          .json({ message: "No categories found", success: false });
      }

      res.json({
        success: true,
        message: "Categories fetched successfully",
        categoriesNames,
      });
    } catch (error) {
      res.status(500).json({ error, success: false, message: "Error" });
    }
  },

  createCategory: async (req, res) => {
    const category = new Category(req.body);
    try {
      const newCategory = await category.save();
      res.status(201).json({
        success: true,
        message: "Category created successfully",
        category: newCategory,
      });
    } catch (error) {
      res
        .status(400)
        .json({ error, message: "Category creation failed", success: false });
    }
  },

  readCategory: async (req, res) => {
    const { categoryId } = req.params;
    try {
      const category = await Category.findById(categoryId);
      if (!category) {
        return res
          .status(404)
          .json({ message: "Category not found", success: false });
      }
      res.json({
        category,
        success: true,
        message: "Category fetched successfully",
      });
    } catch (error) {
      res
        .status(500)
        .json({ error, message: "Category fetch failed", success: false });
    }
  },

  updateCategory: async (req, res) => {
    const { categoryId } = req.params;
    try {
      const category = await Category.findByIdAndUpdate(categoryId, req.body, {
        new: true,
      });
      if (!category) {
        return res
          .status(404)
          .json({ message: "Category not found", success: false });
      }
      res.json({
        category,
        success: true,
        message: "Category updated successfully",
      });
    } catch (error) {
      res
        .status(500)
        .json({ error, message: "Category update failed", success: false });
    }
  },

  deleteCategory: async (req, res) => {
    const { categoryId } = req.params;
    try {
      const category = await Category.findByIdAndRemove(categoryId);
      if (!category) {
        return res
          .status(404)
          .json({ message: "Category not found", success: false });
      }
      res.json({ message: "Category deleted successfully.", success: true });
    } catch (error) {
      res
        .status(500)
        .json({ error, message: "Category delete failed", success: false });
    }
  },
};

module.exports = categoryController;
