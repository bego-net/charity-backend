const nodemailer = require("nodemailer");

const sendEmail = async (subject, htmlContent) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,      // smtp.gmail.com
      port: Number(process.env.SMTP_PORT), // 587
      secure: false, // MUST be false for port 587
      auth: {
        user: process.env.SMTP_USER,    // yabatubrukan@gmail.com
        pass: process.env.SMTP_PASS,    // Gmail App Password (NO spaces)
      },
    });

    // ✅ Verify SMTP connection (important for Render)
    await transporter.verify();
    console.log("✅ SMTP server is ready to send emails");

    const info = await transporter.sendMail({
      from: `"Father Blessed Charity" <${process.env.SMTP_USER}>`,
      to: process.env.ADMIN_EMAIL, // admin inbox
      subject,
      html: htmlContent,
    });

    console.log("✅ Email sent successfully:", info.messageId);
    return info;
  } catch (error) {
    console.error("❌ Email sending failed:", error);
    throw new Error("Email sending failed");
  }
};

module.exports = sendEmail;
