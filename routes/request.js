const express = require('express');
const requestController = require('../controllers/requestController');
const { requireSignin } = require('../middlewares/authMiddleware');
const router = express.Router();

router.get('/all', requireSignin, requestController.getAllRequest);

router.get('/single/:id', requireSignin, requestController.getRequestById);

router.put('/update/:id', requireSignin, requestController.updateRequest);

router.delete('/delete/:id', requireSignin, requestController.deleteRequest);

router.post('/create', requireSignin, requestController.createRequest);

module.exports = router;
