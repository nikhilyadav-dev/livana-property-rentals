const express = require("express");
const router = express.Router();

const Listing = require("../modles/listing");
const wrapAsync = require("../utils/wrapAsync");
const ExpressError = require("../utils/ExpressError");
const { listingJoiSchema, reviewJoiSchema } = require("../schema");

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

//Index Path
router.get(
  "/",
  wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index", { allListings });
  })
);

// New Path
router.get("/new", (req, res) => {
  res.render("listings/new.ejs");
});

router.post(
  "/",
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
router.get(
  "/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    res.render("listings/show.ejs", { listing });
  })
);

// Edit Path
router.get(
  "/:id/edit",
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing });
  })
);

router.put(
  "/:id",
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
router.delete(
  "/:id",
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
  })
);

module.exports = router;
