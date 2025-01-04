const Chat = require('../models/Chat');
const Message = require('../models/Message');
const Request = require('../models/Request');

function removeNullUndefined(obj) {
  return Object.entries(obj).reduce((acc, [key, value]) => {
    if (value !== null && value !== undefined) {
      acc[key] = value;
    }
    return acc;
  }, {});
}

module.exports = userController = {
  getAllRequest: async (req, res) => {
    try {
      const requests = await Request.find({
        $or: [{ sponsor: req.user._id }, { startup: req.user._id }],
      })
        .populate('sponsor')
        .populate('startup');

      res.json({ requests, success: true, message: 'All requests fetched' });
    } catch (error) {
      console.log('🚀 ~ getAllRequest: ~ error:', error);
      res
        .status(500)
        .json({ error, message: 'Failed to get requests', success: false });
    }
  },
  getRequestById: async (req, res) => {
    try {
      const request = await Request.findById(req.params.id);
      res.json({ request, success: true, message: 'Request fetched' });
    } catch (error) {
      res
        .status(500)
        .json({ error, message: 'Failed to get request', success: false });
    }
  },
  updateRequest: async (req, res) => {
    const filteredObj = removeNullUndefined(req.body);

    try {
      const request = await Request.findByIdAndUpdate(
        req.params.id,
        { ...filteredObj },
        {
          new: true,
        }
      )
        .populate('sponsor')
        .populate('startup');

      if (request.status === 'APPROVED') {
        // Create a chat between sponsor and startup
        const chat = new Chat({
          sponsor: request.sponsor,
          startup: request.startup,
          // messages: [message._id],
          // lastMessage: message._id,
        });

        // Create a starter message for the chat
        const message = new Message({
          chatId: chat._id,
          sender: chat.sponsor,
          receiver: chat.startup,
          content: 'Hello, I am interested in your startup',
          type: 'text',
        });
        await message.save();

        // Update the chat with the message
        chat.messages.push(message._id);
        chat.lastMessage = message._id;
        await chat.save();
      }

      if (!request) {
        return res
          .status(404)
          .json({ message: 'Request not found', success: false });
      }

      res.json({
        request,
        success: true,
        message: 'Request updated successfully',
      });
    } catch (error) {
      console.log('🚀 ~ updateRequest: ~ error:', error);
      res
        .status(500)
        .json({ error, message: 'Failed to update request', success: false });
    }
  },
  deleteRequest: async (req, res) => {
    try {
      const request = await Request.findByIdAndDelete(req.params.id);
      res.json({
        request,
        success: true,
        message: 'Request deleted Successfully',
      });
    } catch (error) {
      res.status(500).json({
        error: error.message,
        message: 'Failed to delete request',
        success: false,
      });
    }
  },
  createRequest: async (req, res) => {
    try {
      const { amountRequested, description, sponsorId } = req.body;
      const request = new Request({
        amountRequested,
        description,
        startup: req.user._id,
        sponsor: sponsorId,
      });
      await request.save();
      res.json({
        request,
        success: true,
        message: 'Request created successfully',
      });
    } catch (error) {
      res
        .status(500)
        .json({ error, message: 'Failed to create request', success: false });
    }
  },
};
