const express = require("express");
const router = express.Router();
const Listing = require("../modles/listing");
const wrapAsync = require("../utils/wrapAsync");
const { isLoggedIn, isOwner } = require("../middleware.js");
const { validateListing } = require("../middleware");
const listingController = require("../controllers/listings.js");

const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

router.route("/").get(wrapAsync(listingController.index)).post(
  validateListing,
  isLoggedIn,

  upload.array("listing[images][]", 4),
  wrapAsync(listingController.createListing)
);

router.get("/new", listingController.renderNewForm);

router
  .route("/:id")
  .get(wrapAsync(listingController.showListing))
  .put(
    isLoggedIn,
    isOwner,
    validateListing,
    upload.any(),
    wrapAsync(listingController.updateListing)
  )

  .delete(isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));

// Edit Path
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.renderEditForm)
);

//Filter Path

router.get("/filter/:categoryName", listingController.categoryFilter);

//Search Path

router.get("/search/result", listingController.searchResult);

module.exports = router;
