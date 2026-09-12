const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const Coupon = require('../models/Coupon');

// @route   GET /api/cart/:userId
// @desc    Get user cart
// @access  Private
router.get('/:userId', async (req, res) => {
  try {
    let cart = await Cart.findOne({ userId: req.params.userId }).populate('items.productId');
    
    if (!cart) {
      cart = new Cart({ userId: req.params.userId, items: [] });
      await cart.save();
    }

    res.json({ success: true, cart });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/cart/:userId/add
// @desc    Add item to cart
// @access  Private
router.post('/:userId/add', async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    let cart = await Cart.findOne({ userId: req.params.userId });
    if (!cart) {
      cart = new Cart({ userId: req.params.userId, items: [] });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const existingItem = cart.items.find(item => item.productId.toString() === productId);
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ productId, quantity, price: product.price });
    }

    // Calculate totals
    cart.subtotal = cart.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    cart.total = cart.subtotal - cart.discount;

    await cart.save();
    await cart.populate('items.productId');

    res.json({ success: true, cart });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/cart/:userId/remove
// @desc    Remove item from cart
// @access  Private
router.post('/:userId/remove', async (req, res) => {
  try {
    const { productId } = req.body;
    const cart = await Cart.findOne({ userId: req.params.userId });

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    cart.items = cart.items.filter(item => item.productId.toString() !== productId);
    cart.subtotal = cart.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    cart.total = cart.subtotal - cart.discount;

    await cart.save();
    await cart.populate('items.productId');

    res.json({ success: true, cart });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/cart/:userId/apply-coupon
// @desc    Apply coupon code to cart
// @access  Private
router.post('/:userId/apply-coupon', async (req, res) => {
  try {
    const { couponCode } = req.body;
    const cart = await Cart.findOne({ userId: req.params.userId });

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const coupon = await Coupon.findOne({ code: couponCode, isActive: true });
    if (!coupon) {
      return res.status(400).json({ message: 'Invalid or expired coupon' });
    }

    if (cart.subtotal < coupon.minPurchase) {
      return res.status(400).json({ message: `Minimum purchase of $${coupon.minPurchase} required` });
    }

    let discount = 0;
    if (coupon.discountType === 'percentage') {
      discount = (cart.subtotal * coupon.discountValue) / 100;
      if (coupon.maxDiscount) {
        discount = Math.min(discount, coupon.maxDiscount);
      }
    } else {
      discount = coupon.discountValue;
    }

    cart.couponCode = couponCode;
    cart.discount = discount;
    cart.total = cart.subtotal - discount;

    await cart.save();

    res.json({ success: true, cart });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;