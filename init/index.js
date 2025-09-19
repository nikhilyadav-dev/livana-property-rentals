const mongoose = require("mongoose");
const initDb = require("./data");
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
    return { ...obj, owner: "68cc060fc4cc6fdacf066d88" };
  });
  await Listing.insertMany(initDb.data);
  console.log(initDb.data);
}

initDB();
