const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("./user");

const router = express.Router();

// ================= VERIFY TOKEN =================
function verifyToken(req, res, next) {
  const token = req.headers.authorization;

  if (!token) return res.status(401).json({ message: "Access denied" });

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).json({ message: "Invalid token" });
  }
}

// ================= ADD TO CART =================
router.post("/add", verifyToken, async (req, res) => {
  
  console.log("Incoming body:", req.body);

  const { name, price, image, description, type } = req.body;
  // type = "shopping" OR "fresh"
  
  if (!name || !price) {
  return res.status(400).json({ message: "Invalid product data" });
} 

  const user = await User.findById(req.user.id);
 if (!user.cart || Array.isArray(user.cart)) {

  const oldCart = Array.isArray(user.cart) ? user.cart : [];

  user.cart = {
    shopping: oldCart,
    fresh: []
  };
}
  const cartSection = type === "fresh" ? user.cart.fresh : user.cart.shopping;

 const existingItem = cartSection.find(
  item => item && item.name && name &&
          item.name.toLowerCase() === name.toLowerCase()
);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
   cartSection.push({
  name,
  price,
  image,
  description,
  quantity: 1
});
  }

  await user.save();

  res.json({ message: "Added to cart" });
});
// ================= GET CART =================
router.get("/", verifyToken, async (req, res) => {
  const user = await User.findById(req.user.id);
 if (!user.cart || Array.isArray(user.cart)) {

  const oldCart = Array.isArray(user.cart) ? user.cart : [];

  user.cart = {
    shopping: oldCart,   // move old items to shopping
    fresh: []
  };
}
  res.json(user.cart);
});

// ================= UPDATE QUANTITY =================
router.post("/update", verifyToken, async (req, res) => {

  const { name, action, type } = req.body;

  const user = await User.findById(req.user.id);
 if (!user.cart || Array.isArray(user.cart)) {

  const oldCart = Array.isArray(user.cart) ? user.cart : [];

  user.cart = {
    shopping: oldCart,
    fresh: []
  };
}

  if (!type || !["shopping", "fresh"].includes(type)) {
    return res.status(400).json({ message: "Invalid cart type" });
  }

  const cartSection = user.cart[type];

  const item = cartSection.find(
    item => item.name.toLowerCase() === name.toLowerCase()
  );

  if (!item) {
    return res.status(404).json({ message: "Item not found" });
  }

  if (action === "increase") {
    item.quantity += 1;
  }

  if (action === "decrease") {
    item.quantity -= 1;

    if (item.quantity <= 0) {
      user.cart[type] = cartSection.filter(
        i => i.name.toLowerCase() !== name.toLowerCase()
      );
    }
  }

  await user.save();

  res.json({ message: "Cart updated" });
});

// ================= CLEAR CART (TEMP DEBUG) =================
router.post("/clear", verifyToken, async (req, res) => {

  const { type } = req.body;

  const user = await User.findById(req.user.id);
if (!user.cart || Array.isArray(user.cart)) {

  const oldCart = Array.isArray(user.cart) ? user.cart : [];

  user.cart = {
    shopping: oldCart,
    fresh: []
  };
}

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

  else {
    return res.status(400).json({ message: "Invalid cart type" });
  }

  await user.save();

  res.json({ message: "Cart cleared" });
});

module.exports = router;