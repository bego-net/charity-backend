// controllers/adminController.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const Contact = require('../models/Contact');

// @desc    Admin login
// @route   POST /api/admin/login
const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    // Find admin by email
    const admin = await Admin.findOne({ email: email.toLowerCase().trim() });
    if (!admin) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: admin._id, email: admin.email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(200).json({
      success: true,
      token,
      admin: { id: admin._id, email: admin.email },
    });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ error: 'Server error.' });
  }
};

// @desc    Get all messages
// @route   GET /api/admin/messages
const getMessages = async (req, res) => {
  try {
    const messages = await Contact.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, messages });
  } catch (error) {
    console.error('Get Messages Error:', error);
    res.status(500).json({ error: 'Server error.' });
  }
};

// @desc    Get single message by ID
// @route   GET /api/admin/messages/:id
const getMessageById = async (req, res) => {
  try {
    const message = await Contact.findById(req.params.id);
    if (!message) {
      return res.status(404).json({ error: 'Message not found.' });
    }
    res.status(200).json({ success: true, message });
  } catch (error) {
    console.error('Get Message Error:', error);
    res.status(500).json({ error: 'Server error.' });
  }
};

// @desc    Delete a message
// @route   DELETE /api/admin/messages/:id
const deleteMessage = async (req, res) => {
  try {
    const message = await Contact.findByIdAndDelete(req.params.id);
    if (!message) {
      return res.status(404).json({ error: 'Message not found.' });
    }
    res.status(200).json({ success: true, message: 'Message deleted.' });
  } catch (error) {
    console.error('Delete Message Error:', error);
    res.status(500).json({ error: 'Server error.' });
  }
};

// @desc    Toggle read/unread status
// @route   PATCH /api/admin/messages/:id/toggle-read
const toggleReadStatus = async (req, res) => {
  try {
    const message = await Contact.findById(req.params.id);
    if (!message) {
      return res.status(404).json({ error: 'Message not found.' });
    }

    message.isRead = !message.isRead;
    await message.save();

    res.status(200).json({ success: true, message });
  } catch (error) {
    console.error('Toggle Read Error:', error);
    res.status(500).json({ error: 'Server error.' });
  }
};

module.exports = {
  loginAdmin,
  getMessages,
  getMessageById,
  deleteMessage,
  toggleReadStatus,
};
