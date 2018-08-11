import { Schema, model, SchemaTypes } from 'mongoose';


const attributeSchema = new Schema(
  {
    attribute: {
      type: SchemaTypes.ObjectId,
      required: true
    },
    option: {
      type: SchemaTypes.ObjectId,
      required: true
    }
  },
  { timestamps: true }
);

const productSchema = new Schema(
  {
    product: {
      type: SchemaTypes.ObjectId,
      ref: 'Product',
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    attributes: [attributeSchema]
  },
  { timestamps: true }
);

const wishlistSchema = new Schema(
  {
    user: {
      type: SchemaTypes.ObjectId,
      ref: 'User',
      required: true,
      unique: true
    },
    products: [productSchema]
  },
  { timestamps: true }
);

export default model('Wishlist', wishlistSchema);
