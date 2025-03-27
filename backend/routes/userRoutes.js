const express = require('express');
const router = express.Router();
const authenticate = require('../models/authMiddlewares'); // Authentication middleware
const User = require('../models/User'); // Import your User model

router.get('/profile', authenticate, async (req, res) => {
  try {
    console.log('🚀 User in request:', req.user);

    if (!req.user || !req.user.id) {
      console.error('🔴 No user found in request');
      return res.status(401).json({ msg: 'Unauthorized - No user attached' });
    }

    // Fetch user from database
    const user = await User.findOne({ where: { id: req.user.id } });
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    res.json({ id: user.id, name: user.name, email: user.email }); // Send full user details
  } catch (error) {
    console.error('❌ Server Error:', error);
    res.status(500).json({ msg: 'Server error' });
  }
});



module.exports = router; // Export the router to use in the main server file
