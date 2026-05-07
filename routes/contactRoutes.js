const express = require("express");
const router = express.Router();
const Contact = require("../models/Contact");
const sendEmail = require("../utils/sendEmail");

router.post("/", async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Save message to database
    await Contact.create({ name, email, phone: phone || '', message });

    // Send email notification (non-blocking — don't fail if email fails)
    try {
      await sendEmail(
        "📩 New Contact Message",
        `
          <h2>New Message from Contact Form</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ''}
          <p><strong>Message:</strong> ${message}</p>
        `
      );
    } catch (emailErr) {
      console.error("Email notification failed (message still saved):", emailErr.message);
    }

    res.status(200).json({ success: true, message: "Message sent successfully!" });
  } catch (error) {
    console.error("Contact Error:", error);
    res.status(500).json({ error: "Server error", details: "Failed to save message" });
  }
});

module.exports = router;
