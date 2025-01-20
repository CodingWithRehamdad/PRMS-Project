const express = require('express');
require('dotenv').config({path: './src/.env'});
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const patientRoutes = require('./routes/patientRoutes')
const appointmentRoutes = require('./routes/appointmentRoutes')
const reportRoutes = require('./routes/reportsRoutes')


// Connect to MongoDB
connectDB();

const app = express();
app.use(express.json()); 

//authentication routes
app.use("/api/auth", authRoutes);
app.use("/api/", patientRoutes)
app.use("/api/", appointmentRoutes)
app.search("/api", reportRoutes)

// Test route
app.get('/testing', (req, res) => {
  res.send('API is running');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Error Middleware Log:", err.message);
  res.status(500).json({ message: "Internal Server Error", error: err.message });
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server is listening at port ${port}`);
});


