// routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const {
  loginAdmin,
  getMessages,
  getMessageById,
  deleteMessage,
  toggleReadStatus,
} = require('../controllers/adminController');

// Public route
router.post('/login', loginAdmin);

// Protected routes (require JWT)
router.get('/messages', authMiddleware, getMessages);
router.get('/messages/:id', authMiddleware, getMessageById);
router.delete('/messages/:id', authMiddleware, deleteMessage);
router.patch('/messages/:id/toggle-read', authMiddleware, toggleReadStatus);

module.exports = router;
