const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Address = require("../models/Address");
const authMiddleware = require("../middlewares/authMiddleware");

router.post("/add", authMiddleware.requireSignin, async (req, res) => {
  try {
    const newAddress = await new Address({
      ...req.body,
      user: req.user.userId,
    }).save();

    if (!newAddress) {
      return res
        .status(400)
        .json({ message: "Address creation failed", success: false });
    }

    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.addresses.push(newAddress._id);
    await user.save();

    res.status(201).json({
      success: true,
      message: "Address created successfully",
      address: newAddress,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/", authMiddleware.requireSignin, async (req, res) => {
  try {
    const addresses = await Address.find({ user: req.user.userId });

    res.status(200).json({
      success: true,
      message: "Addresses fetched successfully",
      addresses,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.put("/edit", authMiddleware.requireSignin, async (req, res) => {
  const { addressId, ...rest } = req.body;

  if (!addressId) {
    return res
      .status(400)
      .json({ message: "Address ID is required", success: false });
  }

  try {
    const updatedAddress = await Address.findOneAndUpdate(
      { _id: addressId, user: req.user.userId },
      { ...rest },
      { new: true }
    );

    if (!updatedAddress) {
      return res
        .status(400)
        .json({ message: "Address update failed", success: false });
    }

    res.status(200).json({
      success: true,
      message: "Address updated successfully",
      address: updatedAddress,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to update address" });
  }
});

router.delete("/remove", authMiddleware.requireSignin, async (req, res) => {
  const { productId } = req.body;

  if (!productId) {
    return res
      .status(400)
      .json({ message: "Product ID is required", success: false });
  }

  try {
    const deletedAddress = await Address.deleteOne({ productId });

    User.findOneAndUpdate(
      { _id: req.user.userId },
      { $pull: { addresses: req.body.productId } },
      { new: true }
    );

    if (!deletedAddress) {
      return res
        .status(400)
        .json({ message: "Address deletion failed", success: false });
    }

    res.status(200).json({
      success: true,
      message: "Address deleted successfully",
      address: deletedAddress,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to delete address" });
  }
});

module.exports = router;
