const express = require('express');
const chatController = require('../controllers/chatController');
const { requireSignin } = require('../middlewares/authMiddleware');
const router = express.Router();

router.get('/all', chatController.getAllChats);

router.get('/single/:id', requireSignin, chatController.getChatById);

router.put('/update/:id', chatController.updateChat);

router.delete('/delete/:id', chatController.deleteChat);

router.post('/create', requireSignin, chatController.createChat);

module.exports = router;
