// utils/sendEmail.js
const nodemailer = require("nodemailer");

const sendEmail = async (subject, htmlMessage) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail", // or "outlook", "yahoo", etc.
      auth: {
        user: process.env.ADMIN_EMAIL,
        pass: process.env.ADMIN_EMAIL_PASS, // app password, not your real Gmail password
      },
    });

    const mailOptions = {
      from: process.env.ADMIN_EMAIL,
      to: process.env.ADMIN_EMAIL, // admin gets the email
      subject,
      html: htmlMessage,
    };

    await transporter.sendMail(mailOptions);
    console.log("✅ Email sent successfully!");
  } catch (error) {
    console.error("❌ Email sending failed:", error.message);
    throw new Error("Email sending failed");
  }
};

module.exports = sendEmail;
