import mongoose from 'mongoose';

const productSchema = mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: [true, 'A product must have a name!'],
    trim: true,
    minlength: [4, 'A product must have at least 4 characters'],
    maxlength: [100, 'A product must have at most 100 characters'],
    validate: {
      validator: function (val) {
        let regex = /^[a-zA-Z0-9\s]+$/;
        return regex.test(val);
      },
      message: 'Name of product can only be alphabetic characters',
    },
  },
  quote: {
    type: String,
    trim: true,
    required: [true, 'A product must have a quote'],
  },
  gender: {
    type: String,
    required: [true, 'A product must fit a gender!'],
    enum: {
      values: ['male', 'female', 'unisex'],
      message: 'Gender has to be one of: male, female, unisex',
    },
  },
  category: {
    type: String,
    required: [true, 'A product must have a category'],
    enum: {
      values: ['bracelet', 'ring', 'necklace', 'earrings', 'skin-care'],
      message:
        'category has to be one of: bracelet, ring, necklace, earrings, skin-care, ',
    },
  },
  imageCover: {
    type: String,
    required: [true, 'A product must have a cover image'],
  },
  images: {
    type: [String],
  },
  inStock: {
    type: Number,
    required: [true, 'A product must have an amount in stock'],
    min: [1, 'At least one item should be present'],
  },
  isFeatured: {
    type: Boolean,
    default: false,
  },
  price: {
    type: Number,
    required: [true, 'A product must have a price'],
  },
  rating: {
    type: Number,
    default: 4.5,
    min: [1, 'Rating must be above 1.0'],
    max: [5, 'Rating must be below 5.0'],
  },
  reviews: {
    type: Number,
    default: 0,
  },
  keyPoints: {
    type: [String],
    required: [true, 'A product should have at least one key point.'],
  },
});

productSchema.pre('save', function (next) {
  this.name = this.name.toLowerCase();
  this.quote = this.quote.toLowerCase();
  this.gender = this.gender.toLowerCase();
  this.category = this.category.toLowerCase();
  next();
});

const Product = mongoose.model('Product', productSchema);

export default Product;
