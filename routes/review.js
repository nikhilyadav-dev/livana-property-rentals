const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync");
const ExpressError = require("../utils/ExpressError");
const Listing = require("../modles/listing");
const { reviewJoiSchema } = require("../schema");
const Review = require("../modles/review");

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

//Review
//index route
router.post(
  "/",
  validateReview,
  wrapAsync(async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();
    req.flash("success", "New Review Created");
    res.redirect(`/listings/${listing._id}`);
  })
);

// Delete Review Route
router.delete("/:reviewId", async (req, res) => {
  let { id, reviewId } = req.params;
  await Review.findByIdAndDelete(reviewId);

  const resu = await Listing.findByIdAndUpdate(id, {
    $pull: { reviews: reviewId },
  });
  req.flash("success", "Review Deleted");
  res.redirect(`/listings/${id}`);
});

module.exports = router;
