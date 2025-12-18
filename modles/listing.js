const mongoose = require("mongoose");
let Schema = mongoose.Schema;
const Review = require("./review");
const { string } = require("joi");
let listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  image: [
    {
      filename: String,
      url: {
        type: String,
        default:
          "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      },
    },
  ],
  price: Number,
  location: String,
  area: Number,
  city: String,
  state: String,
  country: String,
  category: String,
  bedrooms: Number,
  bathrooms: Number,
  garages: Number,
  aminities: [String],
  reviews: [{ type: Schema.Types.ObjectId, ref: "Review" }],
  owner: { type: Schema.Types.ObjectId, ref: "User" },
  geometry: {
    type: {
      type: String, // Don't do `{ location: { type: String } }`
      enum: ["Point"], // 'location.type' must be 'Point'
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
});

listingSchema.index({ geometry: "2dsphere" });

// Middleware
listingSchema.post("findOneAndDelete", async (listing) => {
  if (listing) {
    await Review.deleteMany({ _id: { $in: listing.reviews } });
  }
});

let Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
