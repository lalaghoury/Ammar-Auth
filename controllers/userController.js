const User = require("../models/User");

function removeNullUndefined(obj) {
  return Object.entries(obj).reduce((acc, [key, value]) => {
    if (value !== null && value !== undefined) {
      acc[key] = value;
    }
    return acc;
  }, {});
}

module.exports = userController = {
  getAllUsers: async (req, res) => {
    try {
      const users = await User.find();
      res.json({ users, success: true, message: "All users fetched" });
    } catch (error) {
      res
        .status(500)
        .json({ error, message: "Failed to get users", success: false });
    }
  },
  getUserById: async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      res.json({ user, success: true, message: "User fetched" });
    } catch (error) {
      res
        .status(500)
        .json({ error, message: "Failed to get user", success: false });
    }
  },
  getUserWithAuth: async (req, res) => {
    try {
      const user = await User.findById(req.user.userId);
      res.json({ user, success: true, message: "User fetched" });
    } catch (error) {
      res
        .status(500)
        .json({ error, message: "Failed to get user", success: false });
    }
  },
  updateUser: async (req, res) => {
    const filteredObj = removeNullUndefined(req.body);

    try {
      const user = await User.findByIdAndUpdate(
        req.params.id,
        { ...filteredObj },
        {
          new: true,
        }
      );
      res.json({ user, success: true, message: "User updated" });
    } catch (error) {
      res
        .status(500)
        .json({ error, message: "Failed to update user", success: false });
    }
  },
  deleteUser: async (req, res) => {
    try {
      const user = await User.findByIdAndDelete(req.params.id);
      res.json({ user, success: true, message: "User deleted Successfully" });
    } catch (error) {
      res.status(500).json({
        error: error.message,
        message: "Failed to delete user",
        success: false,
      });
    }
  },
};
