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
    amount: {
      type: Number,
      required: true,
      min: 0
    },
    attributes: [attributeSchema]
  },
  { timestamps: true }
);

const orderSchema = new Schema(
  {
    user: {
      type: SchemaTypes.ObjectId,
      ref: 'User',
      required: true
    },
    products: [productSchema],
    amount: {
      type: Number,
      required: true,
      min: 0
    },
    paymentMethod: {
      type: String,
      required: true,
      enum: ['cash', 'card']
    },
    billingAddress: {
      type: SchemaTypes.ObjectId,
      required: true
    },
    deliveryAddress: {
      type: SchemaTypes.ObjectId,
      required: true
    },
    status: {
      type: String,
      required: true,
      enum: ['received', 'processing', 'shipped', 'delivered', 'cancelled'],
      default: 'received'
    },
    isPaid: {
      type: Boolean,
      required: true,
      default: false
    },
    transactionReference: {
      type: String
    }
  },
  { timestamps: true }
);

export default model('Order', orderSchema);
