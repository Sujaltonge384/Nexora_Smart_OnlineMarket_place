const axios = require("axios");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

const aiRoutes = require("./aiRoutes");
app.use("/api/ai", aiRoutes);

const authRoutes = require("./authRoutes");
app.use("/api/auth", authRoutes);

const cartRoutes = require("./cartRoutes");
app.use("/api/cart", cartRoutes);

const orderRoutes = require("./orderRoutes");
app.use("/api/order", orderRoutes);


mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
