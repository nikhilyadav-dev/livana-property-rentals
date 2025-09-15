const express = require("express");
const app = express();
const posts = require("./routes/posts");

app.use("/", posts);

app.listen(3000, () => {
  console.log("listing on port 3000");
});
