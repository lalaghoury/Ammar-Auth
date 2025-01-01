const Chat = require('../models/Chat');

function removeNullUndefined(obj) {
  return Object.entries(obj).reduce((acc, [key, value]) => {
    if (value !== null && value !== undefined) {
      acc[key] = value;
    }
    return acc;
  }, {});
}

module.exports = userController = {
  getAllChats: async (req, res) => {
    try {
      const chats = await Chat.find({
        $or: [{ sponsor: req.user._id }, { startup: req.user._id }],
      });
      res.json({
        chats,
        success: true,
        message: 'All chats fetched successfully',
      });
    } catch (error) {
      res
        .status(500)
        .json({ error, message: 'Failed to get chats', success: false });
    }
  },
  getChatById: async (req, res) => {
    try {
      const chat = await Chat.findById(req.params.id);
      res.json({ chat, success: true, message: 'Chat fetched successfully' });
    } catch (error) {
      res
        .status(500)
        .json({ error, message: 'Failed to get chat', success: false });
    }
  },
  updateChat: async (req, res) => {
    const filteredObj = removeNullUndefined(req.body);

    try {
      const chat = await Chat.findByIdAndUpdate(
        req.params.id,
        { ...filteredObj },
        { new: true }
      );

      if (!chat) {
        return res
          .status(404)
          .json({ message: 'Chat not found', success: false });
      }

      res.json({
        chat,
        success: true,
        message: 'Chat updated successfully',
      });
    } catch (error) {
      res
        .status(500)
        .json({ error, message: 'Failed to update chat', success: false });
    }
  },
  deleteChat: async (req, res) => {
    try {
      const chat = await Chat.findByIdAndDelete(req.params.id);
      res.json({
        chat,
        success: true,
        message: 'Chat deleted Successfully',
      });
    } catch (error) {
      res.status(500).json({
        error: error.message,
        message: 'Failed to delete chat',
        success: false,
      });
    }
  },
  createChat: async (req, res) => {
    try {
      const chat = new Chat(req.body);
      await chat.save();
      res.json({
        chat,
        success: true,
        message: 'Chat created successfully',
      });
    } catch (error) {
      res
        .status(500)
        .json({ error, message: 'Failed to create chat', success: false });
    }
  },
};
