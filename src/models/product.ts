import { Schema, model, SchemaTypes } from 'mongoose';


const gallerySchema = new Schema(
  {
    url: {
      type: String,
      required: true
    },
    caption: {
      type: String
    },
    type: {
      type: String,
      required: true,
      enum: ['image', 'video']
    }
  },
  { timestamps: true }
);

const optionSchema = new Schema(
  {
    name: {
      type: String,
      required: true
    },
    description: {
      type: String
    },
    amount: {
      type: Number,
      required: true,
      default: 0
    }
  },
  { timestamps: true }
);

const attributeSchema = new Schema(
  {
    name: {
      type: String,
      required: true
    },
    options: [optionSchema]
  },
  { timestamps: true }
);

const ratingSchema = new Schema(
  {
    user: {
      type: SchemaTypes.ObjectId,
      ref: 'User',
      required: true,
      unique: true
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    comment: {
      type: String
    }
  },
  { timestamps: true }
);

const productSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true
    },
    slug: {
      type: String,
      required: true,
      unique: true
    },
    description: {
      type: String,
      required: true
    },
    category: {
      type: SchemaTypes.ObjectId,
      ref: 'Category',
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    quantity: {
      type: Number,
      required: true
    },
    gallery: [gallerySchema],
    attributes: [attributeSchema],
    ratings: [ratingSchema]
  },
  { timestamps: true }
);

export default model('Product', productSchema);
