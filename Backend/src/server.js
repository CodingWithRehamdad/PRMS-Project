const express = require('express');
require('dotenv').config();
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');

// Connect to MongoDB
connectDB();

const app = express();
app.use(express.json()); // Middleware to parse JSON bodies

// Use the authentication routes
app.use("/api/auth", authRoutes);

// Test route
app.get('/users', (req, res) => {
  res.send('API is running');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Error Middleware Log:", err.message); // Logs all errors
  res.status(500).json({ message: "Internal Server Error", error: err.message });
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server is listening at port ${port}`);
});
