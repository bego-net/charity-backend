const express = require("express");
const router = express.Router();
const axios = require("axios");
const sendEmail = require("../utils/sendEmail");
const DonationRecord = require("../models/DonationRecord");
require("dotenv").config();

// ===============================
// POST /api/donate – Initialize Chapa Payment (Test Mode)
// ===============================
router.post("/", async (req, res) => {
  try {
    const { donorName, donorEmail, amount, projectId } = req.body;

    if (!donorName || !donorEmail || !amount) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Generate unique transaction reference
    const tx_ref = `tx-${Date.now()}`;

    // Payment data
    const data = {
      amount,
      currency: "ETB",
      email: donorEmail,
      first_name: donorName,
      tx_ref,
      callback_url: "http://localhost:3000/success", // 👈 redirect after test payment
      customizations: {
        title: "Father Blessed Charity Donation",
        description: "Thank you for supporting our mission 🙏",
      },
    };
    console.log("📦 Sending to Chapa:", data)
    // Send request to Chapa API
    const response = await axios.post(
      "https://api.chapa.co/v1/transaction/initialize",
      data,
      {
        headers: {
          Authorization: `Bearer ${process.env.CHAPA_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    // Save to DB as "pending"
    const donation = new DonationRecord({
      donorName,
      donorEmail,
      amount,
      projectId,
      chapaTxRef: tx_ref,
      paymentStatus: "pending",
    });

    await donation.save();

    // ✅ Send admin notification email
    await sendEmail(
      "💖 New Donation Received",
      `
        <h2>New Donation Alert!</h2>
        <p><strong>Donor:</strong> ${donorName}</p>
        <p><strong>Email:</strong> ${donorEmail}</p>
        <p><strong>Amount:</strong> ${amount} ETB</p>
        <p><strong>Transaction Ref:</strong> ${tx_ref}</p>
        <p><strong>Status:</strong> pending (awaiting verification)</p>
      `
    );

    // ✅ Send Chapa checkout URL to frontend
    res.status(200).json({
      success: true,
      checkout_url: response.data.data.checkout_url,
    });
  } catch (error) {
    console.error("Payment initialization error:", error.response?.data || error.message);
  
    // ✅ This sends Chapa’s detailed error to Postman so we can see the exact reason
    res.status(500).json({
      error: "Payment initialization failed",
      details: error.response?.data || error.message
    });
  }
});

// ===============================
// GET /api/donate/verify?tx_ref=12345
// ===============================
router.get("/verify", async (req, res) => {
  try {
    const { tx_ref } = req.query;

    if (!tx_ref) {
      return res.status(400).json({ error: "Missing tx_ref" });
    }

    // Verify with Chapa
    const verify = await axios.get(
      `https://api.chapa.co/v1/transaction/verify/${tx_ref}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.CHAPA_SECRET_KEY}`,
        },
      }
    );

    const status = verify.data.data.status;

    // Update donation record
    const updated = await DonationRecord.findOneAndUpdate(
      { chapaTxRef: tx_ref },
      { paymentStatus: status },
      { new: true }
    );

    res.status(200).json({
      success: true,
      tx_ref,
      status,
      updated,
    });
  } catch (error) {
    console.error("Verification error:", error.response?.data || error.message);
    res.status(500).json({ error: "Verification failed" });
  }
});

module.exports = router;
