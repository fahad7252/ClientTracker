const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const connectDB = require("./config/db");
const path = require("path");
require("dotenv").config();

// Import routes
const authRoutes = require("./routes/auth");
const companyRoutes = require("./routes/company");
const customerRoutes = require("./routes/customer");
const appointmentRoutes = require("./routes/appointment");

// Initialize Express app
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

// Define Routes
app.use("/api/auth", authRoutes);
app.use("/api/companies", companyRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/appointments", appointmentRoutes);

// Serve static files in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../client/dist/index.html"));
  });
}
// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Server Error", error: err.message });
});

// Define PORT
const PORT = process.env.PORT || 5000;

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
