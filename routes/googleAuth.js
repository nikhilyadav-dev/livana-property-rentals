const express = require("express");
const router = express.Router();
const passport = require("../controllers/googleAuth");
router.get(
  "/",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  function (req, res) {
    res.redirect("/listings");
  }
);

module.exports = router;
