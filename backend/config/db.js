const mongoose = require('mongoose');

/**
 * MongoDB Connection Handler
 * Connects Express application to MongoDB Atlas or local MongoDB instance
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/notes_db', {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`[MongoDB Connected]: ${conn.connection.host} / Database: ${conn.connection.name}`);
  } catch (error) {
    console.error(`[MongoDB Connection Error]: ${error.message}`);
    console.log('Ensure MongoDB daemon is running locally or check your MongoDB Atlas URI in .env');
    process.exit(1);
  }
};

module.exports = connectDB;
