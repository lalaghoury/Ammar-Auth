const Cart = require("../models/Cart");
const Product = require("../models/Product");

const cartController = {
  listCart: async (req, res) => {
    const { _id: userId } = req.user;

    try {
      let cart = await Cart.findOne({ userId }).populate({
        path: "items.productId",
        select: "thumbnail name price colors",
      });
      if (!cart) {
        cart = new Cart({ userId, items: [] });
        await cart.save();
      }
      res.json({ success: true, cart, message: "Cart fetched successfully" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  getCount: async (req, res) => {
    const userId = req.user.userId;

    try {
      let cart = await Cart.findOne({ userId });
      if (!cart) {
        cart = new Cart({ userId, items: [] });
        await cart.save();
      }
      res.json({ success: true, count: cart.items.length });
    } catch (err) {
      console.error(err);
      res.status(500).json({
        message: "Internal server error",
        error: err.message,
        success: false,
      });
    }
  },

  createCart: async (req, res) => {
    const { productId, quantity, price, color, size } = req.body;
    const userId = req.user.userId;

    if (!quantity || !productId || !price || !userId) {
      return res
        .status(400)
        .json({ message: "Something went wrong, please try again" });
    }

    try {
      let cart = await Cart.findOne({ userId });
      const product = await Product.findById(productId);

      if (!cart) {
        cart = new Cart({ userId, items: [] });
      }

      const index = cart.items.findIndex(
        (item) =>
          item.productId.toString() === productId.toString() &&
          item.color === (color || product?.colors[0]) &&
          item.size === (size || product?.sizes[0])
      );

      if (index !== -1) {
        cart.items[index].quantity += quantity;
        cart.items[index].price = price * cart.items[index].quantity;
      } else {
        cart.items.push({
          productId,
          quantity,
          price: price * quantity,
          color: color || product?.colors[0],
          size: size || product?.sizes[0],
        });
      }

      cart.total = cart.items.reduce((total, item) => total + item.price, 0);

      await cart.save();
      res.status(201).json({
        success: true,
        message: "Product added to cart successfully",
        cart,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: err.message });
    }
  },

  updateCart: async (req, res) => {
    const { quantity, productId, price } = req.body;
    const { userId } = req.user;

    if (!quantity || !productId || !price) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    try {
      let cart = await Cart.findOne({ userId }).populate("items.productId");

      const index = cart.items.findIndex(
        (item) => item.productId._id.toString() === productId.toString()
      );

      if (index !== -1) {
        const oldCartTotal = cart.total;
        const oldItemPrice = cart.items[index].price;
        const newItemPrice = price * quantity;
        const newCartTotal = oldCartTotal - oldItemPrice + newItemPrice;

        cart.items[index].quantity = quantity;
        cart.items[index].price = newItemPrice;

        cart.total = newCartTotal;

        await cart.save();
        res.json({
          cart,
          message: "Quantity updated successfully",
          success: true,
        });
      } else {
        res.status(404).json({ message: "Item not found in cart" });
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  deleteCartItem: async (req, res) => {
    const userId = req.user.userId;
    const { itemId } = req.params;

    try {
      let cart = await Cart.findOne({ userId }).populate("items.productId");

      const index = cart.items.findIndex(
        (item) => item._id.toString() === itemId.toString()
      );

      if (index !== -1) {
        const oldCartTotal = cart.total;
        const ItemPrice = cart.items[index].price;
        cart.total = oldCartTotal - ItemPrice;
        cart.items.splice(index, 1);
      } else {
        res.status(404).json({ message: "Item not found in cart" });
      }

      if (cart.items.length === 0) {
        cart.total = 0;
      }

      await cart.save();
      res.json({
        cart,
        message: "Product removed from cart successfully",
        success: true,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({
        message: "Filed to delete item from cart",
        success: false,
        error: err.message,
      });
    }
  },
};

module.exports = cartController;
