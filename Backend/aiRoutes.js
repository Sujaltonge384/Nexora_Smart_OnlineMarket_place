const express = require("express");
const axios = require("axios");

const router = express.Router();

router.post("/chat", async (req, res) => {

  const { text } = req.body;

  const aiRes = await axios.post("http://localhost:8000/chat", {
    text
  });

  res.json(aiRes.data);
});

module.exports = router;