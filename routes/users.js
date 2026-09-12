const express = require('express');
const router = express.Router();
const User = require('../models/User');

// @route   GET /api/users/:userId
// @desc    Get user profile
// @access  Private
router.get('/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/users/:userId
// @desc    Update user profile
// @access  Private
router.put('/:userId', async (req, res) => {
  try {
    const { firstName, lastName, phone, address } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.userId,
      { firstName, lastName, phone, address },
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/users/:userId/addresses
// @desc    Add shipping address
// @access  Private
router.post('/:userId/addresses', async (req, res) => {
  try {
    const { label, street, city, state, zipCode, country, isDefault } = req.body;
    const user = await User.findById(req.params.userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (isDefault) {
      user.shippingAddresses.forEach(addr => addr.isDefault = false);
    }

    user.shippingAddresses.push({ label, street, city, state, zipCode, country, isDefault: isDefault || false });
    await user.save();

    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/users/:userId/addresses
// @desc    Get user addresses
// @access  Private
router.get('/:userId/addresses', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ success: true, addresses: user.shippingAddresses });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;