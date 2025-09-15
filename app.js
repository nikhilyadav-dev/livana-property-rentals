const express = require("express");
const app = express();
const mongoose = require("mongoose");
const MONGO_URL = "mongodb://127.0.0.1:27017/rentals";
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError");

const listings = require("./routes/listing");
const reviews = require("./routes/review");

// set view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static("public"));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
// Parse application/x-www-form-urlencoded (from forms)
app.use(express.urlencoded({ extended: true }));
// Parse application/json (from Postman, fetch API, etc.)
app.use(express.json());
const cors = require("cors");
const review = require("./modles/review");
app.use(cors());

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

app.get("/", (req, res) => {
  res.send("working");
});

app.use("/listings", listings);
app.use("/listings/:id/reviews", reviews);

//Page not found middleware
app.use((req, res, next) => {
  // throw new ExpressError(404, "Page not found");
  next(new ExpressError(404, "Page not found"));
});

//Error handler middleware
app.use((err, req, res, next) => {
  let { status = 500, message = "something went wrong" } = err;
  res.status(status).render("error.ejs", { msg: message });
});

app.listen("8080", () => {
  console.log("server is listening on 8080");
});
