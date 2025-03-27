const jwt = require('jsonwebtoken');
require('dotenv').config(); // Load environment variables from .env

const authenticate = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  console.log("🔍 Authorization Header:", authHeader);

  if (!authHeader) {
    return res.status(401).json({ message: 'Token not provided' });
  }

  const token = authHeader.split(' ')[1]; // Extract the token from 'Bearer <token>'
  console.log("🔍 Extracted Token:", token);

  // Verify the token using the JWT secret stored in .env
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      console.log("❌ JWT Verification Error:", err);
      return res.status(403).json({ message: 'Invalid token' });
    }

    console.log("✅ Token Verified. Decoded Data:", decoded);
    req.user = decoded.user;  // Attach decoded user data to request object
    next(); // Continue to the next middleware or route handler
  });
};

module.exports = authenticate; // Export the middleware for use in other files
