const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const { errorHandler } = require('./middleware/errorMiddleware');

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

// Routes
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/companions', require('./routes/companionRoutes'));
app.use('/api/chat', require('./routes/chatRoutes'));
app.use('/api/voice', require('./routes/voiceRoutes'));
app.use('/api/memory', require('./routes/memoryRoutes'));
app.use('/api/subscriptions', require('./routes/subscriptionRoutes'));

// Base route
app.get('/', (req, res) => {
  res.send('Luna AI API is running...');
});

// Error handler middleware
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});