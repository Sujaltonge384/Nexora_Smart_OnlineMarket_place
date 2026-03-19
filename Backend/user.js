const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,

  // 🔥 NEW CART STRUCTURE
cart: {
  shopping: [
    {
      name: String,
      price: Number,
      image: String,
      description: String,
      quantity: {
        type: Number,
        default: 1
      }
    }
  ],
  fresh: [
    {
      name: String,
      price: Number,
      image: String,
      description: String,
      quantity: {
        type: Number,
        default: 1
      }
    }
  ]
},

  orders: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order"
    }
  ]
});

module.exports = mongoose.model("User", userSchema);