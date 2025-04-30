const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/User');

// Protect routes
const protect = asyncHandler(async (req, res, next) => {
  let token;

  // Check for token in headers
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from token
      req.user = await User.findById(decoded.id).select('-password');

      next();
    } catch (error) {
      console.error(error);
      res.status(401);
      throw new Error('Not authorized, token failed');
    }
  }

  if (!token) {
    res.status(401);
    throw new Error('Not authorized, no token');
  }
});

// Admin middleware
const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(401);
    throw new Error('Not authorized as an admin');
  }
};

// Check subscription level
const checkSubscription = (requiredLevel) => {
  return asyncHandler(async (req, res, next) => {
    // Get subscription level from user
    const subscriptionLevel = req.user.subscription.type;
    
    // Define subscription hierarchy
    const levels = {
      'free': 0,
      'premium': 1,
      'ultimate': 2
    };
    
    // Check if user's subscription level is sufficient
    if (levels[subscriptionLevel] >= levels[requiredLevel]) {
      next();
    } else {
      res.status(403);
      throw new Error(`This feature requires a ${requiredLevel} subscription`);
    }
  });
};

module.exports = { protect, admin, checkSubscription };