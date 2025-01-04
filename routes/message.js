const express = require('express');
const messageController = require('../controllers/messageController');
const { requireSignin } = require('../middlewares/authMiddleware');
const upload = require('../config/multerConfig');
const router = express.Router();

// Fetch all messages in a chat
router.get('/:chatId', requireSignin, messageController.getAllMessages);

// Create a new message
router.post(
  '/create',
  upload.single('file'),
  requireSignin,
  messageController.createMessage
);

// Update a message
router.put(
  '/update/:messageId',
  requireSignin,
  messageController.updateMessage
);

// Delete a message
router.delete(
  '/delete/:messageId',
  requireSignin,
  messageController.deleteMessage
);

module.exports = router;
