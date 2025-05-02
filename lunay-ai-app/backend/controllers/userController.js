const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Subscription = require('../models/Subscription');

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// Generate refresh token
const generateRefreshToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: '90d',
  });
};

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, authMethod = 'email' } = req.body;

  // Check if user exists
  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      res.status(400);
      throw new Error('User already exists');
    }
  } catch (error) {
    console.error('Error checking user existence:', error);
    res.status(500);
    throw new Error('Error checking user existence');
  }

  let user;
  try {
    // Create user
    user = await User.create({
      name,
      email,
      password,
      authMethod,
    });

    console.log('User created:', user);

    // Create default subscription (free tier)
    const subscription = await Subscription.create({
      user: user._id,
      plan: 'free',
      status: 'active',
    });

    console.log('Subscription created:', subscription);
  } catch (error) {
    console.error('Error creating user or subscription:', error);
    res.status(500);
    throw new Error('Error creating user account');
  }

  if (user) {
    // Generate tokens
    const token = generateToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // Save refresh token to user
    user.refreshToken = refreshToken;
    await user.save();

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      authMethod: user.authMethod,
      subscription: {
        type: 'free',
      },
      token,
      refreshToken,
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Check for user email
  const user = await User.findOne({ email }).select('+password');

  if (user && (await user.comparePassword(password))) {
    // Update last login
    user.lastLogin = Date.now();
    
    // Generate tokens
    const token = generateToken(user._id);
    const refreshToken = generateRefreshToken(user._id);
    
    // Save refresh token
    user.refreshToken = refreshToken;
    await user.save();

    // Get subscription info
    const subscription = await Subscription.findOne({ user: user._id });

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      authMethod: user.authMethod,
      subscription: {
        type: subscription ? subscription.plan : 'free',
      },
      token,
      refreshToken,
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    // Get subscription info
    const subscription = await Subscription.findOne({ user: user._id });

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      authMethod: user.authMethod,
      profilePicture: user.profilePicture,
      subscription: {
        type: subscription ? subscription.plan : 'free',
        features: subscription ? subscription.features : null,
      },
      createdAt: user.createdAt,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.profilePicture = req.body.profilePicture || user.profilePicture;
    
    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      authMethod: updatedUser.authMethod,
      profilePicture: updatedUser.profilePicture,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Refresh access token
// @route   POST /api/users/refresh-token
// @access  Public
const refreshToken = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    res.status(401);
    throw new Error('Refresh token is required');
  }

  try {
    // Verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    
    // Find user with this refresh token
    const user = await User.findOne({ 
      _id: decoded.id,
      refreshToken: refreshToken 
    });

    if (!user) {
      res.status(401);
      throw new Error('Invalid refresh token');
    }

    // Generate new access token
    const newAccessToken = generateToken(user._id);

    res.json({
      token: newAccessToken,
    });
  } catch (error) {
    res.status(401);
    throw new Error('Invalid refresh token');
  }
});

// @desc    Logout user / clear refresh token
// @route   POST /api/users/logout
// @access  Private
const logoutUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    // Clear refresh token
    user.refreshToken = null;
    await user.save();
    
    res.json({ message: 'Logged out successfully' });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    OAuth login/register (Google, Apple)
// @route   POST /api/users/oauth
// @access  Public
const oauthLogin = asyncHandler(async (req, res) => {
  const { name, email, authId, authMethod } = req.body;

  if (!['google', 'apple'].includes(authMethod)) {
    res.status(400);
    throw new Error('Invalid authentication method');
  }

  // Find user by email or authId
  let user = await User.findOne({
    $or: [
      { email },
      { authId, authMethod }
    ]
  });

  // If user doesn't exist, create a new one
  if (!user) {
    user = await User.create({
      name,
      email,
      authId,
      authMethod,
    });

    // Create default subscription (free tier)
    await Subscription.create({
      user: user._id,
      plan: 'free',
      status: 'active',
    });
  } else {
    // Update auth ID if it's missing
    if (!user.authId && authMethod) {
      user.authId = authId;
      user.authMethod = authMethod;
      await user.save();
    }
  }

  // Update last login
  user.lastLogin = Date.now();
  
  // Generate tokens
  const token = generateToken(user._id);
  const refreshToken = generateRefreshToken(user._id);
  
  // Save refresh token
  user.refreshToken = refreshToken;
  await user.save();

  // Get subscription info
  const subscription = await Subscription.findOne({ user: user._id });

  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    authMethod: user.authMethod,
    subscription: {
      type: subscription ? subscription.plan : 'free',
    },
    token,
    refreshToken,
  });
});

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  refreshToken,
  logoutUser,
  oauthLogin,
};