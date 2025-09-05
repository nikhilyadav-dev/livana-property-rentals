const mongoose = require("mongoose");
let Schema = mongoose.Schema;
let listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  image: {
    filename: String,
    url: String,
  },
  price: Number,
  location: String,
  country: String,
});

let Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
