require('dotenv').config({ path: './src/.env' });
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI)
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error Connecting to MongoDB: ${error.message}`);
    process.exit(1); // Exit process with failure
  }
};

module.exports = connectDB;





































// const mongodb = require('mongodb')
// const MongoClient = mongodb.MongoClient

// const connectionURL = 'mongodb://127.0.0.1:27017'
// const databaseName = 'prms-project'

// MongoClient.connect(connectionURL, {useNewUrlParser: true}, (error, client) =>{
//   if (error) {
//     return console.log('Unable to connect to database')
//   }
//   const db = client.db(databaseName)
// })

