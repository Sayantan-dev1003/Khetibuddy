const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["user","admin"],
      default: "user", // role-based auth
    },
    
    phone: {
      type: String,
      trim: true,
      default: "",
    },
    
    address: {
      type: String,
      trim: true,
      default: "",
    },

    bio: {
      type: String,
      trim: true,
      default: "",
    },
    
    userType: {
      type: String,
      enum: ["buyer", "seller", "both"],
      default: "buyer",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const User = model("User", userSchema);
module.exports = User;