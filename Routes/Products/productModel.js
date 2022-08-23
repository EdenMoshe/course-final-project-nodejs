const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 256,
  },
  description: {
    type: String,
    required: true,
    minlength: 10,
    maxlength: 1024,
  },
  price: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 256,
  },
  image: {
    type: String,
    required: true,
    minlength: 11,
    maxlength: 1204,
  },

  category: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 1024,
  },

  creatorName: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 256,
  },
  creatorAddress: {
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

  likes: {
    type: Array,
    default: [],
    required: false,
  },

  userID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Product = mongoose.model("Product", productSchema, "products");

exports.Product = Product;
