const express = require('express');
const router = express.Router();
const authenticate = require('../models/authMiddlewares'); // Authentication middleware
const User = require('../models/User'); // Import your User model

router.get('/profile', authenticate, async (req, res) => {
  try {
    console.log('🚀 User in request:', req.user); // Log the user attached by middleware

    if (!req.user) {
      console.error('🔴 No user found in request');
      return res.status(401).json({ msg: 'Unauthorized - No user attached' });
    }

    res.json({ id: req.user.id, name: req.user.name }); // Send user details
  } catch (error) {
    console.error('❌ Server Error:', error);
    res.status(500).json({ msg: 'Server error' });
  }
});



module.exports = router; // Export the router to use in the main server file
