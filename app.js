const express = require("express");
const app = express();
const mongoose = require("mongoose");
const MONGO_URL = "mongodb://127.0.0.1:27017/rentals";
const Listing = require("./modles/listing");

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

app.get("/testListing", async (req, res) => {
  let sampleListing = new Listing({
    title: "Arpa Inn",
    description: "Best services across india",
    price: 20000,
    location: "Bilaspur CG",
    country: "India",
  });
  sampleListing
    .save()
    .then((res) => {
      console.log(res);
    })
    .catch((err) => {
      console.log(err);
    });
  console.log("data instered");
  res.send("working");
});

app.listen("8080", () => {
  console.log("server is listening on 8080");
});
