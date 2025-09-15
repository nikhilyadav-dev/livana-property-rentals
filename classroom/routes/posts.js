const express = require("express");
const router = express.Router();

// posts
router.get("/posts", (req, res) => {
  res.send("Get for posts");
});

router.get("/posts/:id", (req, res) => {
  res.send("Get for posts id");
});

module.exports = router;
