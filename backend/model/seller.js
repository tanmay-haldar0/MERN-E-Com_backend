import mongoose from "mongoose";

import bcrypt from "bcryptjs";

import jwt from "jsonwebtoken";

const sellerSchema = new mongoose.Schema({
  shopName: {
    type: String,
    required: [true, "Please enter your Shop name!"],
  },
  name: {
    type: String,
    required: [true, "Please enter your name!"],
  },
  email: {
    type: String,
    required: [true, "Please enter your email!"],
  },
  password: {
    type: String,
    required: [true, "Please enter your password"],
    minLength: [8, "Password should be greater than 8 characters"],
    select: false,
  },
  phoneNumber: {
    type: Number,
    required: true,
  },
  descriptions: {
    type: String,
  },
  addresses: [
    {
      country: {
        type: String,
      },
      city: {
        type: String,
      },
      address1: {
        type: String,
      },
      address2: {
        type: String,
      },
      zipCode: {
        type: Number,
      },
      addressType: {
        type: String,
      },
    },
  ],
  role: {
    type: String,
    default: "seller",
  },
  avatar: {
    public_id: {
      type: String,
      // required: true,
    },
    url: {
      type: String,
      default: "",
      // required: true,
    },
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  resetPasswordToken: String,
  resetPasswordTime: Date,
});

//  Hash & salting password
sellerSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10); // Generate a salt with 10 rounds
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Generate JWT token
sellerSchema.methods.getJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES,
  });
};

// Compare password
sellerSchema.methods.comparePassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model("Seller", sellerSchema);
