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
// Configure CORS to allow requests from frontend
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true
}));

// Routes
app.use('/api/users', require('./routes/userRoutes'));

// Base route
app.get('/', (req, res) => {
  res.send('Luna AI API is running...');
});

// Error handler middleware
app.use(errorHandler);

// Start server
const port = process.env.PORT || 5001;

app.listen(port, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${port}`);
});