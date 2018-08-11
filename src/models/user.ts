import { Schema, model } from 'mongoose';


const addressSchema = new Schema(
  {
    name: {
      type: String,
      required: true
    },
    street: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    state: {
      type: String,
      requried: true
    },
    country: {
      type: String,
      required: true
    },
    isBilling: {
      type: Boolean,
      required: true
    },
    isShipping: {
      type: Boolean,
      required: true
    }
  },
  { timestamps: true }
);

const userSchema = new Schema(
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
    phone: {
      type: String,
      required: true,
      unique: true
    },
    gender: {
      type: String,
      enum: ['male', 'female'],
      requred: true
    },
    avatar: {
      type: String,
      required: true
    },
    addresses: [addressSchema],
    isVerified: {
      type: Boolean,
      required: true
    },
    additional: {
      local: {
        password: {
          type: String,
          select: false
        }
      },
      facebook: {
        id: {
          type: String
        }
      },
      google: {
        id: {
          type: String
        }
      },
      twitter: {
        id: {
          type: String
        }
      }
    }
  },
  { timestamps: true }
);


userSchema.virtual('name')
  .get(function() {
    return `${this.firstname} ${this.lastname}`;
  });

userSchema.set('toObject', { virtuals: true });
userSchema.set('toJSON', { virtuals: true });


export default model('User', userSchema);
