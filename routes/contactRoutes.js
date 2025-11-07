const express = require("express");
const router = express.Router();
const Contact = require("../models/Contact");
const sendEmail = require("../utils/sendEmail");

router.post("/", async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const contact = new Contact({ name, email, message });
    await contact.save();

    // Send email to admin
    await sendEmail(
      "📩 New Contact Message",
      `
        <h3>New Contact Message Received</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `
    );

    res.status(201).json({ success: true, data: contact });
  } catch (error) {
    console.error("❌ Contact message failed:", error.message);
    res.status(500).json({ error: "Server error", details: error.message });
  }
});

module.exports = router;
