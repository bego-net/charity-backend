// force redeploy
// server.js
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const mongoose = require("mongoose");

// --- Initialize Express App ---
const app = express();

// --- Middleware ---
app.use(express.json());

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://yabatubrukan.netlify.app",
    ],
    methods: ["GET", "POST"],
    credentials: true,
  })
);

app.use(helmet());

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100,
    message: "Too many requests from this IP, please try again later.",
  })
);

// --- MongoDB Connection ---
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Atlas connected successfully"))
  .catch((err) =>
    console.error("❌ MongoDB connection error:", err.message)
  );

// --- API Routes ---
app.use("/api/contact", require("./routes/contactRoutes"));
app.use("/api/events", require("./routes/eventRoutes"));
app.use("/api/projects", require("./routes/projectRoutes"));
app.use("/api/donate", require("./routes/donationRoutes"));

// --- Test Route ---
app.get("/", (req, res) => {
  res.send("🌍 Welcome to the Charity API (MongoDB Atlas connected)");
});

// --- Start Server ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
