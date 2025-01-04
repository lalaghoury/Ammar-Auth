const Chat = require('../models/Chat');

// Utility function to remove null/undefined values from an object
function removeNullUndefined(obj) {
  return Object.entries(obj).reduce((acc, [key, value]) => {
    if (value !== null && value !== undefined) {
      acc[key] = value;
    }
    return acc;
  }, {});
}

module.exports = chatController = {
  // Fetch all chats for a user
  getAllChats: async (req, res) => {
    try {
      const { page = 1, limit = 10 } = req.query; // Pagination parameters
      const chats = await Chat.find({
        $or: [{ sponsor: req.user._id }, { startup: req.user._id }],
      })
        .populate('sponsor', 'name email') // Populate sponsor fields
        .populate('startup', 'name email') // Populate startup fields
        .populate('lastMessage') // Populate last message for previews
        .skip((page - 1) * limit)
        .limit(parseInt(limit))
        .lean();

      const totalChats = await Chat.countDocuments({
        $or: [{ sponsor: req.user._id }, { startup: req.user._id }],
      });

      res.json({
        chats,
        totalChats,
        success: true,
        message: 'All chats fetched successfully',
      });
    } catch (error) {
      console.error('Error fetching chats:', error);
      res.status(500).json({
        error: error.message,
        message: 'Failed to get chats',
        success: false,
      });
    }
  },

  // Fetch a single chat by ID
  getChatById: async (req, res) => {
    try {
      const chat = await Chat.findById(req.params.id)
        .populate('sponsor', 'name email') // Populate sponsor fields
        .populate('startup', 'name email') // Populate startup fields
        .populate({
          path: 'messages',
          options: { sort: { timestamp: 1 } }, // Sort messages by timestamp
        })
        .lean();

      if (!chat) {
        return res.status(404).json({
          message: 'Chat not found',
          success: false,
        });
      }

      res.json({
        chat,
        success: true,
        message: 'Chat fetched successfully',
      });
    } catch (error) {
      console.error('Error fetching chat by ID:', error);
      res.status(500).json({
        error: error.message,
        message: 'Failed to get chat',
        success: false,
      });
    }
  },

  // Update a chat by ID
  updateChat: async (req, res) => {
    const filteredObj = removeNullUndefined(req.body);

    try {
      const chat = await Chat.findByIdAndUpdate(
        req.params.id,
        { ...filteredObj },
        { new: true }
      )
        .populate('sponsor', 'name email') // Optional: Populate updated chat
        .populate('startup', 'name email');

      if (!chat) {
        return res.status(404).json({
          message: 'Chat not found',
          success: false,
        });
      }

      res.json({
        chat,
        success: true,
        message: 'Chat updated successfully',
      });
    } catch (error) {
      console.error('Error updating chat:', error);
      res.status(500).json({
        error: error.message,
        message: 'Failed to update chat',
        success: false,
      });
    }
  },

  // Delete a chat by ID
  deleteChat: async (req, res) => {
    try {
      const chat = await Chat.findByIdAndDelete(req.params.id);

      if (!chat) {
        return res.status(404).json({
          message: 'Chat not found',
          success: false,
        });
      }

      res.json({
        chat,
        success: true,
        message: 'Chat deleted successfully',
      });
    } catch (error) {
      console.error('Error deleting chat:', error);
      res.status(500).json({
        error: error.message,
        message: 'Failed to delete chat',
        success: false,
      });
    }
  },

  // Create a new chat
  createChat: async (req, res) => {
    try {
      const { sponsor, startup, messages } = req.body;

      // Basic validation
      if (!sponsor || !startup) {
        return res.status(400).json({
          message: 'Sponsor and Startup are required',
          success: false,
        });
      }

      const chat = new Chat({
        sponsor,
        startup,
        messages: messages || [],
      });

      await chat.save();

      res.status(201).json({
        chat,
        success: true,
        message: 'Chat created successfully',
      });
    } catch (error) {
      console.error('Error creating chat:', error);
      res.status(500).json({
        error: error.message,
        message: 'Failed to create chat',
        success: false,
      });
    }
  },
};
