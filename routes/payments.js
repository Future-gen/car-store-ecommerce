const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Payment = require('../models/Payment');
const Order = require('../models/Order');

// @route   POST /api/payments/create-intent
// @desc    Create Stripe payment intent
// @access  Private
router.post('/create-intent', async (req, res) => {
  try {
    const { orderId, amount } = req.body;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency: 'usd',
      metadata: { orderId }
    });

    res.json({ success: true, clientSecret: paymentIntent.client_secret });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/payments/confirm
// @desc    Confirm payment and update order
// @access  Private
router.post('/confirm', async (req, res) => {
  try {
    const { orderId, transactionId, paymentMethod, amount, cardDetails } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const payment = new Payment({
      orderId,
      userId: order.userId,
      transactionId,
      amount,
      paymentMethod,
      paymentStatus: 'completed',
      cardDetails
    });

    await payment.save();

    order.paymentStatus = 'completed';
    order.orderStatus = 'processing';
    order.statusHistory.push({ status: 'processing', notes: 'Payment received, preparing order' });
    await order.save();

    res.json({ success: true, payment });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/payments/refund
// @desc    Refund payment
// @access  Private
router.post('/refund', async (req, res) => {
  try {
    const { orderId, refundAmount, reason } = req.body;

    const payment = await Payment.findOne({ orderId });
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    payment.refundAmount = refundAmount;
    payment.refundReason = reason;
    payment.refundDate = new Date();
    payment.paymentStatus = 'refunded';
    await payment.save();

    const order = await Order.findById(orderId);
    order.paymentStatus = 'refunded';
    order.orderStatus = 'returned';
    await order.save();

    res.json({ success: true, payment });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;