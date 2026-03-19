const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("./user");
const Order = require("./order");

const router = express.Router();

// ================= VERIFY TOKEN =================
function verifyToken(req, res, next) {

  const token = req.headers.authorization;

  if (!token)
    return res.status(401).json({ message: "Access denied" });

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).json({ message: "Invalid token" });
  }
}

// ================= CHECKOUT =================
router.post("/checkout", verifyToken, async (req, res) => {

  const { paymentMethod, type } = req.body;

  const user = await User.findById(req.user.id);

  if (!type || !["shopping", "fresh", "all"].includes(type)) {
    return res.status(400).json({ message: "Invalid checkout type" });
  }

  let items = [];

  if (type === "shopping") {
    items = user.cart.shopping;
  }

  else if (type === "fresh") {
    items = user.cart.fresh;
  }

  else if (type === "all") {
    items = [
      ...user.cart.shopping,
      ...user.cart.fresh
    ];
  }

  if (!items.length)
    return res.status(400).json({ message: "Cart is empty" });

  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const estimated = new Date();
  estimated.setDate(estimated.getDate() + 5);

  const order = new Order({
    userId: user._id,
    items,
    totalAmount: total,
    paymentMethod,
    estimatedDelivery: estimated,
    status: "Processing"
  });

  await order.save();

  // ================= AUTO STATUS PROGRESSION =================
  setTimeout(async () => {
    order.status = "Shipped";
    await order.save();
  }, 5000);

  setTimeout(async () => {
    order.status = "Out for Delivery";
    await order.save();
  }, 10000);

  setTimeout(async () => {
    order.status = "Delivered";
    await order.save();
  }, 15000);

  // ================= CLEAR CART SECTION =================
  if (type === "shopping") {
    user.cart.shopping = [];
  }

  else if (type === "fresh") {
    user.cart.fresh = [];
  }

  else if (type === "all") {
    user.cart.shopping = [];
    user.cart.fresh = [];
  }

  await user.save();

  console.log("📧 Email sent: Order Confirmed");

  res.json({ message: "Order placed successfully" });
});

// ================= GET MY ORDERS =================
router.get("/my-orders", verifyToken, async (req, res) => {

  const orders = await Order.find({ userId: req.user.id })
    .sort({ createdAt: -1 });

  res.json(orders);
});

module.exports = router;