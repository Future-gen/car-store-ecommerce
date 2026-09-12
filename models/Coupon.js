const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true
    },
    description: String,
    discountType: {
      type: String,
      enum: ['percentage', 'fixed'],
      required: true
    },
    discountValue: {
      type: Number,
      required: true,
      min: 0
    },
    maxDiscount: Number,
    minPurchase: {
      type: Number,
      default: 0
    },
    usageLimit: {
      type: Number,
      default: null
    },
    usedCount: {
      type: Number,
      default: 0
    },
    startDate: {
      type: Date,
      required: true
    },
    endDate: {
      type: Date,
      required: true
    },
    applicableCategories: [String],
    isActive: {
      type: Boolean,
      default: true
    },
    usedBy: [mongoose.Schema.Types.ObjectId]
  },
  {
    timestamps: true
  }
);

// Index for faster queries
couponSchema.index({ code: 1 });
couponSchema.index({ isActive: 1 });

module.exports = mongoose.model('Coupon', couponSchema);
