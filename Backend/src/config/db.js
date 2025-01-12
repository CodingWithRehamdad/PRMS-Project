require('dotenv').config();
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    console.log("Connecting to MongoDB..."); // Logs connection attempt
    const conn = await mongoose.connect(process.env.MONGODB_URI)
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error Connecting to MongoDB: ${error.message}`); // Logs connection errors
    process.exit(1); // Exit process with failure
  }
};

module.exports = connectDB;
