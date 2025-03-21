const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { createUser, getUserByEmail } = require('../models/User'); // Import functions
const authenticate = require('../models/authMiddlewares'); // Authentication middleware

// Load environment variables
require('dotenv').config();  // Make sure to add .env file

const router = express.Router();

// Route for user registration
app.post('/api/auth/register', async (req, res) => {
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
    console.error('Error during registration:', error);  // Log error stack to help trace the issue
    res.status(500).json({ msg: 'Internal server error', error: error.message });
  }
});


// Route for user login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  console.log('Received login request:', { email });  // Log request data

  try {
    // Get the user by email
    console.log('Fetching user by email...');
    const user = await getUserByEmail(email);
    if (!user) {
      console.log('User not found:', email);  // Log if user is not found
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // Check if the password is correct
    console.log('Comparing passwords...');
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log('Invalid password for user:', email);  // Log invalid password attempt
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // Create JWT token
    console.log('Creating JWT token...');
    const payload = { user: { id: user.id } };
    const token = jwt.sign(payload, process.env.JWT_SECRET || 'your-secret-key', { expiresIn: '1h' });

    res.json({ token });
  } catch (error) {
    console.error('Error during login:', error.message);  // Log detailed error message
    res.status(500).json({ msg: 'Internal server error', error: error.message });  // Return more detailed error information
  }
});

// Route to get the user profile
router.get('/profile', authenticate, async (req, res) => {
  console.log('Fetching profile for user:', req.user.email);  // Log the user email from the token

  try {
    // Fetch the user profile based on the email from the token
    const user = await getUserByEmail(req.user.email);
    if (!user) {
      console.log('User not found in profile request:', req.user.email);  // Log if user is not found
      return res.status(404).json({ msg: 'User not found' });
    }

    res.json({ id: user.id, name: user.name });
  } catch (error) {
    console.error('Error fetching profile:', error.message);  // Log detailed error message
    res.status(500).json({ msg: 'Internal server error', error: error.message });  // Return more detailed error information
  }
});

module.exports = router;
