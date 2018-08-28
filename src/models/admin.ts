import { Schema, model } from 'mongoose';


const adminSchema = new Schema(
  {
    firstname: {
      type: String,
      required: true
    },
    lastname: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    avatar: {
      type: String,
      required: true
    },
    isVerified: {
      type: Boolean,
      required: true
    },
    password: {
      type: String,
      required: true,
      select: false
    },
    role: {
      type: String,
      required: true,
      enum: ['admin', 'super-admin']
    }
  },
  { timestamps: true }
);


adminSchema.virtual('name')
  .get(function() {
    return `${this.firstname} ${this.lastname}`;
  });

adminSchema.set('toObject', { virtuals: true });
adminSchema.set('toJSON', { virtuals: true });


export default model('Admin', adminSchema);
