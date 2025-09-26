if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const MONGO_URL = "mongodb://127.0.0.1:27017/rentals";
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError");
const cors = require("cors");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStretgy = require("passport-local");
const User = require("./modles/user");

const listingsRouter = require("./routes/listing");
const reviewsRouter = require("./routes/review");
const usersRouter = require("./routes/user");

// set view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static("public"));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
// Parse application/x-www-form-urlencoded (from forms)
app.use(express.urlencoded({ extended: true }));
// Parse application/json (from Postman, fetch API, etc.)
app.use(express.json());
app.use(cors());
const sessionOption = {
  secret: " mysuperscretesode",
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};
app.use(session(sessionOption));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});

//Passport
passport.use(new LocalStretgy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

// app.get("/", (req, res) => {
//   res.send("working");
// });

// app.get("/demouser", (req, res) => {
//   let fakeUser = new User({
//     email: "student@gmail.com",
//     username: "delta-student",
//   });
//   let registeredUser = User.register(fakeUser, "helloworld");
//   res.send(registeredUser);
// });

app.use("/listings", listingsRouter);
app.use("/listings/:id/reviews", reviewsRouter);
app.use("/", usersRouter);

//Page not found middleware
app.use((req, res, next) => {
  // throw new ExpressError(404, "Page not found");
  next(new ExpressError(404, "Page not found"));
});

//Error handler middleware
app.use((err, req, res, next) => {
  let { status = 500, message = "something went wrong" } = err;
  res.status(status).render("error.ejs", { msg: message });
});

app.listen("8080", () => {
  console.log("server is listening on 8080");
});
