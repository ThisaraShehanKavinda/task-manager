const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (err) {
    console.error(`Error: ${err.message}`);
    // Don't exit process in test environment
    if (process.env.NODE_ENV !== 'test') {
      process.exit(1);
    }
    throw err;
  }
};

module.exports = connectDB;