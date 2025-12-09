const Listing = require("../modles/listing");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapToken = process.env.MAP_KEY;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

const amenitiesList = {
  Pool: false,
  Parking: false,
  Wifi: false,
  Gym: false,
  Garden: false,
};

module.exports.index = async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index", { allListings });
};

module.exports.renderNewForm = (req, res) => {
  res.render("listings/new.ejs", { amenitiesList });
};

module.exports.createListing = async (req, res, next) => {
  //new way
  // Validate body against Joi schema

  // const response = await geocodingClient
  //   .forwardGeocode({
  //     query: req.body.listing.location,
  //     limit: 1,
  //   })
  //   .send();

  const newListing = new Listing(req.body.listing);

  newListing.owner = req.user._id;
  if (req.files) {
    const imageData = req.files.map((file) => ({
      url: file.path,
      filename: file.filename,
    }));

    newListing.image = imageData;
  }
  // newListing.geometry = response.body.features[0].geometry;

  const ress = await newListing.save();
  console.log("newListing", ress);

  req.flash("success", "New Listing Created");
  res.redirect("/listings");
};

module.exports.showListing = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("owner");
  if (!listing) {
    req.flash("error", "Listing you requested for doesn't  exist!");
    return res.redirect("/listings");
  }
  res.render("listings/show.ejs", { listing });
};

module.exports.renderEditForm = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing you requested for doesn't  exist!");
    return res.redirect("/listings");
  }
  let originalImageUrl = listing.image.url;
  originalImageUrl = originalImageUrl.replace("/upload", "/upload/h_300,w_250");
  res.render("listings/edit.ejs", { listing, originalImageUrl });
};

module.exports.updateListing = async (req, res) => {
  const { id } = req.params;
  const updatedList = req.body.listing;
  if (req.file) {
    const { path, filename } = req.file;
    if (!updatedList.image) {
      updatedList.image = {};
    }
    updatedList.image.filename = filename;
    updatedList.image.url = path;
  }
  console.log(updatedList);
  await Listing.findByIdAndUpdate(id, updatedList);
  req.flash("success", "Listing Updated");
  res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req, res) => {
  const { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("success", "Listing Deleted");
  res.redirect("/listings");
};

//Filter path

module.exports.categoryFilter = async (req, res) => {
  const { categoryName } = req.params;
  const allListings = await Listing.find({
    category: { $all: [categoryName] },
  });

  if (allListings.length != 0) {
    // res.locals.success = `Listings Find by ${categoryName}`;
    res.render("listings/index.ejs", { allListings });
  } else {
    req.flash("error", "Listings is not here !!!");
    res.redirect("/listings");
  }
};

//Serach Path

module.exports.searchResult = async (req, res) => {
  const { q } = req.query;

  let searchKey = q.trim().replace(/\s+/g, " ");

  if (searchKey == "" || searchKey == " ") {
    req.flash("error", "Please enter something to search.");
    res.redirect("/listings");
  }

  const toTitleCase = (str) => {
    return str
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  searchKey = toTitleCase(searchKey);

  let allListings = [];

  const intValue = parseInt(searchKey, 10);
  const isIntValue = Number.isInteger(intValue);

  if (isIntValue && allListings.length == 0) {
    allListings = await Listing.find({ price: { $lt: intValue } }).sort({
      price: 1,
    });
    return res.render("listings/index.ejs", { allListings });
  }

  allListings = await Listing.find({
    $or: [
      { title: { $regex: searchKey, $options: "i" } },
      { category: { $regex: searchKey, $options: "i" } },
      { country: { $regex: searchKey, $options: "i" } },
      { location: { $regex: searchKey, $options: "i" } },
    ],
  });

  if (allListings.length == 0) {
    req.flash("error", "Listings is not here");
    res.redirect("/listings");
    return;
  }

  res.render("listings/index.ejs", { allListings });
};
