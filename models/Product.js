const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide product name'],
      trim: true,
      maxlength: [100, 'Product name cannot exceed 100 characters']
    },
    description: {
      type: String,
      required: [true, 'Please provide product description'],
      maxlength: [2000, 'Description cannot exceed 2000 characters']
    },
    category: {
      type: String,
      enum: ['Tires', 'Batteries', 'Oils'],
      required: [true, 'Please specify product category']
    },
    price: {
      type: Number,
      required: [true, 'Please provide product price'],
      min: [0, 'Price cannot be negative']
    },
    originalPrice: {
      type: Number,
      default: null
    },
    discount: {
      type: Number,
      default: 0,
      min: [0, 'Discount cannot be negative'],
      max: [100, 'Discount cannot exceed 100%']
    },
    stock: {
      type: Number,
      required: [true, 'Please provide stock quantity'],
      min: [0, 'Stock cannot be negative'],
      default: 0
    },
    sku: {
      type: String,
      required: [true, 'Please provide SKU'],
      unique: true,
      trim: true
    },
    images: [
      {
        url: String,
        altText: String
      }
    ],
    specifications: {
      // For Tires
      size: String,
      type: String,
      season: String,
      warranty: String,
      
      // For Batteries
      capacity: String,
      voltage: String,
      ampHours: String,
      
      // For Oils
      viscosity: String,
      volume: String,
      specification: String
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    reviews: [
      {
        userId: mongoose.Schema.Types.ObjectId,
        userName: String,
        rating: Number,
        comment: String,
        createdAt: {
          type: Date,
          default: Date.now
        }
      }
    ],
    totalReviews: {
      type: Number,
      default: 0
    },
    inStock: {
      type: Boolean,
      default: true
    },
    isActive: {
      type: Boolean,
      default: true
    },
    tags: [String],
    manufacturer: String,
    warranty: String,
    shippingWeight: Number,
    shippingDimensions: {
      length: Number,
      width: Number,
      height: Number
    }
  },
  {
    timestamps: true
  }
);

// Update inStock status based on stock quantity
productSchema.pre('save', function(next) {
  this.inStock = this.stock > 0;
  if (!this.originalPrice && this.discount > 0) {
    this.originalPrice = this.price / (1 - this.discount / 100);
  }
  next();
});

// Index for faster queries
productSchema.index({ category: 1 });
productSchema.index({ name: 'text', description: 'text' });
productSchema.index({ sku: 1 });

module.exports = mongoose.model('Product', productSchema);
