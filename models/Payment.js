const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema(
  {
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
      required: true
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    transactionId: {
      type: String,
      unique: true,
      required: true
    },
    amount: {
      type: Number,
      required: true
    },
    currency: {
      type: String,
      default: 'USD'
    },
    paymentMethod: {
      type: String,
      enum: ['credit_card', 'debit_card', 'paypal', 'stripe', 'bank_transfer'],
      required: true
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'processing', 'completed', 'failed', 'refunded'],
      default: 'pending'
    },
    cardDetails: {
      cardholderName: String,
      last4Digits: String,
      expiryMonth: Number,
      expiryYear: Number,
      brand: String
    },
    stripePaymentIntentId: String,
    refundAmount: {
      type: Number,
      default: 0
    },
    refundReason: String,
    refundDate: Date,
    failureReason: String,
    failureCode: String,
    receiptUrl: String,
    ipAddress: String,
    userAgent: String
  },
  {
    timestamps: true
  }
);

// Index for faster queries
paymentSchema.index({ orderId: 1 });
paymentSchema.index({ userId: 1 });
paymentSchema.index({ transactionId: 1 });
paymentSchema.index({ paymentStatus: 1 });

module.exports = mongoose.model('Payment', paymentSchema);
