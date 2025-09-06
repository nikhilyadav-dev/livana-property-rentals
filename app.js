const express = require("express");
const app = express();
const mongoose = require("mongoose");
const MONGO_URL = "mongodb://127.0.0.1:27017/rentals";
const Listing = require("./modles/listing");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
// set view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);

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

//Index Path

app.get("/listings", async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index", { allListings });
});

// New Path

app.get("/listings/new", (req, res) => {
  res.render("listings/new.ejs");
});

app.post("/listings", async (req, res) => {
  const newListing = new Listing(req.body.listing);
  await newListing.save();
  res.redirect("/listings");
});

// Show Path

app.get("/listing/:id", async (req, res) => {
  let { id } = req.params;
  console.log(id);
  const listing = await Listing.findById(id);
  res.render("listings/show.ejs", { listing });
});

// Edit Path
app.get("/listing/:id/edit", async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/edit.ejs", { listing });
});

app.put("/listings/:id", async (req, res) => {
  const { id } = req.params;
  const listing = req.body.listing;
  await Listing.findByIdAndUpdate(id, listing);
  res.redirect("/listings");
});

// Delete Path

app.delete("/listings/:id", async (req, res) => {
  const { id } = req.params;
  await Listing.findByIdAndDelete(id);
  res.redirect("/listings");
});

//Test Path

// app.get("/testListing", async (req, res) => {
//   let sampleListing = new Listing({
//     title: "Arpa Inn",
//     description: "Best services across india",
//     price: 20000,
//     location: "Bilaspur CG",
//     country: "India",
//   });
//   sampleListing
//     .save()
//     .then((res) => {
//       console.log(res);
//     })
//     .catch((err) => {
//       console.log(err);
//     });
//   console.log("data instered");
//   res.send("working");
// });

app.listen("8080", () => {
  console.log("server is listening on 8080");
});
