const Listing = require("./modles/listing");
const Review = require("./modles/review");
const ExpressError = require("./utils/ExpressError");
const { listingJoiSchema, reviewJoiSchema } = require("./schema");
module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl;
    req.flash("error", "You must be logged in");
    return res.redirect("/login");
  }
  next();
};

module.exports.saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};

module.exports.isOwner = async (req, res, next) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing.owner._id.equals(res.locals.currUser._id)) {
    req.flash("error", "You are not the owner of this listing");
    return res.redirect(`/listings/${id}`);
  }
  next();
};

module.exports.validateListing = (req, res, next) => {
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

module.exports.validateReview = (req, res, next) => {
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

module.exports.isAuthor = async (req, res, next) => {
  let { id, reviewId } = req.params;
  const review = await Review.findById(reviewId);

  if (!review.author.equals(req.user._id)) {
    req.flash("error", "You are not the author of this review");
    return res.redirect(`/listings/${id}`);
  }
  next();
};
