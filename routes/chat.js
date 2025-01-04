const express = require('express');
const chatController = require('../controllers/chatController');
const { requireSignin } = require('../middlewares/authMiddleware');
const router = express.Router();

router.get('/all', requireSignin, chatController.getAllChats);

router.get('/single/:id', requireSignin, chatController.getChatById);

router.put('/update/:id', requireSignin, chatController.updateChat);

router.delete('/delete/:id', requireSignin, chatController.deleteChat);

router.post('/create', requireSignin, chatController.createChat);

module.exports = router;
