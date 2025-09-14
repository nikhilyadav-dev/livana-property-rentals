const express = require("express");
const app = express();
const mongoose = require("mongoose");
const MONGO_URL = "mongodb://127.0.0.1:27017/rentals";
const Listing = require("./modles/listing");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync");
const ExpressError = require("./utils/ExpressError");
const { listingJoiSchema, reviewJoiSchema } = require("./schema");
const Review = require("./modles/review");

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

// Server side validations functions

const validateListing = (req, res, next) => {
  const { error } = listingJoiSchema.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    return next(
      new ExpressError(400, error.details.map((el) => el.message).join(", "))
    );
  } else {
    next();
  }
};

const validateReview = (req, res, next) => {
  const { error } = reviewJoiSchema.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    return next(
      new ExpressError(400, error.details.map((el) => el.message).join(", "))
    );
  } else {
    next();
  }
};

//Index Path

app.get(
  "/listings",
  wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index", { allListings });
  })
);

// New Path

app.get("/listings/new", (req, res) => {
  res.render("listings/new.ejs");
});

app.post(
  "/listings",
  validateListing,
  wrapAsync(async (req, res, next) => {
    //old way
    // if (!req.body.listing) {
    //   throw new ExpressError(404, "send valid data for listing");
    // }
    //new way
    // Validate body against Joi schema
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
  })
);

// Show Path

app.get(
  "/listing/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    res.render("listings/show.ejs", { listing });
  })
);

// Edit Path
app.get(
  "/listing/:id/edit",
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing });
  })
);

app.put(
  "/listings/:id",
  validateListing,
  wrapAsync(async (req, res) => {
    if (!req.body.listing) {
      throw new ExpressError(404, "send valid data for listing");
    }
    const { id } = req.params;
    const listing = req.body.listing;
    await Listing.findByIdAndUpdate(id, listing);
    res.redirect("/listings");
  })
);

// Delete Path

app.delete(
  "/listings/:id",
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
  })
);

//Review
//index route
app.post(
  "/listings/:id/reviews",
  validateReview,
  wrapAsync(async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();
    res.redirect(`/listing/${listing._id}`);
  })
);

// Delete Review Route
app.delete("/listings/:id/reviews/:reviewId", async (req, res) => {
  let { id, reviewId } = req.params;
  await Review.findByIdAndDelete(reviewId);

  const resu = await Listing.findByIdAndUpdate(id, {
    $pull: { reviews: reviewId },
  });
  console.log(resu);
  res.redirect(`/listing/${id}`);
});

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
