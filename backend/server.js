// Load environment variables from .env file
require('dotenv').config();

console.log(process.env.JWT_SECRET);  // Logs your JWT_SECRET to confirm it's set

const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { createUser, getUserByEmail } = require('./models/User'); // Ensure these methods are correctly imported
const authenticateToken = require('./models/authMiddlewares'); // Authentication middleware
const app = express();

// CORS Middleware setup
app.use(cors({
  origin: 'http://localhost:3000',  // React app origin
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],  // Allowed HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization'],  // Allowed headers
  preflightContinue: false,  // Automatically handle OPTIONS preflight
  optionsSuccessStatus: 200, // Some older browsers choke on 204
}));

// Parse JSON request bodies
app.use(express.json());

// Log the JWT_SECRET to ensure it's set correctly
console.log('JWT_SECRET:', process.env.JWT_SECRET);

// Register route
app.post('/api/auth/register', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Check if user with the same email already exists
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the new user
    const newUser = await createUser({ name, email, password: hashedPassword });

    // Create the JWT token
    const payload = { user: { id: newUser.id } };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(201).json({ token });
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ msg: 'Internal server error' });
  }
});

// Login route
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await getUserByEmail(email);
    if (!user) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // Check if password matches
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // Create the JWT token
    const payload = { user: { id: user.id } };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({ token });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ msg: 'Internal server error' });
  }
});


app.get('/api/auth/profile', authenticateToken, async (req, res) => {
  try {
      const userId = req.user.id; // Get user ID from decoded token

      // Query the database for user details
      const result = await pool.query('SELECT id, name, balance FROM users WHERE id = $1', [userId]);

      if (result.rows.length === 0) {
          return res.status(404).json({ message: "User not found" });
      }

      // Return user details
      res.json(result.rows[0]);
  } catch (error) {
      console.error("Error fetching user profile:", error);
      res.status(500).json({ message: "Internal server error" });
  }
});


// Start the server
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
