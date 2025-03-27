const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { createUser, getUserByEmail } = require('../models/User'); // Import functions from your User model
const authenticate = require('../models/authMiddlewares'); // Authentication middleware

// Load environment variables
require('dotenv').config();

const router = express.Router();

// Route for user registration
router.post('/api/auth/register', async (req, res) => {
  const { name, email, password } = req.body;
  console.log('Received registration request:', { name, email });

  try {
    // Check if user with the same email already exists
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      console.log('User already exists:', email);
      return res.status(400).json({ msg: 'User already exists' });
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the new user
    const newUser = await createUser({ name, email, password: hashedPassword });
    console.log('New user created:', newUser);

    // Create the JWT token
    const payload = { user: { id: newUser.id } };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(201).json({ token });
  } catch (error) {
    console.error('Error during registration:', error); 
    res.status(500).json({ msg: 'Internal server error', error: error.message });
  }
});

// Route for user login
router.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  console.log('Received login request:', { email });

  try {
    // Get the user by email
    console.log('Fetching user by email...');
    const user = await getUserByEmail(email);
    if (!user) {
      console.log('User not found:', email);  
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // Check if the password is correct
    console.log('Comparing passwords...');
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log('Invalid password for user:', email);  
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // Create JWT token
    console.log('Creating JWT token...');
    const payload = { user: { id: user.id, name: user.name, email: user.email } }; // Add necessary fields
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
    
    res.json({ token });
  } catch (error) {
    console.error('Error during login:', error.message);  
    res.status(500).json({ msg: 'Internal server error', error: error.message });
  }
});

// Route to get the user profile
router.get('/api/auth/profile', authenticate, async (req, res) => {
  try {
    console.log('🚀 User in request:', req.user);

    if (!req.user || !req.user.id) {
      console.error('🔴 No user found in request');
      return res.status(401).json({ msg: 'Unauthorized - No user attached' });
    }

    // Fetch user from database
    const user = await getUserByEmail(req.user.email);  // Assuming email is available in req.user
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    res.json({ id: user.id, name: user.name, email: user.email });
  } catch (error) {
    console.error('❌ Server Error:', error);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
