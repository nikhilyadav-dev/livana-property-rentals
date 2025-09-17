const express = require("express");
const router = express.Router();
const User = require("../modles/user");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");

router.get("/signup", (req, res) => {
  res.render("users/signup.ejs");
});

router.post(
  "/signup",
  wrapAsync(async (req, res) => {
    try {
      const { username, email, password } = req.body;
      const registeredUser = new User({
        username,
        email,
      });

      await User.register(registeredUser, password);
      req.flash("success", "Welcome to Livana");
      res.redirect("/listings");
    } catch (e) {
      req.flash("error", "A user with given username is already registred");
      res.redirect("/signup");
    }
  })
);

router.get("/login", (req, res) => {
  res.render("users/login.ejs");
});

router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  async (req, res) => {
    req.flash("success", "Welcome back to Livana");
    res.redirect("/listings");
  }
);

module.exports = router;
