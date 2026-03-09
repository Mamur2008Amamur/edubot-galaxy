const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middleware/auth');

// Leaderboard
router.get('/leaderboard', auth, async (req, res) => {
  try {
    const users = await User.find({}).select('name email role xp streak').sort({ xp: -1 });
    res.json({ users });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update XP
router.post('/xp', auth, async (req, res) => {
  try {
    const { amount } = req.body;
    req.user.xp += amount || 10;
    await req.user.save();
    res.json({ xp: req.user.xp });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
