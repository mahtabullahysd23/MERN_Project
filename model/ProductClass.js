const mongoose = require("mongoose");
const ProductSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: false,
  },
  name:{
    type: String,
    required: [true,"Name is required"]
  },
  price: {
    type: Number,
    required: [true,"Price is required"]
  },
  stock: {
    type: Number,
    required: [true,"Stock is required"]
  },
  author: {
    type: String,
    required: [true,"Author is required"]
  }
});

const Product = mongoose.model("Product", ProductSchema);
module.exports = Product;