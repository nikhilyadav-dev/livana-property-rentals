const express = require("express");
const router = express.Router();
const Listing = require("../modles/listing");
const wrapAsync = require("../utils/wrapAsync");
const { isLoggedIn, isOwner } = require("../middleware.js");
const { validateListing } = require("../middleware");
const listingController = require("../controllers/listings.js");

//Index Path
router.get("/", wrapAsync(listingController.index));

// New Path
router.get("/new", isLoggedIn, listingController.renderNewForm);

router.post(
  "/",
  validateListing,
  isLoggedIn,
  wrapAsync(listingController.createListing)
);

// Show Path
router.get("/:id", wrapAsync(listingController.showListing));

// Edit Path
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.renderEditForm)
);

router.put(
  "/:id",
  isLoggedIn,
  isOwner,
  validateListing,
  wrapAsync(listingController.updateListing)
);

// Delete Path
router.delete(
  "/:id",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.destroyListing)
);

module.exports = router;
