const Product = require("../models/Product");
const Category = require("../models/Category");
const DressStyle = require("../models/DressStyle");
const User = require("../models/User");

const productController = {
  listProducts: async (req, res) => {
    try {
      const products = await Product.find();
      if (!products) {
        return res
          .status(404)
          .json({ message: "No products found", success: false });
      }
      res.json({
        success: true,
        message: "Products fetched successfully",
        products: products.reverse(),
      });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ message: "Error loading products", success: false });
    }
  },

  listFilteredProducts: async (req, res) => {
    const {
      minPrice,
      maxPrice,
      category,
      dressStyle,
      query,
      colors,
      sizes,
      limit,
      offset,
    } = req.query;
    const filters = {};

    if (minPrice && maxPrice) {
      filters.price = { $gte: minPrice, $lte: maxPrice };
    }

    if (category) {
      filters.category = category;
    }

    if (Array.isArray(colors) && colors.length > 0) {
      filters.colors = { $in: colors.map(String) };
    }

    if (dressStyle) {
      filters.dressStyle = dressStyle;
    }

    if (Array.isArray(sizes) && sizes.length > 0) {
      filters.sizes = { $in: sizes.map(String) };
    }

    if (query) {
      filters.$or = [
        { name: { $regex: query.trim().toLowerCase(), $options: "i" } },
        {
          description: {
            $regex: query.trim().toLowerCase(),
            $options: "i",
          },
        },
      ];
    }

    const products = await Product.find(filters).limit(limit);

    res.json({
      success: true,
      message: "Products fetched successfully",
      products: products.reverse(),
    });
  },

  listProductsNames: async (req, res) => {
    try {
      const productsNames = await Product.find({}, { name: 1, _id: 1 });

      if (!productsNames) {
        return res
          .status(404)
          .json({ message: "No products found", success: false });
      }

      res.json({
        success: true,
        message: "Products fetched successfully",
        productsNames,
      });
    } catch (error) {
      res.status(500).json({ error, success: false, message: "Error" });
    }
  },

  createProduct: async (req, res) => {
    try {
      const category = await Category.findById(req.body.category);
      const dressStyle = await DressStyle.findById(req.body.dressStyle);

      if (!category) {
        return res.status(404).json({
          success: false,
          message: "Category not found",
        });
      }

      if (!dressStyle) {
        return res.status(404).json({
          success: false,
          message: "DressStyle not found",
        });
      }

      const product = new Product(req.body);
      const newProduct = await product.save();

      category.products.push(newProduct._id);
      dressStyle.products.push(newProduct._id);

      await category.save();
      await dressStyle.save();

      res.status(201).json({
        success: true,
        message: "product created successfully",
        newProduct,
      });
    } catch (error) {
      res
        .status(400)
        .json({ error, message: "Product creation failed", success: false });
    }
  },

  readWishlistProducts: async (req, res) => {
    try {
      const products = await Product.find({
        wishlists: req.user.userId,
      }).lean();

      res.status(200).json({
        products: products.reverse(),
        success: true,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "Internal Server Error",
        success: false,
        error: error.message,
      });
    }
  },

  readWishlistProductsCount: async (req, res) => {
    try {
      const products = await Product.find({
        wishlists: req.user.userId,
      }).lean();

      res.status(200).json({
        count: products.length,
        success: true,
        message: "Wishlist products count fetched successfully",
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "Internal Server Error",
        success: false,
        error: error.message,
      });
    }
  },

  getLazyProducts: async (req, res) => {
    const { offset, limit } = req.query;
    try {
      const products = await Product.find().skip(offset).limit(limit);
      res.status(200).json({
        products: products.reverse(),
        success: true,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "Internal Server Error",
        success: false,
        error: error.message,
      });
    }
  },

  readProduct: async (req, res) => {
    const { productId } = req.params;
    try {
      const product = await Product.findById(productId);
      if (!product) {
        return res
          .status(404)
          .json({ message: "Product not found", success: false });
      }
      res.json({
        product,
        success: true,
        message: "Product fetched successfully",
      });
    } catch (error) {
      res
        .status(500)
        .json({ error, message: "Product fetch failed", success: false });
    }
  },

  updateProduct: async (req, res) => {
    const { productId } = req.params;
    try {
      const product = await Product.findById(productId);

      if (!product) {
        return res
          .status(404)
          .json({ message: "Product not found", success: false });
      }

      const productCategory = await Category.findById(product.category);
      const productDressStyle = await DressStyle.findById(product.dressStyle);

      if (productCategory || productCategory._id !== req.body.category) {
        productCategory.products.pull(product._id);
        const category = await Category.findById(req.body.category);
        category.products.push(product._id);
        await productCategory.save();
        await category.save();
      }

      if (!productDressStyle || productDressStyle._id !== req.body.dressStyle) {
        productDressStyle.products.pull(product._id);
        const dressStyle = await DressStyle.findById(req.body.dressStyle);
        dressStyle.products.push(product._id);
        await productDressStyle.save();
        await dressStyle.save();
      }

      const updatedProduct = await Product.findByIdAndUpdate(
        productId,
        req.body,
        { new: true }
      );

      res.json({
        updatedProduct,
        success: true,
        message: "Product updated successfully",
      });
    } catch (error) {
      res
        .status(500)
        .json({ error, message: "Product update failed", success: false });
    }
  },

  deleteProduct: async (req, res) => {
    const { productId } = req.params;
    try {
      const product = await Product.findByIdAndRemove(productId);
      if (!product) {
        return res
          .status(404)
          .json({ message: "Product not found", success: false });
      }

      const category = await Category.findById(product.category);
      const DressStyle = await DressStyle.findById(product.DressStyle);

      category.products.pull(product._id);
      DressStyle.products.pull(product._id);

      await category.save();
      await DressStyle.save();
      res.json({
        message: "Product deleted successfully.",
        success: true,
        deletedProduct: product,
      });
    } catch (error) {
      res
        .status(500)
        .json({ error, message: "Product delete failed", success: false });
    }
  },

  addToWishlist: async (req, res) => {
    const { productId } = req.params;
    const userId = req.user.userId;
    try {
      const user = await User.findById(userId);
      const product = await Product.findById(productId);

      if (!product) {
        return res.status(404).send({ message: "product not found" });
      }

      if (
        user.wishlists.includes(productId) ||
        product.wishlists.includes(userId)
      ) {
        return res.status(409).send({
          message: "product is already in the wishlist",
        });
      }

      user.wishlists.push(productId);
      product.wishlists.push(userId);

      await product.save();
      await user.save();

      res.status(200).send({
        message: "product added to wishlist successfully",
        success: true,
        count: user.wishlists.length,
      });
    } catch (error) {
      console.error(error);
      res.status(500).send({
        message: "Internal Server Error",
        success: false,
        error: error.message,
      });
    }
  },

  removeFromWishlist: async (req, res) => {
    const { productId } = req.params;
    const userId = req.user.userId;

    if (!productId || !userId) {
      return res.status(400).send({
        message: "productId and userId are required",
      });
    }

    try {
      const user = await User.findById(userId);
      const product = await Product.findById(productId);

      if (!user) {
        return res.status(404).send({ message: "User not found" });
      }

      if (!product) {
        return res.status(404).send({ message: "product not found" });
      }

      if (
        !user.wishlists.includes(product._id) ||
        !product.wishlists.includes(user._id)
      ) {
        return res.status(409).send({
          message: "product is not in the wishlist",
        });
      }

      product.wishlists = product.wishlists.filter(
        (id) => id.toString() !== userId.toString()
      );
      user.wishlists = user.wishlists.filter(
        (id) => id.toString() !== productId.toString()
      );

      await product.save();
      await user.save();

      res.status(200).send({
        message: "product removed from wishlist successfully",
        success: true,
        count: user.wishlists.length,
      });
    } catch (error) {
      console.error(error);
      res.status(500).send({
        message: "Internal Server Error",
        error: error.message,
      });
    }
  },

  getSearchedProducts: async (req, res) => {
    const { query } = req.query;
    try {
      const products = await Product.find({
        name: { $regex: query, $options: "i" },
      }).lean();
      res.status(200).json({
        products: products.reverse(),
        success: true,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "Internal Server Error",
        success: false,
        error: error.message,
      });
    }
  },
};

module.exports = productController;
