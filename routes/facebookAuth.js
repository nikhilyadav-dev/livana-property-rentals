const express = require("express");
const router = express.Router();
const passport = require("../controllers/facebookAuth");

router.get(
  "/",
  passport.authenticate("facebook", { scope: ["public_profile"] })
);

router.get(
  "/callback",
  passport.authenticate("facebook", { failureRedirect: "/login" }),
  function (req, res) {
    res.redirect("/listings");
  }
);

module.exports = router;
