const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const User = require('../models/User');

// @route   POST /api/orders
// @desc    Create new order
// @access  Private
router.post('/', async (req, res) => {
  try {
    const { userId, shippingAddress, billingAddress, paymentMethod, couponCode } = req.body;

    const cart = await Cart.findOne({ userId }).populate('items.productId');
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    // Create order items
    const orderItems = cart.items.map(item => ({
      productId: item.productId._id,
      productName: item.productId.name,
      quantity: item.quantity,
      price: item.productId.price,
      discount: item.productId.discount,
      subtotal: item.productId.price * item.quantity
    }));

    const order = new Order({
      userId,
      items: orderItems,
      shippingAddress,
      billingAddress,
      subtotal: cart.subtotal,
      discount: cart.discount,
      couponCode: couponCode || null,
      tax: Math.round(cart.subtotal * 0.1 * 100) / 100,
      shippingCost: cart.subtotal > 100 ? 0 : 15,
      total: cart.total + Math.round(cart.subtotal * 0.1 * 100) / 100 + (cart.subtotal > 100 ? 0 : 15),
      paymentMethod,
      orderStatus: 'pending'
    });

    await order.save();

    // Update product stock
    for (let item of cart.items) {
      await Product.findByIdAndUpdate(
        item.productId._id,
        { $inc: { stock: -item.quantity } }
      );
    }

    // Clear cart
    await Cart.deleteOne({ userId });

    res.status(201).json({ success: true, order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/orders/:userId
// @desc    Get user orders
// @access  Private
router.get('/:userId', async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.userId })
      .populate('items.productId')
      .sort({ createdAt: -1 });

    res.json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/orders/detail/:orderId
// @desc    Get order details
// @access  Private
router.get('/detail/:orderId', async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId)
      .populate('items.productId')
      .populate('userId');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/orders/:orderId/cancel
// @desc    Cancel order
// @access  Private
router.put('/:orderId/cancel', async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.orderStatus !== 'pending') {
      return res.status(400).json({ message: 'Cannot cancel this order' });
    }

    order.orderStatus = 'cancelled';
    order.statusHistory.push({ status: 'cancelled', notes: 'Order cancelled by user' });

    // Restore product stock
    for (let item of order.items) {
      await Product.findByIdAndUpdate(
        item.productId,
        { $inc: { stock: item.quantity } }
      );
    }

    await order.save();

    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;