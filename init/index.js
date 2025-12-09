const mongoose = require("mongoose");
const initDb = require("./data2");
const Listing = require("../modles/listing");
const MONGO_URL = "mongodb://127.0.0.1:27017/rentals";

main()
  .then(() => {
    console.log("connect to db");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

async function initDB() {
  await Listing.deleteMany({});
  initDb.data = initDb.data.map((obj) => {
    return { ...obj, owner: "69341b5e773cab19726b18f8" };
  });
  await Listing.insertMany(initDb.data);
  console.log(initDb.data);
}

initDB();
