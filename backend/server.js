require('dotenv').config(); // Load environment variables from .env file
console.log("Loaded JWT_SECRET:", process.env.JWT_SECRET); // Log the JWT secret to ensure it's loaded

const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { createUser, getUserByEmail } = require('./models/User'); // Ensure these methods are correctly imported
const authenticate = require('./models/authMiddlewares'); // Authentication middleware

const app = express();
const authRouter = require('./routes/authRoutes'); // Import the auth routes

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

// Use routes
app.use(authRouter);

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

// Example protected route
app.get('/api/auth/profile', authenticate, (req, res) => {
  // If the middleware is successful, proceed with the route logic
  const user = req.user; // Access user data from the middleware
  res.json({ message: 'Profile data', user }); // Send user data back
});

// Start the server
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
