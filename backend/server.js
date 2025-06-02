const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const connectDB = require('./config/db');
const { errorHandler, notFound } = require('./middleware/errorMiddleware');

dotenv.config();

const env = process.env.NODE_ENV || 'development';

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
require('./swagger')(app);

// Route files
const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');

// Mount routers
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

// Error handling middleware (must be after routes)
app.use(notFound);
app.use(errorHandler);


// Export the app for testing
module.exports = app;



// Only start the server if not in test environment
if (process.env.NODE_ENV !== 'test') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`
      Server started!
      Mode: ${process.env.NODE_ENV || 'development'}
      Port: ${PORT}
      Database: ${process.env.MONGO_URI ? 'Connected' : 'Not configured'}
    `);
  });
}