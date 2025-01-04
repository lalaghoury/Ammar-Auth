const Message = require('../models/Message'); // Import Message model
const Chat = require('../models/Chat'); // Import Chat model
const { pusher } = require('../utils/socket');

module.exports = messageController = {
  getAllMessages: async (req, res) => {
    try {
      const messages = await Message.find({ chatId: req.params.chatId }).sort({
        createdAt: 1,
      });
      res.json({
        messages,
        success: true,
        message: 'All messages fetched successfully',
      });
    } catch (error) {
      res
        .status(500)
        .json({ error, message: 'Failed to get messages', success: false });
    }
  },

  createMessage: async (req, res) => {
    try {
      const { chatId, content, sender, receiver, type } = req.body;

      // Validate that chat exists
      const chat = await Chat.findById(chatId);
      if (!chat) {
        return res
          .status(404)
          .json({ message: 'Chat not found', success: false });
      }

      if (type === 'text') {
        const message = new Message({
          chatId,
          sender,
          receiver,
          content,
          type,
          metadata: req.body.metadata || {},
        });

        await message.save();

        // Emit the message to the Pusher channel
        pusher.trigger(`chat-${chatId}`, 'message-received', message);

        // Optionally update the chat's last message
        chat.lastMessage = message._id;
        await chat.save();

        res.json({
          newMessage: message,
          success: true,
          message: 'Message created successfully',
        });

        return;
      }

      if (!req.file) {
        return res
          .status(400)
          .json({ message: 'File is required', success: false });
      }

      // Create a new message with file metadata
      const message = new Message({
        chatId,
        sender,
        receiver,
        type, // e.g., "image", "video"
        content: `/uploads/${req.file.filename}`, // Local file path
        metadata: {
          filename: req.file.filename,
          mimeType: req.file.mimetype,
          size: req.file.size,
        },
      });

      await message.save();

      // Emit the message to the Pusher channel
      pusher.trigger(`chat-${chatId}`, 'message-received', message);

      // Optionally update the chat's last message
      chat.lastMessage = message._id;
      await chat.save();

      res.json({
        newMessage: message,
        success: true,
        message: 'File uploaded and message created successfully',
      });
    } catch (error) {
      console.log('🚀 ~ createMessage: ~ error:', error);
      res
        .status(500)
        .json({ error, message: 'Failed to create message', success: false });
    }
  },

  updateMessage: async (req, res) => {
    const filteredObj = removeNullUndefined(req.body);

    try {
      const message = await Message.findByIdAndUpdate(
        req.params.messageId,
        { ...filteredObj },
        { new: true }
      );

      if (!message) {
        return res
          .status(404)
          .json({ message: 'Message not found', success: false });
      }

      res.json({
        message,
        success: true,
        message: 'Message updated successfully',
      });
    } catch (error) {
      res
        .status(500)
        .json({ error, message: 'Failed to update message', success: false });
    }
  },

  deleteMessage: async (req, res) => {
    try {
      const message = await Message.findByIdAndDelete(req.params.messageId);

      if (!message) {
        return res
          .status(404)
          .json({ message: 'Message not found', success: false });
      }

      res.json({
        message,
        success: true,
        message: 'Message deleted successfully',
      });
    } catch (error) {
      res
        .status(500)
        .json({ error, message: 'Failed to delete message', success: false });
    }
  },
};
