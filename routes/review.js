const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync");
const Listing = require("../modles/listing");
const Review = require("../modles/review");
const { validateReview, isLoggedIn, isAuthor } = require("../middleware");
const reviewController = require("../controllers/reviews");

//Review
//index route
router.post(
  "/",
  isLoggedIn,
  validateReview,
  wrapAsync(reviewController.createReview)
);

// Delete Review Route
router.delete(
  "/:reviewId",
  isAuthor,
  wrapAsync(reviewController.destroyReview)
);

module.exports = router;
