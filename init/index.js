const mongoose = require("mongoose");
const initDb = require("./data2");
const Listing = require("../modles/listing");
const MONGO_URL = "";

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
    return { ...obj, owner: "" };
  });
  await Listing.insertMany(initDb.data);
}

initDB();
