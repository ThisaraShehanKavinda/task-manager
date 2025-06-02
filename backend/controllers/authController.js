const User = require('../models/User');
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');  

// @desc    Register a new user
// @route   POST /api/auth/register
const registerUser = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { name, email, password } = req.body;
  const userExists = await User.findOne({ email });
  if (userExists) return res.status(400).json({ message: 'User already exists' });

  const user = await User.create({ name, email, password });
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });

  res.status(201).json({ token });
});

// @desc    Login user
// @route   POST /api/auth/login
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Check if user exists
  const user = await User.findOne({ email });
  
  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  // Compare passwords
  const isMatch = await bcrypt.compare(password, user.password);
  
  if (!isMatch) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  // Generate token
  const token = jwt.sign(
    { id: user._id }, 
    process.env.JWT_SECRET, 
    { expiresIn: '30d' }
  );

  res.json({ 
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  });
});

module.exports = { registerUser, loginUser };