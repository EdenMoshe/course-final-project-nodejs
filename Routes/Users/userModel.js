const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 256,
  },
  email: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 255,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 1024,
  },
  address: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 256,
  },
  phone: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 256,
  },
  image: {
    type: String,
    required: true,
    minlength: 11,
    maxlength: 1204,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
  isAdmin: { type: Boolean, default: false },
});

const User = mongoose.model("Users", userSchema, "users");

exports.User = User;
